(function( $ ){
	/**
	 * Big preview
	 */
	var methods = {
		hasPreviewHTML: null,
		hasPreviewImage: null,

		currentPreviewMode: null,

		/**
		 *
		 * @param e
		 * @returns {Boolean}
		 */
		open: function(e) {
			var $window = $(window);
			var $body = $('body');
			if ($body.hasClass('ie6') || $body.hasClass('ie7') || $body.hasClass('ie8') || $body.hasClass('ie9')) {
				$('html').css('overflow', 'hidden');
			} else {
				$body.css('overflow', 'hidden');
			}

			var top = e.data.options.top;
			top += $window.scrollTop();
			
			var $previewWrapper = $('#previewWrapperTemplate').clone().attr('id', 'previewWrapper').css('top', top);
			var $previewOverlay = $('#previewOverlayTemplate').clone().attr('id', 'previewOverlay');

			methods.hasPreviewHTML = e.data.$this.attr('data-htmlpreview') != undefined && e.data.$this.attr('data-htmlpreview').length > 0;
			methods.hasPreviewImage = e.data.$this.attr('data-imagepreview') != undefined && e.data.$this.attr('data-imagepreview').length > 0;

			$previewWrapper.find('.title').html(decodeURIComponent(e.data.$this.attr('data-title')));

			var index = e.data.options.links.index(e.data.$this);
			// Bind previous document
			if (e.data.options.links.length == 1) {
				$previewWrapper.find('.doOpenPreviousDocument').remove();
			} else if (index == 0) {
				$previewWrapper.find('.doOpenPreviousDocument').remove();
			} else {
				$previewWrapper.find('.doOpenPreviousDocument').bind('click', function(e2) {
					methods.close();
					$(e.data.options.links.get(index - 1)).click();
					return false;
				});
			}

			// Bind next document
			if (e.data.options.links.length == 1) {
				$previewWrapper.find('.doOpenNextDocument').remove();
			} else if ((index + 1) == e.data.options.links.length) {
				$previewWrapper.find('.doOpenNextDocument').remove();
			} else {
				$previewWrapper.find('.doOpenNextDocument').bind('click', function(e2) {
					methods.close();
					$(e.data.options.links.get(index + 1)).click();
					return false;
				});
			}

			// Bind click: Preview as Image
			if (methods.hasPreviewImage == true) {
				$previewWrapper.find('.doOpenPreviewAsImage').bind('click', function(e2) {
					methods.setPreviewMode('image', $previewWrapper, e);
					return false;
				});
			} else {
				$previewWrapper.find('.doOpenPreviewAsImage, .doOpenPreviewAsHTML').remove();
			}

			// Bind click: Preview as HTML
			if (methods.hasPreviewHTML == true) {
				$previewWrapper.find('.doOpenPreviewAsHTML').bind('click', function(e2) {
					methods.setPreviewMode('html', $previewWrapper, e);
					return false;
				});
			} else {
				$previewWrapper.find('.doOpenPreviewAsImage, .doOpenPreviewAsHTML').remove();
			}

			// create content
			var $content = $previewWrapper.find('.content');
			$content.bind('mousewheel DOMMouseScroll', {container: $content}, methods.handleEventOnScroll);

			// append to body (and not to .mashup because of Sharepoint)
			$body.append($previewOverlay).append($previewWrapper);

			// event handlers
			$window.bind('resize', methods.resize);
			$window.bind('keyup', methods.handleEventOnKeyUp);
			$previewOverlay.bind('click', methods.close);
			$previewWrapper.find('a.closeButton').bind('click', methods.close);

			methods.resize();
			methods.setPreviewMode(null, $previewWrapper, e);
			return false;
		},

		setPreviewMode: function(previewMode, $previewWrapper, e) {
			$previewWrapper.find('> .content').removeClass('no-loading');

			if (previewMode == null) {
				previewMode = methods.currentPreviewMode;
			}
			if (previewMode == null) {
				// load from a cookie
				previewMode = $.cookie('previewMode');
			} else {
				$.cookie('previewMode', previewMode);
			}

			if (methods.hasPreviewImage == false || previewMode == 'html' && methods.hasPreviewHTML == true) {
				methods.currentPreviewMode = 'html';
				methods.showPreviewAsHTML($previewWrapper, e.data.$this.attr('data-htmlpreview'));
			} else {
				methods.currentPreviewMode = 'image';
				methods.showPreviewAsImage($previewWrapper, e.data.options.baseUrl, e.data.$this.attr('data-imagepreview'), e.data.$this.attr('data-numpages'));
			}
		},

		/**
		 *
		 * @param $previewWrapper
		 * @param baseThumbnailUrl
		 */
		showPreviewAsHTML: function($previewWrapper, baseThumbnailUrl) {
			$previewWrapper.addClass('previewAsHTML');
			$previewWrapper.find('.doOpenPreviewAsHTML').addClass('selected');
			$previewWrapper.find('.doOpenPreviewAsImage').removeClass('selected');
			$previewWrapper.find('> .content > *').remove();

			var htmlTermNavigation = '<div class="termNavigation">' +
				'<span class="notFound" style="display:none"><span class="occurrences">No occurrence for</span> <span class="highlightedQuery"></span></span>' +
				'<span class="oneFound" style="display:none"><span class="occurrences"><b></b> occurrence</span> <span class="highlightedQuery"></span> <a href="#" class="next">view</a></span>' +
				'<span class="found" style="display:none"><span class="occurrences"><b></b> occurrences</span> <a href="#" class="previous">&lt; previous</a> <span class="highlightedQuery"></span> <a href="#" class="next">next &gt;</a></span>' +
			'</div>';
			var $termNavigation = $(htmlTermNavigation);
			$previewWrapper.find('> .content').append($termNavigation);

			var $iframe = $('<iframe></iframe>').hide();
			bindIframeOnLoad($iframe[0], function() {
				$iframe.show();
				bindIframeOnReady($iframe[0], function() {
					buildTermNavigation($termNavigation, $iframe);
				});
			});
			
			$iframe.attr('src', decodeURIComponent(baseThumbnailUrl));
			$previewWrapper.find('> .content').append($iframe);
			methods.resize();
		},

		/**
		 *
		 * @param $previewWrapper
		 * @param baseUrl
		 * @param baseThumbnailUrl
		 * @param numPages
		 */
		showPreviewAsImage: function($previewWrapper, baseUrl, baseThumbnailUrl, numPages) {
			$previewWrapper.find('.doOpenPreviewAsHTML').removeClass('selected');
			$previewWrapper.find('.doOpenPreviewAsImage').addClass('selected');
			$previewWrapper.removeClass('previewAsHTML');
			$previewWrapper.find('> .content > *').remove();

			$.getJSON(baseUrl + 'fetch/previewConfiguration?baseThumbnailURL=' + baseThumbnailUrl + '&numPages=' + numPages, function(data) {
				// create navigation
				var $pageNav = $previewWrapper.find('.pageNav');
				$pageNav.bind('mousewheel DOMMouseScroll', {container: $pageNav}, methods.handleEventOnScroll);
				$pageNav.empty();
				methods.loadNav($pageNav, data.pages, 0, 5);

				// Show the first one by default
				if (data.pages.length > 0) {
					methods.showPreview(0, data.pages[0].big);
				}
			});
		},

		/**
		 *
		 * @param $pageNav
		 * @param pages
		 * @param from
		 * @param to
		 */
		loadNav: function($pageNav, pages, from, to) {
			$pageNav.find('.previewMore').remove();

			for (var i = from; i < pages.length && i < to; i++) {
				var $img = $('<img alt="Preview"/>');
				$img.bind('load', function () {
					$(this).css('visibility', 'visible');
				});

				var $a = $('<a class="loading"/>');
				$a.html($img);
				$pageNav.append($a);

				$img.attr('src', pages[i].small);

				$a.bind('click', {page: i}, function(e2) {
					methods.showPreview(e2.data.page, pages[e2.data.page].big);
					return false;
				});
			}

			if (to < pages.length) {
				$moreLink = $('<a class="previewMore">More</a>');
				$moreLink.bind('click', function() {
					methods.loadNav($pageNav, pages, to, to + 5);
				});
				$pageNav.append($moreLink);
			}
		},

		/**
		 *
		 * @param e
		 * @returns {Boolean}
		 */
		close: function(e) {
			var $window = $(window);
			var $body = $('body');

			if ($body.hasClass('ie6') || $body.hasClass('ie7') || $body.hasClass('ie8') || $body.hasClass('ie9')) {
				$('html').css('overflow', 'auto');
			} else {
				$body.css('overflow', 'auto');
			}

			var $previewWrapper = $('#previewWrapper');
			var $previewOverlay = $('#previewOverlay');
			$previewWrapper.remove();
			$previewOverlay.remove();

			$window.unbind('resize', methods.resize);
			$window.unbind('keyup', methods.handleEventOnKeyUp);
			return false;
		},

		/**
		 *
		 * @param page
		 * @param url
		 * @param x
		 */
		showPreview: function(page, url, x) {
			var $previewWrapper = $('#previewWrapper');

			$previewWrapper.find('.pageNav a.selected').removeClass('selected');
			$previewWrapper.find('.pageNav a:eq(' + page + ')').addClass('selected');

			var $content = $previewWrapper.find('.content');
			$content.find('> img').remove();
			$img = $('<img />');
			$img.bind('load', function () {
				$(this).fadeIn();
			});
			$content.append($img);
			$img.attr('src', url);

			$content.addClass('no-loading');
			
			methods.resize();
		},

		/**
		 *
		 */
		resize: function() {
			var $window = $(window);
			var $previewWrapper = $('#previewWrapper');
			var $previewOverlay = $('#previewOverlay');

			if ($('body').hasClass('ie6')) {
				$previewOverlay.css('position', 'absolute');
				$previewOverlay.css('height', $window.height());
				$previewOverlay.css('width', $window.width());
				$previewOverlay.css('top', $window.scrollTop());
			}


			var buttonBarWidth = 0;
			$previewWrapper.find('.buttonBar, a.closeButton').each(function() {
				buttonBarWidth += $(this).width();
			});

			// Proposed height
			var proposedHeight = $window.height() - 100;
			$previewWrapper.height(proposedHeight);
			$previewWrapper.find('> .pageNav, > .content').height(proposedHeight < 300 ? 250 : proposedHeight - 50);

			// Proposed width
			var proposedWidth = $window.width() - 100;
			if (proposedWidth < 800) {
				proposedWidth = 800;
			} else if (proposedWidth > 1300) {
				proposedWidth = 1300;
			}

			if (methods.currentPreviewMode == 'html') {
				// Preview as HTML
				$previewWrapper.find('> .pageNav').hide();
				$previewWrapper.find('> .content').width(proposedWidth).css('overflow', 'hidden');
				$previewWrapper.find('> .content > iframe').width(proposedWidth).height((proposedHeight < 300 ? 250 : proposedHeight - 60) - 10);
			} else {
				// Preview as Image
				$previewWrapper.find('> .pageNav').show().width(165);
				$previewWrapper.find('> .content').width(proposedWidth - 175).css('overflow', 'auto');
				//$previewWrapper.find('> .content > img').width(proposedWidth - 205); // http://ng/trac/mercury/ticket/15095
			}

			$previewWrapper.find(".title").width(proposedWidth - buttonBarWidth - 35);
			$previewWrapper.width(proposedWidth);
			$previewWrapper.css('left', ($(window).width() - proposedWidth) / 2);
		},

		/**
		 *
		 * @param e
		 * @returns {Boolean}
		 */
		handleEventOnKeyUp: function(e) {
			switch (e.keyCode) {
			case 27: /* Esc */
				methods.close();
				return false;
			default:
				return true;
			}
		},

		/**
		 *
		 * @param e
		 * @returns {Boolean}
		 */
		handleEventOnScroll: function(e) {
			var container = e.data.container;
			e = e.originalEvent ? e.originalEvent : e;
			container.scrollTop(container.scrollTop() - (e.wheelDelta ? e.wheelDelta/120 : -e.detail/3) * 40);
			return false;
		}
	};

	/**
	 * Binds an onready event for iframes
	 * Also update the function in 360-admin-ui/war/resources/commons/js/util/util.js
	 */
	function bindIframeOnReady(iframe, onReady) {
		try {
			var pe = iframe.parentElement;
			var cw = iframe.contentWindow;
			if (pe == null || cw == null || ((cwd = cw.document) == null) || ((state = cwd.readyState) == null) || (state != "complete" && state != "interactive")) {
				setTimeout(function() {
					bindIframeOnReady(iframe, onReady);
				}, 250);
			} else {
				onReady();
			}
		} catch (e) {
			// IE: refused access may happens
			setTimeout(function() {
				bindIframeOnReady(iframe, onReady);
			}, 250);
		}
	}

	/**
	 * Binds onload event for iframes
	 * Also update the function in 360-admin-ui/war/resources/commons/js/util/util.js
	 */
	function bindIframeOnLoad(iframe, onLoad) {
		iframe.onload = iframe.onreadystatechange = function() {
			if (iframe.readyState == undefined || iframe.readyState == 'complete') {
				onLoad();
			}
		};
	}

	$.fn.preview = function(options) {
		var settings = {
			'top': 50,
			'background-color': 'blue',
			'baseUrl': $('meta[name=baseurl]').attr('content'),
			'links': this
		};

		if (options) {
			$.extend(settings, options);
		}

		return this.each(function() {
			$(this).bind('click', {$this: $(this), options: settings}, methods.open);
		});
	};

})( jQuery );
