const getTweetId = (url) => {
  return url.match(/status\/(\d+)/g)[0].replace("status/", "");
};

export { getTweetId };
