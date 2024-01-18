<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>

<widget:widget extraCss="roundedBox">
	<widget:header>
		<config:getOption name="title" defaultValue="" />
	</widget:header>

	<widget:content>
		<render:subWidgets />
	</widget:content>
</widget:widget>
