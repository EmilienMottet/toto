<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%-- Widget templates, headers, content... --%>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget"%>
<%-- Options retrieving... --%>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config"%>
<%-- Template rendering, parameters import... --%>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render"%>
<%-- Result Feed manipulation --%>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search"%>

<render:import varWidget="widget" varFeeds="accessFeeds" />

<config:getOption var="title" name="title" defaultValue="" />
<config:getOption var="width" name="width" defaultValue="" />
<config:getOption var="height" name="height" defaultValue="" />
<config:getOptions var="markers" name="markers" defaultValue="" />
<config:getOption var="sensor" name="sensor" defaultValue="false" />
<config:getOption var="center" name="center" defaultValue="" />
<config:getOption var="zoom" name="zoom" defaultValue="" />

<widget:widget extraCss="staticGoogleMap">
	<widget:header>
		<config:getOption name="title" defaultValue="" />
	</widget:header>
	<widget:content>
		<c:url var="image_url" value="https://maps.googleapis.com/maps/api/staticmap">
			<c:param name="size" value="${width}x${height}" />
			<c:forEach items="${markers}" var="marker">
				<c:param name="markers" value="${marker}"/>
			</c:forEach>
			<c:if test="${!empty sensor}"><c:param name="sensor" value="${sensor}" /></c:if>
			<c:if test="${!empty center}"><c:param name="center" value="${center}" /></c:if>
			<c:if test="${!empty zoom}"><c:param name="zoom" value="${zoom}" /></c:if>
		</c:url>
		<img src="${image_url}" alt="static_map" />
	</widget:content>
</widget:widget>
