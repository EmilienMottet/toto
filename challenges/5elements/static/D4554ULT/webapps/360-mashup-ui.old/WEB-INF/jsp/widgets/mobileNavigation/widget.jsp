<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>

<%-- render widget --%>
<widget:widget extraCss="mobileNavigation">
	<ul>
		<widget:forEachSubWidget>
			<li><render:widget /></li>
		</widget:forEachSubWidget>
	</ul>
</widget:widget>
