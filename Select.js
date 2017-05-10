(function(root, factory){
    factory(root.jQuery);
})(window,function($){
	var opts = {

    };

    function plugin(elm, options, data){
        var _this = this;

        _this.$elm = $(elm);

        _this.data = data;

        _this.opts = $.extend({}, opts, options);

        _this.init();
    }

    plugin.prototype = {
        init: function(){
            var _this = this;
            
            //数据视图渲染
            var html = _this.render(_this.data);
            _this.$elm.after(html);

            //视图事件监听
            _this.handle();
        },
        render: function(data){
            var _this = this,
                html = '',
                length = data.length;

            var val = $.trim(_this.$elm.val());

            var cls = '';
            var scrollTop = 0;
            for(var i=0; i<length; i++){
                if(val == data[i].name){
                    cls = ' class="selected"';
                }
                html += '<li'+ cls +'>'+ data[i].name +'</li>';
            }

            html = html ? '<ul class="select-box">'+ html +'</ul>' : '';
            
            return html;    
        },
        handle: function(){
            var _this = this;

            _this.$select = _this.$elm.next('.select-box');

            _this.$elm.click(function(e){
                //模拟失焦。清除页面上其他下拉显示框。
                $(document).click();
                //显示当前的下拉框。
                _this.$select.show();
                //阻止事件进一步传播。
                e.stopPropagation();    
            });

            _this.docEvents();    //document绑定的事件

            _this.$select.children('li').click(function(e){
                _this.selectIndex($(this).index());
                _this.$select.hide();
            }); 
        },
        docEvents: function(){
            var _this = this;
            
            $(document).on({
                click: function(e){
                    _this.$select.hide();
                },
                keydown: function(e){
                    if(e.keyCode == 40){ //向下
                        if(!_this.$select.is(':hidden')){
                            _this.changeSelected('down');
                            _this.$select.scrollTop(_this.getSelectIndex() * 30);
                        }

                        return false;
                    }else if(e.keyCode == 38){  //向上
                        if(!_this.$select.is(':hidden')){
                            _this.changeSelected('up');
                            _this.$select.scrollTop((_this.getSelectIndex()-1) * 30);
                        }

                        return false;
                    }else if(e.keyCode == 13){  //回车
                        if(!_this.$select.is(':hidden')){
                            _this.selectIndex(_this.getSelectIndex());
                            _this.$select.hide();
                        }
                        
                        return false;
                    }
                }
            });
        },
        getSelectIndex: function(){
            var _this = this;

            var reIndex = 0;
            _this.$select.children('li').each(function(index){
                if($(this).hasClass('selected')){
                    reIndex = index; 
                    return false;       
                }
            });
            return reIndex;
        },
        changeSelected: function(direction){
            var _this = this;

            var length = _this.data.length;

            var chgIndex = 0;

            var selIndex = _this.getSelectIndex();

            if(direction == 'down'){
                if(selIndex < length-1){
                    chgIndex = ++selIndex;
                }
            }else if(direction == 'up'){
                if(selIndex > 0){
                    chgIndex = --selIndex;
                }else{
                    chgIndex = length-1;
                }
            }

            _this.selectIndex(chgIndex);
        },
        selectIndex: function(selIndex){
            var _this = this;

            _this.$select.children('li').each(function(index){
                if(selIndex == index){
                    _this.$elm.val($(this).text());
                    $(this).addClass('selected');
                }else{
                    $(this).removeClass('selected');
                }
            });
        }
    }


    $.fn.Select = function(options, data){
        return new plugin(this, options, data);
    }
})