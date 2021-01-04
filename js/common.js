$(function() {

	// init

	$.fn.device();
	$.fn.gnbSize();

	smooth_scroll();

	navi();
	sticky();
	small_nav();

	main_visual_slider();

	floating();
	lst_walk();
	thesis_slider();

	scroll_flag();

	faq();
	family_site();
	sns_link();
	magnific_popup();

	title_motion();
	mouse_wheel();

	// on load

	window.onload = new function() { 
		
		$('body').addClass('load'); 
		
	};

	// on resize

	$(window).resize(function() {

		$.fn.device();
		$.fn.gnbSize();

	});

	// smooth scroll

	function smooth_scroll() {

		if (is_mobile() || is_mac_os() || is_browser_firefox()) {
			return;
		}

		var $window = $(window);

		if (smooth_scroll_passive()) {
			window.addEventListener('wheel', smooth_scroll_scrolling, {passive: false});
		} else {
			$window.on('mousewheel DOMMouseScroll', smooth_scroll_scrolling);
		}

	}

	function smooth_scroll_passive() {

		var supportsPassive = false;

		try {
			document.addEventListener('nyj', null, { get passive() { supportsPassive = true }});
		} catch(e) {}

		return supportsPassive;

	}

	function smooth_scroll_scrolling(event) {

		event.preventDefault ? event.preventDefault() : event.returnValue = false;

		var $window = $(window),
			scrollTime = 1,
			scrollDistance = $window.height() / 2.5,
			delta = 0;

		if (smooth_scroll_passive()) {
			delta = event.wheelDelta/120 || -event.originalEvent.detail/3;
		} else {
			if (typeof event.originalEvent.deltaY != 'undefined') {
				delta = -event.originalEvent.deltaY/120;
			} else {
				delta = event.originalEvent.wheelDelta/120 || -event.originalEvent.detail/3;
			}
		}

		var scrollTop = $window.scrollTop(),
			finalScroll = scrollTop - parseInt(delta*scrollDistance);

		TweenMax.to($window, scrollTime, {
			scrollTo : { y: finalScroll, autoKill: true },
			ease: Power3.easeOut,
			overwrite: 5
		});

	}

	// gnb pc

	function navi() {

		$('#gnb').on('mouseenter', '> .box > ul > li', function() {
			if ($('body').data('device') != 'mobile') {
				$('#gnb > .box > ul > li').removeClass('on');
				$(this).addClass('on');
				$(this).parents('.h_group').addClass('menu_hover');
				$(this).parents('.h_group').stop().animate({'height': '280px'}, 300);
				$('#gnb > .box > ul > li > a').css('color','#444');
				$('#gnb .sub_menu').show();
			}
		});

		$('.h_group').on('mouseleave', function() {
			if ($('body').data('device') != 'mobile') {
				$('#gnb > .box > ul > li').removeClass('on');
				$('#gnb > .box > ul > li').parents('.h_group').stop().animate({'height': '91px'}, 300, function() {
					$(this).removeClass('menu_hover');
					$('#gnb > .box > ul > li').siblings().children('.sub_menu').hide();

					if ($('.h_group').hasClass('affix')) {
						$('#gnb > .box > ul > li > a').css('color','#444');
					} else {
						if (!$('.h_group').hasClass('sub')) {
							// $(this).css('background','transparent');
						}
						$('#gnb > .box > ul > li > a').css('color','#fff');
					}

				});
			}
		});

		// gnb keyboard accessibility

		$('#gnb').on('focusin', '> .box > ul > li', function() {
			if ($('body').data('device') != 'mobile') {
				$(this).parents('.h_group').addClass('menu_hover');
				$(this).parents('.h_group').stop().animate({'height': '280px'}, 300);
				$('#gnb > .box > ul > li > a').css('color','#444');
				$('#gnb .sub_menu').show();
			}
		});

		$(document).on('focus', '.h_group h1 a, .slick-prev', function() {
			if ($('body').data('device') != 'mobile') {
				$('#gnb > .box > ul > li').parents('.h_group').stop().animate({'height': '91px'}, 300, function() {
					$('#gnb > .box > ul > li').siblings().children('.sub_menu').hide();
				});
			}
		});

	}

	// sticky

	function sticky() {

		var fixed_offset = $('#header').offset();

		// alert(fixed_offset.top);

		$(window).on('scroll', $.throttle(1000 / 15, function() {

			if ($(document).scrollTop() > fixed_offset.top) {
				$('.h_group').addClass('affix');
				$('#gnb > .box > ul > li > a').css('color','#444');
			} else {
				$('.h_group').removeClass('affix');
				if (!$('.h_group').hasClass('sub') && !$('.h_group').hasClass('menu_hover')) {
					$('#gnb > .box > ul > li > a').css('color','#fff');
				}
				
			}

		}));

	}

	// gnb mobile

	function small_nav() {

		$('.btn_menu').on('click', function() {

			var overflowChk = $('body').css('overflow'),
				deviceHeight = $(window).height();

			if (overflowChk == 'hidden') {

				$('body').css({
					'overflow' : 'visible',
					'height'   : 'auto'
				});

			} else {

				$('body').css({
					'overflow' : 'hidden',
					'height'   : deviceHeight
				});

			}

			$('#gnb > .box').css('display','block');
			$(this).next().stop().animate({'right': '0%'}, 300);
			$('#gnb > .dim').fadeIn();
		});

		$('#gnb > .box').on('click', '> ul > li > a', function(e) {

			if ($('body').data('device') == 'mobile') {

				e.preventDefault ? e.preventDefault() : e.returnValue = false;

				if ($(this).parent().hasClass('current')) {
					$(this).parent().removeClass('current');
					return;
				}

				$('#gnb > .box > ul > li').removeClass('current');
				$(this).parent().toggleClass('current');
			}

		});

		$('#gnb').on('click', '> .dim, > .box > .btn_close', function() {

			$('body').css('overflow','visible');
			$('#gnb > .dim').hide();

			$('#gnb > .box').stop().animate({'right': '-80%'}, 300, function() {
				$('#gnb > .box').css('display','none');
			});

			$('#gnb .btn_menu').focus();

		});

	}

	// main visual slider

	function main_visual_slider() {
	
		var $slider = $('.viewport'),
			$progress = jQuery('.main_slider .cycle_progress'),
			progress_time = null,
			flag_next = false;

		if (!$slider.length) {
			return;
		}

		// pre init

		$(document).on('cycle-pre-initialize', $slider, function(event, opts) {

			if ($(event.target).hasClass('viewport')) {

				// init motion

				slide_motion($slider.find('.slider_item:eq(0)')[0], true);

				// progress

				main_visual_action(opts.timeout);

			}

		});

		// Run cycle

		$slider.cycle({
			slides          : '> div',
			paused          : true,
			timeout         : 4000,
			speed           : 800,
			swipe           : true,
			log			    : false,
			prev            : '.controller .prev',
			next            : '.controller .next',
			caption         : '.cycle_caption',
			captionTemplate : '<span class="cycle_caption_caption_text current">{{slideNum}}</span><span class="swiper_progress_hidden_space"></span><span class="cycle_caption_caption_text total">{{slideCount}}</span>',
			pager           : '.cycle_pager',
			pagerTemplate   : '<li><button>{{slideNum}}</button></li>'
		});

		// cycle-before

		$slider.on('cycle-before', function(event, opts, currEl, nextEl, fwdFlag) {

			slide_motion(nextEl, false);
			main_visual_action(opts.timeout+opts.speed);

		})

		// motion

		function slide_motion(el, flag) {

			var $el_txt = $(el).find('.inner'),
				y_pos = 50;

			if (flag) {
				TweenMax.set('.inner', { autoAlpha: 1 });
			}

			// TweenMax.fromTo($el_txt.find('h2'), 2, { y: 200, autoAlpha: 1 }, smooth_args({ y: 0, autoAlpha: 1, force3D: true, ease: Power3.easeOut, delay: 0.10 }), 0.15);    

			TweenMax.to($('.lines h2'), 0.35, { y: 0, autoAlpha: 0, onComplete: function() {
				TweenMax.fromTo($('.lines h2'), 1, { y: 80, autoAlpha: 0, ease: Power3.easeOut, delay: 0 }, { y: 0, autoAlpha: 1, delay: 0 });
			}})

			TweenMax.to($('.lines p'), 0.35, { y: 0, autoAlpha: 0, onComplete: function() {
				TweenMax.fromTo($('.lines p'), 1, { y: 80, autoAlpha: 0, ease: Power3.easeOut, delay: 0 }, { y: 0, autoAlpha: 1, delay: 0.3 });
			}})

		}

		// Play, Pause

		jQuery('.main_visual_state .cycle_state').on('click', function() {

			if (jQuery(this).hasClass('play')) {

				jQuery(this).removeClass('play').addClass('pause');
				progress_time.pause();

				jQuery(this).find('.ico_play').focus();

			} else {

				jQuery(this).removeClass('pause').addClass('play');
				progress_time.play();

				if (flag_next) { 
					$slider.cycle('next'); 
				}

				jQuery(this).find('.ico_pause').focus();

			}

		});

		// main visual slider helper

		function main_visual_action(speed) {

			TweenMax.killTweensOf($progress);

			progress_time = TweenMax.fromTo($progress, parseInt(speed / 1000), {
				width : '0%'
			}, {
				width : '100%',
				ease : Power0.easeNone,
				onStart: function() {
					flag_next = false;
				},
				onComplete: function() {
					flag_next = true;

					// swipe

					if (jQuery('.main_visual_state .cycle_state').hasClass('play')) {
						$slider.cycle('next');
					}
				}
			});

		}

	}

	// floating

	function floating() {
		
		$('.floating').on('click', function() {
			var nextSec = $('.ensi.e2').offset().top - 91,
				wHeight = $(window).height();

			$('html, body').animate({
				scrollTop: nextSec
				}, 400
			);
		});

	}

	// 숫자로 보는 ENSI

	function lst_walk() {	

		if (!$('body').hasClass('home')) { 
			return; 
		}

		var ok = false;

		$('.lst_walk').waypoint(function() {

			var tl = new TimelineMax();

			tl.from('.num_1', 1, {scrambleText: {text: '30', chars: '12345678910', revealDelay: 0.1, tweenLength: false, speed: 0.4, ease: Linear.easeNone} });
			tl.from('.num_2', 1, {scrambleText: {text: '80', chars: '12345678910', revealDelay: 0.1, tweenLength: false, speed: 0.4, ease: Linear.easeNone} });
			tl.from('.num_3', 1, {scrambleText: {text: '220', chars: '12345678910', revealDelay: 0.1, tweenLength: false, speed: 0.4, ease: Linear.easeNone} });
			tl.from('.num_4', 1, {scrambleText: {text: '4,670', chars: '12345678910', revealDelay: 0.1, tweenLength: false, speed: 0.4, ease: Linear.easeNone} });

			this.destroy();

		}, {

			offset: '60%'

		});

	}

	// 연구논문

	function thesis_slider() {

		if (!$('body').hasClass('home')) { 
			return; 
		}

		$('.thesis_slider').slick({
			accessibility: false,
			arrows: true,
			autoplay: false,
			centerMode: true,
			dots: false,
			infinite: true,
			slidesToShow: 4,
			responsive: [
				{
					breakpoint: 1600,
					settings: {
						slidesToShow: 3
					}
				},
				{
					breakpoint: 986,
					settings: {
						dots: false,
						slidesToShow: 2
					}
				},
				{
					breakpoint: 768,
					settings: {
						dots: false,
						centerMode: false,
						slidesToShow: 1,
						slidesToScroll: 1
					}
				}
			]
		});

	}

	// top floating

	function scroll_flag() {

		var btnTopFlag = false;

		$(window).scroll( function() {

			if ($(window).scrollTop() > 100) {

				if (!btnTopFlag) {
					$('.btn_top').stop(true).fadeIn(300);
				}
				btnTopFlag = true;

			} else {

				if (btnTopFlag) {
					$('.btn_top').stop(true).fadeOut(300);
				}
				btnTopFlag = false;
			}

		});

	}

	// faq

	function faq() {

		$('.faqList dl dt a').on('click', function() {
			if ($(this).parent().next().css('display') == 'none') {
				$('.faqList dl dt a').removeClass('on');
				$('.faqList dl dd').slideUp(150);
				$(this).addClass('on');
				$(this).parent().next().slideDown(150);
			} else {
				$('.faqList dl dt a').removeClass('on');
				$('.faqList dl dd').slideUp(150);
			}
		});

	}

	// family site

	function family_site() {

		$('.btn_family').click(function() {

			if (!$('.btn_family').hasClass('open')) {

				$('.btn_family').removeClass('open');
				$('.lst_family').slideUp(150);
				$(this).addClass('open');
				$(this).find('.txt').text('닫기');
				$(this).next().slideDown(150);

			} else {

				$('.btn_family').removeClass('open');
				$('.lst_family').slideUp(150);
				$(this).find('.txt').text('열림');

			}

			return false;

		});

	}

	// sns

	function sns_link() {

		$('.share').click(function() {
			var state = $('.sns_group').css('display');

			if (state == 'none') {
				$('.sns_group').show();
			} else {
				$('.sns_group').hide();
			}
		});

	}

	// magnific popup

	function magnific_popup() {

		if (!$('body').hasClass('magnific')) { 
			return; 
		}

		$('.popup-with-move-anim').magnificPopup( {

			type: 'inline',
			callbacks : {
				open : function() { $(window).on('load'); }
			},

			fixedContentPos: false,
			fixedBgPos: true,

			overflowY: 'hidden',

			closeBtnInside: true,
			preloader: false,

			midClick: true,
			removalDelay: 300,
			mainClass: 'my-mfp-slide-bottom'

		});

	}

	// title motion

	function title_motion() {

		if (!$('body').hasClass('home')) {

			var tl = new TimelineLite({delay:0.5});

			if ($('.spot .inner p').length > 0) {
				var title = new SplitText($('.spot .inner p'), {type: 'chars'});
				var title_chars = title.chars;

				tl.staggerFrom(title_chars, 1.2, smooth_args({force3D: true, autoAlpha: 0, y: 10, ease: Back.easeOut, onComplete: function() {
						$('.spot .inner p').addClass('completed');
					}
				}), 0.02, '+=0')
			}

		}

	}

	// mouse wheel

	function mouse_wheel() {

		$.fn.extend({
			mouse_wheel: function() {
				$(this).on('mousewheel', function(e) {
					if (e.originalEvent.wheelDelta >= 120) {
						this.scrollTop -= 50;
					} else if (e.originalEvent.wheelDelta <= -120) {
						this.scrollTop += 50;
					}
					return false;
				});
			}
		});

		// 컨퍼런스, 포럼, 연구세미나

		$('.papers_ensi .article_content').mouse_wheel();

		// 회원가입

		$('.box_agree').mouse_wheel();

	}

	// youtube

	$( 'iframe[src^="https://www.youtube.com/"], iframe[src^="https://www.facebook.com/"], iframe[src^="https://goo.gl/"]' ).wrap( '<div class="youtubeWrap"></div>' );

	// file upload

	InputFileEvt('.wrap_fileSearch .btn_slight', '.wrap_fileSearch input[type="file"]', '.wrap_fileSearch .delete');

});


// device chk

$.fn.device = function() {

	// 스크롤바 width 추가

	var size = $(window).width() + 17; 

	if (size <= 1200) {
		$('body').data('device','mobile');
	/* } else if (size > 1024 && size < 1280) {
		$('body').data('device','tablet'); */
	} else {
		$('body').data('device','pc');
	}

}

// gnb setting

$.fn.gnbSize = function() {

	var deviceWidth = $(window).width(),
		deviceHeight = $(window).height();

	if ($('body').data('device') == 'mobile') {

		$('body').css('overflow','visible');
		$('#gnb > .box').css({
			'height':deviceHeight,
			'background':'#fff'
		});

		$('#gnb .sub_menu').show();
		// $('#gnb .sub_menu ul').hide();
		if ($('#gnb > .dim').length == 0) {
			$('#gnb').append("<div class='dim' style='display:none;position:fixed;top:0px;left:0px;z-index:10;width:" + (deviceWidth + 17) + "px;height:" + deviceHeight + "px;background:#000;filter:alpha(opacity=50);opacity:0.5'></div>");
		}

	} else {

		$('body').css('overflow','visible');
		$('#header .h_group > div > h1 > a > img').css('display','block');

		$('#gnb > div.box').css({
			'display'    : 'block',
			'height'     : 'auto',
			'background' : 'none'
		});

		$('#gnb > div.box').css('right','-80%');
		$('#gnb > div.box > ul > li').removeClass('current');
		$('#gnb .sub_menu').hide();
		// $('#gnb .sub_menu ul').show();
		$('#gnb .sub_menu > div ul').show();
		$('#gnb > .dim').remove();

	}

}

// scroll top 

function scollTopStart() {

	 $('html,body').stop().animate({ scrollTop: 0 }, 600);

}

// popup open

function PopOpenEvt(url, w, h) {

	winObject = window.open(url,'_blank','top=0,left=0,width='+w+',height='+h+',resizable=no,scrollbars=yes');

}

// input[type="file"] event

function InputFileEvt(btnFile, inputFile, btnDelete) {

	// 파일첨부 링크 클릭 시

	$(document).on('click', btnFile, function() {
		var fileId = $(this).attr('href');
		$(fileId).click();

		return false;
	});

	// 파일 첨부 완료, 변경 시

	$(document).on('change', inputFile, function(e) {

		var fileObj = $(this).val(),
			Prt = $(this).parent(),
			pathHeader, 
			pathMiddle, 
			pathEnd, 
			allFilename, 
			fileName, 
			extName;

		if (fileObj) {
			pathHeader = fileObj.lastIndexOf('\\');
			pathMiddle = fileObj.lastIndexOf('.');
			pathEnd = fileObj.length;
			fileName = fileObj.substring(pathHeader+1, pathMiddle);
			extName = fileObj.substring(pathMiddle+1, pathEnd);
			allFilename = fileName+'.'+extName;

			$(this).parent().children('.fileName').html(allFilename);
			$(Prt).children('.btn_slight').hide();
			$(Prt).children('.delete').detach();
			$(Prt).children('.fileName').after('<a href="#" class="ico_ del delete">첨부된 ' + allFilename + ' 파일 삭제</a>');
			$(Prt).children('.delete').fadeIn();
		}

	});

	// 파일 삭제 시

	$(document).delegate(btnDelete, 'click', DeleteFileEvt);

	function DeleteFileEvt() {
		var _this = $(this);
		$(_this).parent().children('input[type="file"]').val(null);
		$(_this).parent().children('.btn_slight').show();
		$(_this).parent().children('.fileName').html('');
		$(_this).detach();
		return false;
	}

}

// Debug ie not smoothy text motion

function smooth_args(args) {

	if ($('html').hasClass('ie')) {
	    args.rotation = 0.1;
	}

	return args;

}

// mobile condition

function is_mobile() {
    return (/Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i).test(navigator.userAgent || navigator.vendor || window.opera);
	// return $('html').hasClass('mobile');
}

// os check

function is_mac_os() {
    return navigator.platform.indexOf('Mac') > -1;
}

// browser check

function is_browser_chrome() {
    return /Chrome/.test(navigator.userAgent);
}

function is_browser_firefox() {
    return /Firefox/.test(navigator.userAgent);
}