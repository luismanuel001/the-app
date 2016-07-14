'use strict';

function invoicesService() {
	// AngularJS will instantiate a singleton by calling "new" on this function
  var data = [
    {
      no: 111,
      clientDetails: 'Company 111',
      date: 'July 07, 2016',
      product: 'Product for Company 111',
      fees: '111'
    },
    {
      no: 222,
      clientDetails: 'Company 222',
      date: 'July 07, 2016',
      product: 'Product for Company 222',
      fees: '222'
    },
    {
      no: 333,
      clientDetails: 'Company 333',
      date: 'July 07, 2016',
      product: 'Product for Company 333',
      fees: '333'
    }
  ];

  var Invoices = {
    getAll() {
      return data;
    },
    get(id) {
      return _.find(data, { no: parseInt(id) });
    }
  };
  return Invoices;
}

angular.module('angularFullstackApp.frontend-hexo')
  .service('invoicesService', invoicesService);
