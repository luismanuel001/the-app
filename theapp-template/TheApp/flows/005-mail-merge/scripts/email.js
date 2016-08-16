'use strict';

import kue from 'kue';
import Promise from 'bluebird';
import path from 'path';
import ngCompile from 'ng-node-compile';
import fs from 'fs';
import nodemailer from 'nodemailer';
import archiver from 'archiver';

var queue = kue.createQueue({
  disableSearch: true,
  redis: require('../../../config/databases/redis.json').redis
});

export function create(rowData) {
  return new Promise((resolve, reject) => {
    var emailJob = queue.create('send-email', JSON.parse(rowData.additional_data1))
      .attempts(3).backoff( {delay: 60*1000, type:'fixed'} )
      .on('complete', result => {
        resolve({ status: 'success', rowId: rowData._id, result: result });
      })
      .on('failed', error => {
        resolve({ status: 'failed', rowId: rowData._id, error: error });
      })
      .save();
  });
}

queue.process('send-email', function(job, done){
  var mailMergeData = job.data;
  var template = require(path.join(mailMergeData.templatePath, 'config.json'));
  var compiledEmailInfo = {};
  var merge = {merge: mailMergeData.form_vars};
  ngCompile.prototype.onEnvReady(() => {
    var ngEnvironment = new ngCompile();
    ngEnvironment.onReady(() => {
      // Interpolate merge variables
      compiledEmailInfo = JSON.parse(ngEnvironment.$interpolate(JSON.stringify(template.email))(merge));
      // Get document html template and compile
      var emailHtml = fs.readFileSync(path.join(mailMergeData.templatePath, compiledEmailInfo.html), 'utf8');
      ngEnvironment.onReady(() => {
        compiledEmailInfo.html = ngEnvironment.$compile(emailHtml)(merge);
        var emailData = {};
        var zipPath = path.join(mailMergeData.templatePath, '../../../../', mailMergeData.form_vars.output_folder, mailMergeData.form_vars.zip_permalink.split('/').pop());
        prepareAttachments(compiledEmailInfo.attachments, zipPath)
          .then(res => {
            emailData.attachmentData = res;
            return sendEmail(compiledEmailInfo, template.smtp, emailData.attachmentData);
          })
          .then(res => {
            emailData.compiledData = compiledEmailInfo
            done(null, emailData);
          })
          .catch(err => {
            done(err);
          });
      });
    });
  });
});

function prepareAttachments(attachments, zipPath) {
  return new Promise((resolve, reject) => {
    try {
      if (!attachments.length) {
        resolve(false);
      }
      else if (attachments.length === 1) {
        resolve({
          isZip: false,
          path: path.join(__dirname, '../../../', attachments[0]),
          filename: attachments[0].split('/').pop(),
          data: fs.readFileSync(path.join(__dirname, '../../../', attachments[0]), 'binary')
        });
      }
      else {
        var output = fs.createWriteStream(zipPath);
        var archive = archiver('zip');

        archive.on('error', function(err) {
          reject(err);
        });

        output.on('close', function() {
          fs.readFile(zipPath, 'binary', (err, data) => {
            if (err) {
              reject(err);
            }
            else {
              resolve({
                isZip: true,
                path: zipPath,
                filename: zipPath.split('/').pop(),
                data: data
              });
            }
          });
        });

        archive.pipe(output);
        var files = [];
        attachments.forEach((file) => {
          file = path.join(__dirname, '../../../', file);
          var promise = new Promise((resolve, reject) => {
            fs.access(file, fs.F_OK, (err) => {
               if (err) reject(err);
               resolve({
                 path: file,
                 content: fs.createReadStream(file)
               });
            });
          });
          files.push(promise);
        });
        Promise.all(files)
          .then((attachFiles) => {
            attachFiles.forEach((file) => {
              archive.append(file.content, { name: file.path.split('/').pop() });
            });
            archive.finalize();
          })
          .catch(err => {
            reject(err);
          });
      }
    }
    catch(err) {
      reject(err);
    }
  });
}

function sendEmail(compiledEmailInfo, smtpInfo, attachment) {
  var smtpConfig = {
    host: smtpInfo.host,
    port: smtpInfo.port,
    secure: smtpInfo.usessl,
    requireTLS: !smtpInfo.ssl? smtpInfo.usetls: false,
    auth: {
      user: smtpInfo.userid,
      pass: smtpInfo.userpassword
    },
    debug: smtpInfo.debug
  };
  var transporter = nodemailer.createTransport(smtpConfig);
  var mailOptions = {
    from: '"' + smtpInfo.name + '" <' + smtpInfo.fromaddress + '>',
    to: compiledEmailInfo.to,
    cc: compiledEmailInfo.cc,
    bcc: compiledEmailInfo.bcc,
    subject: compiledEmailInfo.subject
  };
  if (compiledEmailInfo.sendemail) {
    mailOptions.text = compiledEmailInfo.text;
  }
  if (compiledEmailInfo.sendhtmlemail) {
    mailOptions.html = compiledEmailInfo.html;
  }
  if (attachment) {
    mailOptions.attachments = [{
      filename: attachment.filename,
      path: attachment.path
    }];
  }
  return transporter.sendMail(mailOptions);
}
