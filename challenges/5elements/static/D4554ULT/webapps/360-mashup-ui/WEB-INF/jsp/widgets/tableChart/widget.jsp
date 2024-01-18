<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>

<render:import varWidget="widget" varFeeds="feeds" />

<%-- Canvas for IE --%>
<render:renderOnce id="highcharts">
	<render:renderLater>
		<!--[if IE]>
			<script src="<c:url value="/resources/highcharts/js/excanvas.compiled.js" />" type="text/javascript"></script>
		<![endif]-->
	</render:renderLater>
</render:renderOnce>

<config:getOption var="width" name="width" />
<c:if test="${width != null}"><c:set var="width" value="width:${width}px;" /></c:if>

<widget:widget varCssId="cssId" extraCss="highcharts tableChart" extraStyles="${width}">

	<widget:header>
		<config:getOption name="title" defaultValue="" />
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

				<config:getOption var="height" name="height" />

                <div class="chart-wrapper" style="height: ${height}px;width:100%;">
                    <div class="chart-inner">
                        <div id="chart_${cssId}" class="highChartsSVGWrapper" style="height: ${height}px;width:100%;"></div>
                    </div>
                </div>

				<render:renderScript position="READY">
					<render:template template="javascript.jsp">
						<render:parameter name="chartContainerId" value="chart_${cssId}" />
					</render:template>

					highCharts.create({
						$widget: $('#chart_${cssId}').parent(),
						$chartContainer: $('#chart_${cssId}'),
						opts: opts,
						$insertRefinementsBefore: $('#chart_${cssId}').closest('.chart-wrapper')
					});
				</render:renderScript>
			</c:otherwise>
		</c:choose>
	</widget:content>
</widget:widget>
