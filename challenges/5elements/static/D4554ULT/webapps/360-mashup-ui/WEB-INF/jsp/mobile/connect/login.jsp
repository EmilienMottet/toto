<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="request" uri="http://www.exalead.com/jspapi/request" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="i18n" uri="http://www.exalead.com/jspapi/i18n" %>

<style type="text/css">
	.loginWrapper {
		padding: 15px;
	}
	.loginWrapper h3 {
		margin-top: 0;
	}

	.loginWrapper .error {
		color: #cc0000;
		text-align: center;
		padding: 5px;
	}

	#form-login{
		max-width: 260px;
		margin-left:auto;
		margin-right:auto;
		text-align: center;
	}
	
	#form-login .input-login,
	#form-login .input-pwd {
		width: 100%;
		height: 26px;
		font-size: 13px;
		z-index: 5;		
		background-color: white;		
		border:1px solid #ccc;
	}

	#form-login .input-login input,
	#form-login .input-pwd input{
		text-align: left;
		padding: 0 0px 0 5px;
		background-color: white;
		border: 0px;
		height: 26px;
		width: 90%;
		margin-left:2px;
	}

	#form-login .input-login {
		background-color: white;
		border-top-left-radius: 4px;
		border-top-right-radius: 4px;
		border:1px solid #ccc;
	}

	#form-login .input-pwd {
		border-bottom-left-radius: 4px;
		border-bottom-right-radius: 4px;
		border-top: none;
	}

	#form-login .btn {
		width: 100%;
		margin-top: 10px;
		margin-left: 0px;
		margin-right: 0px;
		padding: 0 5px 0 5px;
		border-top-left-radius: 4px;
		border-top-right-radius: 4px;
		border-bottom-left-radius: 4px;
		border-bottom-right-radius: 4px;
		height: 26px;
	}

</style>

<c:url var="url" value="/login"/>
<config:getOption var="logo" name="logo" defaultValue="" />

<div class="loginWrapper">
	<c:if test="${!empty title}"><h3>${title}</h3></c:if>

	<request:getParameterValue var="err" name="err" />	
	<c:if test="${err == '3'}"><div class="error"><i18n:message code="login.err.3"/></div></c:if>
	
	<form:form action="${url}" method="POST" id="form-login">
		<c:if test="${!empty logo}"><img src="<c:url value="${logo}"/>" alt="logo" /></c:if>
		<div class="input-login"><input type="text" id="login" name="login" value="${securityModel != null ? securityModel.login : ""}" placeholder="Login" /></div>
		<div class="input-pwd"><input type="password" id="password" name="password" placeholder="Password" /></div>
		<c:if test="${!empty err}">
		<c:choose>
			<c:when test="${err == '2'}"><div class="error"><i18n:message code="login.err.2"/></div></c:when>
            <c:when test="${err != '3'}"><div class="error"><i18n:message code="login.err.${fn:replace(err, ' ', '_')}" text="${err}"/></div></c:when>
		</c:choose>
        </c:if>
		
		<input type="hidden" name="goto" value="${continueUrl}" />
		<input type="submit" class="btn" name="connect" value="<i18n:message code="login.button"/>" />
        <render:csrf />
	</form:form>
</div>