<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>

<render:import varWidget="widget" varParentEntry="parentEntry" varParentFeed="parentFeed" />

<widget:widget disableStyles="true">
	<render:definition name="tableLayout">
		<render:parameter name="prefix" value="${widget.wuid}" />
		<render:parameter name="layout" value="${widget.layout}" />
		<render:parameter name="parentFeed" value="${parentFeed}" />
		<render:parameter name="parentEntry" value="${parentEntry}" />
	</render:definition>
</widget:widget>
