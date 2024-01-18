<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>

<render:import varWidget="widget" />

<config:getOption var="urlLink" name="urlLink" />
<config:getOption var="urlImage" name="urlImage" />
<config:getOption var="height" name="height" />
<config:getOption var="width" name="width" />
<config:getOption var="alt" name="alt" defaultValue="" />
<config:getOption var="urlTarget" name="urlTarget" defaultValue="" />

<widget:widget extraCss="logo">
	<render:link href="${urlLink}" target="${urlTarget == 'New Page' ? '_blank' : ''}">
		<img src="<c:url value="${urlImage}" />" <c:if test="${fn:length(height) > 0}">height="${height}"</c:if> <c:if test="${fn:length(width) > 0}">width="${width}"</c:if> alt="${alt}" />
	</render:link>
</widget:widget>
