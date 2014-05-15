;;(function($){

	var defaults = {
		pagination: false,
		deltaScroll: 35,
		beforeSlide: function(index, y, common){},
		afterSlide: function(index, y, common){},
		slideEvent: function(y, percent, common){},
		join: function(index,common){},
		leave: function(index, prev, common){},
		init: function(el, common){},
		resize: function(common){}
	}
	
	$.fn.ivanSlider = function (options){
		var positions_id = new Array(),
			positions_top = [0,0],
			offset_id = new Array(),
			links = new Array(),
			settings = $.extend({}, defaults, options),
			el = $(this).wrapInner('<div></div>').css({position:'relative'}),
			inwrapper = el.children().first().addClass('wrapInSlider').css({position:'absolute',width:'100%'}),
			hellSection = $('<section></section>').appendTo(inwrapper).addClass('endOfAll'),
			sections = inwrapper.children('section'),
			current_index = 1,
			lastAnimation = 0,
			reloadSectionsTimeout = false,
			windowHeight = 0,
			slideAction = false,
			prevPosition = 0,
			statusScroll = true;
		
		var common = {
			switchScroll:function(status){if(status) statusScroll = true; else statusScroll = false;}
		};
		
		$.fn.slide = function(index, callback){
			if(slideAction) return false;
			var __callback = callback || function(){};
			var position = positions_id[index];
			settings.beforeSlide(index, position.top);
			/*
			if(!settings.join(index)){
				//el.slide(current_section);
				
				inwrapper.stop().css({top:(positions_id[current_section].top * -1)+'px'});
				
				return false;
				
			}else{
			*/
				slideAction = true;
				
				inwrapper.animate({top:(position.top * -1)+'px'}, 400, 'swing', function(){
					__callback(); 
					slideAction = false; 
					settings.afterSlide(index, position.top, common);
					
					var h = sections.filter(hellSection).first().position().top - windowHeight;
					settings.slideEvent(position.top, position.top / h * 100);
				});
				//$(links).not(__current).removeClass('active');
				//var __current = $(links).filter("[data-index='" + index +"']").addClass('active');
				//$(links).not(__current).removeClass('active');
				$(links).each(function(){
					var __index = parseInt($(this).data('index'));
					if(index == __index) $(this).addClass('active');
					else $(this).removeClass('active');
				});
				
				var current_section = sections[index-1];
				
				$(sections).each(function(i,s){
					var $this = $(this),
						is_active = $this.hasClass('active'),
						is_curr = $this.is(current_section);
					if(!is_active && is_curr){
						$this.addClass('active').fadeTo(200 , 1);
						animate($this);
					}
					if(is_active && !is_curr) $this.removeClass('active').fadeTo(400, 0.5);
				});
				
				if(current_section){
					//$(current_section)
				}
				return true;
			//}
		}
		
		var activeSlideIndex = 1;
		
		function join_slide(index){
			if(settings.join(index)){
				exit_slide(activeSlideIndex, index);
				activeSlideIndex = index;
				return true;
			}else{
				return false;
			}
		}
		
		function exit_slide(index){
			
		}
		
		if(settings.pagination){
			$(settings.pagination).each(function(i,p){
				var _el = el;
				$(p + ' a').each(function(i,element){
					var id = $(this).data('index'),
						__el = _el,
						__this = $(this);
					$(this).click(function(e){
						e.preventDefault();
						__el.slide(id, function(){});
					});
					links.push(__this[0]);
				});
			});
			
		}
		
		var startX,
			startY,
			$this = $(this);

		$this.bind('touchstart', touchstart);

		function touchstart(event) {
			var touches = event.originalEvent.touches;
			if (touches && touches.length) {
				startX = touches[0].pageX;
				startY = touches[0].pageY;
				$this.bind('touchmove', touchmove);
			}
		}

		function touchmove(event) {
				var touches = event.originalEvent.touches;
				if (touches && touches.length) {
					var deltaX = startX - touches[0].pageX;
					var deltaY = startY - touches[0].pageY;
					
					if (deltaY >= settings.deltaScroll){
						//$this.trigger("swipeUp");
						init_scroll({}, deltaY*-1);
					}
					if (deltaY <= (settings.deltaScroll*-1)){
						//$this.trigger("swipeDown");
						init_scroll({}, deltaY*-1);
					}
					if (Math.abs(deltaX) >= 50 || Math.abs(deltaY) >= 50) {
						$this.unbind('touchmove', touchmove);
					}
				}
		   }
		
		function reload_sections(){
			var __positions_id = positions_id;
			sections.each(function(i, element){
				//console.log(element);
				__positions_id[i+1] = $(this).position();
				if($(this).is(hellSection)) __positions_id[i+1].isHell = true;
				positions_top = __positions_id[i+1].top;
			});
		}
		
		function reload_sizes(){
			//windowHeight = $(window).height();
			windowHeight = window.outerHeight;
			window.clearTimeout(reloadSectionsTimeout);
			sections.css({minHeight:windowHeight});
			reloadSectionsTimeout = window.setTimeout(reload_sections, 300);
		}
		
		function check_position(){
			var __current = Math.abs(inwrapper.offset().top),
				__el = el;
			
			if(__current > prevPosition){
				///*
				sections.each(function(i, element){
					var __index = i+1,
						__thisY = $(this).position().top,
						//__nextYDiff = $(window).height() - (__thisY - __current);
						__nextYDiff = $(window).height() - (__thisY - __current);
						//console.log('This 1: '+__nextYDiff);
						//console.log('This 2: '+($(window).height() - __thisY + Math.abs($('.main').children().first().offset().top)));
					if($(this).is(hellSection) && __nextYDiff > 120){
						inwrapper.stop().animate({top:((__current - __nextYDiff)*-1)+'px'});
						
						return false;
					}else{
					
						if(120 < __nextYDiff  && __nextYDiff <= 250){
							__el.slide(__index);
							//console.log(__nextYDiff);
							return false;
						}
						
						if(__nextYDiff > 250) return true;
						
					}
				});
				//*/
				/*
				for (var __index = 1; __index < positions_id.length; __index++){
					var __position = positions_id[__index],
						__thisY = __position.top,
						__nextYDiff = windowHeight - (__thisY - __current);
					if(__position.isHell && __nextYDiff > 120){
						inwrapper.stop().animate({top:((__current - __nextYDiff)*-1)+'px'});
						return false;
					}else{
						if(120 < __nextYDiff  && __nextYDiff <= 250){
							__el.slide(__index);
							console.log('CURRENT');
							return false;
						}
						if(__nextYDiff > 250){
							//console.log('MORE_BITCH');
						 	//return true;
						}
					}
				}
				*/
			}else{
				///*
				sections.each(function(i, element){
					var __index = i+1,
						__thisY = $(this).position().top,
						__nextYDiff = __thisY - __current;
					if($(this).is(sections[0]) && __nextYDiff > 120){
						inwrapper.stop().animate({top:((__current + __nextYDiff)*-1)+'px'});
						return false;
					}else{
						if(120 < __nextYDiff  && __nextYDiff <= 250){
							__el.slide(__index - 1);
							//console.log(__nextYDiff);
							return false;
						}
						if(__nextYDiff > 250) return true;
					}
				});
				//*/
				
				
			}
			/*
			sections.each(function(i, element){
				if($(this).is(hellSection)){
					$(this).position().top;
					
				}
			});
			*/
			var h = sections.filter(hellSection).first().position().top - windowHeight;
			settings.slideEvent(__current, __current / h * 100);
			
			
			prevPosition = __current;
		}
		
		function animate(div) {
			div.find('.animated-no').each(function() {
				$(this).addClass('animated '+$(this).attr('data-animation'));
			});
			div.find('.counter').removeClass('counter').each(function() {
				$(this).children('.value').countTo();
			});
		}
		/*
		function check_active(current, new_position){
			var current = Math.abs(inwrapper.offset().top),
				position = positions_id[activeSlideIndex];
			
			if(current < new_position){
				if(position.top > new_position) return join_slide(activeSlideIndex-1);
				else return true;
			}else{
				var next_position = positions_id[activeSlideIndex+1];
				console.log('238: next_position: '+next_position);
				if((next_position.top - windowHeight) < current) return join_slide(activeSlideIndex+1);
				else return true;
			}
			
		}
		*/
		function init_scroll(event, delta) {
			var __current = inwrapper.offset().top;
			if(!__current) __current = 0;
			
			var __new = __current;
			
			if(delta < 0) __new = __current - settings.deltaScroll;
			else if(delta > 0) __new = __current + settings.deltaScroll;
			else return false;
			
			/*
			if(!check_active(__current, __new)){
				alert('NOPE');
			}else{
				//var __new = __current + (delta / 2);
			*/
				if(__new > 0) __new = 0;
				inwrapper.css({top:__new+'px'});
				check_position();
			//}
			
		}
		
		var eventHellSlide = 0;
		
		$(document).bind('mousewheel DOMMouseScroll', function (event){
			event.preventDefault();
			
			if(!statusScroll) return false;
			if(slideAction) return false;
			
			var inOffset = inwrapper.offset(),
				currentTime = new Date().getTime();
			
			var delta = event.originalEvent.wheelDelta || -event.originalEvent.detail;
			
			if(delta > 0){
				var __firstHeight = $(sections[0]).height();
				if(Math.abs(inOffset.top) - __firstHeight - settings.deltaScroll < 0){
					inwrapper.css({top:(__firstHeight*-1)+'px'});
					delta = 0;
				}
			}
			if(delta < 0){
				var __hellTop = positions_id[sections.length].top;
				if((Math.abs(inOffset.top) + windowHeight) > __hellTop){
					///*
					window.clearTimeout(eventHellSlide);
					eventHellSlide = window.setTimeout(function(){
						inwrapper.stop().animate({top:((__hellTop - windowHeight)*-1)+'px'});
					}, 100);
					//*/
					//inwrapper.stop().css({top:((__hellTop - windowHeight)*-1)+'px'});
					delta = 0;
				}
			}
			
			init_scroll(event, delta);
		});
		
		reload_sizes();
		
		$(window).resize(function () {
			reload_sizes();
			settings.resize(common);
		});
		
		$(document).load(function(){
			reload_sections();
			reload_sizes();
		});
		
		$(window).load(function(){
			reload_sections()
		});
		
		reload_sections();
		
		common.reload = function(){
			reload_sizes();
			reload_sections();
		}
		
		//windowHeight = $(window).height();
		windowHeight = window.outerHeight;
		
		common.windowHeight = windowHeight;
		
		settings.init(el, common);
		
		return false;
	}
})(window.jQuery);
