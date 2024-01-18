<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>

<render:import parameters="defaultOpenTab" />

<div class="widget-tabs-list has-popup-menu">
	<span class="widget-tabs-active">
		<widget:forEachSubWidget begin="${defaultOpenTab}" iteration="1">
			<config:getOption name="title" defaultValue="" />
		</widget:forEachSubWidget>
	</span>
	&#9660;
	<ul class="widget-tabs-popup-menu">
		<widget:forEachSubWidget varStatus="status">
			<li data-tabId="${status.index+1}" class="widget-tab tab-${status.index+1} popup-menu-item<c:if test="${status.index == defaultOpenTab}"> active</c:if>">
				<config:getOption name="title" defaultValue="" />
			</li>
		</widget:forEachSubWidget>
	</ul>
</div>