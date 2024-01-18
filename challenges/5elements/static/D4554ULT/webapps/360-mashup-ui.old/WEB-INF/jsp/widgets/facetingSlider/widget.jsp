<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>
<%@ taglib prefix="string" uri="http://www.exalead.com/jspapi/string" %>
<%@ taglib prefix="url" uri="http://www.exalead.com/jspapi/url" %>
<%@ taglib prefix="request" uri="http://www.exalead.com/jspapi/request" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>

<render:import varWidget="widget" varFeeds="feeds"/>

<widget:widget varCssId="cssId" extraCss="exa-faceting-slider">
	
	<config:getOption name="pattern" var="pattern" />
	<config:getOption name="step" var="step" defaultValue="1" />
	<config:getOptions var="forceRefineOnFeeds" name="forceRefineOnFeeds" />
	
	<search:forEachFeed feeds="${feeds}" var="feed" varStatus="status">
		<search:getFacet var="facet" facetId="${widget.wuid}_numerical_facet" feed="${feed}" />
		<search:getFacetValue var="tmp_min_facet" name="min" facet="${facet}" defaultValue="0"/>
		<search:getFacetValue var="tmp_max_facet" name="max" facet="${facet}" defaultValue="0"/>
		<c:if test="${status.first || tmp_min_facet < min_facet}"><c:set var="min_facet" value="${tmp_min_facet}"/></c:if>
		<c:if test="${status.first || tmp_max_facet > max_facet}"><c:set var="max_facet" value="${tmp_max_facet}"/></c:if>		
	</search:forEachFeed>
	
	<request:getParameterValue var="min_val" widget="${widget}" name="min" defaultValue="${min_facet}" />
	<request:getParameterValue var="max_val" widget="${widget}" name="max" defaultValue="${max_facet}" />
	
	<url:url var="target_url" keepQueryString="true" xmlEscape="false" feeds="${feeds}">
		<url:page />
		<url:parameter widget="${widget}" name="min" value="" override="true"/>
		<url:parameter widget="${widget}" name="max" value="" override="true"/>
	</url:url>

	<c:if test="${min_val < min_facet}"><c:set var="min_val" value="${min_facet}"/></c:if>
	<c:if test="${max_val > max_facet}"><c:set var="max_val" value="${max_facet}"/></c:if>
	
	<fmt:parseNumber var="min_val" value="${min_val}" parseLocale="en_US" />
	<fmt:parseNumber var="max_val" value="${max_val}" parseLocale="en_US"/>
	<fmt:parseNumber var="min_facet" value="${min_facet}" parseLocale="en_US"/>
	<fmt:parseNumber var="max_facet" value="${max_facet}" parseLocale="en_US"/>
	
	<c:set var="range" value="${fn:replace(pattern, '%{MIN}', min_val)}" />
	<c:set var="range" value="${fn:replace(range, '%{MAX}', max_val)}" />
	
	<span id="${cssId}_range" class="exa-slider-range">${range}</span>	
	<div id="${cssId}_slider"></div>
	<div class="exa-filter-button">
		<a id="${cssId}_filter" class="exa-button">Filter</a>
	</div>

	<render:renderScript position="READY">
		
		(function () {
			var url = new BuildUrl('${target_url}');
			<search:forEachFeed var="feed" feeds="${feeds}">
				url.clearRefinements('${feed.id}', '${facet.id}');
			</search:forEachFeed>
			<c:if test="${forceRefineOnFeeds != null}">
				<c:forEach var="feedId" items="${forceRefineOnFeeds}">
					url.clearRefinements('${feedId}', '${facet.id}');
				</c:forEach>
			</c:if>
			
			function formatRange(min, max) {				
				var range = '<string:escape>${pattern}</string:escape>'.replace('%{MIN}', min);
				range = range.replace('%{MAX}', max);
				return range;		
			}
			
			$('#${cssId}_slider').slider({
				range:true,
				min:${min_facet},
				max:${max_facet},
				values:[${min_val},${max_val}],
				step:${step},
				create: function () {
					var handlers = $(this).find('.ui-slider-handle');
					handlers[0].innerHTML = '<div class="exa-slider-tooltip">${min_val}</div>';
					handlers[1].innerHTML = '<div class="exa-slider-tooltip">${max_val}</div>';
				},
				change: function(event, ui) {
					var values = $(this).slider("values"),
						handlers = $(this).find('.ui-slider-handle');							
						
					$('#${cssId}_range').html(formatRange(values[0], values[1]));
					
					if (values[0] == ${min_facet}) {
						url.removeParameter('w\$${widget.wuid}.min');
					} else {
						url.addParameter('w\$${widget.wuid}.min', values[0], true);
					}
					
					if (values[1] == ${max_facet}) {
						url.removeParameter('w\$${widget.wuid}.max');
					} else { 						
						url.addParameter('w\$${widget.wuid}.max', values[1], true);
					}
															
					$('#${cssId}_filter').attr('href', url.toString());					
					
					handlers[0].innerHTML = '<div class="exa-slider-tooltip">'+values[0]+'</div>';
					handlers[1].innerHTML = '<div class="exa-slider-tooltip">'+values[1]+'</div>';
				},
				slide: function(event, ui) {
					var values = $(this).slider("values"),
						handlers = $(this).find('.ui-slider-handle');
					$('#${cssId}_range').html(formatRange(values[0], values[1]));
					
					handlers[0].innerHTML = '<div class="exa-slider-tooltip">'+values[0]+'</div>';
					handlers[1].innerHTML = '<div class="exa-slider-tooltip">'+values[1]+'</div>';
				}
			});
			
		})();
	
	</render:renderScript>
	
</widget:widget>
