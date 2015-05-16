/*
 **
 */

(function ($) {
    var pageSize,container,templateId;
    $.fn.scrollPagination = function (options) {

        var opts = $.extend($.fn.scrollPagination.defaults, options);
        var target = opts.scrollTarget;
        if (target == null) {
            target = obj;
        }
        opts.scrollTarget = target;
        pageSize = opts.contentData.pageSize;
        container = opts.container;
        templateId = opts.templateId;

        var loading='<div class="loading" id="loading">加载中...</div><div class="loading" id="nomoreresults">没有更多记录</div>';
        $(container).after(loading);

        return this.each(function () {
            $.fn.scrollPagination.init($(this), opts);
        });

    };

    $.fn.stopScrollPagination = function () {
        return this.each(function () {
            $(this).attr('scrollPagination', 'disabled');
        });

    };

    $.fn.scrollPagination.loadContent = function (obj, opts) {

        var target = opts.scrollTarget;
        var mayLoadContent = $(target).scrollTop() + opts.heightOffset >= $(document).height() - $(target).height();
        if (mayLoadContent) {
            if (opts.beforeLoad != null) {
                opts.beforeLoad();
            }
            opts.contentData.page ++;
            $.ajax({
                type: 'GET',
                url: opts.contentPage,
                data: opts.contentData,
                success: function (data) {
                    $(obj).append(data);
                    if (opts.afterLoad != null) {
                        opts.afterLoad(data);
                    }
                },
                dataType: 'json'
            });
        }

    };

    $.fn.scrollPagination.init = function (obj, opts) {
        var target = opts.scrollTarget;
        $(obj).attr('scrollPagination', 'enabled');

        $(target).scroll(function (event) {
            if ($(obj).attr('scrollPagination') == 'enabled') {
                $.fn.scrollPagination.loadContent(obj, opts);
            }
            else {
                event.stopPropagation();
            }
        });

        $.fn.scrollPagination.loadContent(obj, opts);

    };

    $.fn.scrollPagination.defaults = {
        'contentPage': null,
        'container': '#list',
        'templateId': '#template',
        'contentData': {
            page: '0', //当前页码
            pageSize: '5' //每页条数
        },
        'scrollTarget': $(window),
        'heightOffset': 0,
        'beforeLoad': function () {
            $('#loading').show();
        },
        'afterLoad': function (data) {
            var template = $(templateId).html();
            Mustache.parse(template);
            var rendered = Mustache.render(template, data);
            $(container).append(rendered);
            $('#loading').hide();
            if (data.list.length < pageSize) {
                $('#nomoreresults').show();
                $(container).stopScrollPagination();
            }
        }
    };
})(jQuery);