<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="request" uri="http://www.exalead.com/jspapi/request" %>

<config:getOption var="focus" name="focus" defaultValue="true" />
<config:getOption var="inputName" name="inputName" defaultValue="q" />
<config:getOption var="action" name="action" defaultValue="" />

<widget:widget extraCss="basicSearchForm">
	<form method="get" action="<c:url value='${action}' />">
		<input type="text" class="inputSearch decorate" autocomplete="off" name="${inputName}" value="<request:getParameterValue name='${inputName}' defaultValue="" />" />
		<button class="button decorate" type="submit">
			<div class="buttonContent"><config:getOption name="buttonContent" defaultValue="" /></div>
		</button>
	</form>
</widget:widget>

<c:if test="${focus == true}">
	<render:renderOnce id="basicSearchForm">
		<render:renderScript position="READY">
			$('.inputSearch:first').focus();
		</render:renderScript>
	</render:renderOnce>
</c:if>
