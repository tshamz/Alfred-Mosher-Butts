let cheerio = require('cheerio');
let request = require('request-promise');


request('http://urbandictionary.com').then(function (html) {
  let $ = cheerio.load(html);
  let word = $('.word').first().text();

  return word;


}).then(function (word) {
  request(`http://api.urbandictionary.com/v0/define?term=${word}`).then(function (result) {
    request({
      method: 'POST',
      uri: 'https://hooks.slack.com/services/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',
      body: {
        "text": JSON.parse(result).list[0].permalink
      },
      json: true
    });
  });
});


