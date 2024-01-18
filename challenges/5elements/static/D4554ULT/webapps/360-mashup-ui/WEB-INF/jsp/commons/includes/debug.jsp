<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="dev" uri="http://www.exalead.com/jspapi/dev" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="reporting" uri="http://www.exalead.com/jspapi/reporting" %>

<render:import parameters="position" />

<c:choose>
	<c:when test="${position == 'HEADER'}">
		<%-- Debug mode library--%>
		<link type="text/css" rel="stylesheet" href="<c:url value='/resources/css/debugMode.less' />" />
		<script type="text/javascript" src="<c:url value='/resources/javascript/debugMode.js' />" charset="utf-8"></script>
		
		<script type="text/javascript">
			<dev:debugEachFeed var="feed">
				<c:if test="${feed.error != null}">
					FeedDebugger.addError({id:'${feed.id}', message:'${feed.error.message}'});
				</c:if>
			</dev:debugEachFeed>
		</script>
	</c:when>
	<c:when test="${position == 'FOOTER'}">
		<script type="text/javascript"> 
			window.debugMode_reporting = <reporting:getJSON />; 
		</script>
	</c:when>
</c:choose>
