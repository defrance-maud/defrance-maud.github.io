(function($){
	"use strict";

	/* 
	 * ------------------------------------------
	 * Sticky Sidebar
	 * ------------------------------------------
	 */
	$(".sticky-sidebar").sticky({
		topSpacing: 40,
		bottomSpacing: $(".site-footer").outerHeight() + 20,
		className: "sidebar-sticked",
	});

	/* 
	 * ------------------------------------------
	 * Gallery
	 * ------------------------------------------
	 */
	$(".post-image-gallery, .gallery").justifiedGallery({
		rowHeight: 200,
		captions: false,
	});
	$(".post-image-gallery a, .gallery a").swipebox();

	/* 
	 * ------------------------------------------
	 * FitVids
	 * ------------------------------------------
	 */
	$(".post").fitVids();

	/* 
	 * ------------------------------------------
	 * Grid layout
	 * ------------------------------------------
	 */
	$(".blogroll-grid .post").matchHeight();

})(jQuery);