(function( $ , window){
	var $window = $(window);

	var methods = {
		/*
		 * Small preview
		 */
		initSmallPreview: function($img, options) {
			$img.attr('src', $img.attr('data-src'));
			var numPages = parseInt($img.attr('data-numPages') || 1);
			if (numPages <= 1) {
				return;
			}

			var $previousLink = $('<a href="#" class="switchPreviousPreview switchPreview" style="position:absolute; display:none"> &lsaquo; </a>');
			var $previewLink = $('<a href="#" class="openBigPreview">Preview</a>');
			$previewLink.attr('data-htmlpreview', $img.attr('data-htmlpreview') || '');
			$previewLink.attr('data-imagepreview', $img.attr('data-imagepreview') || '');
			$previewLink.attr('data-title', $img.attr('data-title'));
			$previewLink.attr('data-numpages', $img.attr('data-numpages'));
			var $nextLink = $('<a href="#" class="switchNextPreview switchPreview" style="position:absolute;"> &rsaquo; </a>');
			var $status = $('<span class="switchStatusPreview switchPreview" style="position:absolute;">1/' + numPages + '</span>');

			// Append links to the DOM
			var $closestLinkTag = $img.closest('a');
			if ($closestLinkTag.length > 0) {
				$closestLinkTag.parent().css('position', 'relative');
				$status.insertAfter($closestLinkTag);
				$nextLink.insertAfter($closestLinkTag);
				if (options.showPreviewLink) {
					$previewLink.insertAfter($closestLinkTag);
				}
				$previousLink.insertAfter($closestLinkTag);
			} else {
				$img.parent().css('position', 'relative');
				$status.insertAfter($img);
				$nextLink.insertAfter($img);
				if (options.showPreviewLink) {
					$previewLink.insertAfter($img);
				}
				$previousLink.insertAfter($img);
			}

			// Bind links
			$previousLink.bind('click', {$img: $img}, function(e) {
				var url = new BuildUrl(e.data.$img.attr('src'));
				var page = parseInt(url.getParameter('start_page') || 1);
				url.addParameter('start_page', page - 1, true);
				if ((page - 1) == 1) {
					$previousLink.hide();
				}
				$nextLink.css('display', '');
				methods.addLoadingOverlay(e);
				e.data.$img.attr('src', url.toString());
				$status.html((page - 1) + '/' + numPages);
				return false;
			});
			if (options.showPreviewLink) {
				$previewLink.preview(options);
			}
			$nextLink.bind('click', {$img: $img}, function(e) {
				var url = new BuildUrl(e.data.$img.attr('src'));
				var page = parseInt(url.getParameter('start_page') || 1);
				url.addParameter('start_page', page + 1, true);
				if ((page + 1) == numPages) {
					$nextLink.hide();
				}
				$previousLink.css('display', '');
				methods.addLoadingOverlay(e);
				e.data.$img.attr('src', url.toString());
				$status.html((page + 1) + '/' + numPages);
				return false;
			});

			methods.refreshPositions($img, $previousLink, $nextLink, $status);
			$img.bind('load', {$img:$img, $previousLink:$previousLink, $nextLink:$nextLink, $status:$status}, methods.removeLoadingOverlay);
		},
		refreshPositions: function($img, $previousLink, $nextLink, $status) {
			// Links' position
			var position = $img.position();
			$previousLink.css('top', $img.outerHeight() / 2 + position.top - 18);
			$previousLink.css('left', position.left - 16);
			$nextLink.css('top', $img.outerHeight() / 2 + position.top - 18);
			$nextLink.css('left', position.left + $img.outerWidth());
			$status.css('top', $img.outerHeight() + position.top - 18);
			$status.css('left', position.left);
		},
		addLoadingOverlay: function(e) {
			var position = e.data.$img.position();

			// Overlay
			var $div = $('<div class="previewSwitchLoadingOverlay loading" style="position: absolute;"></div>');
			$div.css('top', position.top);
			$div.css('left', position.left);
			$div.css('height', e.data.$img.outerHeight() - 2); // Because of borders
			$div.css('width', e.data.$img.outerWidth() - 2); // Because of borders
			e.data.$img.parent().append($div);
		},
		removeLoadingOverlay: function(e) {
			methods.refreshPositions(e.data.$img, e.data.$previousLink, e.data.$nextLink, e.data.$status);
			e.data.$img.parent().find('> .previewSwitchLoadingOverlay').remove();
		}
	};

	function isInViewPort($img) {
		var position = $img.offset();
		return position.top < $window.height() + $window.scrollTop();
	}

	$.fn.smallPreview = function(options) {
		var elements = this;

		var settings = {
			'showPreviewLink': true,
			'baseUrl': $('meta[name=baseurl]').attr('content')
		};

		if (options) {
			$.extend(settings, options);
		}

		var $mainScrollableWrapper;
		if(options.mainContainerId != ""){
			$mainScrollableWrapper = $("#"+options.mainContainerId);
		}
		else if(typeof(window.mashup.mainContainerId) !== 'undefined' && window.mashup.mainContainerId != ""){
			$mainScrollableWrapper = $("#"+window.mashup.mainContainerId);
		}
		else{
			$mainScrollableWrapper = $window;
		}
		
		function update() {
			elements.each(function() {
				var $this = $(this);
				if (!this.isLoaded && isInViewPort($this)) {
					this.isLoaded = true;
					methods.initSmallPreview($this, settings);
				}
			});
			elements = elements.filter(function (i) {
				return !elements[i].isLoaded;
			});
			if (elements.length == 0) {
				$mainScrollableWrapper.unbind('scroll', update);
				$mainScrollableWrapper.unbind('resize', update);
			}
		}
		$mainScrollableWrapper.bind('scroll', update);
		$mainScrollableWrapper.bind('resize', update);
		update();

		return this;
	};

})( jQuery , window);