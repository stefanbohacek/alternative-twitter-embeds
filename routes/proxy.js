const express = require('express'),
      request = require('request'),
      router = express.Router();

router.all('/', (req, res) => {
  if (req.query.url){
    const url = req.query.url;
    request.get(url).pipe(res);
  } else {
    res.end(JSON.stringify({ error: 'missing required parameter: url' }));
  }
});

module.exports = router;
