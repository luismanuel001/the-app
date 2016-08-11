'use strict';

angular.module('angularFullstackApp').factory('mergeService',['$http',
        function($http){
          var baseUrl='/api';
          var mergeService = {
            create:function(data){
              var url = baseUrl + '/flows/mail-merge';
              return $http({
                    method:'POST',
                    url:url,
                    data:data,
                    headers:{
                        'Content-type':'application/json'
                    }
                });
            },
            getHistory:function(data){
              var url = baseUrl + '/merges' +data.code+'/history';
              return $http({
                    method:'get',
                    url:url,
                    headers:{
                        'Content-type':'application/json'
                    }
                });
            }

          };

      return mergeService;

}]);
