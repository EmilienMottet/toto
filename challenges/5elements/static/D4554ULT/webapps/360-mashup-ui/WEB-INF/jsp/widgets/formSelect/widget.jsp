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
<config:getOption name="multipleSelect" var="multipleSelect" />
<config:getOption name="value" var="value" defaultValue=""/>
<config:getOptionsComposite name="items" var="items" defaultValue="" />
<config:getOption name="inputwidth" var="width" defaultValue="100" />
<config:getOption name="widthFormat" var="widthFormat" defaultValue="px" />
<config:getOption name="multipleValuesSeparator" var="multipleValuesSeparator" defaultValue=";" />
<config:getOptionsComposite var="formInterface" name="exa.io.FormInterface" separator="##" />

<widget:widget varCssId="cssId" disableStyles="true">
	<string:split var="value" string="${value}" separator="${multipleValuesSeparator}" />

	<select name="${name}" class="decorate" <c:if test="${multipleSelect == 'true'}">multiple</c:if> style="width:${width}${widthFormat}">
		<c:forEach var="item" items="${items}">
			<option value="<string:escape escapeType="HTML">${item[1]}</string:escape>"<c:if test="${list:contains(value, item[1])}"> selected</c:if>><string:escape escapeType="HTML">${item[0]}</string:escape></option>
		</c:forEach>
	</select>
</widget:widget>

<config:getOption name="enableValidation" var="enableValidation" defaultValue="false" />

<c:if test="${enableValidation == 'true' || fn:length(formInterface) > 0 }">
	<config:getOption name="validationMessage" var="validationMessage" defaultValue="" />
	<render:renderScript position="READY">
		<c:if test="${enableValidation == 'true'}">	
			$('#${cssId} select[name=${name}]').rules("add", {
			required: true,
			messages: {
				<c:choose>
					<c:when test="${validationMessage == ''}">required: "<i18n:message code="${rule}" javaScriptEscape="true" />"</c:when>
					<c:otherwise>required: "<string:escape escapeType="javascript">${validationMessage}</string:escape>"</c:otherwise>
				</c:choose>
				}
			});
		</c:if>
		<c:forEach var="rowForm" items="${formInterface}">
			exa.io.register('exa.io.FormInterface', '${rowForm[0]}', function (formInterface) {
				formInterface.addOnSubmitListener(function () {
					formInterface.addParameter('${name}', $('#${cssId} select[name=${name}]').val());
				});
			});
		</c:forEach>
	</render:renderScript>
</c:if>