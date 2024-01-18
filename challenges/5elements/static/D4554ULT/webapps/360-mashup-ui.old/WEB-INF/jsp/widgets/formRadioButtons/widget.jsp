<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="list" uri="http://www.exalead.com/jspapi/list" %>
<%@ taglib prefix="i18n" uri="http://www.exalead.com/jspapi/i18n" %>	
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="string" uri="http://www.exalead.com/jspapi/string" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>

<render:import varWidget="widget" varFeeds="feeds" />

<config:getOption name="name" var="name" defaultValue="" />
<config:getOption name="value" var="value" defaultValue=""/>
<config:getOptionsComposite name="items" var="items" defaultValue="" />
<config:getOption name="enableValidation" var="enableValidation" defaultValue="false" />
<config:getOption name="validationMessage" var="validationMessage" defaultValue="" />
<config:getOptionsComposite var="formInterface" name="exa.io.FormInterface" separator="##" />

<widget:widget varCssId="cssId" disableStyles="true">
	<c:forEach var="item" items="${items}">
		<label><input type="radio" name="${name}" class="decorate" value="${item[1]}" <c:if test="${item[1] == value}"> checked</c:if>/> ${item[0]}</label>
	</c:forEach>
	<c:if test="${enableValidation == 'true'}">
		<label for="${name}" class="formError">
			<c:choose>
				<c:when test="${validationMessage == ''}"><i18n:message code="required" javaScriptEscape="true" /></c:when>
				<c:otherwise><string:escape escapeType="javascript">${validationMessage}</string:escape></c:otherwise>
			</c:choose>
		</label>
	</c:if>
</widget:widget>

<c:if test="${enableValidation == 'true' || fn:length(formInterface) > 0 }">
	<render:renderScript position="READY">
		<c:if test="${enableValidation == 'true'}">
			$('#${cssId} input').rules("add", { required: true });
		</c:if>
		<c:forEach var="rowForm" items="${formInterface}">
			exa.io.register('exa.io.FormInterface', '${rowForm[0]}', function (formInterface) {
				formInterface.addOnSubmitListener(function () {
					$('#${cssId} input').each(function (index, input) {
						if (input.checked) {
							formInterface.addParameter('${name}', input.value);
						}
					});
				});
			});
		</c:forEach>
	</render:renderScript>
</c:if>