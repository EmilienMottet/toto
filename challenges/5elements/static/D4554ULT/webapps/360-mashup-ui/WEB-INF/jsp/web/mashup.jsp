<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="reporting" uri="http://www.exalead.com/jspapi/reporting" %>

<%-- retrieve application properties --%>
<config:getOption var="favicon" name="favicon" component="${v10MashupUI}" defaultValue="/resources/images/favicon.ico" />
<config:getOption var="cssTheme" name="cssTheme" component="${v10MashupUI}" defaultValue="" />

<%-- retrieve first feed --%>
<search:getFeed var="pageFeed" name="${feedName}" feeds="${mashupAPI}" />
<search:getEntry var="pageEntry" feed="${pageFeed}" />
<search:getFeed var="firstFeed" entry="${pageEntry}" />

<config:evalTriggers component="${mashupUI}" feeds="${mashupAPI}">

	<%-- retrieve page properties --%>
	<config:getOption var="title" name="title" component="${mashupUI}" feed="${firstFeed}" defaultValue="\${i18n['html.title']}" doEval="true" />
	<config:getOption var="description" name="description" component="${mashupUI}" feed="${firstFeed}" doEval="true" />
	<config:getOption var="cssId" name="cssId" component="${mashupUI}" defaultValue="body" />
	<config:getOption var="cssClass" name="cssClass" component="${mashupUI}" defaultValue="" />
	<config:getOptionsComposite var="metasHeader" name="metasHeader" component="${mashupUI}" feed="${firstFeed}" separator="=" doEval="true" />
	<config:getOptionsComposite var="metasHttpEquiv" name="metasHttpEquiv" component="${mashupUI}" feed="${firstFeed}" doEval="true" separator="##"/>	
	<config:getOption var="customLayout" name="customLayout" component="${mashupUI}" />

	<html xmlns="http://www.w3.org/1999/xhtml" lang="${i18nLang}" xml:lang="${i18nLang}">
		<head>
			<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
			<meta name="description" content="${description}" />
			<meta name="baseurl" content="${pageContext.request.contextPath}/" />
			<c:if test="${csrf != null}">
				<meta name="CSRF-Token" content="${csrf}" />
			</c:if>

			<%-- page title --%>
			<title>${title}</title>

			<%-- page meta descriptions --%>
			<c:forEach var="meta" items="${metasHeader}">
				<meta name="${meta[0]}" content="${meta[1]}" />
			</c:forEach>
			
			<%-- page http-equiv descriptions --%>
			<c:forEach var="meta" items="${metasHttpEquiv}">
				<meta http-equiv="${meta[0]}" content="${meta[1]}" />
			</c:forEach>

			<link rel="canonical" href="${canonicalURL}" />
			<link rel="shortcut icon" type="image/ico" href="<c:url value='${favicon}' />" />

			<%-- resources --%>
			<render:definition name="resources">
				<render:parameter name="position" value="HEADER" />
			</render:definition>

			<%-- debug mode --%>
			<c:if test="${debugMode.debugModeEnable == true}">
				<render:definition name="debug" >
					<render:parameter name="position" value="HEADER"/>
				</render:definition>
			</c:if>
		</head>

		<body id="${cssId}" class="mashup mashup-style web ${bodyClass} ${cssClass} ${cssTheme}">
			<div id="mainWrapper" style="width:${mashupUI.layout.width}${mashupUI.layout.widthFormat}">
				<c:choose>
					<c:when test="${customLayout != null}">
						<config:resolveLayout var="layoutPath" layout="${customLayout}" />
						<render:template template="${layoutPath}">
							<render:parameter name="layout" value="${mashupUI.layout}"/>
							<render:parameter name="parentFeed" value="${pageFeed}"/>
							<render:parameter name="parentEntry" value="${pageEntry}"/>
							<render:parameter name="wrapperCssClass" value="pageLayout"/>					
						</render:template>	
					</c:when>
					<c:otherwise>						
						<render:definition name="tableLayout">
							<render:parameter name="layout" value="${mashupUI.layout}"/>
							<render:parameter name="parentFeed" value="${pageFeed}"/>
							<render:parameter name="parentEntry" value="${pageEntry}"/>
							<render:parameter name="wrapperCssClass" value="pageLayout"/>
						</render:definition>
					</c:otherwise>
				</c:choose>
			</div>

			<render:definition name="resources">
				<render:parameter name="position" value="BODY" />
			</render:definition>

			<render:renderLater flush="true" />
			<render:renderScript flush="true" />
			<%-- debug mode --%>
			<c:if test="${debugMode.debugModeEnable == true}">
				<render:definition name="debug" >
					<render:parameter name="position" value="FOOTER"/>
				</render:definition>
			</c:if>
		</body>
	</html>
</config:evalTriggers>
<reporting:pageExecutionEnd />
