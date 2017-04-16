(function($) {
	"use strict";

	$('[data-show-changeset]').click(function() {
		var changeset = $(this).data('show-changeset');
		var currentChangeset = $('[data-changeset=' + changeset + ']');
		$('[data-changeset]').removeClass('showchange');
		currentChangeset.addClass('showchange');

		$('html, body').animate({
			scrollTop: currentChangeset.offset().top
		}, 2000);
	});
})(jQuery);