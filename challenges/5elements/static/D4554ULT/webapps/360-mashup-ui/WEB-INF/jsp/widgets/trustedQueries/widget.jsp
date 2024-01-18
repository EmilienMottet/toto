<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config"%>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render"%>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget"%>
<%@ taglib prefix="string" uri="http://www.exalead.com/jspapi/string"%>
<%@ taglib prefix="request" uri="http://www.exalead.com/jspapi/request"%>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search"%>

<render:import varWidget="widget" />

<config:getOption var="inputSize" name="inputSize" />
<config:getOption var="queryParameter" name="queryParameter" />
<config:getOption var="action" name="action" defaultValue="" />
<config:getOption var="cookieName" name="cookieName" defaultValue="trustedqueries" />
<config:getOptions var="refineFeeds" name="refineFeeds" />
<config:getOptions var="includeDataModelClasses" name="includeDataModelClasses" />
<c:if test="${fn:length(includeDataModelClasses) == 1}">
	<c:set var="forceType" value="${includeDataModelClasses[0]}" />
</c:if>

<widget:widget extraCss="trustedQueries">
</widget:widget>

<render:renderScript position="READY">
	<config:getOptionsComposite var="geoForm" name="exa.io.GeoInterface" />
	(function() {
		var tq = new TrustedQuery(
			'<c:url value="/utils/trustedqueries/${feedName}" />',
			'${widget.wuid}',
			{
				cookieName: '${cookieName}',
				queryVar: '${queryParameter}',
				refines: <string:serialize object="${refineFeeds}" />,
				action: '<c:url value="${action}" />',
				width: ${inputSize},
				forceType: ${forceType != null}
			}).init();
		<c:forEach var="rowGeoForm" items="${geoForm}" varStatus="status">
			tq.registerGeoInteface('${rowGeoForm[0]}', '${rowGeoForm[1]}', '<request:getParameterValue name="${rowGeoForm[1]}" defaultValue="" />', '${rowGeoForm[2]}');
		</c:forEach>
	})();
</render:renderScript>
