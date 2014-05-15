#jSectionScroll
Jquery Page Scroll Slider

##Simple Example
	$('#main').jSectionScroll({
		init: function(common){},
		join: function(common, index, prev){},
		leave: function(common, index, next){}
	});

##Events
* init ([ common ])
* join ([ common [, index [, prev ]]])
* leave ([ common [, index [, next ]]])

