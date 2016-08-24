'use strict';

angular.module('downloadPdfButton', [])
  .directive('downloadPdfButton', function () {
    return {
      template: `<div>
                  <!--[if mso]>
                    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="{{downloadUrl}}" style="height:53px;v-text-anchor:middle;width:200px;" arcsize="8%" stroke="f" fill="t">
                      <v:fill type="tile" src="https://imgur.com/5BIp9d0.gif" color="#49a9ce" />
                      <w:anchorlock/>
                      <center style="color:#ffffff;font-family:sans-serif;font-size:13px;font-weight:bold;">Download PDF</center>
                    </v:roundrect>
                  <![endif]-->
                  <a href="{{downloadUrl}}" style="background-color:#49a9ce;background-image:url('https://imgur.com/5BIp9d0.gif');border-radius:4px;color:#ffffff;display:inline-block;font-family:sans-serif;font-size:13px;font-weight:bold;line-height:53px;text-align:center;text-decoration:none;width:200px;-webkit-text-size-adjust:none;mso-hide:all;">
                    Download PDF
                  </a>
                </div>`,
      restrict: 'EA',
      scope: {
        pdfPermalink: '='
      },
      controller: function ($scope, $sce) {
        $scope.downloadUrl = $sce.trustAsResourceUrl($scope.pdfPermalink);
      }
    };
  });
