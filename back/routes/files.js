var express = require('express');
var router = express.Router();
var path = require('path');
var multer = require('multer');
var fs = require('fs-extra');
var util = require('util');

var readFile = util.promisify(fs.readFile);
var writeFile = util.promisify(fs.writeFile);
var copy = util.promisify(fs.copy);
var rename = util.promisify(fs.rename);

var auth = require('../mid/auth');

var upload = multer({
  storage: multer.diskStorage({
    destination: './data/tmp/files/',
    filename: function(req, file, cb) {
      cb(null, file.originalname);
    }
  })
});

router.get('/:file', function(req, res, next) {
  var link = req.params.file;
  res.sendFile(path.join(__dirname, '../data/current/files', link));
});

router.post('/', auth, upload.array('files[]'), async function(req, res, next) {
  try {
    var type = res.locals.auth.type;
    if (type !== 'demo') {
      var account = res.locals.auth.account;
      var now = Date.now();
      var jteam = JSON.parse(await readFile('./data/tmp/'+ account + '/main/team.json', 'utf8'));
      var jcourses = JSON.parse(await readFile('./data/tmp/'+ account + '/main/courses.json', 'utf8'));
      for (let type of Object.keys(jcourses)) {
        for (let course of jcourses[type]) {
          var oriName = course.link;
          if (fs.existsSync('./data/tmp/files/' + oriName)) {
            await rename('./data/tmp/files/' + oriName, './data/tmp/' + account + '/files/' + oriName);
          } else {
            await copy('./data/current/files/' + oriName, './data/tmp/' + account + '/files/' + oriName);
          }
        }
      }
      for (let mem of jteam) {
        var oriName = mem.link;
        if (fs.existsSync('./data/tmp/files/' + oriName)) {
          await rename('./data/tmp/files/' + oriName, './data/tmp/' + account + '/files/' + oriName);
        } else {
          await copy('./data/current/files/' + oriName, './data/tmp/' + account + '/files/' + oriName);
        }
      }
      await Promise.all([
        writeFile('./data/tmp/' + account + '/main/team.json', JSON.stringify(jteam, null, 2)),
        writeFile('./data/tmp/' + account + '/main/courses.json', JSON.stringify(jcourses, null, 2))
      ]);
      if (!fs.existsSync('./data/history/' + account)) {
        fs.mkdirSync('./data/history/' + account);
      }
      if (fs.existsSync('./data/tmp/' + account)) {
        await rename('./data/current', './data/history/' + account + '/' + now);
        await rename('./data/tmp/' + account, './data/current');
        res.sendStatus(204);
      } else {
        res.sendStatus(500);
      }
    } else {
      res.sendStatus(401);
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
