/**
 * Created with JetBrains WebStorm.
 * User: kangjia
 * Date: 13-6-28
 * Time: 下午5:38
 * To change this template use File | Settings | File Templates.
 */

(function(){
    function showAction(){

    }

    function share(doc){
        var msg = ['[每日名画]有品位的人都喜欢这里',
        '[每日名画]唯有爱与艺术不可辜负',
        '[每日名画]忘却纷繁，与艺术大师一起仰望'];
        var msgIdx = parseInt((Math.random()*3),10);
        fusion2.dialog.sendStory({
            title : msg[msgIdx],
            img: doc["image"],
            msg:"我很喜欢" + doc.author + "的《" + doc.name + "》。 你喜欢么？",
            context:doc["_id"],
            onSuccess : function(opt){
                $.getJSON("/arts/comment/addCount/"+opt.context,function(){});
            }
        });

    }

    function collect(doc){
        var img_source = "http://qzone.nothr.com/images/" + doc['bigImg']||doc['pic'];
        fusion2.dialog.savePhoto({
            //照片标题
            title : doc.name,

            //照片描述。
            desc : "",

            // 必须 。上传到相册的图片URL。只支持jpg/png/gif格式的图片，大小不能超过1MB
            // 图片没有域名限制，但是图片地址的根域名必须要有一个crossdomain.xml 的flash授权文件，详见下文
            img : img_source,

            // 必须。展示在对话框中的小预览图，不会上传到相册
            // 图片没有域名限制，但是要使用crossdomain.xml让Flash可以跨域传输数据
            preview : img_source,

            //可选。透传参数，用于onSuccess和onCancel回调时传入的参数，用于识别请求。
            context : doc._id,

            // 可选。用户操作后的回调方法。
            // 可通过opt.photo_url获取照片地址，opt.thumbnail_url获取照片缩略图地址。
            onSuccess : function (opt){
                $.getJSON("/arts/like/addCount/"+opt.context,function(){});
            }
        })
    }

    function setHeight(){
        var height = $(document).height();
        fusion2.canvas.setHeight({
            height : height
        })
    }

    function init(){

        $(".share").click(function(){
            var $this = $(this);
            var _id = $this.data("_id");
            $.getJSON("/arts/"+_id,function(res){
                if(!res.errcode){
                    share(res.data[0]);
                }
            });
        })
        $(".like").click(function(){
            var $this = $(this);
            var _id = $this.data("_id");
            $.getJSON("/arts/"+_id,function(res){
                if(!res.errcode){
                    collect(res.data[0]);
                }
            });

        })
    }


    $(document).ready(function(){
        setHeight();
        init();
    })

})();
