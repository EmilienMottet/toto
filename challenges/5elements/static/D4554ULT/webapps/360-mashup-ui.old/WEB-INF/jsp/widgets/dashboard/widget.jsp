<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="i18n" uri="http://www.exalead.com/jspapi/i18n" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="string" uri="http://www.exalead.com/jspapi/string" %>
<%@ taglib prefix="security" uri="http://www.exalead.com/jspapi/security" %>

<render:import varWidget="widget" varFeeds="feeds" />

<config:getOption var="dashboardId" name="dashboardId" defaultValue="${widget.wuid}" />

<widget:widget extraCss="highcharts dashboard">

	<widget:header htmlTag="div">
		<div id="options_${dashboardId}" class="options">
			<a href="#" name="editDashboard"><i18n:message code="edit" text="edit" htmlEscape="true" /></a>
		</div>
		<h2><config:getOption name="title" defaultValue="" /></h2>
	</widget:header>

	<widget:content>
		<c:choose>

			<%-- IF there are no feeds at all --%>
			<c:when test="${search:hasFeeds(feeds) == false}">
				<render:definition name="noFeeds">
					<render:parameter name="widget" value="${widget}" />
					<render:parameter name="showSuggestion" value="false" />
				</render:definition>
			</c:when>

			<c:otherwise>
				<render:renderScript position="READY">
						var chartsConfigs = {};

						<config:getOptionsComposite name="facets" var="facets" />
						<c:forEach var="option" items="${facets}">

							<%-- FIXME: sould not override options --%>
							<config:setOption name="facetsList" component="${widget}" value="${option[0]}"/>
							<config:setOption name="facetType" component="${widget}" value="${option[1]}"/>

							<c:set var="noResults" value="true" />
							<search:forEachFacet
								var="facet"
								filterMode="include"
								feeds="${feeds}"
								facetsList="${option[0]}">
								<c:remove var="noResults" />

								var facet = {};

								<render:template template="javascript.jsp" widget="pieChart">
									<render:parameter name="chartContainerId" value="" />
								</render:template>
								opts.chart.defaultSeriesType = 'pie';
								facet.pieChart = { opts: opts };

								<render:template template="javascript.jsp" widget="stackedColumnChart">
									<render:parameter name="chartContainerId" value="" />
								</render:template>
								opts.chart.defaultSeriesType = 'column';
								facet.stackedColumnChart = { opts: opts };

								<render:template template="javascript.jsp" widget="lineChart">
									<render:parameter name="chartContainerId" value="" />
								</render:template>
								opts.chart.defaultSeriesType = 'spline';
								facet.lineChart = { opts: opts };

								<render:template template="javascript.jsp" widget="tableChart">
									<render:parameter name="chartContainerId" value="" />
								</render:template>
								opts.chart.defaultSeriesType = 'table';
								facet.tableChart = { opts: opts };

								chartsConfigs['${facet.description}'] = facet;
							</search:forEachFacet>
						</c:forEach>

						<c:if test="${noResults == null}">
							<config:getOption var="chartWidth" name="chartWidth" defaultValue="" />
							<config:getOption var="chartHeight" name="chartHeight" defaultValue="400" />
							<config:getOption var="nbColumns" name="nbColumns" />
							<config:getOption var="nbSubFacets" name="nbSubFacets" defaultValue="" />
							<config:getOption var="storage" name="storage" defaultValue="cookie" />

							new Dashboard('${dashboardId}', chartsConfigs, {
								chartWidth: '${chartWidth}',
								chartHeight: '${chartHeight}',
								nbColumns: '${nbColumns}',
								nbCategories: '${nbSubFacets}',
								baseUrl: '<c:url value="/" />',
								storageType: '${storage}',
								isUserConnected: <security:isUserConnected />
							}, {
								mustBeConnected: '<i18n:message code="error-must-be-connected" text="The dashboard settings require you to be connected to save your changes." javaScriptEscape="true" />',
								configurationIncorrect: '<i18n:message code="error-configuration-incorrect" text="The configured storage system is incorrect. Your changes won't be saved." javaScriptEscape="true" />',
								noData: '<i18n:message code="error-no-data" text="No data to display the graph" javaScriptEscape="true" />',
								noGraph: '<i18n:message code="error-no-graph" text="No graph to display the data" javaScriptEscape="true" />',
								popupTitleDashboard: '<i18n:message code="popup-title-dashboard" text="Edit the dashboard" javaScriptEscape="true" />',
								popupTitleChart: '<i18n:message code="popup-title-chart" text="Edit the chart" javaScriptEscape="true" />',
								edit: '<i18n:message code="edit" text="edit" javaScriptEscape="true" />',
								showData: '<i18n:message code="show-data" text="data" javaScriptEscape="true" />',
								showChart: '<i18n:message code="show-chart" text="chart" javaScriptEscape="true" />'
							}).construct();
						</c:if>
				</render:renderScript>

				<c:choose>
					<c:when test="${noResults != null}">
						<config:getOption var="noResultsJspPathHit" name="noResultsJspPathHit" defaultValue="/WEB-INF/jsp/commons/noFacets.jsp" />
						<render:template template="${noResultsJspPathHit}">
							<render:parameter name="accessFeeds" value="${feeds}" />
							<render:parameter name="showSuggestion" value="true" />
						</render:template>
					</c:when>
					<c:otherwise>

						<div id="wrapper_${dashboardId}" class="dashboardWrapper med-padding">
							<ul id="chart_${dashboardId}" class="secondary-nav"></ul>
						</div>

						<div id="popupOverlay_${dashboardId}" class="dashboardPopupOverlay" style="display:none;"></div>
						<div id="popup_${dashboardId}" class="dashboardPopup" style="display: none;">
							<h3 class="popupTitle"></h3>
							<div class="content">
								<div class="wrapper first">
									<label for="chartFacetPath"><i18n:message code="label-facet" text="Facet:" htmlEscape="true" /></label>
									<select name="chartFacetPath"></select>
								</div>
								<div class="wrapper">
									<table class="chartIds"></table>
								</div>
								<div class="wrapper">
									<label><i18n:message code="label-max-categories" text="Max categories:" htmlEscape="true" /></label>
									<input type="text" name="chartCategories" placeholder="<i18n:message code="placeholder-max-categories" text="Max number of categories" htmlEscape="true" />" />
									<br />
									<label><i18n:message code="label-display-others" text="Display others:" htmlEscape="true" /></label>
									<input type="checkbox" name="chartOthers" value="1" />
								</div>
								<div class="wrapper">
									<label for="chartWidth"><i18n:message code="label-width" text="Width:" htmlEscape="true" /></label>
									<select name="chartWidth"></select>
								</div>
								<div class="wrapper last">
									<label><i18n:message code="label-title" text="Title:" htmlEscape="true" /></label>
									<input type="text" name="chartTitle" placeholder="<i18n:message code="placeholder-title" text="Title of the chart" htmlEscape="true" />" />
								</div>
								<div class="buttons">
									<button class="decorate doAddNewChart"><i18n:message code="button-create" text="Create" htmlEscape="true" /></button>
									<button class="decorate doEditChart"><i18n:message code="button-save" text="Save" htmlEscape="true" /></button>
									<button class="decorate doRemoveChart"><i18n:message code="button-remove" text="Remove" htmlEscape="true" /></button>
									<button class="decorate doClosePopup"><i18n:message code="button-cancel" text="Cancel" htmlEscape="true" /></button>
								</div>
							</div>
						</div>

					</c:otherwise>
				</c:choose>
			</c:otherwise>
		</c:choose>
	</widget:content>
</widget:widget>
