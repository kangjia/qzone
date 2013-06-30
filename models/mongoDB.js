/**
 * Created with JetBrains WebStorm.
 * User: kangjia
 * Date: 13-6-25
 * Time: 下午6:49
 * To change this template use File | Settings | File Templates.
 */

var mongoose = require('mongoose');
var mongoConfig = require('../config').mongo;

var linkStr =  "mongodb://" + mongoConfig.username + ":" + mongoConfig.password + "@" + mongoConfig.hostname + ":" + mongoConfig.port + "/" + mongoConfig.db;

var connection = mongoose.createConnection(linkStr);

connection.on('error' , function(){
    console.error('mongoose connection error');
});

connection.on('open' , function(){
    console.info('mongoose open connection');
});

exports.connection = connection;


