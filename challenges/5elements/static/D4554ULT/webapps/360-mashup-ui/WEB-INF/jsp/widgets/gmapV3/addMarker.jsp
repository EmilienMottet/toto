<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="string" uri="http://www.exalead.com/jspapi/string" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="url" uri="http://www.exalead.com/jspapi/url" %>

<render:import parameters="id,location,addr,iconUrl,hitUrl,messagePopup" />	
markerManager.addMarker({
	<c:if test="${fn:length(location) > 0}">
	location: '${location}',
	</c:if>
	<c:if test="${fn:length(addr) > 0}">
	address:'<string:escape escapeType="JAVASCRIPT">${addr}</string:escape>',
	</c:if>
	<c:if test="${fn:length(messagePopup) > 0}">
	messagePopup: '${messagePopup}',
	</c:if>
	<c:if test="${fn:length(hitUrl) > 0}">
	hitUrl: '${hitUrl}',
	</c:if>
	<c:if test="${fn:length(iconUrl) > 0}">
	iconUrl: '${iconUrl}',
	</c:if>
	id:'${id}'
});