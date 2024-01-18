<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>
<%@ taglib prefix="string" uri="http://www.exalead.com/jspapi/string" %>
<%@ taglib prefix="data" uri="http://www.exalead.com/jspapi/data" %>
<%@ taglib prefix="i18n" uri="http://www.exalead.com/jspapi/i18n" %>
<%@ taglib prefix="url" uri="http://www.exalead.com/jspapi/url" %>
<%@ taglib prefix="highcharts" uri="http://www.exalead.com/jspapi/highcharts" %>

<render:import varFeeds="feeds" parameters="chartContainerId" />

<config:getOption var="baseUrl" name="facetPageName" defaultValue=""/>
<config:getOption var="facetType" name="facetType" defaultValue="normal"/>
<config:getOption var="facetsList" name="facetsList" doEval="true" />
<config:getOptionsComposite var="serieConfiguration" name="basedOn" />
<config:getOptions var="forceRefineOnFeeds" name="forceRefineOnFeeds" />
<config:getOption var="nbSubFacets" name="nbSubFacets" defaultValue="0" />
<config:getOption var="showOthers" name="showOthers" defaultValue="true" />
<config:getOption var="sortMode" name="sortMode" defaultValue="default" />
<config:getOption var="strategy" name="strategy" defaultValue="compare" />
<config:getOption var="defaultYValue" name="defaultYValue" defaultValue="" />

<highcharts:line 
	var="data" 
	sortMode="${sortMode}"
	aggregations="${serieConfiguration}" 
	feeds="${feeds}"
	defaultYValue="${defaultYValue}"
	iterations="${nbSubFacets}" 
	showOthers="${showOthers}">
	<c:choose>
		<c:when test="${facetType == 'auto'}">
			<data:auto feeds="${feeds}" facets="${facetsList}" strategy="${strategy}" />
		</c:when>
		<c:when test="${facetType == 'legacy_2d'}">
			<data:legacy2D feeds="${feeds}" facet="${facetsList}" />
		</c:when>
		<c:when test="${facetType != 'normal'}">
			<data:matrix feeds="${feeds}" facet="${facetsList}" />
		</c:when>
		<c:when test="${strategy == 'compare'}">
			<data:compare feeds="${feeds}" facet="${facetsList}" />
		</c:when>
		<c:otherwise>
			<data:merge feeds="${feeds}" facets="${facetsList}" />
		</c:otherwise>
	</c:choose>
	<data:mashupUrlHelper baseUrl="${baseUrl}" feeds="${feeds}" forceRefineOn="${forceRefineOnFeeds}" />
</highcharts:line>

/* Chart Options */
var data = (<config:getOption name="dataProcessor" defaultValue="function(data) { return data; }" />)(${data});
var opts = $.extend(true, <config:getOption name="opts" />, data);
opts.chartImage = '<c:url value="/resources/highcharts/images/chart_pie.png" />';
opts.chartName = 'spiderChart';
opts.chartDisplayName = '<i18n:message code="spiderchart_name" javaScriptEscape="true" />';
opts.chartTitle = <string:escape escapeType="jsonValue"><config:getOption name="title" defaultValue="" /></string:escape>; /* Used for multipleCharts */
opts.chart.renderTo = '${chartContainerId}';
opts.plotOptions.series.baseUrl = <string:escape escapeType="jsonValue"><url:url value="${baseUrl}" feeds="${feeds}" xmlEscape="false" keepQueryString="true" forceRefineOn="${forceRefineOnFeeds}"><url:page value="1"/></url:url></string:escape>;
