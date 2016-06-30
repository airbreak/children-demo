define(['base', 'fastclick'], function(Base) {
    FastClick.attach(document.body);
    var Baby = function() {
        Base.call(this);
        this.pageIndex = 1;
        this.pageSize = 10;
        this.totalPage = 1;
        this.loadData(1);
        var that = this;

        $(document).on('click','.nav-item', function (e) {
            var index = $(this).index();
            $(this).addClass('selected').siblings().removeClass('selected');
            $('.article-wrapper-item').eq(index).show().siblings().hide();
        });  
    };

    Baby.prototype = new Base();
    Baby.constructor = Baby;

    var t = Baby.prototype;


    t.loadData = function(pageIndex, callback) {
        var that = this;
        this.getDataAsync(pageIndex, callback);
        var cover={
            data:[
                'imgs/1.png',
                'imgs/2.png',
                'imgs/3.png'
            ]
        };
        this.fillInTouchSliderItem(cover);
    };

    /*
     *向服务器请求新闻列表数据，计算总的页码数，并填充内容
     * para:
     * pageIndex - {int} 当前的页码数
     */
    t.getDataAsync = function(pageIndex, callback) {
        var that = this;
        $.getJSON('js/test.json', function(data, state) {
            if (data && data.state == 1 && state == 'success') {
                //本地测试，为了看到加载中效果故加上定时器
                var str = that.getNewsContent(data.data);
                $('#baby-devlopment').html(str);
            }
        });
    };

    /*
     *填充内容
     * para:
     * data - {array} 结果数据
     * return
     * str - {string} 内容字符串
     */
    t.getNewsContent = function(data) {
        var str = '',
            title, len = data.length,
            item, dateStr;
        for (var i = 0; i < len; i++) {
            item = data[i];
            title = this.substrLongStr(item.title, 25);
            str += '<li class="newsLiItem">' +
                    '<div class="coverBorderContainer"></div>' +
                        '<a href="' + item.link+ '/hisihi-new-open">' +
                            '<div class="left">' +
                                '<img src="' + item.cover + '"/>' +
                            '</div>' +
                            '<div class="right">' +
                                '<div class="rightHeader">' +
                                    '<h3>' + title + '</h3>' +
                                '</div>' +
                                '<div class="rightBottom">' +
                                    '<p class="rightBottomRight">' + item.digest + '</p>' +
                                '</div>' +
                            '</div>' +
                        '</a>' +
                    '</li>';
        }
        return str;
    };

    /*
     *滚动加载更多的数据
     * 通过滚动条是否在底部来确定
     * 同时通过 loadingData 类 来防止连续快速滚动导致的重复加载
     */
    t.scrollContainer = function(e) {
        var target = e.currentTarget,
            height = target.scrollHeight - $(target).height();
        if ($(target).scrollTop() == height && !$(target).hasClass('loadingData')) { //滚动到底部
            $(target).addClass('loadingData');
            this.loadData(this.pageIndex, function() {
                $(target).removeClass('loadingData');
            });
        }
    };

     /*
     *填充滚动区域的图片
     *@para:
     *covers - {obj} 内容信息，包括地址数组等
     *flag - {bool} 是否没有图片，false 则使用 nocover 样式 控制
     */
    t.fillInTouchSliderItem=function(covers,flag){
        var data=covers.data,
            len=data.length,
            str='',str1='',
            className='',className1='nocover';
        if(flag){
            className1='';
        }
        for(var i=0;i<len;i++){
            str+='<li >'+
                    //'<a href="javascript:showFullImg('+i+')">'+
                    '<a href="javascript:void(0)">'+
                        '<img src="'+data[i]+'" alt="" class="'+ className1 +'">'+
                    '</a>'+
                  '</li>';
            className='';
            if(i==0){
                className='actived';
            }
            str1+='<li class="'+className+'"></li>';
        }
        $('#slider4').html(str);
        $('#currentPage').html(str1);

        //初始滑动
        this.initTouchSlider();
    };

    /*滑动图片*/
    t.initTouchSlider=function(){
        this.t4=new TouchSlider('slider4',{speed:1000, direction:0, interval:1000, fullsize:true});
        this.t4.on('before', function (m, n) {
            $('#currentPage li').eq(n).addClass('actived').siblings().removeClass('actived');
        });
    };

    return Baby;
});