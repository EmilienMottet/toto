<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>

<%-- retrieve widget option --%>
<config:getOption var="title" name="title" defaultValue="" />
<config:getOption var="listType" name="listType" defaultValue="unordered" />

<widget:widget extraCss="mobileList">
	<c:if test="${title != ''}">
		<div class="list-header">${title}</div>
	</c:if>
	<c:set var="tag" value="${listType == 'ordered' ? 'ol' : 'ul'}" />
	<${tag} class="rounded">
		<render:subWidgets />
	</${tag}>
</widget:widget>
