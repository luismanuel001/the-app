'use strict';

import kue from 'kue';
import Promise from 'bluebird';
import path from 'path';
import ngCompile from 'ng-node-compile';
import fs from 'fs';
import nodemailer from 'nodemailer';

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
      compiledEmailInfo.html = ngEnvironment.$compile(emailHtml)(merge);
      sendEmail(compiledEmailInfo, template.smtp)
        .then(res => {
          done(null, { compiledEmailInfo: compiledEmailInfo });
        })
        .catch(err => {
          done(err);
        });
    });
  });
});

function sendEmail(compiledEmailInfo, smtpInfo) {
  console.log('sendEmail');
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
    subject: compiledEmailInfo.subject,
  };
  if (compiledEmailInfo.sendemail) {
    mailOptions.text = compiledEmailInfo.text;
  }
  if (compiledEmailInfo.sendhtmlemail) {
    mailOptions.html = compiledEmailInfo.html;
  }
  return transporter.sendMail(mailOptions);
}
