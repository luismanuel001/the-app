
'use strict';

import kue from 'kue';
import Promise from 'bluebird';
import path from 'path';
import ngCompile from 'ng-node-compile';
import fs from 'fs';
import config from '../../../server/config/environment';
import pdf from 'html-pdf';
import mkdirp from 'mkdirp';

var queue = kue.createQueue({
  disableSearch: true,
  redis: require(path.resolve(config.root, config.redis.configPath)).redis
});

export function create(rowData) {
  return new Promise((resolve, reject) => {
    var pdfJob = queue.create('generate-document', JSON.parse(rowData.additional_data1))
    .on('complete', result => {
      resolve({ status: 'success', rowId: rowData._id, result: result });
    })
    .on('failed', error => {
      resolve({ status: 'failed', rowId: rowData._id, error: error });
    })
    .save();
  });
}

queue.process('generate-document', function(job, done){
  try {
    var mailMergeData = job.data;
    var template = require(path.join(mailMergeData.templatePath, 'config.json'));
    var compiledDocumentInfo = {};
    var merge = {merge: mailMergeData.form_vars};
    merge.merge.isPDF = false;
    ngCompile.prototype.onEnvReady(() => {
      var ngEnvironment = new ngCompile([{ name: 'downloadPdfButton', path: path.join(__dirname, 'download-pdf-button.directive') }]);
      ngEnvironment.onReady(() => {
        // Interpolate merge variables
        compiledDocumentInfo = JSON.parse(ngEnvironment.$interpolate(JSON.stringify(template.document))(merge));
        // Get document html template and compile
        setTimeout(() => {
          var documentHtml = fs.readFileSync(path.join(mailMergeData.templatePath, compiledDocumentInfo.html), 'utf8');
          compiledDocumentInfo.html = ngEnvironment.$compile(documentHtml)(merge);
          // If generatepdf is true then process html into pdf
          if (compiledDocumentInfo.generatepdf) {
            var compiledPDFInfo = JSON.parse(JSON.stringify(compiledDocumentInfo));
            var pdfMerge = JSON.parse(JSON.stringify(merge));
            pdfMerge.merge.isPDF = true;
            compiledPDFInfo.html = ngEnvironment.$compile(documentHtml)(pdfMerge);
            generatePdf(compiledPDFInfo)
              .then(res => {
                done(null, { compiledData: compiledDocumentInfo, pdfData: res});
              })
              .catch(err => {
                console.log(err);
                done(err);
              });
          }
          // Else just return the compiledDocumentInfo
          else {
            done(null, { compiledData: compiledDocumentInfo });
          }
        }, 500);
      });
    });
  }
  catch(err) {
    console.log(err);
    done(err);
  }
});

function generatePdf(compiledDocumentInfo) {
  return new Promise((resolve, reject) => {
    var outputPath = path.resolve(config.root, compiledDocumentInfo.output_folder);
    mkdirp(outputPath, function (err) {
      if (err) {
        reject(err);
      }
      else {
        pdf.create(compiledDocumentInfo.html, { format: 'Letter' })
          .toFile(path.join(outputPath, compiledDocumentInfo.filename), function(err, res) {
            if (err) reject(err);
            else {
              resolve(fs.readFileSync(res.filename, 'binary'));
            }
        });
      }
    });
  });
}
