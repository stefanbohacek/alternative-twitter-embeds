const express = require( 'express' ),
      fs = require( 'fs' ),
      helpers = require( __dirname + '/../helpers/general.js' ),
      dataHelper = require( __dirname + '/../helpers/data.js' ),
      twitter = require( __dirname + '/../helpers/twitter.js' ),
      router = express.Router();

router.all( '/', function( req, res ) {
  res.render( '../views/home.handlebars', {
    project_name: process.env.PROJECT_DOMAIN,
    head_scripts: process.env.HEAD_SCRIPTS,
    timestamp: Date.now()
  } );
} );

module.exports = router;
