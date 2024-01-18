<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>

<%-- retrieve widget options --%>
<config:getOption var="collapsed" name="collapsed" defaultValue="" />

<%-- render widget --%>
<widget:widget extraCss="mobileCollapsible" >
	<widget:header htmlTag="div">
		<div class="sub-header-collapsible">
			<span class="${collapsed == 'true' ? 'icon-collapsed':'icon-collapsible'}"></span>
			<config:getOption name="header" defaultValue="Header" />
		</div>
	</widget:header>
	<widget:content extraCss="collapsible-content ${collapsed == 'true' ? 'collapsed' : '' }">
		<render:subWidgets />
	</widget:content>
</widget:widget>
<render:renderOnce id="renderScript">
	<render:renderScript>
	$(".mobileCollapsible .widgetHeader").click(function(){
		$(this).find(".sub-header-collapsible span").toggleClass("icon-collapsible").toggleClass("icon-collapsed");
		$(this).find("+ div").slideToggle("slow");
	});
	</render:renderScript>
</render:renderOnce>