/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';
import kue from 'kue';

export default function(app) {
  // Insert routes below
  app.use('/api/users', require('./api/user'));
  app.use('/api/app', require('./api/app'));
  app.use('/api/jobs', require('./api/jobs'));
  app.use('/api/kue', kue.app);

  app.use('/auth', require('./auth').default);

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  app.route('/theapp')
    .get((req, res) => {
      res.sendFile(path.resolve(app.get('appPath') + '/app-index.html'));
    });

  app.route('/theapp/*')
    .get((req, res) => {
      res.sendFile(path.resolve(app.get('appPath') + '/app-index.html'));
    });

  // All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      res.sendFile(path.resolve(app.get('frontendPath') + '/index.html'));
    });
}
