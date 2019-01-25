var jwt = require('jsonwebtoken');
var fs = require('fs');
var util = require('util');

const readFile = util.promisify(fs.readFile);

module.exports = async function(req, res, next) {
  try {
    var cookie = req.cookies.jwt;
    if (cookie) {
      var publicKey = await readFile('./data/login/public.key', 'utf8');
      var verified = await jwt.verify(cookie, publicKey, {
        algorithm: ['RS256'],
        issuer: 'Lore'
      });
      if (verified) {
        res.locals.auth = {type: verified.type, account: verified.account};
        next();
      } else {
        res.clearCookie('jwt');
        res.redirect('/login/');
      }
    } else {
      res.redirect('/login/');
    }
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      res.clearCookie('jwt');
      res.redirect('/login/');
    }
    next(err);
  }
};
