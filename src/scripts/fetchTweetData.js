const fetchTweetData = (altTwitterEmbedsAPI, tweetIds, cb, done) => {
  done =
    done ||
    function () {
      /* noop */
    };

  fetch(`${altTwitterEmbedsAPI}/api/?tweet_ids=${tweetIds.join(",")}`, {
    method: "GET",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cache-Control": "no-cache",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      cb(response);
    })
    .catch((error) => {
      // console.error('tembeds_error', error);
    })
    .then(done);
};

export { fetchTweetData };
