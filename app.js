const util = require( 'util' ),
      path = require( 'path' ),
      express = require( 'express' ),
      cors = require( 'cors' ),
      compression = require( 'compression' ),
      exphbs  = require( 'express-handlebars' ),
      bodyParser = require( 'body-parser' ),
      sassMiddleware = require( 'node-sass-middleware' ),
      babelify = require( 'express-babelify-middleware' ),
      // babelify = require( 'babelify' ),
      browserify = require( 'browserify-middleware' ),
      helpers = require( __dirname + '/helpers/general.js' ),
      app = express(  );

app.use( compression() );

app.use( sassMiddleware( {
  // debug: true,
  src: __dirname + '/src',
  dest: path.join( __dirname, 'public' ),
  outputStyle: 'compressed'
} ) );

app.use( express.static( 'public' ) );

app.use( bodyParser.urlencoded( {
  extended: true
} ) );

app.use( bodyParser.json() );

app.use('/js/', [
  function( req, res, next ){
    // console.log( res );
    // res.body = res.body.replace( 'CONFIG_USE_API' , 'true' );
    next();
  },
  babelify( 'src/scripts/', {
    minify: true,
    transform: [
        [   'browserify-replace', {
                replace: [
                    { from: /CONFIG_USE_API/, to: 'true' },
                    { from: /CONFIG_SHOW_METRICS/, to: 'true' },
                    { from: /CONFIG_AJAX_URL/, to: `https://${ process.env.PROJECT_DOMAIN }.glitch.me` }
                ]
            }
        ]
    ]
    
  } )  
] );

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use('/', require('./routes/index.js'))
app.use('/api', require('./routes/api.js'))
app.use('/proxy', require('./routes/proxy.js'))

app.get('/js/helpers.js', function (req, res) {
  res.sendFile(path.join(__dirname + '/helpers/general.js'));
});

module.exports = app;
