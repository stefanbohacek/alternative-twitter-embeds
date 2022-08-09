"use strict";

import { ready } from "./ready.js";
import { processTweets } from "./processTweets.js";

const altTwitterEmbedsAPI = "CONFIG_AJAX_URL";

ready(() => {
  processTweets(altTwitterEmbedsAPI, CONFIG_USE_API, CONFIG_SHOW_METRICS);
});
