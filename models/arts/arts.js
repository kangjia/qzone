/**
 * Created with JetBrains WebStorm.
 * User: kangjia
 * Date: 13-6-25
 * Time: 下午5:19
 * To change this template use File | Settings | File Templates.
 */

var mongoose = require('mongoose');
require('date-utils');

var ArtsSchema = new mongoose.Schema({
    id : Number,
    author : String,
    detail : String,
    bigImg : String ,
    pic : String ,
    image : String ,
    publish : Number ,
    n_publish : String ,
    name : String ,
    commentcount : Number ,
    likecount : Number
});

var connection = require('../mongoDB').connection;

var ArtsModel = connection.model('arts',ArtsSchema );




//exports.ArtsArtsSchema = ArtsSchema;
exports.ArtsModel = ArtsModel;