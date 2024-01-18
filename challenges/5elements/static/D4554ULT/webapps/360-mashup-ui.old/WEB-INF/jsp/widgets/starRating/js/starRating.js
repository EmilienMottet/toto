StarRating360Service = (function($, undefined) {

	var widgets = {};
	var db;

	function getWidget(anyChildNode) {
		return widgets[anyChildNode.parents(".starRating-wrapper").attr('id')];
	};	

	function ratingFromLink(aElement) {
		return parseFloat(aElement.attr('href').replace(/.*#/, ""));
	};

	function displayRant(ratingDiv, rating) {
		var widget = getWidget($(ratingDiv));
		var weight = rating / widget.numStars;
		var rantIndex = Math.floor((weight * widget.rants.length) - widget.increment);
		ratingDiv.find("div.rant").html(widget.rants[rantIndex]);
		ratingDiv.find("div.rant").show();
	};

	function displayMessage(ratingDiv, message) {
		ratingDiv.find("div.rant").show();
		ratingDiv.find("div.rant").html(message);
		ratingDiv.find("div.rant").fadeOut('slow');
	};

	function hideRant(ratingDiv) {
		ratingDiv.find("div.rant").html("");
	};

	function setRating(ratingDiv, rating, highlight) {
		var stars = ratingDiv.children("div.stars.full");
		var starWidth = parseInt(getWidget(ratingDiv).starWidth, 10);
		stars.css('width', (rating * starWidth) + 'px');
		if (highlight) {
			stars.addClass("highlight");
		} else {
			stars.removeClass("highlight");
		}

		// Set value in DOM
		ratingDiv.parents('.starRating-wrapper').find('.rating span.value').html(rating);
	};

	function resetRating(ratingDiv) {
		var stars = ratingDiv.children("div.stars.full");
		setRating(ratingDiv, getWidget(stars).value ? getWidget(stars).value.value : 0, false);
	};

	function showSpinner(ratingDiv) {
		var widget = getWidget(ratingDiv);
		ratingDiv.find(".rant").before('<div class="loadingSpinner"></div>');
		ratingDiv.find("div.loadingSpinner").css('left', (widget.numStars * widget.starWidth + 5) + "px");
	};

	function hideSpinner(ratingDiv) {
		ratingDiv.find("div.loadingSpinner").remove();
	};

	// Event listeners

	function onStarHoverIn(evt) {
		if(getWidget($(this)).readonly)
			return false;
		
		var hoverRating = ratingFromLink($(this));
		var ratingDiv = $(this).parents('.starRating');
		hideUnrated(getWidget(ratingDiv));
		displayRant(ratingDiv, hoverRating);
		setRating(ratingDiv, hoverRating, true);
		
		return false;
	};

	function onStarHoverOut(evt) {
		if(getWidget($(this)).readonly)
			return false;
		
		var ratingDiv = $(this).parents('.starRating');
		showUnrated(getWidget(ratingDiv));
		resetRating(ratingDiv);
		hideRant(ratingDiv);
		
		return false;
	};

	function onClickStar(evt) {
		if(getWidget($(this)).readonly)
			return false;
		
		var newAbsRating = ratingFromLink($(this));
		if (isNaN(newAbsRating)) {
			throw new Error("Vote was NaN, aborting", this);
			return;
		}
		var ratingDiv = $(this).parents('.starRating');
		var widget = getWidget(ratingDiv);

		// make sure can not vote again
		ratingDiv.find("div.sections").remove();

		hideRant(ratingDiv);

		// show loading spinner
		showSpinner(ratingDiv);

		// fetch rating again
		db.get(widget.docBuildGroup, widget.docSource,widget.docId, widget.dbKey, function(items) {
			var storedRating = items.length == 1 ? $.evalJSON(items[0].value) : {num: 0, value: 0.0};
			var newRating = calculateRating(storedRating, newAbsRating);
			var json = $.toJSON(newRating);

			// Set new json string in storage
			db.set(widget.docBuildGroup, widget.docSource, widget.docId, widget.dbKey, json, function() {

				// hide loading
				hideSpinner(ratingDiv);

				displayMessage(ratingDiv, mashupI18N.get("starRating","submitted"));

				if (widget.showAvgAfterVote) {
					refresh(widgets);
				} else {
					setRating(ratingDiv, newAbsRating, true);
				}

				setTotalVotes($(ratingDiv).find('.totalVotes'), newRating.num);

				// restore appearance
				hideUnrated(widget);
			});

			// Export numerical rating to 'meta'
			if (widget.meta) {
				db.set(widget.docBuildGroup ,widget.docSource, widget.docId, widget.meta, "" + newRating.value);
			}
		});

		return false;
	};

	function calculateRating(oldRating, newAbsRating) {
		var dRate = newAbsRating - oldRating.value;
		return {
			num: oldRating.num + 1,
			value: oldRating.value + dRate * (1 / (oldRating.num + 1))
		};
	};

	function showUnrated(widget) {
		if (widget.showUnrated === true && widget.value === undefined) {
			$("#" + widget.widgetId)
			.find('div.unrated').show();
		}
	};

	function hideUnrated(widget) {
		$("#" + widget.widgetId).find("div.unrated").hide();
	};

	/**
	 * Fetch fresh ratings for 'widgets'
	 * 
	 * If callback is defined, execute
	 * Otherwise, refresh UI from database
	 */
	function refresh(widgets) {
		// get doc info
		var docsInfo = [];
		var uniqueDbKeys = {};
		for (var wid in widgets) {
			docsInfo[docsInfo.length] = {
				docBuildGroup : widgets[wid].docBuildGroup,
				docSource : widgets[wid].docSource,
				docUrl : widgets[wid].docId
			};
			uniqueDbKeys[widgets[wid].dbKey] = {};
		}

		var keys = [];
		for (var key in uniqueDbKeys) {
			keys[keys.length] = key;
		}

		db.getMany(docsInfo, keys, function(data) {
			for (var wid in widgets) {
				var widget = widgets[wid];
				if (data[ widget.docId ] !== undefined) {
					// entry in database found
					widgets[wid].value = $.evalJSON(data[ widget.docId ][widget.dbKey][0].value);
					hideUnrated(widget);
					setRating($("#" + wid).children(".starRating"), widget.value.value);
					setTotalVotes($("#" + wid).find(".totalVotes"), widget.value.num);
				} else {
					showUnrated(widgets[wid]);
					setTotalVotes($("#" + wid).find(".totalVotes"), 0);
				}
			}
		});
	};

	function setTotalVotes(votesDiv, numTotalVotes) {
		if (votesDiv.length > 0) {
			votesDiv.html(getWidget(votesDiv).numVotesFormat.replace('@numvotes@', numTotalVotes));
		}
	};

	function buildHTML(widgets) {
		for (var wid in widgets) {
			var w = widgets[wid];
			if(w.readonly)
				break;

			// build the link sections (hover / click)
			var html = [];
			var sectionWidth = w.starWidth * w.increment;
			var numSections = (w.numStars / w.increment);
			for (var i = 0; i < numSections; i++) {
				html[html.length] = "<a style='width: ";
				html[html.length] = sectionWidth;
				html[html.length] = "px' href='#";
				html[html.length] = w.increment + (i * w.increment);
				html[html.length] = "'></a>";
			}

			$("#" + wid).find('div.sections').html(html.join(''));

			// build the unrated links
			$("#" + wid).children(".starRating").append("<div class='unrated' style='width: " + 
					w.starWidth * w.numStars + 
					"px'>"+mashupI18N.get("starRating","unrated")+"</div>");

			if (!w.rants || !w.rants[0]) {
				$("#" + wid).find(".starRating div.rant").remove();
			}
		}
	};
	
	function cleanup(){
		for (widget in widgets){
		//
		}
	};

	return {
		registerWidget: function(config) {
			// Split the rants on ';' into an array
			config.rants = config.rants.split(/\s*;\s*/g);
			widgets[config.widgetId] = config;
		},

		start: function() {
			
			//this.cleanup();
			
			db = new StorageClient('document');

			// Construct the hidden links that trigger the rating
			// Add the 'unrated' divs
			buildHTML(widgets);

			// Attach event listeners
			$('div.starRating div.sections a').mouseenter(onStarHoverIn);
			$('div.starRating div.sections a').mouseleave(onStarHoverOut);
			$('div.starRating div.sections a').click(onClickStar);

			refresh(widgets);
		}
	};

})(jQuery);
