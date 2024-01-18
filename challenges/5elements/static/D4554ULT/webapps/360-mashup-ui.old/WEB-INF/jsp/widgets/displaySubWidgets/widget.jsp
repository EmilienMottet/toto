<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget"%>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render"%>

<%-- FIXME: should use tag for composite to hides 'composite_dataWidgetWrapper' stuff --%>
<c:choose>
	<c:when test="${composite_dataWidgetWrapper != null}">
		<widget:widget disableStyles="true" extraCss="subWidgets">
			<div class="wrapper">
				<render:subWidgets dataWidgetWrapper="${composite_dataWidgetWrapper}" />
			</div>
		</widget:widget>
	</c:when>
	<c:otherwise>
		<b style="color:red;">The SubWidget can only be used in a composite widget.</b>
	</c:otherwise>
</c:choose>
