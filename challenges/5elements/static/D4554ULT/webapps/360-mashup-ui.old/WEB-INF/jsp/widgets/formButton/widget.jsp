<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>

<render:import varWidget="widget" />

<config:getOption var="type" name="type" />
<config:getOption var="onclick" name="onclick" />
<config:getOption var="width" name="inputwidth" defaultValue="100" />
<config:getOption var="widthFormat" name="widthFormat" defaultValue="px" />
<config:getOption var="value" name="value" defaultValue="" />

<widget:widget varCssId="cssId" disableStyles="true">
	<input type="${type}" style="width:${width}${widthFormat}" value="${value}" />
</widget:widget>

<c:if test="${onclick != null}">
	<render:renderScript position="READY">
		$('#${cssId} input').click(function(){ ${onclick} });
	</render:renderScript>
</c:if>
