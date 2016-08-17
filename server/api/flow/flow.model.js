'use strict';

import Joi from 'joi';
import config from '../../config/environment';

module.exports = function(bookshelf) {
  var Flow = bookshelf.Model.extend({
    tableName: config.flows.tableName,

	  /**
     * ID Field Attribute
     */
    idAttribute: '_id',

	  /**
     * Validation
     */
    validate: {
      type1: Joi.string(),
	    type2: Joi.string(),
    	type3: Joi.string(),
    	code1:  Joi.string(),
    	code2:  Joi.string(),
    	code3:  Joi.string(),
      status1: Joi.string(),
    	status2: Joi.string(),
    	status3: Joi.string(),
    	text1: Joi.string(),
    	text2: Joi.string(),
    	text3: Joi.string(),
    	clob1: Joi.string(),
    	clob2: Joi.string(),
    	clob3: Joi.string(),
    	blob1: Joi.binary(),
    	blob2: Joi.binary(),
    	blob3: Joi.binary(),
    	date1: Joi.date(),
    	date2: Joi.date(),
    	date3: Joi.date(),
    	amount1: Joi.number(),
    	amount2: Joi.number(),
    	amount3: Joi.number(),
    	bool1: Joi.boolean(),
    	bool2: Joi.boolean(),
    	bool3: Joi.boolean(),
    	log1: Joi.string(),
    	log2: Joi.string(),
    	log3: Joi.string(),
    	notes: Joi.string(),
    	additional_data1:  Joi.string(),
    	additional_data2:  Joi.string(),
    	additional_data3:  Joi.string()
    },

    /**
     * Virtual Getters
     */
    virtuals: {},

    /**
     * Instance Methods
     */

  });

  return Flow;
};
