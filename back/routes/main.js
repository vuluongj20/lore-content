var express = require('express');
var router = express.Router();
var fs = require('fs');
var util = require('util');

var readFile = util.promisify(fs.readFile);
var writeFile = util.promisify(fs.writeFile);
var rename = util.promisify(fs.rename);

var auth = require('../mid/auth');

router.get('/des', async function(req, res, next) {
  try {
    var jdes = JSON.parse(await readFile('./data/current/main/des.json', 'utf8'));
    res.json(jdes);
  } catch (err) {
    next(err);
  }
});
router.get('/courses', async function(req, res, next) {
  try {
    var jcourses = JSON.parse(await readFile('./data/current/main/courses.json', 'utf8'));
    res.json(jcourses);
  } catch (err) {
    next(err);
  }
});
router.get('/team', async function(req, res, next) {
  try {
    var jteam = JSON.parse(await readFile('./data/current/main/team.json', 'utf8'));
    res.json(jteam);
  } catch (err) {
    next(err);
  }
});

router.post('/', auth, async function(req, res, next) {
  try {
    var type = res.locals.auth.type;
    if (type !== 'demo') {
      var account = res.locals.auth.account;
      var data = req.body;
      var dir = './data/tmp/' + account;
      var dirMain = dir + '/main';
      var dirFiles = dir + '/files';
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
        fs.mkdirSync(dirMain);
      } else if (!fs.existsSync(dirMain)) {
        fs.mkdirSync(dirMain);
      }
      if (!fs.existsSync(dirFiles)) {
        fs.mkdirSync(dirFiles);
      }
      await Promise.all([
        writeFile(dirMain + '/des.json', JSON.stringify(data.des, null, 2)),
        writeFile(dirMain + '/courses.json', JSON.stringify(data.courses, null, 2)),
        writeFile(dirMain + '/team.json', JSON.stringify(data.team, null, 2))
      ]);
      res.sendStatus(204);
    } else {
      res.sendStatus(401);
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
