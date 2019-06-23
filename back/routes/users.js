var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var fs = require('fs');
var util = require('util');
var crypto = require('crypto');

var readFile = util.promisify(fs.readFile);
var writeFile = util.promisify(fs.writeFile);

router.post('/login', async function (req, res, next) {
  try {
    var email = req.body.email;
    var pass = req.body.pass;
    var authorized = false;
    var users = JSON.parse(await readFile('./data/login/users.json'));
    for (let user of users) {
      if (user.email === email && user.pass === pass) {
        authorized = true;
        var privateKey = await readFile('./data/login/private.key', 'utf8');
        var tokenSettings = {
          algorithm: 'RS256',
          expiresIn: 31536000,
          issuer: 'Lore',
          subject: email
        };
        if (user.type === 'admin') {
          var token = jwt.sign({account: email, type: 'admin'}, privateKey, tokenSettings);
          res.cookie('jwt', token, { maxAge: 31536000000, httpOnly: true, secure: false });
          res.cookie('userType', 'admin', { maxAge: 31536000000});
          res.json({authorized: true, type: 'admin'});
        } else if (user.type === 'norm'){
          var token = jwt.sign({account: email, type: 'norm'}, privateKey, tokenSettings);
          res.cookie('jwt', token, { maxAge: 31536000000, httpOnly: true, secure: false });
          res.cookie('userType', 'norm', { maxAge: 31536000000});
          res.json({authorized: true, type: 'norm'});
        } else if (user.type === 'demo') {
          var token = jwt.sign({account: email, 'type': 'demo'}, privateKey, tokenSettings);
          res.cookie('jwt', token, { maxAge: 7200000, httpOnly: true, secure: false });
          res.cookie('userType', 'demo', { maxAge: 7200000});
          res.json({authorized: true, type: 'demo'});
        }
      }
    }
    if (!authorized) {
      res.json({authorized: false});
    }
  } catch (err) {
    next(err);
  }
});

router.post('/exists', async function (req, res, next) {
  try {
    var email = req.body.email;
    var users = JSON.parse(await readFile('./data/login/users.json'));
    var userExists = false;
    for (let user of users) {
      if (user.email === email) {
        userExists = true;
        res.json({userExists: true});
      }
    }
    if (!userExists) {
      res.json({userExists: false});
    }
  } catch (err) {
    next(err);
  }
});

router.post('/reset', async function (req, res, next) {
  async function reset (req, res, next) {
    try {
      var email = req.body.email;
      var newPass = req.body.newPass;
      var userFound = false;
      var users = JSON.parse(await readFile('./data/login/users.json'));
      for (let user of users) {
        if (user.email === email) {
          userFound = true;
          user.pass = newPass;
          await writeFile('./data/login/users.json', JSON.stringify(users, null, 2));
          res.clearCookie('jwt');
          res.sendStatus(204);
        }
      }
      if (!userFound) {
        res.sendStatus(400);
      }
    } catch (err) {
      next(err);
    }
  }
  try {
    var cookie = req.cookies.jwt;
    if (cookie) {
      var publicKey = await readFile('./data/login/public.key', 'utf8');
      var verified = await jwt.verify(cookie, publicKey, {
        algorithm: ['RS256'],
        issuer: 'Lore'
      });
      if (verified) {
        if (verified.type === 'admin') {
          reset(req, res, next);
        } else {
          res.clearCookie('jwt');
          throw new Error('Non-admin-user.')
        }
      } else {
        res.clearCookie('jwt');
        throw new Error('JWT token not accepted.')
      }
    } else {
      throw new Error('No cookie found.')
    }
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      res.clearCookie('jwt');
      res.redirect('/login/');
    }
    next(err);
  }
});

router.post('/new', async function (req, res, next) {
  async function newUser (req, res, next) {
    try {
      var email = req.body.email;
      var pass = req.body.pass;
      var userExists = false;
      var users = JSON.parse(await readFile('./data/login/users.json'));
      for (let user of users) {
        if (user.email === email) {
          already = true;
          res.json({userExists: true});
        }
      }
      if (!userExists) {
        users.push({
          email: email,
          pass: pass,
          type: 'norm'
        });
        await writeFile('./data/login/users.json', JSON.stringify(users, null, 2))
        res.clearCookie('jwt');
        res.json({userExists: false});
      }
    } catch (err) {
      next(err);
    }
  }
  try {
    var cookie = req.cookies.jwt;
    if (cookie) {
      var publicKey = await readFile('./data/login/public.key', 'utf8');
      var verified = await jwt.verify(cookie, publicKey, {
        algorithm: ['RS256'],
        issuer: 'Lore'
      });
      if (verified) {
        if (verified.type === 'admin') {
          newUser(req, res, next);
        } else {
          res.clearCookie('jwt');
          throw new Error('Non-admin-user.');
        }
      } else {
        res.clearCookie('jwt');
        throw new Error('JWT token not accepted.');
      }
    } else {
      throw new Error('No cookie found.');
    }
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      res.clearCookie('jwt');
      res.redirect('/login/');
    }
    next(err);
  }
});

module.exports = router;
