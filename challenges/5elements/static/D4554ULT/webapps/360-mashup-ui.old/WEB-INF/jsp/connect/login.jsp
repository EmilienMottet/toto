<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="request" uri="http://www.exalead.com/jspapi/request" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="i18n" uri="http://www.exalead.com/jspapi/i18n" %>

<style type="text/css">
	#connect .widgetContent label {
		float:left;
		padding-right:5px;
		text-align:left;
		width:100px;
		font-weight:bold;
	}
	#connect .widgetContent .error-box {
		margin-top: 0;
	}
</style>

<div id="connect" class="searchWidget loadingBox">
	<h2 class="widgetHeader"><i18n:message code="login.title"/></h2>
	<div class="widgetContent not-top med-padding">
		<c:url var="url" value="/login"/>
		<form:form action="${url}" method="POST">
			<request:getParameterValue var="err" name="err" />
            <c:if test="${!empty err}">
			<c:choose>
				<c:when test="${err == '2'}"><div class="error-box"><i18n:message code="login.err.2"/></div></c:when>
				<c:when test="${err == '3'}"><div class="error-box"><i18n:message code="login.err.3"/></div></c:when>
                <c:otherwise><div class="error-box"><i18n:message code="login.err.${fn:replace(err, ' ', '_')}" text="${err}"/></div></c:otherwise>
			</c:choose>
            </c:if>

			<div>
				<label for="login"><i18n:message code="login.username"/></label> <input type="text" name="login" value="${securityModel != null ? securityModel.login : ""}" class="decorate" style="width: 120px" />
			</div>

			<div>
				<label for="password"><i18n:message code="login.password"/></label> <input type="password" name="password" class="decorate" style="width: 120px" />
			</div>

			<div>
				<label>&nbsp;</label>
				<input type="hidden" name="goto" value="${continueUrl}" />
				<input type="submit" name="connect" value="<i18n:message code="login.button"/>" class="decorate" style="width: 126px;"/>
			</div>
            <render:csrf />
		</form:form>
	</div>
</div>

<script type="text/javascript">
	$(document).ready(function() {
		$('[name=login]').focus();
	});
</script>
