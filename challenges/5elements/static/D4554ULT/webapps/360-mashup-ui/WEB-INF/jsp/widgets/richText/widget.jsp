<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>

<widget:widget>
	<widget:header>
		<config:getOption name="title" defaultValue="" />
	</widget:header>

	<widget:content extraCss="small-padding">
		<config:getOption name="richText" defaultValue="" />
	</widget:content>
</widget:widget>
