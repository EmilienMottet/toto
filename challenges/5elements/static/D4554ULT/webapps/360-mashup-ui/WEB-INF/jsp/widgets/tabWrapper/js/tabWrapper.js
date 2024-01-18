(function() {

	var $opened = null;
	var timeout = null;

	var getMenu = function($menuContainer) {
		return $menuContainer.find('> ul');
	};

	var openMenu = function($menuContainer) {
		if ($menuContainer.hasClass('popup-menu-item') == false) {
			// if main menu then close any previously opened menu
			closeMenu();
			$opened = $menuContainer;
		}
		getMenu($menuContainer).show();
	};

	var closeMenu = function() {
		clearMenuTimeout();
		if ($opened != null) {
			getMenu($opened).hide();
			$opened = null;
		}
	};

	var clearMenuTimeout = function() {
		if (timeout != null) {
			clearTimeout(timeout);
			timeout = null;
		}
	};

	var setMenuTimeout = function() {
		timeout = setTimeout(function() {
			closeMenu();
		}, 400);
	};

	var getEventTarget = function(e) {
		try {
			var target = null;
			if (!e) e = window.event;
			if (e.target) target = e.target;
			else if (e.srcElement) target = e.srcElement;
			if (target.nodeType == 3) // defeat Safari bug
				target = target.parentNode;
			return $(target);
		} catch (e) {
		}
		return null;
	};

	var openTab = function($widgetContent, $li) {
		var $list = $li.closest('.widget-tabs-list');

		var currentTabId = $list.find('.active').removeClass('active').attr('data-tabId');
		if (currentTabId != undefined) {
			$widgetContent.find('> .container-' + currentTabId).addClass('widget-tab-hidden');
		}

		var tabId = $li.attr('data-tabId');
		if (tabId != undefined) {
			$widgetContent.find('> .container-' + tabId).removeClass('widget-tab-hidden');
			$list.find('.widget-tabs-active').html($li.html());
			$li.addClass('active');
		}
	};
	
	       
        var getCookiePath =  function() {
            var metas = document.getElementsByTagName('meta'); 
            for (i=0; i<metas.length; i++) { 
               if (metas[i].getAttribute('name') == 'baseurl') { 
                  return metas[i].getAttribute('content'); 
               } 
            } 
            return '/';
    };


	var loadStates = function() {
		var value = $.cookie('widget-tabs');
		if (value != undefined) {
			var ret = {};
			var values = value.split('|');
			for (var i = 0; i < values.length; i++) {
				var tmp = values[i].split(';');
				ret[tmp[0]] = tmp[1];
			}
			return ret;
		}
		return null;
	};

	var saveState = function(key, value) {
		var data = loadStates();
		if (data == null) {
			data = {};
		}

		data[key] = value;

		var tmp = [];
		for (var key in data) {
			if (data.hasOwnProperty(key)) {
				tmp.push(key + ';' + data[key]);
			}
		}

		$.cookie('widget-tabs', tmp.join('|'), { expires: 1, path: getCookiePath() });
	};

	var options = {};

	if (window.TabWrapper == undefined) {
		window.TabWrapper = {

			init: function(ucssid, opts) {
				options[ucssid] = opts || {};

				var $widget = $('.' + ucssid),
					$widgetContent = $widget.find('> .widgetContent');

				// sets tab width to 100%
				// need to use widget layout to split in several cells
				$widgetContent.find('> .widget-tab-container').css('width','100%');

				// load cookie-state (if enabled)
				var name = undefined;
				if (options[ucssid].saveState !== false) {
					var states = loadStates();
					name = exa.string.util.hashCode(exa.widget.getPath($widget[0])).toString(32);
					if (states != null && states[name] != undefined) {
						openTab($widgetContent, $widgetContent.find('> .widget-tabs-list-wrapper').find('.tab-' + states[name]));
					}
				}

				// open first tab if none opened yet (because hidden on the fly)
				if ($widgetContent.find('.widget-tabs-list').find('.active').length == 0) {
					openTab($widgetContent, $($widgetContent.find('> .widget-tabs-list-wrapper').find('.widget-tab')[0]));
				}

				// bind events
				$widgetContent.find('> .widget-tabs-list-wrapper')
					.on('mousedown', '.has-popup-menu', function(e) {
						if ((target = getEventTarget(e)) != null) {
							target = target.closest('.has-popup-menu');
							if (target.length > 0) {
								openMenu(target);
								return false;
							}
						}
					})
					.on('mouseup', '.popup-menu-item', function(e) {
						if ((target = getEventTarget(e)) != null) {
							if (target.hasClass('popup-menu-item')) {
								closeMenu();
								return false;
							}
						}
					})
					.on('mouseenter mouseleave', '.has-popup-menu', function(e) {
						// must have an opened menu to handle this
						if ($opened == null) {
							return;
						}

						var target = $(this);
						if (e.type == 'mouseenter') {
							if (target == $opened) {
								// re-enter the opened menu, simply clear timeout
								clearMenuTimeout();
							} else {
								// enter another menu which is not a submenu
								openMenu(target);
							}
						} else {
							// leave the current menu, set a timeout
							setMenuTimeout();
						}
					})
					.on('click', '.widget-tab', function(e) {
						openTab($widgetContent, $(this));
						if (name !== undefined) {
							saveState(name, $(this).attr('data-tabId'));
						}
					});
			},
			open: function(ucssid, idx) {
				var $widget = $('.' + ucssid);
				var $widgetContent = $widget.find('> .widgetContent');
				var $li = $widgetContent.find('.widget-tabs-list').find('.tab-' + idx);
				if ($li.length > 0) {
					openTab($widgetContent, $li);
					if (options[ucssid] != undefined && options[ucssid].saveState !== false) {
						var name = exa.string.util.hashCode(exa.widget.getPath($widget[0])).toString(32);
						saveState(name, idx);
					}
				}
			}
		};
	}
})();