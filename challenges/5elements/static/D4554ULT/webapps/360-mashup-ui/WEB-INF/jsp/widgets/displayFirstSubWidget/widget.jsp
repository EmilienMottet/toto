<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>

<c:set var="continueLoop" value="true" />
<widget:widget disableStyles="true" extraCss="firstWidget">
	<widget:forEachSubWidget>
		<c:if test="${continueLoop == 'true'}">
			<c:set var="continueLoop" value="false" />
			<render:widget />
		</c:if>
	</widget:forEachSubWidget>
</widget:widget>
