
jQuery.fn.megaSelectbox = (function($) {
  var initialized = false;
  var uls = [];
  var selects = [];

  // speed-up in ie
  var $d = $(document);

  if (!$.stopEvent) {
    $.stopEvent = function stopEvent(e){
      e.preventDefault();  // browser 組み込みの動作を防止（リンクなど)
      e.stopPropagation(); // stop bubbling up
      return false;
    }
  }

  var isRegistedSelect = function isRegistedSelect(e) {
    for (var i=0; i < selects.length; i++) {
      if (selects[i] === e)
        return true;
    }
    return false;
  }

  // メニューが表示されてる状態で、メニュー以外の領域がクリックされたときの
  // クリックハンドラ追加
  var setHideHandler = function setHideHandler() {
    $d.click(function(e){
      if (isRegistedSelect(e.target)) {
        return $.stopEvent(e);
      } else {
        $(uls).hide();
        $(selects).attr('disabled', false);
      }
    });
  }

  // 要素の領域を取得 {top: , left:, h: , w: }
  var getArea = function getArea($e) {
    return $.extend($e.position(),{h: $e.height(), w:$e.width()});
  }

  // selectboxアイテムmousedownハンドラ追加
  var setMouseDownHandler = function setMouseDownHandler($select, $ul_optg) {
    $select.mousedown(function(e) {
      $(uls).hide();
      $(selects).attr('disabled', false);
      var value = $select.val();
      var select_area = getArea($select);
      select_area.h += ($.browser.msie) ? 4 : 2;

      $select
        .focus()
        .attr('disabled', true)
        .blur();
      $ul_optg.parent().css({top: select_area.top + select_area.h, left: select_area.left});
      $ul_optg
        .show();
      $ul_optg
        .find('input:button')
        .removeClass('selected')
        .removeClass('hover');
      $ul_optg
        .find('input[value=' + value + ']')
        .addClass('selected');

      if(isIE6) {
        // input 対応モイル？ !!!
        hideOverlappedSelect(this, $ul_optg);
      }
      return $.stopEvent(e);
    });
  }

  // ulアイテムクリックハンドラ追加
  var setULClickHandler = function setULClickHandler($select, $ul_optg) {
    $ul_optg
      .find('input:button')
      .click(function(){
          var elem = $(this);
          $select.val(elem.val());
          $select.attr('disabled', false);
          $ul_optg.hide();
          if(isIE6)
            $('select.mega_selectbox_hidden').removeClass('mega_selectbox_hidden');
      })
      .hover(function(){
                $(this).addClass('hover');
              }
            ,function(){
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
    var ulArea = getArea($ul_optg);
    $('select').not(except)
      .each(function(){
        var $selectOther = $(this);
        var selectArea = getArea($selectOther);
        if (isOverlapped(ulArea, selectArea)) {
          $selectOther.addClass('mega_selectbox_hidden');
        } 
      });
  }

  // selectboxにクリックハンドラを追加する
  var initSelect = function initSelect(select, config) {
    var $select = $(select);
    selects.push($select[0]);
    
    var selectboxBodyHtml = generateSelectboxBodyHtml($select);
    $select.before(selectboxBodyHtml);
    
    var $ul_optg = $select.prev().find('ul.optgroup');
    uls.push($ul_optg[0]);

    setMouseDownHandler($select, $ul_optg);
    setULClickHandler($select, $ul_optg);
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
