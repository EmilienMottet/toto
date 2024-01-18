<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<%@ taglib prefix="ajax" uri="http://www.exalead.com/jspapi/ajax" %>
<%@ taglib prefix="url" uri="http://www.exalead.com/jspapi/url" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="string" uri="http://www.exalead.com/jspapi/string" %>

<search:getFeed var="pageFeed" name="${feedName}" feeds="${mashupAPI}" />
<search:getEntry var="pageEntry" feed="${pageFeed}" />
<search:getFeed var="firstFeed" entry="${pageEntry}" />

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

	"html": <string:escape escapeType="jsonvalue">
		<config:evalTriggers component="${mashupUI}" feeds="${mashupAPI}">		
			<config:getOption var="cssId" name="cssId" component="${mashupUI}" defaultValue="body" />
			<config:getOption var="cssClass" name="cssClass" component="${mashupUI}" defaultValue="" />					
			<div id="${cssId}" class="mashup mashup-style web ${bodyClass} ${cssClass} ${cssTheme}">
				<div id="mainWrapper" style="width:${mashupUI.layout.width}${mashupUI.layout.widthFormat}">
					<render:definition name="tableLayout">
						<render:parameter name="layout" value="${mashupUI.layout}"/>
						<render:parameter name="parentFeed" value="${pageFeed}"/>
						<render:parameter name="parentEntry" value="${pageEntry}"/>
						<render:parameter name="wrapperCssClass" value="pageLayout"/>
					</render:definition>
				</div>
	
				<render:definition name="resources">
					<render:parameter name="position" value="BODY" />
				</render:definition>			
			</div>
		</config:evalTriggers>
		</string:escape>,
	"executeLater": <string:escape escapeType="jsonvalue"><render:renderLater flush="true" /></string:escape>,
	"appendScript": <string:escape escapeType="jsonvalue"><render:renderScript flush="true" /></string:escape>
}
<c:if test="${fn:length(callback) > 0}">
);
</c:if>