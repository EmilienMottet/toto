<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>

<render:import parameters="valign,defaultOpenTab,display" />

<div class="widget-tabs-list-wrapper list-${valign}">
	<c:choose>
		<c:when test="${display == 'dropdowns'}">
			<render:template template="templates/dropdownlist.jsp">
				<render:parameter name="defaultOpenTab" value="${defaultOpenTab}" />
			</render:template>
		</c:when>
		<c:otherwise>
			<render:template template="templates/inline.jsp">
				<render:parameter name="defaultOpenTab" value="${defaultOpenTab}" />
			</render:template>
		</c:otherwise>
	</c:choose>
</div>