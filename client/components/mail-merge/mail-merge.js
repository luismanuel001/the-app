/* global Papa */
/* jshint camelcase: false */
'use strict';

angular.module('angularFullstackApp')
.directive('mailMerge', function () {
  return {
    templateUrl: 'components/mail-merge/mail-merge.html',
    restrict: 'EA',
    scope:{template:'=',labelButton:'=',labelButtonPopup:'=',dataid:'=?',tableid:'=?'},
    controller:['$scope','formlyConfig','$http','$compile','$interpolate','mergeService','$uibModal', '$log', '$filter', '$location',function($scope,formlyConfig,$http,$compile,$interpolate,mergeService,$uibModal, $log, $filter, $location){
      $scope.popup = {
        opened: false
      };


      $scope.merge = {};
      $scope.markup = '<formly-form model="merge" fields="mergeFields" options="options" form="form">';
      $scope.modalId = $scope.template.toLowerCase();


      var table = null;
      if($scope.tableid){
        table = $('#'+$scope.tableid).DataTable({
          buttons:[
            {
              text: 'Copy',
              extend: 'copy',
              header:false
            }
          ]
        });
        table.buttons().container().appendTo( $('.col-sm-6:eq(0)', table.table().container() ) );
      }

      var initAdditionalVars = function(){
        var baseUrl = $location.protocol() + "://" + $location.host() + ":" + $location.port();
        var additional_vars = {
          'pdf_file_name': $scope.mailMerge.document.filename,
          'output_folder': $scope.mailMerge.document.output_folder,
          'pdf_file_path': $scope.mailMerge.document.output_folder + '/' + $scope.mailMerge.document.filename,
          'html_permalink': baseUrl + $scope.mailMerge.document.html_permalink,
          'pdf_permalink': baseUrl + $scope.mailMerge.document.pdf_permalink,
          'zip_permalink': baseUrl + $scope.mailMerge.document.html_permalink + '.zip',
          'now_custom_date': $filter('date')(Date.now(), 'yyyy.MM.dd_HH.mm.ss'),
          'now_default_date': $filter('date')(Date.now(), 'mediumDate'),
          'now_short_date': $filter('date')(Date.now(), 'shortDate'),
          'now_medium_date': $filter('date')(Date.now(), 'mediumDate'),
          'now_long_date': $filter('date')(Date.now(), 'longDate'),
          'now_full_date': $filter('date')(Date.now(), 'fullDate'),
        };
        $scope.merge = _.merge($scope.merge, additional_vars);
      };

      var mapping = function(){
        $scope.merge = $scope.messageInterpolate[$scope.currentIndex];
        initAdditionalVars();
      };

      var singleMsg = function(){
        var email ={};
        for(var key in $scope.merge){
          if($scope.merge[key] !== null && typeof $scope.merge[key] === 'object'){
            if($scope.merge[key] instanceof Date){
              email[key] = $scope.merge[key];
            }else{
              for(var subkey in $scope.merge[key]){
                if(!email[key]){
                  email[key]={};
                }
                email[key][subkey] = $scope.merge[key][subkey];
              }
            }
          }else{
            email[key] = $scope.merge[key];
          }

        }
        $scope.messageInterpolate.push(email);
      };

      var transform = function(){
        $scope.messageInterpolate = [];
        if($scope.dataid || $scope.tableid){
          if(!$scope.result){
            singleMsg();
          }
          else if($scope.result.data.length === 0){
            //no csv value
            singleMsg();
          }else{
            for(var i=0;i<$scope.result.data.length;i++){
              var data = $scope.result.data[i];
              var email ={};
              var index = 0;
              for(var key in $scope.merge){
                if(key === 'date'){
                  var date =  data[index].split('-');

                  email[key] = new Date(date[0],parseInt(date[1])-1,date[2]);
                  index++;
                }else if($scope.merge[key] !== null && typeof $scope.merge[key] === 'object'){
                  for(var subkey in $scope.merge[key]){
                    if(!email[key]){
                      email[key]={};
                    }
                    email[key][subkey] = data[index];
                    index++;
                  }

                }
                else{
                  email[key] = data[index];
                  index++;
                }

              }
              $scope.messageInterpolate.push(email);
            }
          }
        }else{
          singleMsg();
        }

      };

      var prepareTableData = function(table){
        var transformData = [];
        for(var i=0;i<table.rows( { search:'applied' } ).data().length;i++){
          transformData.push(table.rows( { search:'applied' } ).data()[i]);
        }

        $scope.result={
          data:transformData
        };

        for(var j in $scope.result.data){
          if($scope.result.data[j].sending!==undefined){
            $scope.result.data[j].sending = null;
          }
        }
        $scope.dataLength = $scope.result.data.length;
        transform();
        if($scope.dataLength>0){
          if($scope.currentIndex >= $scope.dataLength){
            $scope.currentIndex = $scope.dataLength- 1;
          }
          $scope.current = $scope.result.data[$scope.currentIndex];

          mapping();
        }

      };


      $scope.showModal = function(id){
        //set component id and reset all variables
        $scope.myId = id;

        $scope.tableId = id+'_table';
        $scope.formId = id+'_form';
        $scope.htmlPreviewId = id+'_html_preview';
        $scope.textPreviewId = id+'_text_preview';
        $scope.docPreviewId = id+'_doc_preview';
        $scope.emailIframe = id+'_email_iframe';
        $scope.docIframe = id+'_doc_iframe';
        // $scope.emailHistoryIframe = id+'_doc_iframe';

        $scope.invalidTo = null;
        $scope.current = {sending:null};
        $scope.currentIndex = 0;
        $scope.dataLength = 0;
        $scope.page={
          currentPageNumber :1,
          itemPerPage:2,
          pageId:$scope.currentIndex
        };
        $scope.emailHistoryIframe = id+'_history_iframe_0';
        $scope.docHistoryIframe = id+'_history_doc_iframe_0';





        $scope.tab = {
          isActive : true
        };

        if($scope.dataid){
          $scope.csvData = $('#myData').val().trim();
        }

        $http.get('/api/flows/mail-merge/' + $scope.template + '/config').then(function(res){
          $scope.mailMerge = res.data;
          $scope.mailMerge.attachpdf = $scope.mailMerge.document.attachpdf;

          $scope.invalidTo = false;

          $scope.sendEmail = $scope.mailMerge.email.sendemail;
          $scope.sendhtml = $scope.mailMerge.email.sendhtmlemail;

          var renderEmail = function(){
            setTimeout(function(){
              $('#'+$scope.formId).html($compile($scope.markup)($scope));

              if($scope.sendEmail){
                if($scope.sendhtml){
                  $('#'+$scope.emailIframe).contents().find('#'+$scope.htmlPreviewId).html($compile($scope.mailMerge.email.html)($scope));
                  $scope.previewText = 'HTML Email Preview';
                }
                else{
                  $('#'+$scope.textPreviewId).text($interpolate($scope.mailMerge.email.text)($scope));
                  $scope.previewText = 'Email Preview';
                }
              }
            },100);
          };

          var renderDoc = function(){
            setTimeout(function(){
              $('#'+$scope.docIframe).contents().find('#'+$scope.docPreviewId).html($compile($scope.mailMerge.document.html)($scope));
            },10);
          };


          if($scope.mailMerge.document.generatepdf){
            $http.get('/api/flows/mail-merge/' + $scope.template + '/document').then(function(template){
              $('#'+$scope.docIframe).contents().find('body').html('');
              $('#'+$scope.docIframe).contents().find('body').append($compile('<div class=" doc-scroll" id="{{docPreviewId}}"></div>')($scope));
              var doc = template.data;
              $scope.mailMerge.document.html = doc;
              renderDoc();
            });
          }



          $http.get('/api/flows/mail-merge/' + $scope.template + '/form').then(function(template){
            var doc = template.data;
            var additional_vars = [
              {
                key: 'pdf_file_name',
                type: 'horizontalInput',
                templateOptions: {
                  type: 'hidden'
                }
              },
              {
                key: 'output_folder',
                type: 'horizontalInput',
                templateOptions: {
                  type: 'hidden'
                }
              },
              {
                key: 'pdf_file_path',
                type: 'horizontalInput',
                templateOptions: {
                  type: 'hidden'
                }
              },
              {
                key: 'html_permalink',
                type: 'horizontalInput',
                templateOptions: {
                  type: 'hidden'
                }
              },
              {
                key: 'pdf_permalink',
                type: 'horizontalInput',
                templateOptions: {
                  type: 'hidden'
                }
              },
              {
                key: 'zip_permalink',
                type: 'horizontalInput',
                templateOptions: {
                  type: 'hidden'
                }
              },
              {
                key: 'now_custom_date',
                type: 'horizontalInput',
                templateOptions: {
                  type: 'hidden'
                }
              },
              {
                key: 'now_default_date',
                type: 'horizontalInput',
                templateOptions: {
                  type: 'hidden'
                }
              },
              {
                key: 'now_short_date',
                type: 'horizontalInput',
                templateOptions: {
                  type: 'hidden'
                }
              },
              {
                key: 'now_medium_date',
                type: 'horizontalInput',
                templateOptions: {
                  type: 'hidden'
                }
              },
              {
                key: 'now_long_date',
                type: 'horizontalInput',
                templateOptions: {
                  type: 'hidden'
                }
              },
              {
                key: 'now_full_date',
                type: 'horizontalInput',
                templateOptions: {
                  type: 'hidden'
                }
              }
            ];
            doc = doc.concat(additional_vars);
            $scope.mergeFields = doc;
            for(var i =0;i<doc.length;i++){
              if(doc[i].key.indexOf('.')!==-1){
                var key = doc[i].key.substring(0,doc[i].key.indexOf('.'));
                var subkey = doc[i].key.substring(doc[i].key.indexOf('.')+1);
                if(!$scope.merge[key]){
                  $scope.merge[key] = {};
                }
                $scope.merge[key][subkey] = null;
              }else{
                $scope.merge[doc[i].key] = null;
              }
            }

            if($scope.tableid){
              prepareTableData(table);
              $scope.fetchHistory();
            }else if($scope.dataid){
              if($scope.csvData){
                $scope.parseCSV();
              }else{
                $scope.current = null;
              }
              $scope.fetchHistory();
            }
            else {
              initAdditionalVars();
            }

            if($scope.sendEmail){
              $http.get('/api/flows/mail-merge/' + $scope.template + '/email').then(function(template){
                $('#'+$scope.emailIframe).contents().find('body').html('');
                $('#'+$scope.emailIframe).contents().find('body').append($compile('<div  id="{{htmlPreviewId}}" class="email-scroll pull-left col-xs-11"></div>')($scope));
                var html = template.data;
                $scope.mailMerge.email.html = html;
                renderEmail();
              });
            }




          });

        });
      };

      $scope.parseCSV = function(){
        $scope.result = Papa.parse($scope.csvData);
        $scope.dataLength = $scope.result.data.length;
        transform();
        if($scope.dataLength>0){
          if($scope.currentIndex >= $scope.dataLength){
            $scope.currentIndex = $scope.dataLength- 1;
          }
          $scope.current = $scope.result.data[$scope.currentIndex];
          mapping();
        }
      };

      $scope.fetchHistory = function(){
        mergeService.getHistory({code:$scope.merge.code}).then(function(result){
          $scope.history = {
            mergeHistory :result.data
          };
          for(var i in $scope.history.mergeHistory){
            $scope.history.mergeHistory[i].form_vars.date = new Date($scope.history.mergeHistory[i].form_vars.date);
          }
        });
      };


      $scope.next = function(){
        $scope.currentIndex++;
        // $scope.email = $scope.message[$scope.currentIndex];
        $scope.current = $scope.result.data[$scope.currentIndex];
        $scope.page.currentPageNumber = 1;
        $scope.page.pageId = $scope.currentIndex;

        mapping();

        $scope.fetchHistory();


      };

      $scope.previous = function(){
        $scope.currentIndex--;
        $scope.current = $scope.result.data[$scope.currentIndex];
        $scope.page.currentPageNumber = 1;
        $scope.page.pageId = $scope.currentIndex;
        mapping();

        $scope.fetchHistory();

      };

      $scope.update = function(){
        $('#'+$scope.textPreviewId).text($interpolate($scope.mailMerge.email.text)($scope));
      };



      $scope.open = function(){
        $scope.popup.opened = true;
      };

      $scope.refresh = function(){
        $('#'+$scope.emailIframe).contents().find('#'+$scope.htmlPreviewId).empty();
        $('#'+$scope.emailIframe).contents().find('#'+$scope.htmlPreviewId).html($compile($scope.mailMerge.email.html)($scope));
        $('#'+$scope.formId).html($compile($scope.markup)($scope));
      };

      $scope.openDocument = function(history){
        $uibModal.open({
          template:'<iframe style="width:100%;height:500px;overflow:auto" id="'+$scope.docHistoryIframe+'"></iframe>',
          scope:$scope,
          controller:function($scope){
            setTimeout(function(){
              $('#'+$scope.docHistoryIframe).contents().find('body').empty();
              $('#'+$scope.docHistoryIframe).contents().find('body').html(history.document.html);
            },100);
          }
        });
      };

      $scope.openEmail = function(history){
        $uibModal.open({
          template:'<iframe style="width:100%;height:500px;overflow:auto" id="'+$scope.emailHistoryIframe+'"></iframe>',
          scope:$scope,
          controller:function($scope){
            setTimeout(function(){
              $('#'+$scope.emailHistoryIframe).contents().find('body').empty();
              $('#'+$scope.emailHistoryIframe).contents().find('body').html(history.email.html);
            },100);
          }
        });
      };

      $scope.sendMessage = function(){
        $scope.messages = [];
        $scope.invalidTo = false;
        if($scope.sendEmail && !$scope.merge.email.to){
          $scope.invalidTo = true;
          return;
        }

        $scope.current.sending = true;
        if(!$scope.dataid && !$scope.tableid || !$scope.result || $scope.result.data.length === 0 ){
          transform();
        }

        if(!$scope.sendEmail){
          return;
        }
        // var template = angular.copy($scope.mailMerge);
        //
        //
        // $scope.messages.push(template);
        // var scope = $scope.$new();
        // scope.merge = $scope.messageInterpolate[$scope.currentIndex];
        //
        // var emailEl = $compile($scope.mailMerge.email.html)(scope);
        // if($scope.mailMerge.document.generatepdf){
        //   var docEl = $compile($scope.mailMerge.document.html)(scope);
        // }
        // var text = $interpolate($scope.mailMerge.email.text)(scope);
        //
        // setTimeout(function(){
        //   var previewEmail= $('#email-temp').html(emailEl);
        //   if($scope.mailMerge.document.generatepdf){
        //     var previewDoc= $('#doc-temp').html(docEl);
        //     $scope.messageInterpolate[$scope.currentIndex].doc = previewDoc.html();
        //   }
        //   $scope.messageInterpolate[$scope.currentIndex].html = previewEmail.html();
        //
        //   var message = angular.copy($scope.messages[0]);
        //
        //   message.recipientcode = $scope.messageInterpolate[$scope.currentIndex].code;
        //   message.status = 'kue';
        //   message.email.to = $scope.messageInterpolate[$scope.currentIndex].email.to;
        //   message.email.cc = $scope.messageInterpolate[$scope.currentIndex].email.cc;
        //   message.email.bcc = $scope.messageInterpolate[$scope.currentIndex].email.bcc;
        //   message.email.subject = $scope.messageInterpolate[$scope.currentIndex].email.subject;
        //   message.email.html = $scope.messageInterpolate[$scope.currentIndex].html;
        //   message.email.text = text;
        //   if($scope.mailMerge.document.generatepdf){
        //     message.document.html = $scope.messageInterpolate[$scope.currentIndex].doc;
        //   }
        //   message.document.attachpdf = $scope.mailMerge.attachpdf;
        //   $scope.messages[0] = message;
        // },200);

        setTimeout(function(){

          var type = $scope.template.charAt(0).toUpperCase() + $scope.template.slice(1, $scope.template.length-1);
          if($scope.history &&  $scope.history.mergeHistory){
            $scope.history.mergeHistory.unshift({ 'form_vars':{ date: Date.now() }, sending: true, template:type, status: 'queue'});
            $scope.totalItems++;
          }
          var mergeData = {
            recipientCode: $scope.merge.code,
	          template: $scope.template,
            'form_vars': $scope.merge
          };
          angular.forEach(mergeData.form_vars, (item, key) => {
            mergeData.form_vars[key] = _.isString(item)? $interpolate(item)($scope): item;
          });
          $log.debug(mergeData);
          mergeService.create(mergeData).then(function(data){
            $log.debug(data);
            $scope.current.sending = false;
            // if($scope.dataid || $scope.tableid){
            //   $scope.fetchHistory();
            // }
          });
        },200);

      };


    }]
  };
})
.filter('stringCut',function(){
  return function(string){
    if(string){
      return string.substring(0,25);
    }
    else{
      return '';
    }
  };
})
.directive('timeCount',['$interval','$filter',function($interval,$filter){
  return {
    restrict:'E',
    scope: { date: '=' },
    template:'<div>{{timeDiffer}}</div>',
    link: function (scope) {
      var time;
      scope.$watch('date',function(){
        time = new Date(scope.date);
        calc();
      });


      function calc () {
        var relativeTime = moment(moment.parseZone(time).local().format(), 'YYYY-MM-DD h:mm:ss a').fromNow();

        if(relativeTime.indexOf('day') !== -1 || relativeTime.indexOf('year')!==-1){
          scope.timeDiffer =  $filter('date')(time, 'd MMMM yyyy');
        }else{
          scope.timeDiffer =  relativeTime;
        }
      }

      $interval(calc, 60000);
    }
  };
}]);
