<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config"%>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget"%>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render"%>
<%@ taglib prefix="string" uri="http://www.exalead.com/jspapi/string"%>

<config:getOption var="invertHistoryOrder" name="invertHistoryOrder" defaultValue="false" />
<config:getOption var="displayStyle" name="displayStyle" defaultValue="breadcrumb" />
<config:getOption var="historySize" name="jsonCookieSize" defaultValue="10" />
<config:getOption var="storageMethod" name="storageMethod" defaultValue="Cookie" />
<config:getOption var="separator" name="separator" defaultValue="" />
<config:getOption var="label" name="label" defaultValue="" />
<config:getOption var="showHistory" name="showHistory" defaultValue="true" />

<c:choose>
	<c:when test="${storageMethod == 'Cookie'}">
		<config:getOption var="storageKey" name="jsonCookieName" defaultValue="history" />
	</c:when>
	<c:otherwise>
		<config:getOption var="storageKey" name="storageKey" defaultValue="NavigationHistoryWidget" />
	</c:otherwise>
</c:choose>

<c:if test="${showHistory == 'true'}">
	<widget:widget extraCss="navigationHistory">
		<widget:header>
			<config:getOption name="title" defaultValue="" />
		</widget:header>
		<widget:content extraCss="med-padding">
			<ul class="${displayStyle}"></ul>
		</widget:content>
	</widget:widget>
</c:if>

<render:renderScript position="READY">
	new NavigationHistory($('.<widget:getUcssId />'), '${storageMethod}', '${storageKey}', {
		reverse: '${invertHistoryOrder}',
		maxSize: '${historySize}',
		separator: '${separator}'
	}).onReady('<string:escape escapeType="javascript" value="${label}" />');
</render:renderScript>
