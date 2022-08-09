const express = require('express'),
      router = express.Router();

router.all('/', (req, res) => {
  res.render('../views/home.handlebars', {
    project_name: process.env.PROJECT_DOMAIN,
    head_scripts: process.env.HEAD_SCRIPTS,
    timestamp: Date.now()
  });
});

module.exports = router;
