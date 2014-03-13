// 1
// (function ($) {

// 	$.fn.helloWorld = function(){
// 		this.each(function() {
// 			$(this).text("Hello World");
// 		})
// 	}

// }(jQuery));

// 2
// (function ($) {

// 	$.fn.helloWorld = function( customText ){
// 		this.each(function() {
// 			$(this).text(customText);
// 		})
// 	}

// }(jQuery));


// 3
// (function ($) {

// 	$.fn.helloWorld = function( options ){

// 		var settings = $.extend({
// 			text 		: "Hello World",
// 			color		: null,
// 			fontStyle	: null
// 		}, options);

// 		return this.each(function() {
// 			$(this).text(settings.text);
// 			$(this).css({"background-color":settings.color});
// 		})
// 	}

// }(jQuery));


// 4
(function ($) {

	$.fn.helloWorld = function( options ){

		var settings = $.extend({
			text 		: "Hello World",
			color		: null,
			fontStyle	: null,
			complete	: null
		}, options);

		return this.each(function() {
			$(this).text(settings.text);
			$(this).css({"background-color":settings.color});

			if ($.isFunction(settings.complete)) {
				settings.complete.call(this);
			};
		})
	}

}(jQuery));