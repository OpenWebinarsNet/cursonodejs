var path = require('path');
var _ = require('lodash');

if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development';


var bydefault = {
  env: process.env.NODE_ENV,

  root: path.normalize(__dirname + '/../../..'),

  port: process.env.PORT || 9000,

  userRoles: ['customer', 'owner'],

  mongo: {
    uri: "mongodb://localhost/pizzeria",
    options: {
      db: {
        safe: true
      }
    }
  },


}


module.exports = _.merge(
  bydefault,
  require('./' + process.env.NODE_ENV + '.js')
);
