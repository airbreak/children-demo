define(['base', 'fastclick'], function(Base) {
    var Baby = function() {
        Base.call(this);
        this.pageIndex = 1;
        this.pageSize = 10;
        this.totalPage = 1;
        this.loadData(1);
        var that = this;
    }

    Baby.prototype = new Base();
    Baby.constructor = Baby;

    var t = Baby.prototype;


    /*
     *加载新闻列表数据
     * para:
     * pageIndex - {int} 当前的页码数
     */
    t.loadData = function(pageIndex, callback) {
        var that = this;
        this.getDataAsync(pageIndex, callback);
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
     *字符串截取
     * para
     * str - {string} 目标字符串
     * len - {int} 最大长度
     */
    t.substrLongStr = function(str, len) {
        if (str.length > len) {
            str = str.substr(0, parseInt(len - 1)) + '……';
        }
        return str;
    };

    t.getTimeFromTimestamp = function(dateInfo, dateFormat) {
        return new Date(parseFloat(dateInfo) * 1000).format(dateFormat);
    };

    return Baby;
});