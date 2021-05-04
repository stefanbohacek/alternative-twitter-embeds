const express = require( 'express' ),
      request = require( 'request' ),
      fs = require( 'fs' ),
      helpers = require( __dirname + '/../helpers/general.js' ),
      dataHelper = require( __dirname + '/../helpers/data.js' ),
      twitter = require( __dirname + '/../helpers/twitter.js' ),
      router = express.Router();

router.all( '/', function( req, res ) {
  if ( req.query.url ){
    const url = req.query.url;
    request.get( url ).pipe( res );
  } else {
    res.end( JSON.stringify( { error: 'missing required parameter: url' } ) );
  }
} );

module.exports = router;
