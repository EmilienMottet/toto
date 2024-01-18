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

<config:getOption var="baseUrl" name="facetPageName" defaultValue="" />
<config:getOption var="facetsList" name="facetsList" doEval="true" />
<config:getOptionComposite var="basedOn" name="basedOn" />
<config:getOptions var="forceRefineOnFeeds" name="forceRefineOnFeeds" />
<config:getOption var="nbSubFacets" name="nbSubFacets" defaultValue="0" />
<config:getOption var="showOthers" name="showOthers" defaultValue="true" />
<config:getOption var="sortMode" name="sortMode" defaultValue="default" />
<config:getOption var="categoryName" name="categoryName" defaultValue="\${category.description} (\${category.count})" doEval="false" />

<highcharts:pie var="data" aggregation="${basedOn[0]}" facet="${facetsList}" sortMode="${sortMode}" iterations="${nbSubFacets}" showOthers="${showOthers}" legend="${categoryName}">
	<data:merge feeds="${feeds}" facets="${facetsList}"/>
	<data:mashupUrlHelper baseUrl="${baseUrl}" feeds="${feeds}" forceRefineOn="${forceRefineOnFeeds}" />
</highcharts:pie>
<%-- <highcharts:json --%>
<%-- 	var="data" --%>
<%-- 	feeds="${feeds}" --%>
<%-- 	x="${facetsList}" --%>
<%-- 	y="${serieConfiguration}" --%>
<%-- 	forceRefineOn="${forceRefineOnFeeds}" --%>
<%-- 	iterations="${nbSubFacets}" --%>
<%-- 	showOthers="${showOthers}" --%>
<%-- 	sortMode="${sortMode}" --%>
<%-- 	strategy="merge" --%>
<%-- 	categoryName="${categoryName}" --%>
<%-- 	baseUrl="${baseUrl}" /> --%>

/* Chart Options */
var data = (<config:getOption name="dataProcessor" defaultValue="function(data) { return data; }" />)(${data});
var opts = $.extend(true, <config:getOption name="opts" />, data);
opts.chartImage = '<c:url value="/resources/highcharts/images/chart_pie.png" />';
opts.chartName = 'pieChart';
opts.chartDisplayName = '<i18n:message code="piechart_name" javaScriptEscape="true" />';
opts.chartTitle = <string:escape escapeType="jsonValue"><config:getOption name="title" defaultValue="" /></string:escape>; /* Used for multipleCharts */
opts.chart.renderTo = '${chartContainerId}';
opts.plotOptions.series.baseUrl = <string:escape escapeType="jsonValue"><url:url value="${baseUrl}" feeds="${feeds}" xmlEscape="false" keepQueryString="true" forceRefineOn="${forceRefineOnFeeds}"><url:page value="1"/></url:url></string:escape>;
