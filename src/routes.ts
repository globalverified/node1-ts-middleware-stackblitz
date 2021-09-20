import express, { Request, Response, NextFunction } from 'express';
let router = express.Router();
const app = express();
// const fs = require('fs');
import * as fs from 'fs';

// In middleware, you are checking if session object is available or not.
// Instead, we should check for an authorization key which we store inside session.
// Because session object & session ID will always be available once we inject express session correctly.

//middleware to check if req has a session
const checkSession = (req: Request, res: Response, next: NextFunction) => {
  //check for an authorization key which we store inside session
  if (req.session) {
    console.log('req.session', req.session);
    next();
  } else {
    res.send('Invalid session');
  }
};

router.use(checkSession);

app.use(express.static(__dirname + '/public'));

router.route('/bpm/start').get(checkSession, (req: Request, res: Response) => {
  console.log('pub/proxy/bpm/start called session id is ', req.sessionID);
  res.send('pub/proxy/bpm/start called');
});

router.route('/adu-ms/get').get(checkSession, (req: Request, res: Response) => {
  console.log('api/proxy/adu-ms/get called session id is ', req.sessionID);
  res.send('api/proxy/adu-ms/get called');
});

router
  .route('/save/:id')
  .get((req: Request, res: Response) => {
    //reads file Id and serves back as JSON http://localhost:3000/pub/proxy/save/29 output: {"fileID":"29"}
    res.json({ fileID: req.params.id });
  })
  .post((req: Request, res: Response) => {
    //writes contents of request body that is JSON to file named id.json
    var body = '';
    var filePath = __dirname + '/id.json';
    req.on('data', function (data) {
      body += data;
    });

    req.on('end', function () {
      fs.appendFile(filePath, body, function () {
        res.end();
      });
    });
    res.send('new content updated successfully');
  });

module.exports = router;
