$(document).ready(function() {
	var debugMode = null;
	var $debugBar = $('<div></div>').attr('id', 'debugBar');
	$('<div>Debug: </div>').appendTo($debugBar);
	var $buttonWrapper = $('<div></div>');

	function onClick(opt) {
		opt = $.extend({
			nodeName: 'i18n',
			createDebugMode: function() {
				return new I18N();
			}
		}, opt);

		if (debugMode != null) {
			$('#debugBar .button').removeClass('selected');
			debugMode.get().reset();
			if (debugMode.get().options.nodeName == opt.nodeName) {
				debugMode = null;
				return false;
			}
		}
		$(this).addClass('selected');

		debugMode = opt.createDebugMode();
		debugMode.get().highlightAll();
		return false;
	}

	$('<a class="button"> I18N </a>').bind('click', function() {
		return onClick.call(this, {
			nodeName: 'i18n',
			createDebugMode: function() {
				return new I18N();
			}
		});
	}).appendTo($buttonWrapper);

	$('<a class="button"> Widgets </a>').bind('click', function() {
		return onClick.call(this, {
			nodeName: 'widget',
			createDebugMode: function() {
				return new Widget();
			}
		});
	}).appendTo($buttonWrapper);

	$('<a class="button"> Templates </a>').bind('click', function() {
		return onClick.call(this, {
			nodeName: 'template',
			createDebugMode: function() {
				return new Template();
			}
		});
	}).appendTo($buttonWrapper);

	if (window.debugMode_reporting != null) {
		$('<a class="button"> Timeline </a>').bind('click', function() {
			return onClick.call(this, {
				nodeName: 'timeline',
				createDebugMode: function() {
					return new Timeline();
				}
			});
		}).appendTo($buttonWrapper);
	}

	$buttonWrapper.appendTo($debugBar);

	$('<span class="nodeFound"></span>').appendTo($debugBar);

	var countries = [ "XX", "FR", "EN", "AB", "AA", "AF", "SQ", "AM", "AR", "HY", "AS",
			"AY", "AZ", "BA", "EU", "BN", "DZ", "BH", "BI", "BR", "BG",
			"MY", "BE", "KM", "CA", "ZH", "CO", "HR", "CS", "DA", "NL",
			"EN", "EO", "ET", "FO", "FJ", "FI", "FR", "FY", "GD", "GL",
			"KA", "DE", "EL", "KL", "GN", "GU", "HA", "IW", "HI", "HU",
			"IS", "IN", "IA", "IE", "IK", "GA", "IT", "JA", "JW", "KN",
			"KS", "KK", "RW", "KY", "RN", "KO", "KU", "LO", "LA", "LV",
			"LN", "LT", "MK", "MG", "MS", "ML", "MT", "MI", "MR", "MO",
			"MN", "NA", "NE", "NO", "OC", "OR", "OM", "PS", "FA", "PL",
			"PT", "PA", "QU", "RM", "RO", "RU", "SM", "SG", "SA", "SR",
			"SH", "ST", "TN", "SN", "SD", "SI", "SS", "SK", "SL", "SO",
			"ES", "SU", "SW", "SV", "TL", "TG", "TA", "TT", "TE", "TH",
			"BO", "TI", "TO", "TS", "TR", "TK", "TW", "UK", "UR", "UZ",
			"VI", "VO", "CY", "WO", "XH", "JI", "YO" ];

	var languages = [ "-- ALL --", "French", "English", "Abkhazian", "Afar", "Afrikaans", "Albanian",
			"Amharic", "Arabic", "Armenian", "Assamese", "Aymara",
			"Azerbaijani", "Bashkir", "Basque", "Bengali, Bangla",
			"Bhutani", "Bihari", "Bislama", "Breton", "Bulgarian",
			"Burmese", "Byelorussian", "Cambodian", "Catalan",
			"Chinese", "Corsican", "Croatian", "Czech", "Danish",
			"Dutch", "English, American", "Esperanto", "Estonian",
			"Faeroese", "Fiji", "Finnish", "French", "Frisian",
			"Gaelic (Scots Gaelic)", "Galician", "Georgian", "German",
			"Greek", "Greenlandic", "Guarani", "Gujarati", "Hausa",
			"Hebrew", "Hindi", "Hungarian", "Icelandic", "Indonesian",
			"Interlingua", "Interlingue", "Inupiak", "Irish",
			"Italian", "Japanese", "Javanese", "Kannada", "Kashmiri",
			"Kazakh", "Kinyarwanda", "Kirghiz", "Kirundi", "Korean",
			"Kurdish", "Laothian", "Latin", "Latvian, Lettish",
			"Lingala", "Lithuanian", "Macedonian", "Malagasy", "Malay",
			"Malayalam", "Maltese", "Maori", "Marathi", "Moldavian",
			"Mongolian", "Nauru", "Nepali", "Norwegian", "Occitan",
			"Oriya", "Oromo, Afan", "Pashto, Pushto", "Persian",
			"Polish", "Portuguese", "Punjabi", "Quechua",
			"Rhaeto-Romance", "Romanian", "Russian", "Samoan",
			"Sangro", "Sanskrit", "Serbian", "Serbo-Croatian",
			"Sesotho", "Setswana", "Shona", "Sindhi", "Singhalese",
			"Siswati", "Slovak", "Slovenian", "Somali", "Spanish",
			"Sudanese", "Swahili", "Swedish", "Tagalog", "Tajik",
			"Tamil", "Tatar", "Tegulu", "Thai", "Tibetan", "Tigrinya",
			"Tonga", "Tsonga", "Turkish", "Turkmen", "Twi",
			"Ukrainian", "Urdu", "Uzbek", "Vietnamese", "Volapuk",
			"Welsh", "Wolof", "Xhosa", "Yiddish", "Yoruba" ];

	var select = '<select>';
	for (var i = 0; i < countries.length; i++) {
		var isSelected = (countries[i].toUpperCase() === window.mashup.lang.toUpperCase() ? 'selected="selected"' : '');
		select += '<option value="'+window.mashup.baseUrl+'/lang/'+countries[i]+'" '+isSelected+'>'+languages[i]+'</option>';
	}
	select += '</select>';
	$select = $(select);
	$select.appendTo($debugBar);
	$select.bind('change', function() {
		var path = $(this).val(), gotoUrl = new BuildUrl(window.location.href.substr(window.location.href.indexOf('/page/'))).addParameter('l', path.substr(path.lastIndexOf('/') + 1), true);
		window.location.href = new BuildUrl(path).addParameter('goto', gotoUrl.toString()).toString();
		return false;
	});

	$('body').append($debugBar);

	var feedErrors = FeedDebugger.getErrors();
	if (feedErrors.length > 0) {
		var $feedErrorsBar = $('<ul></ul>').attr('id', 'feedErrorsBar');
		for (var i = 0; i < feedErrors.length; i ++) {
			$feedErrorsBar.append('<li><b>'+feedErrors[i].id+'</b>'+feedErrors[i].message+'</li>');
		}
		$('body').append($feedErrorsBar);
	}

});

/*
 * Debug mode
 */
function DebugMode(options) {
	this.options = $.extend({
		nodeName: 'i18n',
		nodeType: 'span',
		cssClass: 'debugMode',
		init: function()  {
		},
		highlight: function(ret, $span) {
			if (ret.json) {
				$('<div class="debugModeTemplatePopup">'+ret.json.template+'</div>').prependTo($span);
			}
		},
		onClick: function() {
			return false;
		},
		reset: function() {
			$('.debugModeTemplatePopup').remove();
		}
	}, options);

	this.comments = this._findComments(this.options.nodeName);
	$('#debugBar > .nodeFound').html(this.comments.length + ' ' + this.options.nodeName + ' nodes found');
	//$('body').click($.proxy(this.options.onClick, this));
	//console.log(this.comments.length, this.options.nodeName, 'comment nodes found');
}

DebugMode.prototype._findComments = function(nodeName) {
	return $("*").contents().filter(
		function() { return this.nodeType == 8; }
	).filter(
		function() { return $.trim(this.nodeValue).lastIndexOf(nodeName, 0) === 0; }
	);
};

DebugMode.prototype._findClosingNode = function(node) {
	var ret = {
		startingNode: node,
		closingNode: null,
		wrappedNodes: []
	};
	try {
		var json = $.trim(ret.startingNode.nodeValue).substring(this.options.nodeName.length);
		ret.json = $.parseJSON(decodeURIComponent(json));
	} catch (e) {
		ret.json = null;
		//console.warn(e);
	}

	while ((node = node.nextSibling)) {
		if (node.nodeType === 8 && $.trim(node.nodeValue).lastIndexOf('/'+this.options.nodeName, 0) === 0) {
			ret.closingNode = node;
			return ret;
		} else {
			ret.wrappedNodes.push(node);
		}
	}
	return null;
};

DebugMode.prototype.highlightAll = function() {
	for  (var i = 0; i < this.comments.length; i++) {
		try {
			this.highlight(this.comments[i]);
		} catch (e) {
			//console.warn(e);
		}
	}
	this.options.init.call(this);
};

DebugMode.prototype.highlight = function(startingNode) {
	var ret = this._findClosingNode(startingNode);
	if (ret == null) {
		return;
	}
//	console.log('StartingNode', startingNode.nodeValue, startingNode);
//	console.log(ret.wrappedNodes.length, 'wrapped nodes', ret.wrappedNodes);
//	console.log('ClosingNode', ret.closingNode.nodeValue, ret.closingNode);

	for  (var i = 0; i < ret.wrappedNodes.length; i++) {
		$(ret.wrappedNodes[i]).remove();
	}
	var $span = $('<'+this.options.nodeType+' class="debugMode '+this.options.cssClass+'"></'+this.options.nodeType+'>');
	$span.append(ret.wrappedNodes);
	$span.insertAfter(startingNode);
	
	$span.parent().addClass('debugModeContainer');

	this.options.highlight.call(this, ret, $span);
};

DebugMode.prototype.reset = function() {
	this.options.reset.call(this);

	$('.debugMode').each(function() {
		var $debugMode = $(this);
		$debugMode.contents().each(function() {
			$(this).insertBefore($debugMode);
		});
	}).remove();
	$('#debugBar > .nodeFound').empty();
};

/*
 * Widget
 */
function Widget() {
	this.debugMode = new DebugMode({
		nodeName: 'widget',
		nodeType: 'div',
		cssClass: 'debugModeWidget',
		init: function() {
		    
		},
		onClick: function() {
		    // do not intercept click events
		},
		highlight: function(ret, $span) {
			if (ret.json !== undefined) {
				var content = 'Widget: <span>' + ret.json.id + '</span>';
				content += '<div class="moreInfo">';

				if (ret.json.wuid !== undefined) {
					content += 'WUID: <span>' + ret.json.wuid + '</span><br />';
				}

				if (ret.json.template !== undefined) {
					content += 'Template: <span>' + ret.json.template + '</span><br />';
				}

				if (ret.json.feeds === undefined) {
				} else if (ret.json.feeds.length == 0) {
					content += 'Feeds: <span>none</span><br />';
				} else {
					content += 'Feeds:<ul>';
					for (var i = 0; i < ret.json.feeds.length; i++) {
						content += '<li><span>' + ret.json.feeds[i].id + ' <a href="'+ret.json.feeds[i].uri+'" target="_blank">Open XML</a> <a href="'+ret.json.feeds[i].uri+'?outputFormat=json" target="_blank">Open JSON</a></span></li>';
					}
					content += '</ul>';
				}

				if (ret.json.ucssid !== undefined) {
					var client = new MashupAjaxClient($span, {spinner: false});
					client.addWidget(ret.json.ucssid);
					var ajaxUrl = client.getAjaxUrl().toString();
					content += 'Ajax URL: <span><a href="'+ajaxUrl+'" target="_blank">Open AJAX URL</a></span><br />';
				}
				content += '</div>';

				$('<div class="debugModeWidgetPopup">'+content+'</div>').prependTo($span);
			}
		},
		reset: function() {
			$('.debugModeWidgetPopup').remove();
		}
	});
}

Widget.prototype.get = function() {
	return this.debugMode;
};

/*
 * i18n
 */
function I18N() {
	var _this = this;
	this.debugMode = new DebugMode({
		nodeName: 'i18n',
		nodeType: 'span',
		cssClass: 'debugModeI18N',
		init: function() {
			$('.debugMode-jsKeys').show();

			var $popups = $('body').find('.debugModeI18N');

			$popups.on({
				click: function() {
					return false;
				},
				mouseenter: function() {
                    _this.debugMode.setPopup($(this).find('.debugModeI18NPopup'));
				},
				mouseleave: function() {
                    _this.debugMode.setPopup(null);
				}
			});

			$popups.find('.input-text').on('keyup', function(e) {
				if (e.keyCode == '13') {
					$(this).next().click();
				}
			});

			$popups.find('.input-button').on('click', function() {
				var $inputButton = $(this);
				$inputButton.attr('disabled', 'disabled');
				$inputButton.val('Saving ...');

				var $popup = $inputButton.closest('div');

				var $inputText = $popup.find('.input-text');
				$inputText.attr('disabled', 'disabled');
				var value = $inputText.val();
				if (value.length > 0) {
					var code = $popup.attr('data-code');
					var $span =  $popup.parent();
					// message cannot be empty
					_this.save(code, value, function() {
						// redraw the span
						$span.html(value);
						_this.get().options.highlight({
							json: {
								overriden: 6,
								code: code,
								msg: value
							}
						}, $span);
					}, function() {
						$popup.html('<span>an error occured</span>');
					});
				}
				return false;
			});
		},
		highlight: function(ret, $span) {
			if (ret.json) {
				var content = ret.json.code;

				if (ret.json.overriden == 1) {
					content += ' <b style="font-size:9px;">(overriden in <u>global</u>)</b>';
				} else if (ret.json.overriden == 2) {
					content += ' <b style="font-size:9px;">(overriden in widget <u>'+ret.json.useWidgetId+'</u>)</b>';
				} else if (ret.json.overriden == 3) {
					content += ' <b style="font-size:9px;">(overriden in widget <u>'+ret.json.useWidgetId+'</u>)</b>';
				} else if (ret.json.overriden == 4) {
					content += ' <b style="font-size:9px;">(undefined in widget <u>'+ret.json.useWidgetId+'</u>)</b>';
				} else if (ret.json.overriden == 5) {
					content += ' <b style="font-size:9px;">(undefined in <u>global</u>)</b>';
				} else if (ret.json.overriden == 6) {
					content += ' <b style="font-size:9px;">(overriden in <u>MashupI18N.xml</u>)</b>';
				}

				content += '<br /><input class="input-text" type="text" value="'+ret.json.msg+'" /><input class="input-button" type="button" value="Save" />';

				$('<div class="debugModeI18NPopup" data-default="'+escape(ret.json.msg)+'" data-code="'+ret.json.code+'">'+content+'</div>').prependTo($span);
			}
		},
		onClick: function(e) {
			_this.debugMode.setPopup(null);
			return false;
		},
		reset: function() {
			$('.debugMode-jsKeys').hide();
			$('.debugModeI18NPopup').remove();
		}
	});

	this.debugMode.closePopup = function() {
		if (this.$popup != undefined) {
			this.$popup.css('display', 'none');
			this.$popup.find('.input-text').val(unescape(this.$popup.attr('data-default')));
			this.$popup = null;
		}
	};

	this.debugMode.setPopup = function($popup) {
		if ($popup == null) {
			this.closePopup();
		} else {
			if (this.$popup != undefined) {
				if (this.$popup[0] == $popup[0]) {
					return;
				} else {
					this.closePopup();
				}
			}

			this.$popup = $popup;
			this.$popup.css('display', 'block');
		}
	};
}

I18N.prototype.get = function() {
	return this.debugMode;
};

I18N.prototype.save = function(code, message, callback, errorCallback) {
	var _this = this;
	var baseurl =  $('meta[name=baseurl]').attr('content');                                                                                                                                                                              
	if (baseurl === "/") {                                                                                                                                                                                                               
		baseurl = "";                                                                                                                                                                                                                
	}
	$.ajax({
		type: "POST",
		url: baseurl + "/lang/edit",
		data: "message=" + encodeURIComponent(message) + "&code=" + encodeURIComponent(code),

		/* Save Succeed */
		success: function(data, textStatus) {
			callback.call(_this);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			errorCallback.call(_this);
		}
	});
};

/*
 * Template
 */
function Template() {
	this.debugMode = new DebugMode({
		nodeName: 'template',
		nodeType: 'div',
		cssClass: 'debugModeTemplate',
		init: function() {
		},
		highlight: function(ret, $span) {
			if (ret.json) {
				$('<div class="debugModeTemplatePopup">'+ret.json.template+'</div>').prependTo($span);
			}
		},
		reset: function() {
			$('.debugModeTemplatePopup').remove();
		}
	});
}

Template.prototype.get = function() {
	return this.debugMode;
};

function Timeline() {
	this.debugMode = new DebugMode({
		nodeName: 'timeline',
		nodeType: 'div',
		cssClass: 'debugModeTimeline',
		init: function() {			
			
			
			var pageStartTime = 0;	
			
			var formatTime = function(microseconds){
				var formatted;
				if(microseconds < 1000)
					formatted = microseconds + " µs";
				else if(microseconds < 1000000)
					formatted = Math.round(microseconds / 1000) + " ms";
				else
					formatted = Math.floor(microseconds / 1000000, 2) + " s";
				
				return formatted;
			};
			
			var renderRow = function(report, path, level){
				if(pageStartTime == 0)
					pageStartTime = report.timeStart;
				
				var row = "<tr class=\"expanded level-"+level + "\" data-path=\""+path+"\">";
				row += "<td class=\"row-title\">";
				row += "<div";
				if(report.subReports.length > 0){
					row += " class=\"toggle-node\">";
					row += "<span class=\"expand\">\u25BA</span><span>\u25BC</span>";
				}
				else
					row +=">";
				row += "</div>";
				
				row += "<span class=\"title\">"+report.componentType +"</span></td>";
				row += "<td>" +report.componentName +"</td>";
				row += "<td>" +report.componentEvent +"</td>";
				row +="<td>" + formatTime(report.elapsedCPU) +"</td>";
				row += "<td>" + formatTime(report.elapsedTime) +"</td>";
				row += "<td class=\"time-info\"><div class=\"elapsed "+report.source+"\" style=\"margin-left:" + (report.timeStart - pageStartTime) / 1000000 + "px;width:"+ (report.elapsedTime / 1000) +"px\"></span></div></td>";
				row += "</tr>";
				return row;
			};
			
			var renderReport = function(report, path, level) {
				var reportHtlm = renderRow(report, path, level);
				for(var i=0; i< report.subReports.length;i++) {
					reportHtlm += renderReport(report.subReports[i], path + "_" + i, level +1);
				}
				return reportHtlm;
			};
			
			var $timeline = $('<div>');
			$timeline.addClass("debugModeTimelinePopup");

			var html = "<table class=\"data-table\">";
			html += "<tr><th>Type</th><th>Name</th><th>Event</th><th>Elapsed CPU</th><th>Elapsed Time</th><th>Timeline</th></tr>";
			html += "<tr><td colspan=\"5\"></td><td class=\"timeline-header\">";
			
			//Generates time axis with ms
			for(var i =100; i< window.debugMode_reporting.elapsedTime / 1000 ; i+=100){
				html += "<div class=\"time-marker\"><span>"+i+"</span></div>";
			}

			html += "</td></tr>";
			html += renderReport(window.debugMode_reporting, "0", 0);
			html += "</table>";
			
			$timeline.html(html);
			
			$timeline.find(".toggle-node").click(function(){
				$row = $(this).closest('tr');
				$row.toggleClass("expanded").toggleClass("collapsed");
				if($row.hasClass("collapsed")) {
					$("tr[data-path^='"+$row.attr("data-path")+"_']").hide();
				}
				else {
					$("tr[data-path^='"+$row.attr("data-path")+"_']").show();
					$("tr.collapsed").each(function() {
						$("tr[data-path^='"+$(this).attr("data-path")+"_']").hide();
					});
				}
				$(this).find("span").toggle();
			});
			
			$timeline.appendTo($('body'));
		},
		highlight: function(ret, $span) {
		},
		reset: function() {
			$('.debugModeTimelinePopup').remove();
		}
	});
}

Timeline.prototype.get = function() {
	return this.debugMode;
};

var FeedDebugger = (function () {
	var errors = [];

	return {
		getErrors: function () {
			return errors;
		},
		addError: function (e) {
			errors.push(e);
		}
	};
})();
