var fs = require('fs');
var crypto = require('crypto');
var inspect = require('util').inspect;
var ssh2 = require('ssh2');
var utils = ssh2.utils;

var allowedUser = Buffer.from('foo');
var allowedPassword = Buffer.from('bar');
var MAX_NAME_LEN = 10;
var PROMPT_NAME = 'Enter a username to use (max ' + MAX_NAME_LEN + ' chars): ';
var PROMPT_PASS = 'Enter a password to use (max ' + MAX_NAME_LEN + ' chars): ';

const host_key = 'host.key';
var keygenPromise = require('ssh-keygen').keygenPromise;

module.exports = new Promise((resolve, reject) => {
  (async() => {
    await (async() => {
      try {
        fs.statSync(host_key);
      } catch (err) {
        if (err.code === 'ENOENT') {
          var keygen = require('ssh-keygen');
          var location = __dirname + '/' + host_key;
          var comment = 'joe@foobar.com';
          var password = ''; // false and undefined will convert to an empty pw
          var format = 'PEM'; // default is RFC4716
          await keygenPromise({
            location: location,
            comment: comment,
            password: password,
            read: true,
            format: format
          })
        }
      }
    })()
    var allowedPubKey = utils.parseKey(fs.readFileSync('host.key.pub'));
    try {
      new ssh2.Server({
        hostKeys: [fs.readFileSync(host_key)]
      }, function (client) {
        console.log('Client connected!');
        client.on('authentication', function (ctx) {
          var nick = ctx.username;
          var prompt = nick ? PROMPT_PASS : PROMPT_NAME;
          // Try to use username as nickname
          switch (ctx.method) {
          case 'password':
            var password = Buffer.from(ctx.password);
            if (password.length !== allowedPassword.length || !crypto.timingSafeEqual(password, allowedPassword)) {
              return ctx.reject();
            }
              return ctx.accept();
            break;
          case 'keyboard-interactive':
            if (nick.length === 0) prompt = 'A nickname is required.\n' + PROMPT_NAME;
            ctx.prompt(prompt, function retryPrompt(answers) {
              if (answers.length === 0) return ctx.reject(['keyboard-interactive']);
              if (ctx.username) {
                var password = Buffer.from(answers[0])
                if (password.length === allowedPassword.length && crypto.timingSafeEqual(password, allowedPassword)) {
                  ctx.accept();
                } else {
                  ctx.username = ''
                  return ctx.prompt('A password is wrong.\n' + PROMPT_PASS, retryPrompt);
                }
              } else {
                nick = Buffer.from(answers[0]);
                if (nick.length > MAX_NAME_LEN) {
                  return ctx.prompt('That nickname is too long.\n' + PROMPT_NAME, retryPrompt);
                } else if (nick.length === 0) {
                  return ctx.prompt('A nickname is required.\n' + PROMPT_NAME, retryPrompt);
                } else if (nick.length === allowedUser.length && !crypto.timingSafeEqual(nick, allowedUser)) {
                  return ctx.prompt('A nickname is not listed.\n' + PROMPT_NAME, retryPrompt);
                }
                ctx.username = nick;
                return ctx.prompt('A password is required.\n' + PROMPT_PASS, retryPrompt);
              }
            })
            break;
          default:
            return ctx.reject(['keyboard-interactive']);
          }
        }).on('ready', function () {
          console.log('Client authenticated!');
          client.on('session', function (accept, reject) {
            var session = accept();
            session.on('pty', function (accept, reject, info) {
              accept()
            })
            session.on('shell', function (accept, reject, info) {
              const stream = accept();
              resolve(stream)
            });
          });
        }).on('end', function () {
          console.log('Client disconnected');
        });
      }).listen(process.env.PORT || 8022 '127.0.0.1', function () {
        console.log('Listening on port ' + this.address().port);
      });
    } catch (err) {
      reject(err)
    }
  })()
})
