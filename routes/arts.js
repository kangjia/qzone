/**
 * Created with JetBrains WebStorm.
 * User: kangjia
 * Date: 13-6-25
 * Time: 下午4:44
 * To change this template use File | Settings | File Templates.
 */

//arts router
require('date-utils');

var EventEmitter =  require("events").EventEmitter;
var GE = new EventEmitter();

var ArtsModel = require('../models/arts').ArtsModel;

exports.addLikeCount = function( req , res ){
    var _id = req.params._id;
    ArtsModel.update({_id:_id},{$inc:{likecount:1}}).exec(function(err){
        res.json({errcode : 0 , errmsg : "ok"});
    });
}

exports.addCommentCount = function( req , res ){
    var _id = req.params._id;
    ArtsModel.update({_id:_id},{$inc:{commentcount:1}}).exec(function(err){
        res.json({errcode : 0 , errmsg : "ok"});
    });

}
exports.api = function( req , res ){
    var _id = req.params._id;
    ArtsModel.find( {_id : _id }).exec(function(err,doc){
        if( !err ){
            res.json({errcode : 0 , errmsg : "ok" , data : doc });
        }else{
            res.json({errcode : -1 , errmsg : "" });
            console.error('mongoose query err');
        }
    });
}
exports.show = function( req , res ){
    var today = new Date();
    var n_publish = today.toFormat('YYYY-MM-DD');
    var title = "每日名画";
    var qzone = {
        pf : req.param('pf') || 'qzone',
        openId : req.param('openid'),
        openkey : req.param('openkey'),
        pfkey : req.param('pfkey')
    }
    ArtsModel.find({'n_publish':{$lte:n_publish}}).sort({'publish':'desc'}).exec(function(err,docs){
        if( !err ){
            res.render('arts/show',{docs:docs ,title:title , qzone : qzone } );
        }else{
            console.error('mongoose query err');
        }
    })
}

exports.today = function( req , res ){
    var today = new Date();
    today = today.toFormat('YYYY-MM-DD');
    var title = "今日名画";
    getArtByPublish( today , res , title );
}


exports.calendar = function( req , res ){
    var today = req.params.calendar;
    var title = "往日名画";
    getArtByPublish( today , res , title );
}

exports.rank = function( req , res ){
    var title = "收藏排行";

    ArtsModel.where("likecount").sort('desc').limit(5).exec(function(err,docs){
        res.render('arts/show',{docs:docs,title:title});
    })
}

exports.history = function( req , res ){
    var title = "往日名画";
    var today = new Date(),
        yes1 = today.addDays(-1).toFormat("YYYY-MM-DD"),
        yes2 = today.addDays(-1).toFormat("YYYY-MM-DD"),
        yes3 = today.addDays(-1).toFormat("YYYY-MM-DD");

    ArtsModel.find({"n_publish":{$in:[yes1,yes2,yes3]}}).sort({'publish':'desc'}).exec(function(err,docs){
        res.render('arts/show',{docs:docs,title:title});
    })
}

exports.fav = function( req , res ){

}

function getArtByPublish( today , res , title){
    ArtsModel.findOne({'n_publish' : today },function(err,doc){
        var docs = [];
        if( !err ){
            docs.push(doc);
            res.render('arts/show',{docs:docs ,title:title});
        }else{
            console.error('mongoose query err');
        }
    });
}


