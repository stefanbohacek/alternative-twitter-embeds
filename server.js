if ( !process.env.PROJECT_NAME || !process.env.PROJECT_ID ){
  require( 'dotenv' ).config();
}

const app = require( __dirname + '/app.js' );

var listener = app.listen(process.env.PORT, function() {
  console.log( `app is running on port ${listener.address().port}...` );
} );  
