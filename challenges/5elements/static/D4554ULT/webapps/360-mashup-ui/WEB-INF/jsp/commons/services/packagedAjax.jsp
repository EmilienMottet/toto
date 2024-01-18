<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<%@ taglib prefix="ajax" uri="http://www.exalead.com/jspapi/ajax" %>
<%@ taglib prefix="url" uri="http://www.exalead.com/jspapi/url" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="string" uri="http://www.exalead.com/jspapi/string" %>

<c:if test="${fn:length(callback) > 0}">
${callback}(
</c:if>
{
	<%-- styles (@see IncludeResources) --%>
	"cssFiles": [
		<c:set var="comma" value="" />
		<c:forEach var="cssFile" items="${include_header_cssFiles}">
			${comma}"<c:url value='${cssFile}' />"
			<c:set var="comma" value="," />
		</c:forEach>

		<c:forEach var="cssFile" varStatus="cssStatus" items="${include_body_cssFiles}">
			${comma}"<c:url value='${cssFile}' />"
			<c:set var="comma" value="," />
		</c:forEach>
	],
	"cssStyles": <string:escape escapeType="jsonvalue">${include_header_cssStyles}</string:escape>,

	<%-- javascript (@see IncludeResources) --%>
	"jsFiles": [
		<c:forEach var="jsFile" varStatus="jsStatus" items="${include_header_jsFiles}">
			"<c:url value='${jsFile}' />"<c:if test="${jsStatus.last == false}">,</c:if>
		</c:forEach>
	],
	"jsBodyFiles": [
		<c:forEach var="jsFile" varStatus="jsStatus" items="${include_body_jsFiles}">
			"<c:url value='${jsFile}' />"<c:if test="${jsStatus.last == false}">,</c:if>
		</c:forEach>
	],
	"jsHeader": <string:escape escapeType="jsonvalue">${include_header_js}</string:escape>,
	"jsBody": <string:escape escapeType="jsonvalue">${include_body_js}</string:escape>,

	"widgets": [
		<search:getFeed var="pagefeed" name="${feedName}" feeds="${mashupAPI}" />
		<ajax:forEachPath var="dataWidgetWrapper" varUcssId="cssId" varStatus="pathStatus" feed="${pagefeed}" page="${mashupUI}" paths="${paths}">
			<config:evalTriggers dataWidgetWrapper="${dataWidgetWrapper}">
				{
					"cssId": "${cssId}",
					"html": <string:escape escapeType="jsonvalue"><render:widget dataWidgetWrapper="${dataWidgetWrapper}" /></string:escape>,
					"includes": [
						<ajax:forEachWidgetIncludesTag var="include" varStatus="varStatus" dataWidgetWrapper="${dataWidgetWrapper}">
							{
								"includeType": "${include.type}",
								"includePath": "<url:resource file="${include.path}" dataWidgetWrapper="${dataWidgetWrapper}"/>",
								"includeTheme": "${include.theme}"
							}<c:if test="${varStatus.last == false}">,</c:if>
						</ajax:forEachWidgetIncludesTag>
					]
				}<c:if test="${pathStatus.last == false}">,</c:if>
			</config:evalTriggers>
		</ajax:forEachPath>
	],
	"executeLater": <string:escape escapeType="jsonvalue"><render:renderLater flush="true" /></string:escape>,
	"appendScript": <string:escape escapeType="jsonvalue"><render:renderScript flush="true" /></string:escape>
}
<c:if test="${fn:length(callback) > 0}">
);
</c:if>