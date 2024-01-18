function buildTermNavigation(navigationContainer, $previewFrame, options) {
        // may have switch back to Image preview before we get called (no valid iframe)
        var contentWindow = $previewFrame[0].contentWindow;
        if (contentWindow == null) {
                return;
        }

        try {
               if (contentWindow.document.readyState == null ||
                   (contentWindow.document.readyState != "complete" &&
                    contentWindow.document.readyState != "interactive")) {
                        setTimeout(function() {
                                buildTermNavigation(navigationContainer, $previewFrame, options);
                        }, 500);
                        return;
                }
        } catch (e) {
                // IE: refused access may happens
                setTimeout(function() {
                        buildTermNavigation(navigationContainer, $previewFrame, options);
                }, 500);
                return;
        }

        options = $.extend({
                currentNavigationTermStyleTitle:"currentNavigationTermStyle",
                currentNavigationTermClass:"currentNavigationTerm",
                frameStyleTitle:"highlightStyles",
                termNavigationElementId:"termNavigation",
                hightlightedQueryMetaName:"query",
                commonHightlightClass:"highlight",
                scrollDuration:250
        }, options);

        var $navigationContainer = $(navigationContainer);

        var $previewDoc = $(contentWindow.document);

        var query = $previewDoc.find("meta[name="+options.hightlightedQueryMetaName+"]");

        var currentTermStyle = $("style[title="+options.currentNavigationTermStyleTitle+"]");

        var currentPreviewSpanTermIndex = null;
        var previewDocSpanTerms = $previewDoc.find("."+options.commonHightlightClass);

        // additional elements from Aspose multi-sheet xls(x)
        var previewDocSheetFrame = $previewDoc.find('frame[name="frSheet"]');

        if (previewDocSheetFrame.length != 0) {
                var previewDocSheetDocument = previewDocSheetFrame.get()[0].contentWindow.document;

                previewDocSheetFrame.get()[0].onload = function() {
                        buildTermNavigation(navigationContainer, $previewFrame, options);
                };

                try {
                        if (previewDocSheetDocument.readyState == null ||
                            (previewDocSheetDocument.readyState != "complete" &&
                             previewDocSheetDocument.readyState != "interactive")) {
                                setTimeout(function() {
                                        buildTermNavigation(navigationContainer, $previewFrame, options);
                                }, 500);
                                return;
                        }
                } catch (e) {
                        // IE: refused access may happens
                        setTimeout(function() {
                                buildTermNavigation(navigationContainer, $previewFrame, options);
                        }, 500);
                        return;
                }

                var $previewDocSheet = $(previewDocSheetDocument);

                if (query.length == 0) {
                        query = $previewDocSheet.find("meta[name="+options.hightlightedQueryMetaName+"]");
                }

                var hightlightingStyles = $previewDocSheet.find("style[title="+options.frameStyleTitle+"]");
                if (hightlightingStyles.length != 0) {
                        //clean solution does not work in legacy IE
                        $("head").append('<style>'+hightlightingStyles.html()+'</style>');
                }

                $previewDocSheet.find("head").append('<style>'+currentTermStyle.html()+'</style>');

                previewDocSpanTerms = previewDocSpanTerms.add($previewDocSheet.find("."+options.commonHightlightClass));
        }

        $navigationContainer.find(".occurrences b").empty().append(previewDocSpanTerms.length);

        var hightlightingStyles = $previewDoc.find("style[title="+options.frameStyleTitle+"]");
        if (hightlightingStyles.length != 0) {
                //clean solution does not work in legacy IE
	        $("head").append('<style>'+hightlightingStyles.html()+'</style>');
        }

        $previewDoc.find("head").append('<style>'+currentTermStyle.html()+'</style>');

	var TermNavigation = function(navigationFilterFunction) {
		this.navigationFilter = navigationFilterFunction;

		this.gotoNext = function(event) {
			var termNav = event.data;
			var nextIndex = currentPreviewSpanTermIndex;
			var nextTerm = null;
			var maxIteration = previewDocSpanTerms.length;
			var i = 0;
			while(true) {
				if(nextIndex != null) {
					if(++nextIndex >= previewDocSpanTerms.length)
						nextIndex = 0;
				}
				else {
					nextIndex = 0;
				}
				if(i++ >= maxIteration) {
					nextTerm = null;
					break;
				}
				nextTerm = previewDocSpanTerms.get(nextIndex);
				if(termNav.navigationFilter(nextTerm)) {
					break;
				}
			}
			if(nextTerm) {
				termNav.gotoTerm(nextTerm, nextIndex, termNav);
			}
			return false;
		};

		this.gotoPrevious = function(event) {
			var termNav = event.data;
			var nextIndex = currentPreviewSpanTermIndex;
			var nextTerm = null;
			var maxIteration = previewDocSpanTerms.length;
			var i = 0;
			while(true) {
				if(nextIndex != null) {
					if(--nextIndex < 0)
						nextIndex = previewDocSpanTerms.length - 1;
				}
				else {
					nextIndex = previewDocSpanTerms.length - 1;
				}
				if(i++ >= maxIteration) {
					nextTerm = null;
					break;
				}
				nextTerm = previewDocSpanTerms.get(nextIndex);
				if(termNav.navigationFilter(nextTerm)) {
					break;
				}
			}

			if(nextTerm) {
				termNav.gotoTerm(nextTerm, nextIndex, termNav);
			}
			return false;
		};

		this.gotoNextOrPrevious = function(event) {
			var termNav = event.data;
			if(!event.shiftKey) {
				termNav.gotoNext(event);
			}
			else {
				termNav.gotoPrevious(event);
			}
			return false;
		};

		this.gotoTerm = function(term, index, termNav) {
			if(currentPreviewSpanTermIndex != null) {
				$(previewDocSpanTerms.get(currentPreviewSpanTermIndex)).removeClass(options.currentNavigationTermClass);
			}

			$(term).addClass(options.currentNavigationTermClass);
			currentPreviewSpanTermIndex = index;
			$($previewDoc.find('frame[name="frSheet"]')[0].contentWindow).scrollTo(term, options.scrollDuration, {
				axis: 'y'
			});
			return false;
		};
	};

	globalTermNav = new TermNavigation(function(term) {
		return true;
	});

	var highlightedQueryString = query.attr("content");
	//fix IE bug with simple quotes
	if($(document.body).hasClass("legacy-ie") || $(document.body).hasClass("ie8") || $(document.body).hasClass("ie8compat")) {
		highlightedQueryString = highlightedQueryString.replace("&apos;", "'");
	}

	if (previewDocSpanTerms.length > 1) {
		var $highlightedQuery = $navigationContainer.find(".found .highlightedQuery");
		$highlightedQuery.empty().html(highlightedQueryString);

		$navigationContainer.find(".previous").unbind("click").bind("click", globalTermNav, globalTermNav.gotoPrevious);
		$navigationContainer.find(".next").unbind("click").bind("click", globalTermNav, globalTermNav.gotoNext);

		$highlightedQuery.find("span").each(function(index,spanTerm){
			var termNav = new TermNavigation(function(term) {
				return $(term).hasClass(spanTerm.className);
			});

			$(spanTerm).unbind("click").bind("click", termNav, termNav.gotoNextOrPrevious);
			$(spanTerm).css("cursor","pointer");
		});


		$navigationContainer.find(".notFound").hide();
		$navigationContainer.find(".oneFound").hide();
		$navigationContainer.find(".found").show();
	}

	else if (previewDocSpanTerms.length == 1) {
		var $highlightedQuery = $navigationContainer.find(".oneFound .highlightedQuery");
		$highlightedQuery.empty().html(highlightedQueryString);

		$navigationContainer.find(".next").unbind("click").bind("click", globalTermNav, globalTermNav.gotoNext);

		$highlightedQuery.find("span").each(function(index,spanTerm){
			var termNav = new TermNavigation(function(term) {
				return $(term).hasClass(spanTerm.className);
			});

			$(spanTerm).unbind("click").bind("click", termNav, termNav.gotoNextOrPrevious);
			$(spanTerm).css("cursor","pointer");
		});

		$navigationContainer.find(".notFound").hide();
		$navigationContainer.find(".found").hide();
		$navigationContainer.find(".oneFound").show();
	}

	else {
		var $highlightedQuery = $navigationContainer.find(".notFound .highlightedQuery");
		$highlightedQuery.empty().html(highlightedQueryString);

		$navigationContainer.find(".found").hide();
		$navigationContainer.find(".oneFound").hide();
		$navigationContainer.find(".notFound").show();
	}

	$(navigationContainer).show();
}
