const request = require("request");

module.exports = {
  send: (task, recipients) => {
    if (recipients && recipients.length > 0) {
      const options = {
        body: { task, recipients },
        json: true,
        method: "POST",
        url: process.env.EMAIL_WEBHOOK,
      };
      return makeRequest(options);
    }
    return Promise.reject("no recipients");
  }
};

const makeRequest = (options) => new Promise((resolve, reject) => {
  request(options, (err, res, body) => {
    if (err) {
      return reject(err);
    }
    if (res.statusCode !== 200) {
      return reject(res.statusCode);
    }
    resolve(body);
  });
});
