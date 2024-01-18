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

	$(document).ready(function() {
		$('.wuid.header')
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
			.each(function() {
				$(this).find('.header-widgets').css('right', $(this).find('.header-right').outerWidth());
			});
	});
})();