$.calculateTopArrow = function(element) {
    element = $(element);
    leftOffset = 0; 
    element.prevAll('li:not(li.search)').each(function(i) { leftOffset += $(this).width(); });
    return parseInt(element.width() / 2 - 17 + leftOffset).toString() + 'px';
}

$.calculateBottomArrow = function(element) {
    if(element == null) return $('#menu div.arrowbottom').css('left');
    element = $(element);
    leftOffset = 0; 
    element.prevAll('li').each(function(i) { leftOffset += $(this).width() + 3; });
    fix = (element[0] == $('#menu ul.submenu.selected li:first-child')[0] ? 3 : 0);
    return parseInt(element.width() / 2 + 8 - fix + leftOffset).toString() + 'px';
}

$(document).ready(function() {
    var TIMEOUT = 2000;
    var DELAY = 500;

    var backTimer = null;
    var waitTimer = null;
    var animationWorks = false;
    var subAnimationWorks = false;
    var onSubmenu = false;
    var bottomBgImage = $('#menu ul.submenu li.selected a').css('background-image');
    var hideArrow = false;
    /* menu arrow */
    $('#menu ul.menu li.selected, #menu ul.submenu li.selected a').css('background-image', 'none');
    $('#menu').append($(document.createElement('div')).addClass('arrowtop'));
    $('#menu div.arrowtop').css('left', $.calculateTopArrow($('ul.menu li.selected')));
    $('#menu').append($(document.createElement('div')).addClass('arrowbottom'));
    $('#menu div.arrowbottom').hide();
    $('#menu div.arrowtop').hide();

    $('#menu ul.menu li a').each(function(i) { 
        if(!$('ul.submenu.' + $(this).attr('class')).is('ul')) { 
            $(document.createElement('ul')).attr('class', 'submenu ' + $(this).attr('class')).insertAfter($('#menu ul.submenu:last')); 
        }
    });
    if(!$('#menu ul.submenu.selected').is('ul')) {
        $(document.createElement('ul')).attr('class', 'submenu selected empty').insertAfter($('#menu ul.submenu:last'));
        $('#menu div.arrowbottom').hide();
        hideArrow = true;
    }
    
    if($('#menu ul.menu li.selected').is('li')) {
        $('#menu div.arrowtop').css('left', $.calculateTopArrow($('#menu ul.menu li.selected'))).show();
    }
    if($('#menu ul.submenu.selected li.selected').is('li')) {
        $('#menu div.arrowbottom').css('left', $.calculateBottomArrow($('ul.submenu.selected li.selected'))).show();
    }

    var base = $('ul.submenu.selected');
    $('ul.menu li a').bind('mouseover', function(e) {
        clearInterval(backTimer);
        th = $(this);
        if(!$('ul.submenu.selected').hasClass('empty')) { _delay = DELAY; } else { _delay = 0; }
        waitTimer = setTimeout(function() {
            if(!th.attr('class') || !th.attr('class').match($('#menu ul.submenu.selected').attr('class').replace(/submenu|selected|\s/g, ''))) {
                $('#menu ul.submenu li.selected a').css('background-image', bottomBgImage);
                $('#menu div.arrowbottom').hide();
	        $('#menu div.arrowtop').stop().css('top', '0px');;
	        if($('#menu div.arrowtop').is(':visible')) {
                $('#menu div.arrowtop').animate({left: $.calculateTopArrow(th.parent())});
            } else {
                $('#menu div.arrowtop').css('left', $.calculateTopArrow(th.parent())).css('top', '-6px').show();
                $('#menu div.arrowtop').animate({top: '+=6'}, 500);
            }
                cl = th.attr('class').replace(/\s|selected/g, '');
	        $('#menu ul.submenu').stop();
	        $('#menu ul.submenu').css('top', '2px');
	        $('#menu ul.submenu.selected').css('top', '29px');
                $('#menu ul.submenu.selected').animate({top: '+=27'}, 500, function() {
                    $('#menu ul.submenu.selected').css('top', '2px').removeClass('selected');
                }); 
                $('#menu ul.' + cl).animate({top: '+=27'}, 500, function() {
                    $('#menu ul.' + cl).addClass('selected')
                    $('#menu ul.' + cl + ' li a').css('background-image', 'none');
                });
            }
        }, _delay);
    });
    $('#menu ul.menu li a').bind('mouseleave', function(e) {
        clearTimeout(waitTimer);
        th = $(this);
        backTimer = setInterval(function() {
            if((!th.attr('class') || $('#menu ul.submenu.selected').attr('class').replace(/submenu|selected|\s/g, '') != base.attr('class').replace(/submenu|selected|\s/g, '')) && !onSubmenu) {
                $('#menu ul.submenu li.selected a').css('background-image', bottomBgImage);
		$('#menu div.arrowtop').stop().css('top', '0px');
		        if($('#menu ul.menu li.selected').is('li')) {
                    $('#menu div.arrowtop').animate({left: $.calculateTopArrow('#menu ul.menu li.selected')});
		        } else {
                    $('#menu div.arrowtop').animate({top: '-=6'}, 500, function() {$(this).hide()});
		        }
		$('#menu ul.submenu').stop();
 	        $('#menu ul.submenu').css('top', '2px');
	    $('#menu ul.submenu.selected').css('top', '29px');

                $('#menu ul.submenu.selected').animate({top: '+=27'}, 500, function() {
                    $('#menu ul.submenu.selected').css('top', '2px').removeClass('selected');
                    clearInterval(backTimer);
                }); 
                base.animate({top: '+=27'}, 500, function() {
                    base.addClass('selected');
                    base.find('li.selected a').css('background-image', 'none');
                    if(!base.hasClass('empty')) { $('#menu div.arrowbottom').css('bottom', '0px').css('left', $.calculateBottomArrow($('ul.submenu.selected li.selected'))).show(); }
                });
            }
        }, TIMEOUT);
    });
    $('#menu ul.submenu li a').bind('mouseover', function(e) {
        onSubmenu = true;
        if($('#menu div.arrowbottom').is(':visible')) {
            var selected = null;
        } else {
            var selected = $(this).parent();
        }
        $('#menu div.arrowbottom').css('left', $.calculateBottomArrow(selected));
        $('#menu div.arrowbottom').stop().css('bottom', '0px');
        if($('#menu div.arrowbottom').is(':visible')) {
            $('#menu div.arrowbottom').animate({left: $.calculateBottomArrow($(this).parent())}, 500);
        } else {
            $('#menu div.arrowbottom').css('left', $.calculateBottomArrow($(this).parent())).css('bottom', '-6px').show();
            $('#menu div.arrowbottom').animate({bottom: '+=6'}, 500);
        }
    });
    $('#menu ul.submenu').bind('mouseleave', function(e) {
            $('#menu div.arrowbottom').stop().css('bottom', '0px');;
	        if($('#menu ul.submenu.selected li.selected').is('li')) {
                $('#menu div.arrowbottom').animate({left: $.calculateBottomArrow($('#menu ul.submenu.selected li.selected'))}, 500, function() {
                    onSubmenu = false;
                });
	        } else {
                $('#menu div.arrowbottom').animate({bottom: '-=6'}, 500, function() {$(this).hide(); onSubmenu = false; });
	        }

    });

    /* selects */
    $('select').wrap($(document.createElement('span')).addClass('select'));
    $('span.select').each(function(i) {
        var cite = $(document.createElement('cite'));
        $(this).append(cite);
        cite.width($(this).find('select').width() - 14);
    });

    $('select').bind('change', function(e) {
        var val = $(this).find('option[selected]').text();
        if(val != null) {
            $(this).parent().find('cite').text(val);
        } else {
            $(this).parent().find('cite').text('');
        }
    });
    $('select').change();

    $('input[type=text], input[type=password]').each(function(i) {
        $(this).data('hint', $(this).val());
        $(this).bind('focus', function(e) {
            if($(this).val() == $(this).data('hint')) { $(this).val(''); }
        });
        $(this).bind('blur', function(e) {
            if($(this).val() == '') { $(this).val($(this).data('hint')); }
        });
    });

    /* scroll filters */
    if($('div.filters').is('div')) {
        $('div.filters-content').append($(document.createElement('div')).attr('class', 'mask-filter mask-left'));
        $('div.filters-content').append($(document.createElement('div')).attr('class', 'mask-filter mask-right'));
        var filters_width = 0;
        var filters_pos = 0;
        $('div.filters > div[class]').each(function(i) { filters_width += $(this).width(); });
        $('div.filters').width(filters_width);
        $('div.search > a.next').bind('click', function(e) {
            if(-parseInt($('div.filters').css('margin-left')) < ($('div.filters').width() - $('div.filters > div[class]').width() * 5)) {
                filters_pos += 1;
                $('div.filters').animate({marginLeft: '-=' + $('div.filters > div[class]').width().toString()}, 500);
            }
        });
        $('div.search > a.prev').bind('click', function(e) {
            if(parseInt($('div.filters').css('margin-left')) < 0) {
                filters_pos -= 1;
                 $('div.filters').animate({marginLeft: '+=' + $('div.filters > div[class]').width().toString()}, 500);
            }
        });
    }


    /* slide filters */
    if($('#slideFilters').is('div')) {
        var slideFilters_height = $('#slideFilters').height();
        var slideWorks = false;
        $('#slideFilters ul > li + li + li + li').hide();
        $('#slideFilters ul li:last-child').css('position', 'absolute').css('bottom', '10px').css('z-index', '10').show();
        $('#slideFilters').height($('#slideFilters').height()).css('padding-bottom', '24px')
        $('#slideFilters ul > li + li + li + li').show();
        $('#slideFilters').append($(document.createElement('div')).css('float', 'none').width($('#slideFilters').width()).height(24).css('background-color', '#99cc00').css('position', 'absolute').css('left', '0px').css('bottom', '0px').css('z-index', '5'));
        $('#slideFilters').data('expanded', false);
        $('#slideFilters').parent().attr('class', 'filters-content short').find('a.expand').bind('click', function(e) { 
          if(!slideWorks) {
              slideWorks = true;
              if($('#slideFilters').data('expanded')) {
                  $('#slideFilters').data('expanded', false);
                  var endAn = slideFilters_height.toString();
                  slideFilters_height = $('#slideFilters').height();
                  $('#slideFilters').animate({height: endAn + 'px'}, 500, function() { 
                      $('#slideFilters').parent().find('a.expand').text('rozwiń filtry');
                      $('#mask').hide(); 
                      $('#slideFilters').parent().attr('class', 'filters-content short');
                      $('div.filters > div[class]').css('visibility', 'visible');
                      slideWorks = false; 
                  });
              } else {
                  $('div.filters > div[class]').each(function(i) {if(i < filters_pos || i > (filters_pos + 4)) { $(this).css('visibility', 'hidden'); } });
                  $('#slideFilters').data('expanded', true);
                  $('#mask').show();
                  $('#slideFilters').parent().find('a.expand').text('zwiń filtry');
                  var endAn = slideFilters_height.toString();
                  slideFilters_height = $('#slideFilters').height();
                  $('#slideFilters').parent().attr('class', 'filters-content long');
                  $('#slideFilters').animate({height: endAn + 'px'}, 500, function() { 
                      slideWorks = false;
                  });
              }
          } 
        });
    }

    $('#mask').height($('#wrapper').height());
    /* IE hacks */
    /*@cc_on 
        $('ul.productList > li:nth-child(5n+1)').css('margin', '0'); 
        $('input[type=checkbox], input[type=radio], select').css('opacity', '0.01');
        $('div.yesaccount.disabled, div.noaccount.disabled').css('opacity', '0.5');
        $('#mask').css('opacity', '0.7');
        $('input[type=radio], input[type=checkbox]').after($(document.createElement('var')));
        $('input[type=radio], input[type=checkbox]').bind('change', function(i) {
            if($(this).attr('type') == 'radio') {
                $('input[type=radio][name=' + $(this).attr('name') + ']').removeClass('checked');
            }
            $(this).is(':checked') ? $(this).addClass('checked') : $(this).removeClass('checked');
        });
        @if (@_jscript_version <= 5.7)
            $('div.submit input[type=submit]').css('overflow', 'visible');
            $('#top > form.login div.submit input[type=submit]').css('margin-left', '-4px')
            $('#top > form.login > fieldset').css('width', '434px');
            $('#footer ol > li.newsletter, #footer ol > li.newsletter form').css('width', '152px');
            $('#footer li.newsletter legend').after($(document.createElement('var')).text($('#footer li.newsletter legend').text())).remove();
            $('ol.sitemap > li').css('position', 'relative').each(function(i) { $(this).append($(document.createElement('var')).text('0' + (i+1).toString() + '.')) });
            $('table.productslist ul.options li.delete').css('margin-left', '-15px');
            $('span.select cite').css('padding-top', '1px');
            $('input[type=radio] + var, input[type=checkbox] + var').css('left', '22px').css('top', '3px');
            $('div.search ul.productList.short > li').css('height', '266px');
            $('#top div.topmenu ul.topmenu > li:not(:first-child), #menu ul.submenu > li:not(:first-child),  ul.pager > li:not(:first-child)').each(function(i) { $(this).html(' | ' + $(this).html()); });
            $('ul.productMenu > li:not(:first-child)').each(function(i) { $(this).html(' / ' + $(this).html()); });
            $('div.productinfo ul.productList.short > li').css('position', 'relative');
            $('div.productinfo ul.productList.short > li ul.info li.description').css('position', 'absolute').css('bottom', '0');
            $('#menu ul.menu li.search input[type=submit]').css('font-size', '0');
        @end
    @*/;
});
