const Q = require('q');
const cheerio = require('cheerio');
const request = require('request-promise');

const getWord = function () {
  return Q.Promise(function (resolve, reject, notify) {
    request('http://urbandictionary.com')
    .then(function (html) {
      let $ = cheerio.load(html);
      let word = $('.word').first().text();
      resolve(word);
    })
    .catch(function (err) {
      reject(new Error(err));
    })
  });
};

const getDefinition = function (word) {
  return Q.Promise(function (resolve, reject, notify) {
    request(`http://api.urbandictionary.com/v0/define?term=${word}`)
    .then(function (response) {
      let data = JSON.parse(response).list[0];
      resolve(data);
    })
    .catch(function (err) {
      reject(new Error(err));
    })
  });
};

const postToSlack = function (data) {
  return Q.Promise(function (resolve, reject, notify) {
    request({
      method: 'POST',
      uri: 'https://hooks.slack.com/services/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',
      body: {
        "attachments": [{
          "fallback": data.definition,
          "color": "#e86222",
          "title": data.word,
          "title_link": data.permalink,
          "text": `${data.definition} \n\n _${data.example}_`,
          "mrkdwn_in": ["text"]
        }]
      },
      json: true
    })
    .then(function () {
      resolve();
    })
    .catch(function () {
      reject(new Error(err));
    })
  });
};

getWord().then(getDefinition).then(postToSlack).done();
