if (!process.env.PROJECT_NAME || !process.env.PROJECT_ID){
  require('dotenv').config();
}

const app = require(__dirname + '/app.js');

const listener = app.listen(process.env.PORT, () => {
  console.log(`app is running on port ${listener.address().port}...`);
} );  
