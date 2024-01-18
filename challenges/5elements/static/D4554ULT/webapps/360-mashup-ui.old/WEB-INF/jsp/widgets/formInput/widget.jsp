<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="i18n" uri="http://www.exalead.com/jspapi/i18n" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="string" uri="http://www.exalead.com/jspapi/string" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>

<render:import varWidget="widget" varFeeds="feeds" />

<config:getOption name="type" var="type" />
<config:getOption name="name" var="name" defaultValue="" />
<config:getOption name="value" var="value" defaultValue="" />
<config:getOption name="inputwidth" var="width" defaultValue="100" />
<config:getOption name="widthFormat" var="widthFormat" defaultValue="px" />
<config:getOption name="placeholder" var="placeholder" defaultValue="" />
<config:getOption name="enableValidation" var="enableValidation" defaultValue="false" />
<config:getOption name="enableSuggest" var="enableSuggest" defaultValue="false" />
<config:getOptionsComposite var="formInterface" name="exa.io.FormInterface" separator="##" />

<widget:widget varCssId="cssId" disableStyles="true">
	<input name="<string:escape escapeType="HTML">${name}</string:escape>" type="${type == 'datepicker' ? 'input' : type}" class="decorate" style="width:${width}${widthFormat}" value="<string:escape escapeType="HTML">${value}</string:escape>" <c:if test="${placeholder != ''}">placeholder="${placeholder}"</c:if> />
</widget:widget>

<c:if test="${placeholder != '' || enableValidation == true || enableSuggest == true || fn:length(formInterface) > 0 || type == 'datepicker'}">
	<render:renderScript position="READY">
		(function () {
			var $input = $('#${cssId} input');

			<c:if test="${placeholder != ''}">
				$input.placeholder();
			</c:if>

			<c:if test="${enableValidation == true}">
				<config:getOptions name="validationRules" var="validationRules" defaultValue="" />
				<config:getOption name="validationMessage" var="validationMessage" defaultValue="" />

				$input.rules('add', {
					<c:forEach var="rule" items="${validationRules}">
						${rule}: true,
					</c:forEach>
					messages: {
					<c:forEach var="rule" items="${validationRules}" varStatus="loopStatus">
						<c:choose>
							<c:when test="${validationMessage == ''}">
								${rule}: "<i18n:message code="${rule}" javaScriptEscape="true" />"<c:if test="${loopStatus.last == false}">,</c:if>
							</c:when>
							<c:otherwise>
								${rule}: "<string:escape escapeType="javascript">${validationMessage}</string:escape>"<c:if test="${loopStatus.last == false}">,</c:if>
							</c:otherwise>
						</c:choose>
					</c:forEach>
					}
				});
			</c:if>
			
			<%-- --%>
			<c:if test="${type == 'datepicker'}">
				$input.datepicker();
			</c:if>

			<%-- cannot have suggest on hidden/password input --%>
			<c:if test="${enableSuggest == true && type == 'text'}">
				$input.enableSuggest('<c:url value="/utils/suggest/${feedName}" />', '${feedName}', '${widget.wuid}', {autoSubmit: false});
			</c:if>
			
			<c:forEach var="rowForm" items="${formInterface}">
				exa.io.register('exa.io.FormInterface', '${rowForm[0]}', function (formInterface) {
					formInterface.addOnSubmitListener(function () {
						formInterface.addParameter('${name}', $input.val());
					});
				});
			</c:forEach>
		})();
	</render:renderScript>
</c:if>
