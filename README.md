![Alternative Tweet Embeds](https://cdn.glitch.com/73fcfec4-fd90-48b0-acb7-6196517f580b%2Fbanner-772x250.png)

# Alternative Tweet Embeds

Embed tweets without compromising your users' privacy and your site's performance.

Learn more on [stefanbohacek.com](https://stefanbohacek.com/project/tweet-embeds-wordpress-plugin/). Also available as a [WordPress plugin](https://wordpress.org/plugins/tembeds/).

## How to use

Remix this project and update `.env` file with your own Twitter API keys. (See instructions inside that file.)

You can then open your project to see how to add necessary `style` and `script` tags to your page.

![View project page](https://cdn.glitch.com/4705ea0a-1577-4255-a4d5-04b4e49626a2%2Fview-project.png?v=1617223621328)
![Add scripts and styles](https://cdn.glitch.com/4705ea0a-1577-4255-a4d5-04b4e49626a2%2Finclude-files.png?v=1617224227703)


Be sure to remove any `script` tags from the [embed code that Twitter gives you](https://help.twitter.com/en/using-twitter/how-to-embed-a-tweet).

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <link href="https://alternative-twitter-embeds.glitch.me/css/styles-bs.css" rel="stylesheet" type="text/css">
</head>
<body>
    <TWEET CODE>
    <script src="https://alternative-twitter-embeds.glitch.me/js/tweets.js"></script>
</body>
</html>
```

If you're using Bootstrap v4 on your site, you can load an alternative slimmed down stylesheet.

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <link href="https://alternative-twitter-embeds.glitch.me/css/styles.css" rel="stylesheet" type="text/css">
</head>
<body>
    <TWEET CODE>
    <script src="https://alternative-twitter-embeds.glitch.me/js/tweets.js"></script>
</body>
</html>
```

## Performance improvements


See a comparison of the PageSpeed performance test results between [this project's page](https://alternative-twitter-embeds.glitch.me/) and the [test page](https://alternative-twitter-embeds.glitch.me/test.html). 

![A comparision of PageSpeed performance test results between two pages, one using this project and one using Twitter's scripts](https://cdn.glitch.com/4705ea0a-1577-4255-a4d5-04b4e49626a2%2Fperformance-compare.png?v=1617221434741)


- [Project page](https://developers.google.com/speed/pagespeed/insights/?url=https%3A%2F%2Falternative-twitter-embeds.glitch.me%2Ftest.html&tab=desktop)
- [Test page](https://developers.google.com/speed/pagespeed/insights/?url=https%3A%2F%2Falternative-twitter-embeds.glitch.me%2F&tab=desktop) ([view test page](https://alternative-twitter-embeds.glitch.me/test.html))


## Questions and tips

Need help or want to share feedback or suggestions? Feel free to reach out [via email](mailto:stefan@stefanbohacek.com) or [on Twitter](https://twitter.com/stefanbohacek)!

### I want to run some code after all tweets are processed

Use the `tembeds_tweets_processed` event.


```js
document.addEventListener('tembeds_tweets_processed', () => {
  const tweets = document.querySelectorAll('.twitter-tweet');
  console.log('tweets are ready', tweets);
});
```

Here's an example using jQuery.

```js
$(document).on('tembeds_tweets_processed', () => {
  const $tweets = $('.twitter-tweet');
  console.log('tweets are ready', $tweets);
});
```

### How do I prevent others from using my app?

Use the `ALLOWED_URLS` variable inside your `.env` file.

```
ALLOWED_URLS='alternative-twitter-embeds.glitch.me'
```
  
You can list multiple domains, separated by a comma.