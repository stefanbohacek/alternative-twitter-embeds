const fs = require( 'fs' ),
      url = require( 'url' ),
      request = require( 'request' ),
      cheerio = require( 'cheerio' ),
      NodeCache = require( "node-cache" ),
      cacheOptions = {
        stdTTL: 3600
      },
      cacheTwitterData = new NodeCache( cacheOptions ),
      cacheSiteData = new NodeCache( cacheOptions );

const tokenFile = './.data/token';
const tweetsDirectory = './.data/tweets';

const existsToken = fs.existsSync( tokenFile );
const existsTweetsDirectory = fs.existsSync( tweetsDirectory );
  
if ( !existsTweetsDirectory ){
  fs.mkdirSync( tweetsDirectory );  
}

const get_page_metadata_fn = function get_page_metadata( pageUrl ){          
  if ( pageUrl.length > 0 ){
    return new Promise( function( resolve, reject ){
      let domain = url.parse( pageUrl ).hostname;
      
      if ( domain.indexOf( 'www.' ) === 0 ){
        /* Remove leading www */
        domain = domain.substr( 4 );    
      }
      
      const r = request.get( pageUrl, function ( err, res, body ) {
        // console.log( `processing ${pageUrl}...` );
        if ( r !== undefined ){
          const $ = cheerio.load( body );
          const pageTitle = $( 'meta[property="og:title"]' ).attr( 'content' ) || $( 'meta[property="twitter:text:title"]' ).attr( 'content' ) || $( 'title' ).text() || '';
          const pageDescription = $( 'meta[name="description"]' ).attr( 'content' ) || $( 'meta[name="twitter:title"]' ).attr( 'content' )  || $( 'meta[property="og:title"]' ).attr( 'content' ) || '';
          const image = $( 'meta[name="twitter:image"]' ).attr( 'content' ) || $( 'meta[property="og:image"]' ).attr( 'content' ) || '';

          const siteData = {
            'title': pageTitle.trim(),
            'description': pageDescription.trim(),
            'image': image,
            'original-url': pageUrl,
            'domain': domain
          };

          cacheSiteData.set( pageUrl , siteData );
          // console.log( 'pageUrl', pageUrl );
          // console.log( 'cacheSiteData', cacheSiteData.get( pageUrl ) );
          return resolve( siteData );
        }
      } );
    } );    
  }
  else{
    return false;
  }
}

const dataHelper = {
  storeTweetData: function( tweet ) {
    // console.log( 'storing tweet data', tweet );
    let valuesSQL = [];
    fs.writeFileSync( `${tweetsDirectory}/${ tweet.id }.json`, JSON.stringify( tweet ), { /* flag: 'wx' */ } );    
//     data.forEach( function( tweet ){

//     } );
  },
  getTweetData: function( tweetIds, cb ) {
    let tweetData = [];
    
    tweetIds.forEach( function( id ){
      const filePath = `${tweetsDirectory}/${ id }.json`;
      tweetData.push( JSON.parse( fs.readFileSync( filePath ) ) );      
    } );

    if ( cb ){
      cb( tweetData );
    }
  },
  storeTwitterToken: function( token, cb ) {
    fs.writeFile( tokenFile, token, function( err ){
      if ( cb ){
        cb( err, token );
      }
    } );
  },
  getTwitterToken: function( cb ) {
    fs.readFile( tokenFile, function( err, token ){
      if ( cb ){
        cb( err, token );
      }
    } );
  },
  getSiteData: function( pageUrl, cb ) {
    const urls = [pageUrl],
          siteInfo = cacheSiteData.get( pageUrl );

    // console.log( `searching cache for ${ pageUrl }`, siteInfo );

    if ( !siteInfo ){
        // const urls = [pageUrl].map( helpers.clean_url );
        const urls = [pageUrl];

        // const urls = [pageUrl].map( helpers.clean_url );

        let actions = urls.map( get_page_metadata_fn );
        let results = Promise.all( actions );  

        results.then( function ( results ) {
          if ( cb ){
            cb( null, results[0] );
          }
        } );
    } else {
      if ( cb ){
        cb( null, siteInfo );
      }
    }

  }
};

module.exports = dataHelper;
