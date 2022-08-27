const express = require('express'),
      router = express.Router();

router.all('/', (req, res) => {
  res.render('../views/home.handlebars', {
    project_name: process.env.PROJECT_DOMAIN,
    footer_scripts: process.env.FOOTER_SCRIPTS,
    timestamp: Date.now()
  });
});

module.exports = router;
