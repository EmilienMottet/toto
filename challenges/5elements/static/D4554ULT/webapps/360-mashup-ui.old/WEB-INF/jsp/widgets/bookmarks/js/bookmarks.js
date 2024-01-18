(function($) {
	var defaults = {
		className : 'tag',
		classEmptyStar : 'bookmarks-empty-star',
		classFullStar : 'bookmarks-full-star',
		classWaitingStar : 'bookmarks-waiting-star',
		selector : 'h3.rounded-top',
		scope : 'shared',
		storageKey : 'bookmarks[]',
		action : '',
		wuid : ''
	};

	var Bookmarks = function(base, wuid, feedEntries, userOptions) {
		var options = {};
		$.extend(options, defaults, userOptions);
		var self = this;
		var entries = {};
		var db = null;

		var init = function() {

			options.wuid = wuid;
			db = new StorageClient(options.scope);
			exa.io.share('exa.io.HitDecorationInterface', wuid, exa.getInterface(exa.io.HitDecorationInterface, {
				getDecoration: function (id) {
					return '<span class="'+ options.wuid +' bookmarks-star bookmarks-star-' + id + '"><div></div></span>';
				},
				afterDecorating: function(id){
					//register event on previously created star
					$('.' + options.wuid + '.bookmarks-star-' + id).click(function() {
						self.addOrDeleteBookmark($(this), entries[id]);
						self.waitForIt($(this));
					});
				}
			}));
			
			feedEntries = feedEntries || [];
			$.each(feedEntries, function(i, entry) {
				self.registerEntry(entry);
			});
			//Retrieve existing bookmarks
			self.getStoredBookmarks();
		};

		this.registerEntry = function(entry) {
			if (typeof(entry) !== 'object') {
				throw new Exception("Entry should be an object { cleanEntryId: '', display: '', data : { } }");
			}
			entries[entry.cleanEntryId] = $.toJSON(entry);
		};

		this.addOrDeleteBookmark = function($star, value) {
			var key = $star.data('key');
			if (typeof(key) !== 'undefined') {
				$star.removeData('key');
				self.removeBookmark(key);
			}
			else {
				self.addBookmark(value);
			}
		};

		this.addBookmark = function(value) {
			db.set(options.storageKey, value, function() {
				self.getStoredBookmarks();
			}, self.callBackerror);
		};

		this.removeBookmark = function(key) {
			db.del(key, function() {
				self.getStoredBookmarks();
			}, self.callBackerror);
		};

		this.getStoredBookmarks = function() {
			db.get(options.storageKey, function(items) {
				self.RefreshUI(items);
			}, self.callBackerror);
		};

		this.RefreshUI = function(bookmarks) {
			//all star entries are set to empty
			for (var entryId in entries) {
				if (entries.hasOwnProperty(entryId)) {
					$('.' + options.wuid + '.bookmarks-star-' + entryId).removeClass(options.classFullStar).removeClass(options.classWaitingStar).addClass(options.classEmptyStar);
				}
			}

			var $base = $(base);
			$base.find(".bookmarks-list").html('<ul></ul>');
			var $ul = $base.find(".bookmarks-list ul");
			//display bookmark list
			for (var i = 0; i < bookmarks.length; i++) {
				var realKey = bookmarks[i].key;
				var bmData = $.evalJSON(bookmarks[i].value);

				var $hitStar = $('.'+options.wuid+'.bookmarks-star-' + bmData.cleanEntryId);
				if ($hitStar.length) {//hitstar Found : this bookmarked document is on this page
					//we keep the internal storage key for this entry && we flag it as Bookmarked
					$hitStar.data('key',realKey).removeClass(options.classEmptyStar).addClass(options.classFullStar);
					if (options.action != '') {
						li ='<li class="nearBookmark"><a href="'+self.getBookmarkUrl(options.action, bmData.data)+'">'+ bmData.display +'</a>';
					} else {
						li ='<li class="nearBookmark"><a href="#'+bmData.cleanEntryId+'">'+ bmData.display +'</a>';
					}
				}
				else {
					li = '<li><a href="'+self.getBookmarkUrl(options.action, bmData.data)+'">'+ unescape(bmData.display) +'</a>';
				}

				li += '&nbsp;<a class="cross">\u00D7</a></li>';
				$(li).addClass("item").data('skey',realKey).appendTo($ul);
			}

			if(bookmarks.length == 0){
				$("<li class=\"empty-data\">"+mashupI18N.get('bookmarks', 'no-bookmark')+"</li>").appendTo($ul);
			}
			$base.find(options.countSelector).html("("+bookmarks.length+")");

			$base.find(".bookmarks-list li a.cross").click(function(){
				self.removeBookmark($(this).closest("li").data('skey'));
			});
		};

		this.getBookmarkUrl = function(baseUrl, data) {
			return baseUrl += (baseUrl.indexOf('?') == '-1' ? '?' : '&') + $.param(data);
		};

		this.waitForIt = function(jquery) {
			jquery.toggleClass(options.classWaitingStar);
		};

		this.callBackError = function(evt, args) {
			alert(args.responseText);
		};

		init();
	};
	$.fn.bookmarks = function(wuid, feedEntries, options) {
		this.each(function() {
			this.bookmarks = new Bookmarks(this, wuid, feedEntries, options);
		});
		return this;
	};
}(jQuery));