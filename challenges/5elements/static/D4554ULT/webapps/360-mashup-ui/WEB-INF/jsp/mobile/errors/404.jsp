<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="tiles" uri="http://tiles.apache.org/tags-tiles" %>

<a href="<c:url value="/" />"><img src="<c:url value="/resources/logo/images/cvlogo_small.png" />" /></a>
<p><strong><spring:message code="html.error.404.title" /></strong></p>
<p>
	<c:url var="baseUrl" value="/" />
	<spring:message code="html.error.404.message" arguments="${baseUrl},javascript:history.back()" />
</p>
