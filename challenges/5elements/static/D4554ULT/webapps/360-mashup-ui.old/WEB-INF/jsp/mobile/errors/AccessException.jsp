<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<a href="<c:url value="/" />"><img src="<c:url value="/resources/logo/images/cvlogo_small.png" />" /></a>
<p><strong>An error occurred while processing the access request</strong></p>
<p>Please see your logs for more details.</p>
<p>Error message is: <em>"${fn:escapeXml(exception.message)}"</em>.</p>

