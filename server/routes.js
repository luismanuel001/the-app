/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';
import kue from 'kue';
import _ from 'lodash';
import he from 'he';
import {getPermalinkData} from './api/flow/flow.controller';
import * as auth from './auth/auth.service';

export default function(app) {
  // Insert routes below
  app.use('/api/users', require('./api/user'));
  app.use('/api/app', require('./api/app'));
  app.use('/api/jobs', require('./api/jobs'));
  app.use('/api/kue', kue.app);
  app.use('/api/flows', require('./api/flow'));

  app.use('/auth', require('./auth').default);

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  app.route('/theapp')
    .get((req, res) => {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });

  app.route('/theapp/*')
    .get((req, res) => {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });

  // All other routes
  app.route('/*')
    .get(auth.addUserIfAuthenticated(), (req, res) => {
      // Check if there is a document with that permalink url
      getPermalinkData(req.path)
        .then(permalinkData => {
          if (permalinkData.authRequired && !req.user) {
            return res.status(401).end();
          }
          if (permalinkData.dataType === 'html') {
            res.render(path.join(app.get('frontendPath'), 'document'), {}, function(err, html) {
              res.send(html.replace('[[doc_html]]', '<iframe src="" srcdoc="' +  he.escape(permalinkData.data) + '" frameborder="0" scrollbar="false" onload="' + he.escape("this.style.height=this.contentDocument.body.scrollHeight + 'px';") + '" class="col-xs-12"></iframe>'));
            });
          }
          else if (permalinkData.dataType === 'pdf') {
            res.writeHead(200, {
              'Content-Type': 'application/pdf',
              'Access-Control-Allow-Origin': '*',
              'Content-Disposition': 'attachment; filename=' + encodeURIComponent(permalinkData.filename)
            });
            res.end(permalinkData.data, 'binary');
          }
          else if (permalinkData.dataType === 'zip') {
            res.writeHead(200, {
              'Content-Type': 'application/zip',
              'Access-Control-Allow-Origin': '*',
              'Content-Disposition': 'attachment; filename=' + encodeURIComponent(permalinkData.filename)
            });
            res.end(permalinkData.data, 'binary');
          }
          else {
            res.render(path.join(app.get('frontendPath'), '404'));
          }
        })
        .catch(err => {
          console.log(err);
          res.render(path.join(app.get('frontendPath'), '404'));
        });
    });
}
