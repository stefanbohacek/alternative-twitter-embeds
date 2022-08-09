const fetchSiteData = (altTwitterEmbedsAPI, url, cb, done) => {
  done =
    done ||
    function () {
      /* noop */
    };

  fetch(`${altTwitterEmbedsAPI}/api/?site_url=${url}`, {
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

export { fetchSiteData };
