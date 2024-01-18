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
<config:getOption var="strategy" name="strategy" defaultValue="compare" />

<highcharts:timeline
	var="data"
	aggregations="${serieConfiguration}" 
	feeds="${feeds}">
	<c:choose>
		<c:when test="${facetType != 'normal'}">
			<data:matrix feeds="${feeds}" facet="${facetsList}" iterationMode="LEAVES"/>
		</c:when>
		<c:otherwise>
			<c:choose>
				<c:when test="${strategy == 'compare'}">
					<data:compare feeds="${feeds}" facet="${facetsList}" iterationMode="LEAVES"/>
				</c:when>
				<c:otherwise>
					<data:merge feeds="${feeds}" facets="${facetsList}" iterationMode="LEAVES"/>
				</c:otherwise>
			</c:choose>
		</c:otherwise>
	</c:choose>
	<data:mashupUrlHelper baseUrl="${baseUrl}" feeds="${feeds}" forceRefineOn="${forceRefineOnFeeds}" />
</highcharts:timeline>

/* Chart Options */
var data = (<config:getOption name="dataProcessor" defaultValue="function(data) { return data; }" />)(${data});
var opts = $.extend(true, <config:getOption name="opts" />, data);
opts.xAxis.categories = null;
opts.xAxis.tickInterval = null;
opts.chartImage = '<c:url value="/resources/highcharts/images/chart_line.png" />';
opts.chartName = 'timeChart';
opts.chartDisplayName = '<i18n:message code="timechart_name" javaScriptEscape="true" />';
opts.chartTitle = <string:escape escapeType="jsonValue"><config:getOption name="title" defaultValue="" /></string:escape>; /* Used for multipleCharts */
opts.chart.renderTo = '${chartContainerId}';
opts.plotOptions.series.baseUrl = <string:escape escapeType="jsonValue"><url:url value="${baseUrl}" feeds="${feeds}" xmlEscape="false" keepQueryString="true" forceRefineOn="${forceRefineOnFeeds}"><url:page value="1"/></url:url></string:escape>;
