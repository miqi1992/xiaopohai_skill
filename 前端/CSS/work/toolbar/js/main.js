requirejs.config({
	paths: {
		jquery: 'jquery.main.js'
	}
});


requirejs(['jquery'], function ($) {
	$('body').css('background', 'red');
});