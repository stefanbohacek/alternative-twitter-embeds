const express = require( 'express' ),
      fs = require( 'fs' ),
      helpers = require( __dirname + '/../helpers/general.js' ),
      dataHelper = require( __dirname + '/../helpers/data.js' ),
      twitter = require( __dirname + '/../helpers/twitter.js' ),
      router = express.Router();

router.all( '/', function( req, res ) {
  res.render( '../views/home.handlebars', {
    project_name: process.env.PROJECT_DOMAIN,
    sc_project: process.env.SC_PROJECT,
    sc_security: process.env.SC_SECURITY,      
    timestamp: Date.now()
  } );
} );

module.exports = router;
