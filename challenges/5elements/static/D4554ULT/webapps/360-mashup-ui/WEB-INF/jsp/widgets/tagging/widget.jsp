<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="string" uri="http://www.exalead.com/jspapi/string" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>
<%@ taglib prefix="i18n" uri="http://www.exalead.com/jspapi/i18n" %>

<render:import varWidget="widget" varFeeds="feeds" />

<config:getOption var="metaName" name="metaName" defaultValue=""/>
<search:getPageName var="pageName"/>
<config:getOption var="onClickUrl" name="link" defaultValue="" />
<config:getOption var="tagMetaName" name="tagMetaName" defaultValue="tags" />
<config:getOption var="editEnabled" name="editEnabled" defaultValue="true" />

<search:getEntry var="entry" feeds="${feeds}" />
<c:choose>
	<c:when test="${metaName != ''}">
		<search:getMetaValue var="documentId" entry="${entry}" metaName="${metaName}" isHighlighted="false" />
	</c:when>
	<c:otherwise>
		<search:getEntryInfo var="documentId" name="url" entry="${entry}" />
	</c:otherwise>
</c:choose>
<search:getEntryInfo var="buildGroup" name="buildGroup" entry="${entry}" />
<search:getEntryInfo var="source" name="source" entry="${entry}" />

<widget:widget varCssId="widgetId" extraCss="tagging-wrapper">
	<div class="edittags-form"></div>
	<ul class="taglist"></ul>
	<c:if test="${editEnabled == true}">
		<a class="edittags" href="#!"><i18n:message code="tag-this" /> </a>
	</c:if>
	<div class="clearfix"></div>
</widget:widget>

<render:renderScript>
	Tagging360Service.registerWidget({ docUri: "<string:escape value="${documentId}" />", docBuildGroup:"${buildGroup}", docSource: "${source}", widgetId: "${widgetId}", onClickUrl: "<string:escape escapeType="HTML" value="${onClickUrl}"/>", storageKey: "${tagMetaName}" });
</render:renderScript>

<render:renderOnce id="Tagging360Service">
	<render:renderScript position="READY">
		Tagging360Service.start();
	</render:renderScript>
</render:renderOnce>
