<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="security" uri="http://www.exalead.com/jspapi/security" %>
<%@ taglib prefix="i18n" uri="http://www.exalead.com/jspapi/i18n" %>

<security:getUser var="user" />

<c:if test="${user != null}">
	<style type="text/css">
		#logout {
			border-color: #CCCCCC;
			border-style: solid;
			border-width: 0 0 1px 1px;
			padding: 7px 5px 7px 30px;
			position: absolute;
			top: 0;
			right: 0px;
	
			background-image:url("<c:url value="/resources/images/user.gif" />");
			background-position:4px 2px;
			background-repeat:no-repeat;
			background-color: #fff;
			box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
		}
	</style>

	<div id="logout">
		<a href="<c:url value="/logout" />"><i18n:message code="logout.button" arguments="${user.login}" /></a>
	</div>
</c:if>