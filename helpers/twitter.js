// https://github.com/fourtonfish/tweet-embeds-wordpress-plugin/blob/main/index.php
const fs = require( 'fs' ),
      request = require( 'request' ),
      util = require( 'util' ),
      data = require( __dirname + '/../helpers/data.js' ),
      twitterApiUrl = 'https://api.twitter.com/2',
      tweetsDirectory = './.data/tweets';

const twitter = {
  createBearerToken: function( cb ) {
    let buff = Buffer.from( `${process.env.TWITTER_CONSUMER_KEY}:${process.env.TWITTER_CONSUMER_SECRET}` );
    let base64data = buff.toString( 'base64' );
    let err = null;
    
    request.post( {
      url:'https://api.twitter.com/oauth2/token',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${ base64data }`
      },
      form: { grant_type: 'client_credentials' }
    }, function( err, httpResponse, body){
        const resp = JSON.parse( body );
      
        if ( cb ){
            cb( err, resp.access_token );
            if ( resp.access_token ){
              data.storeTwitterToken( resp.access_token, function( err, token ){

              
              } );
            }
        }
    } );
  },
  getTwitterToken: function( cb, refresh ) {
    if ( refresh ){
      this.createBearerToken( function( err, token ){
        if ( cb ){
          cb( err, token );
        }
      } );
    } else {
      data.getTwitterToken( function( err, token ){
        if ( cb ){
          cb( err, token );
        }
      } );      
    }
  },
  getTweetData: function( tweetIds, cb ) {
    const tw = this;
    let tweetData = [];

    function getTweetDataFn( token, tweetIds, cb ){
      let tweetIdsAPI = [];

      tweetIds.forEach( function( id ){
        const tweetDataFile = `${tweetsDirectory}/${ id }.json`;
        let refreshData = true;
        
        if ( fs.existsSync( tweetDataFile ) ){
          // console.log( 'found cached tweet data', id );
          const fileInfo = fs.statSync( tweetDataFile );
          const timeNow = new Date().getTime();
          const timeExpire = new Date( fileInfo.ctime ).getTime() + 3 * 3600000;

          if ( timeNow < timeExpire ) {
            refreshData = false;
          }
        }
                
        if ( refreshData ){
          tweetIdsAPI.push( id );
        } else {
          tweetData.push( JSON.parse( fs.readFileSync( tweetDataFile ) ) );          
        }
      } );
      
      if ( tweetIdsAPI && tweetIdsAPI.length ){
        const params = new URLSearchParams( {
          'ids': tweetIdsAPI,
          'expansions': 'author_id,attachments.media_keys,referenced_tweets.id,attachments.poll_ids',
          'tweet.fields': 'attachments,entities,author_id,conversation_id,created_at,id,in_reply_to_user_id,lang,referenced_tweets,source,text,public_metrics',
          'user.fields': 'id,name,username,profile_image_url,verified',
          'media.fields': 'media_key,preview_image_url,type,url,width,height'
        } );

        const apiURL = `${twitterApiUrl}/tweets?${ params.toString() }`;

        request.get( {
          url: apiURL,
          headers: {
            'Authorization': `Bearer ${ token }`
          }
        }, function( err, httpResponse, body){
          const resp = JSON.parse( body );
          // console.log( 'resp', util.inspect( resp, false, null, true ) );

          if (resp.reason || resp.detail === 'Unauthorized' ){
            tw.getTwitterToken( function( err, token ){
              getTweetDataFn( token, tweetIds, cb );
            }, true );
          } else {
            if ( resp.data ){
              resp.data.forEach( function( tweet ){
                tweet.users = [];

                if ( resp.includes.users ){
                  resp.includes.users.forEach( function( user ){
                    if ( tweet.author_id === user.id ){
                        tweet.users.push( user );
                    }
                  } );
                }

                tweet.media = [];

                if ( tweet.attachments && tweet.attachments.media_keys ){
                  tweet.attachments.media_keys.forEach( function( mediaKey ){
                      resp.includes.media.forEach( function( media ){
                          if ( mediaKey === media.media_key ){
                              tweet.media.push( media );
                          }
                      } );
                  } );
                }

                tweet.polls = [];

                if ( resp.includes.polls ){
                  resp.includes.polls.forEach( function( poll ){
                    if ( tweet.attachments && tweet.attachments.poll_ids && tweet.attachments.poll_ids.indexOf( poll.id ) > -1 ){
                      tweet.polls.push( poll );
                    }
                  } );
                }

                data.storeTweetData( tweet );
                tweetData.push( tweet );
              } );
            }
            if ( cb ){
              cb( err, tweetData );
            }
          }
        } );         
      } else {
        if ( cb ){
          cb( null, tweetData );
        }
      }      
    }    
    
    tw.getTwitterToken( function( err, token ){
      getTweetDataFn( token, tweetIds, cb );
    } );
  },
  getSiteInfo: function( url ) {
    return 'DATA'; 
  }
};

module.exports = twitter;