<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>

<%-- retrieve widget option --%>
<config:getOption var="minScreenTarget" name="minScreenTarget" defaultValue="650" />
<config:getOption var="position" name="position" defaultValue="left" />
<config:getOption var="width" name="width" defaultValue="50%" />


<widget:widget varCssId="cssId">
	<render:subWidgets />
</widget:widget>
<render:renderLater>
<style type="text/css">
@media (min-width: ${minScreenTarget}px) {
	#${cssId}{
		float: ${position};
		width: ${width};
	}
}
</style>
</render:renderLater>