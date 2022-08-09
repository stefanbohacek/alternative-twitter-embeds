import { renderTweet } from "./renderTweet.js";
import { getTweetId } from "./getTweetId.js";
import { fetchTweetData } from "./fetchTweetData.js";
import { fetchSiteData } from "./fetchSiteData.js";
import { dispatchEvent } from "./dispatchEvent.js";

const processTweets = (altTwitterEmbedsAPI, useAPI, showMetrics) => {
  const tweets = document.querySelectorAll("blockquote.twitter-tweet");
  let tweetIds = [];

  for (const tweet of tweets) {
    const anchors = tweet.querySelectorAll("a");
    const url = anchors[anchors.length - 1].href;
    const tweetId = getTweetId(url);
    tweetIds.push(tweetId);
    tweet.dataset.tweetId = tweetId;
  }

  if (tweetIds.length) {
    if (useAPI) {
      fetchTweetData(altTwitterEmbedsAPI, tweetIds, (response) => {
        if (response && response.length) {
          response.forEach((data) => {
            renderTweet(altTwitterEmbedsAPI, showMetrics, data);
          });

          const tweetsWithAttachment = document.querySelectorAll(
            '[data-url-attachment-processed="false"]'
          );
          let tweetsWithAttachmentCount = tweetsWithAttachment.length;

          if (tweetsWithAttachmentCount === 0) {
            dispatchEvent("tembeds_tweets_processed");
          }

          for (const tweet of tweetsWithAttachment) {
            tweet.dataset.urlAttachmentProcessed = "true";

            if (tweet.dataset.urlAttachment.indexOf("twitter.com/") > -1) {
              fetchTweetData(
                altTwitterEmbedsAPI,
                [getTweetId(tweet.dataset.urlAttachment)],
                (response) => {
                  if (response && response.length) {
                    response.forEach((data) => {
                      renderTweet(data, tweet);
                    });
                  }
                }
              );
            }

            fetchSiteData(
              altTwitterEmbedsAPI,
              tweet.dataset.urlAttachment,
              (data) => {
                if (data && data.image) {
                  let urlAttachmentPreview = document.createElement("div");
                  urlAttachmentPreview.className = `tweet-attachment-preview card mt-4`;

                  let tmpAnchor = document.createElement("a");
                  tmpAnchor.href = tweet.dataset.urlAttachment;

                  let urlAttachmentPreviewHTML = "";

                  if (data.image) {
                    urlAttachmentPreviewHTML += `<a href="${tweet.dataset.urlAttachment}"><img loading="lazy" class="tweet-attachment-site-thumbnail card-img-top" src="${data.image}" alt="Preview image for ${tweet.dataset.urlAttachment}"></a>`;
                  }

                  urlAttachmentPreviewHTML += `<div class="card-body">`;

                  if (data.title) {
                    urlAttachmentPreviewHTML += `<p class="card-title">${data.title}</p>`;
                  }

                  if (data.description) {
                    urlAttachmentPreviewHTML += `<p class="card-subtitle mb-2 text-muted">${data.description}</p>`;
                  }

                  urlAttachmentPreviewHTML += `<p class="card-text"><a class="stretched-link text-muted" href="${tweet.dataset.urlAttachment}" target="_blank">${tmpAnchor.hostname}</a></p></div>`;

                  urlAttachmentPreview.innerHTML = urlAttachmentPreviewHTML;
                  tweet
                    .querySelector(".tweet-body-wrapper")
                    .appendChild(urlAttachmentPreview);
                }
              },
              () => {
                tweetsWithAttachmentCount--;
                if (tweetsWithAttachmentCount === 0) {
                  dispatchEvent("tembeds_tweets_processed");
                }
              }
            );
          }
        }
      });
    } else {
      for (const tweet of tweets) {
        let tweetAttribution = "",
          tweetDate = "";

        if (tweet.childNodes && tweet.childNodes.length) {
          if (tweet.childNodes.length === 3) {
            tweetDate = tweet.childNodes[2].textContent;
            for (let i = 0; i < tweet.childNodes.length; i++) {
              let currentNode = tweet.childNodes[i];
              if (currentNode.nodeName === "#text") {
                tweetAttribution = currentNode.nodeValue;
                break;
              }
            }
          } else {
            tweetAttribution =
              tweet.childNodes[tweet.childNodes.length - 2].innerHTML;
            let tweetDateEl = document.createElement("div");
            tweetDateEl.innerHTML = tweetAttribution;
            tweetDate = tweetDateEl.querySelector("a").textContent;
          }

          const usernames = tweetAttribution.match(/@\w+/gi);
          let name = "",
            username = "";

          if (usernames && usernames[0]) {
            username = usernames[0];
            const names = tweetAttribution.split(username);

            if (names && names[0]) {
              name = names[0].replace("— ", "").replace(" (", "");
            }
          }
          renderTweet(altTwitterEmbedsAPI, showMetrics, {
            created_at: tweetDate,
            text: tweet.querySelector("p").innerHTML,
            id: tweet.dataset.tweetId,
            // 'author_id': '',
            users: [
              {
                name: name,
                username: username.replace(/^@/, ""),
                // 'id': '',
                // 'profile_image_url': '',
                // 'verified': false
              },
            ],
          });
        }
      }
    }
  }
};

export { processTweets };
