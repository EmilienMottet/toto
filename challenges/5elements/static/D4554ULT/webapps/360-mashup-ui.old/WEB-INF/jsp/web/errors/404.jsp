<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="tiles" uri="http://tiles.apache.org/tags-tiles" %>

<a href="<c:url value="/" />" class="exception">
	<img src="<c:url value="/resources/logo/images/cvlogo_medium.png" />" />
</a>

<div class="exception">
	<div class="detail">
		<h3><spring:message code="html.error.404.title" /></h3>
		<div>
			<c:url var="baseUrl" value="/" />
			<spring:message code="html.error.404.message" arguments="${baseUrl},javascript:history.back()" />
		</div>
	</div>
</div>
