const express = require( 'express' ),
      util = require( 'util' ),
      helpers = require( __dirname + '/../helpers/general.js' ),
      dataHelper = require( __dirname + '/../helpers/data.js' ),
      twitter = require( __dirname + '/../helpers/twitter.js' ),
      router = express.Router();

router.all( '/', function( req, res ) {
  // console.log( req.query );
  let data = [], isAllowed = false;
  const origin = req.headers.origin;
  
  if ( process.env.ALLOWED_URLS ){
    const allowedUrls = process.env.ALLOWED_URLS.split( ',' );
    
    if ( allowedUrls.indexOf( origin ) > -1 ){
      isAllowed = true;
    }
  } else {
    isAllowed = true;
  }
  
  if ( isAllowed ){
    res.set( {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Headers': '*'
    } );  
    
    if ( req.query.tweet_ids ){
      const tweetIDs = req.query.tweet_ids.split( ',' );
      twitter.getTweetData( tweetIDs, function( err, data ){
        res.end( JSON.stringify( data ) );
      } );
    } else if ( req.query.site_url ){
      const siteUrl = req.query.site_url;
      dataHelper.getSiteData( siteUrl, function( err, data ){
        res.end( JSON.stringify( data ) );
      } );
    } else {
      res.end( JSON.stringify( { error: 'endpoint not found' } ) );
    }    
  } else {
    res.end( JSON.stringify( { error: 'endpoint not accessible' } ) );    
  }
} );

module.exports = router;
