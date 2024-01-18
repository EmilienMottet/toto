<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<a href="<c:url value="/" />" class="exception">
	<img src="<c:url value="/resources/logo/images/cvlogo_medium.png" />" />
</a>

<div class="exception">

	<div class="detail">
		<h3>An error occurred while processing your request</h3>

		<div>
			Please see your logs for more details.
		</div>

		<div>
			Error message is: <i>"${fn:escapeXml(exception.message)}"</i>.
		</div>

	</div>
</div>
