
jQuery.fn.megaSelectbox = (function($) {
  var initialized = false;

  // speed-up in ie
  var $d = $(document);

  if (!$.stopEvent) {
    $.stopEvent = function stopEvent(e){
      e.preventDefault();  // browser 組み込みの動作を防止（リンクなど)
      e.stopPropagation(); // stop bubbling up
      return false;
    }
  }

  // メニューが表示されてる状態で、メニュー以外の領域がクリックされたときの
  // クリックハンドラ追加
  var setHideHandler = function setHideHandler() {
    $d.click(function(e){
      if($(e.target).hasClass('mega_selectbox')){
        return $.stopEvent(e);
      } else {
        // ul.optgroup, select.mega_selectboxハ、ショキカジニキオクシテオイテ、ソレヲツカウヨウニスル!!!
        $('ul.optgroup').hide();
        $('select.mega_selectbox').attr('disabled', false);
      }
    });
  }

  // selectboxアイテムmousedownハンドラ追加
  var setMouseDownHandler = function setMouseDownHandler($select, $ul_optg) {
    $select.mousedown(function(e) {
      $('ul.optgroup').hide();
      $('select.mega_selectbox').attr('disabled', false);
      var value = $select.val();
      var of = $.extend($select.offset(),{h: parseInt($select.height()), w:parseInt($select.width())});
      of.h += ($.browser.msie) ? 4 : 2;

      // focus, blurハイル？
      $select
        .focus()
        .attr('disabled', true)
        .blur();
      $ul_optg
        .show()
        .css({top:of.h});
      $ul_optg
        .find('input:button')
        .removeClass('hover')
        .attr('selected',null);
      // use class only
      $ul_optg
        .find('input[value=' + value + ']')
        .addClass('hover')
        .attr('selected','selected');

      if(isIE6) {
        // input 対応モイル？ !!!
        hideOverlappedSelect(this, $ul_optg);
      }
      return $.stopEvent(e);
    });
  }

  // ulアイテムクリックハンドラ追加
  var setClickHandler = function setClickHandler($select, $ul_optg) {
    // mousedown ナノハナゼ？ !!!
    $ul_optg
      .find('input:button')
      .mousedown(function(){
          var elem = $(this);
          $select.val(elem.val());
          $select.attr('disabled', false);
          elem.parents('ul.optgroup').hide();
          // use class!!!
          if(isIE6)
            $('select[optgroup=1]').css('visibility','visible');
      })
      .hover(function(){
                // use class & use other name for hover!!!
                if($(this).attr('selected') == 1){ return true;}
                $(this).addClass('hover');
              }
            ,function(){
                if($(this).attr('selected') == 1){ return true;}
                $(this).removeClass('hover');
              })
      .end();
  }

  var isIE6 = (function() {return $.browser.msie && $.browser.version == '6.0'})();

  var generateSelectboxBodyHtml = function generateSelectboxBodyHtml($select) {
    var html = ['<div class="optgroup"><ul class="optgroup">'];
    $optgroups = $select.find('optgroup');
    $optgroups.each(function(){
      $optgroup = $(this);
      html.push('<li>');
      html.push($optgroup.attr('label') ? '<div class="optlabel">' + $optgroup.attr('label') + '</div>' : '');
      $optgroup.find('option').each(function(i2, opt){
        opt = $(opt);
        html.push('<div><input type="button" value="' + opt.text() + '" scale="'+ opt.attr('scale') +'"></div>');
      });
      html.push('</li>');
    });

    html.push('</ul></div>');
    return html.join("");
  }

  var isOverlapped = function isOverlapped(area1, area2) {
    return !((area1.left > area2.left + area2.w) ||
             (area1.top > area2.top + area2.h) ||
             (area1.left + area1.w < area2.left) ||
             (area1.top + area1.h < area2.top));
  }

  // メニューの中身と重複する位置にあるselectを非表示にする
  var hideOverlappedSelect = function hideOverlappedSelect(except, $ul_optg) {
    var ofg = $.extend($ul_optg.offset(),{w:$ul_optg.width(),h:$ul_optg.height()});
    $('select').not(except)
      .each(function(){
        var elm = $(this);
        var ofe = $.extend(elm.offset(),{w:elm.width(),h:elm.height()});
        if (isOverlapped(ofg, ofe)) {
          elm.css('visibility','hidden')
             .attr('optgroup',1);
        } 
      });
  }

  // selectboxにクリックハンドラを追加する
  var initSelect = function initSelect(select, config) {
    var $select = $(select);
    
    var selectboxBodyHtml = generateSelectboxBodyHtml($select);
    $select.before(selectboxBodyHtml);
    var $ul_optg = $select.parent().find('ul.optgroup');

    setMouseDownHandler($select, $ul_optg);
    setClickHandler($select, $ul_optg);
  }

  var main = function main(config){
    if(!initialized){
      setHideHandler();
      initialized = true;
    }

    var defaultConfig = {};
    config = $.extend(defaultConfig, config || {});
    var $selects = this;
    $selects.each(function() {
      initSelect(this, config);
    });

    return $(this);
  }
  
  return main;
})(jQuery);

jQuery(function($){
    $('select.mega_selectbox').megaSelectbox();
});
