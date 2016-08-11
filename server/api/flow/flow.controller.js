/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/flows              ->  index
 * POST    /api/flows              ->  create
 * GET     /api/flows/:id          ->  show
 * PUT     /api/flows/:id          ->  update
 * DELETE  /api/flows/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import {Flow} from '../../sqldb';
import config from '../../config/environment';
import path from 'path';
import fs from 'fs';
var mailMerge = require(path.join(config.root, config.flows.mailMergeFolder, 'scripts', 'mail-merge'));

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    return entity.updateAttributes(updates)
      .then(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.destroy()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

function mailMergeConfig(template) {
  var templatePath = path.join(config.root, config.flows.mailMergeFolder, 'templates', template);
  return require(path.join(templatePath, 'config.json'));
}

function respondWithMailMergeResults(res) {
  return function(entity) {
    if (entity) {
      entity = _.map(entity.models, (item) => {
        item.set({'additional_data1': JSON.parse(item.get('additional_data1'))});
        item.set({'additional_data2': JSON.parse(item.get('additional_data2'))});
        return item;
      });
      res.status(200).json(entity);
    }
  };
}

// Gets a list of Flows
export function index(req, res) {
  return Flow.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Flow from the DB
export function show(req, res) {
  return Flow.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Flow in the DB
export function create(req, res) {
  return Flow.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Flow in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Flow.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Flow from the DB
export function destroy(req, res) {
  return Flow.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

// Creates a new Flow in the DB
export function createMailMerge(req, res) {
  var mailMergeData = req.body;
  mailMergeData.templatePath = path.join(config.root, config.flows.mailMergeFolder, 'templates', req.body.template);
  mailMerge.create(mailMergeData).then((mergeJob) => {
    return res.status(200).json(mergeJob);
  });
  // return Flow.create(req.body)
  //   .then(respondWithResult(res, 201))
  //   .catch(handleError(res));
}

// Returns a mail-merge template config file as JSON
export function getMailMergeConfig(req, res) {
  var templateConfig = mailMergeConfig(req.params.template);
  if (!templateConfig) {
    return res.status(404).end();
  }
  return res.status(200).json(templateConfig);
}

// Returns a mail-merge template form file as JSON
export function getMailMergeForm(req, res) {
  var templateConfig = mailMergeConfig(req.params.template);
  if (!templateConfig) {
    return res.status(404).end();
  }
  var templateForm = require(path.join(config.root, config.flows.mailMergeFolder, 'templates', req.params.template, templateConfig.form));
  return res.status(200).json(templateForm);
}

// Returns a mail-merge template email
export function getMailMergeEmail(req, res) {
  var templateConfig = mailMergeConfig(req.params.template);
  if (!templateConfig) {
    return res.status(404).end();
  }
  var emailPath = path.join(config.root, config.flows.mailMergeFolder, 'templates', req.params.template, templateConfig.email.html);
  fs.readFile(emailPath, 'utf8', function read(err, data) {
    if (err) {
      return res.status(404).end();
    }
    return res.status(200).json(data);
  });
}

// Returns a mail-merge template document
export function getMailMergeDocument(req, res) {
  var templateConfig = mailMergeConfig(req.params.template);
  if (!templateConfig) {
    return res.status(404).end();
  }
  var documentPath = path.join(config.root, config.flows.mailMergeFolder, 'templates', req.params.template, templateConfig.document.html);
  fs.readFile(documentPath, 'utf8', function read(err, data) {
    if (err) {
      return res.status(404).end();
    }
    return res.status(200).json(data);
  });
}

// Gets a list of Mail-Merge Flows
export function listMailMerge(req, res) {
  return Flow.findAll({ type1: 'mail-merge' })
    .then(respondWithMailMergeResults(res))
    .catch(handleError(res));
}

export function getMailMergeDocumentHtmlFromPermalink(permalink) {
  return new Promise((resolve, reject) => {
    Flow.findAll({ type1: 'mail-merge' })
      .then(entity => {
        if (entity && entity.models) {
          entity = _.find(entity.models, (item) => {
            item.set({'additional_data1': JSON.parse(item.get('additional_data1'))});
            item.set({'additional_data2': JSON.parse(item.get('additional_data2'))});
            if (item.get('additional_data2') && item.get('additional_data2').document &&item.get('additional_data2').document.html_permalink) {
              return item.get('additional_data2').document.html_permalink === permalink;
            }
            else {
              return false;
            }
          });
          if (entity) resolve(entity.get('additional_data2').document.html);
          else reject();
        }
        else reject();
      })
      .catch(err => {
        reject(err);
      });
  });

}
