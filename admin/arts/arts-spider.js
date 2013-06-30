/**
 * Created with JetBrains WebStorm.
 * User: kangjia
 * Date: 13-6-25
 * Time: 下午2:13
 * To change this template use File | Settings | File Templates.
 */

var http = require('http');

var mongodb = require("mongodb");

var qs = require('querystring');

var EventEmitter =  require("events").EventEmitter;
var GE = new EventEmitter();

var mongourl = require("./../mongoConfig.js").mongourl;

require('date-utils');

var PDATE = new Date('2013-06-26');
var ENDDATE = new Date('2012-09-01');   //2013-06-25
function init(){
    saveToMongo();
    getData();
}


function saveToMongo(){

    mongodb.Db.connect(mongourl,function(err,db){
        db.createCollection('arts',function(err,coll){
            GE.on('data.finish',function(d){
                d['n_publish'] = PDATE.toFormat('YYYY-MM-DD');
                d['likecount'] = parseInt(Math.random()*10,10);
                coll.save(d,function(err){});

                var bigImg = d['bigImg']||d['pic'];
                PDATE = PDATE.addDays(1);
                var dir = '/Users/kangjia/Downloads/temp/';
//                var dir = '/data/www/qzone/public/images/';
                require("child_process").exec('wget ' + bigImg + ' --directory-prefix ' + dir ,function(error,std,stdorr){
                    if(!error){
                        var e = ENDDATE.addDays(1);
                        getData( e);
                    }else{
                        console.error(error);
                    }
                });

            });
        });
        GE.on('data.end',function(d){
            setTimeout(function(){
              db.close();
            },2000);
        });
    });
}

function getData(){

    var params = {
        'date' : ENDDATE.toFormat('YYYYMMDD')
    };

    var content = qs.stringify(params);

    var options = {
        host : 'dailyarts.sinaapp.com',
        port : 80 ,
        path : '/api/info' ,
        method : 'POST' ,
        headers:{
            'Content-Type':'application/x-www-form-urlencoded',
            'Content-Length':content.length
        }
    };

    var req = http.request(options,function(res){
        var data = '';
        res.on('data',function(chunk){
            data += chunk ;
        });
        res.on('end',function(){
            console.log(data);
            data = JSON.parse(data);
            data = data['data'];
            if(data['publish'] == '1372348800'){ //next end publish
                GE.emit('data.end');
            }else{
                GE.emit('data.finish',data);

            }
        });

    });

    req.write(content);
    req.end();
}

init();

//var d = new Date('2013-06-26');
//console.log(d.addDays(-299));