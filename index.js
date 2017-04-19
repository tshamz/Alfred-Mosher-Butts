let cheerio = require('cheerio');
let request = require('request-promise');


request('http://urbandictionary.com').then(function (html) {
  let $ = cheerio.load(html);
  let word = $('.word').first().text();
  return word;
}).then(function (word) {
  request(`http://api.urbandictionary.com/v0/define?term=${word}`).then(function (result) {
    let data = JSON.parse(result).list[0];
    let url = `http://www.urbandictionary.com/define.php?term=${data.word}&defid=${data.defid}`;
    request({
      method: 'POST',
      uri: 'https://hooks.slack.com/services/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',
      body: {
        "attachment": [{
          "fallback": data.definition,
          "color": "#e86222",
          "author_name": data.author,
          "title": data.word,
          "title_link": data.permalink,
          "text": `${data.definition} \n\n _${data.example}_`,
        }]
      },
      json: true
    });
  });
});
