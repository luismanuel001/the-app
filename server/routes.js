/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';
import kue from 'kue';
import _ from 'lodash';
import he from 'he';
import {getMailMergeDocumentHtmlFromPermalink} from './api/flow/flow.controller';

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
    .get((req, res) => {
      // Check if there is a document with that permalink url
      getMailMergeDocumentHtmlFromPermalink(req.path)
        .then(documentHtml => {
          res.render(path.join(app.get('frontendPath'), 'document'), {}, function(err, html) {
            res.send(html.replace('[[doc_html]]', '<iframe src="" srcdoc="' +  he.escape(documentHtml) + '" frameborder="0" scrollbar="false" onload="' + he.escape("this.style.height=this.contentDocument.body.scrollHeight + 'px';") + '" class="col-xs-12"></iframe>'));
          });
        })
        .catch(err => {
          res.render(path.join(app.get('frontendPath'), '404'));
        });
    });
}
