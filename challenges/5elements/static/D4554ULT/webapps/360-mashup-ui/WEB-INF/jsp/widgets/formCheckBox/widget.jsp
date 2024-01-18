<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="i18n" uri="http://www.exalead.com/jspapi/i18n" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="string" uri="http://www.exalead.com/jspapi/string" %>
<%@ taglib prefix="request" uri="http://www.exalead.com/jspapi/request" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>

<render:import varWidget="widget" varFeeds="feeds" />

<config:getOption name="name" var="name" defaultValue="" />
<config:getOption name="value" var="value" />
<config:getOption name="enableValidation" var="enableValidation" defaultValue="false" />
<config:getOption name="validationMessage" var="validationMessage" defaultValue="" />
<config:getOptionsComposite var="formInterface" name="exa.io.FormInterface" separator="##" />

<request:getParameterValue var="httpValue" name="${name}" />

<widget:widget varCssId="cssId" disableStyles="true">
	<label><input class="decorate" name="<string:escape escapeType="HTML">${name}</string:escape>" type="checkbox" value="<string:escape escapeType="HTML">${value}</string:escape>" <c:if test="${value == httpValue}">checked</c:if> /><config:getOption name="label" /></label>
	<label for="<string:escape escapeType="HTML">${name}</string:escape>" class="formError">
		<c:choose>
			<c:when test="${validationMessage == ''}"><i18n:message code="required" /></c:when>
			<c:otherwise><string:escape escapeType="HTML">${validationMessage}</string:escape></c:otherwise>
		</c:choose>
	</label>
</widget:widget>

<c:if test="${enableValidation == 'true' || fn:length(formInterface) > 0 }">
	<render:renderScript position="READY">
		<c:if test="${enableValidation == 'true'}">
			$('#${cssId} input').rules("add", { required: true });
		</c:if>
		<c:forEach var="rowForm" items="${formInterface}">
			exa.io.register('exa.io.FormInterface', '${rowForm[0]}', function (formInterface) {
				formInterface.addOnSubmitListener(function () {
					var $input = $('#${cssId} input');
					if ($input[0].checked) {
						formInterface.addParameter('${name}', $input.val());
					}
				});
			});
		</c:forEach>
	</render:renderScript>
</c:if>
