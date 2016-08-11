
'use strict';

import kue from 'kue';
import Promise from 'bluebird';
import path from 'path';
import _ from 'lodash';
import * as generateDocumentJob from './generate-document';
import * as sendEmailJob from './email';

var Flow = require(path.join(process.cwd(), 'server', 'sqldb')).Flow;

var queue = kue.createQueue({
  disableSearch: true,
  redis: require('../../../config/databases/redis.json').redis
});

export function create(mergeData) {
  return new Promise((resolve, reject) => {
    queue.create('mail-merge', mergeData)
    .on('complete', function(result){
      // console.log('Job completed with data ', result);
    })
    .on('failed', function(errorMessage){
      console.log('Job failed: ' + errorMessage);
    })
    .save(err => {
       if( err ) {
         reject(err);
       }
       else {
         resolve();
       }
    });
  });
}

queue.process('mail-merge', function(job, done){
  insertMailMergeDataIntoDB(job)
    .then(data => {
      return generateDocumentJob.create(data.attributes);
    })
    .then(data => {
      if (data.status === 'failed') {
        updateMergeStatus('failed', data.rowId, data.error)
          .then(() => {
            done(data.error);
          })
          .catch(err => {
            done(err);
          });
      }
      else if (data.status === 'success') {
        return updateDocumentDataIntoDB(data.result, data.rowId);
      }
    })
    .then(data => {
      return sendEmailJob.create(data.attributes);
    })
    .then(data => {
      if (data.status === 'failed') {
        updateMergeStatus('failed', data.rowId, data.error)
          .then(() => {
            done(data.error);
          })
          .catch(err => {
            done(err);
          });
      }
      else if (data.status === 'success') {
        return updateEmailDataIntoDB(data.result, data.rowId);
      }
    })
    .then(data => {
      done(null, data);
    })
    .catch(err => {
      done(err);
    });
});

function insertMailMergeDataIntoDB(job) {
  var mailMergeData = job.data;
  var templateConfig = require(path.join(mailMergeData.templatePath, 'config.json'));
  mailMergeData = _.merge(mailMergeData, templateConfig);
  var flowData = {
    type1: 'mail-merge',
    type2: mailMergeData.template,
    code1: mailMergeData.recipientCode,
    code2: job.id.toString(),
    status1: mailMergeData.document.initialstatus,
    status2: 'queued',
    date1: new Date(),
    additional_data1: JSON.stringify(mailMergeData),
  };
  return Flow.create(flowData);
}

function updateMergeStatus(status, rowId, error) {
  return Flow.findById(rowId)
    .then(flow => {
      return flow.save({
        status2: status,
        log1: status === 'failed' ? error : null
      }, {patch: true});
    });
}

function updateDocumentDataIntoDB(documentData, rowId) {
  return Flow.findById(rowId)
    .then(flow => {
      var compiledMailMergeData = JSON.parse(flow.attributes.additional_data1);
      compiledMailMergeData.document = documentData.compiledData;
      var flowData = {
        clob1: documentData.compiledData.html,
        blob1: documentData.pdfData ? documentData.pdfData : null,
        additional_data2: JSON.stringify(compiledMailMergeData)
      };
      return flow.save(flowData, {patch: true});
    });
}

function updateEmailDataIntoDB(emailData, rowId) {
  return Flow.findById(rowId)
    .then(flow => {
      var compiledMailMergeData = JSON.parse(flow.attributes.additional_data2);
      compiledMailMergeData.email = emailData.compiledData;
      var flowData = {
        status2: 'complete',
        additional_data2: JSON.stringify(compiledMailMergeData)
      };
      return flow.save(flowData, {patch: true});
    });
}
