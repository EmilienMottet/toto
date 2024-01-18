<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>

<render:import parameters="position" />

<%--
	Includes CSS and JS resources
	@see IncludeResources
--%>

<c:choose>
	<c:when test="${position == 'HEADER'}">
		<c:forEach var="cssFile" items="${include_header_cssFiles}">
			<link rel="stylesheet" type="text/css" media="screen,print"  href="<c:url value='${cssFile}?v=${v10MashupUI.lastModifiedDate}' />" />
		</c:forEach>
		<c:forEach var="cssFile" items="${include_body_cssFiles}">
			<link rel="stylesheet" type="text/css" media="screen,print"  href="<c:url value='${cssFile}?v=${v10MashupUI.lastModifiedDate}' />" />
		</c:forEach>
		<c:if test="${include_header_cssStyles != null && fn:length(include_header_cssStyles) > 0}">
			<style type="text/css">
				${include_header_cssStyles}
			</style>
		</c:if>
		<c:forEach var="jsFile" items="${include_header_jsFiles}">
			<script type="text/javascript" src="<c:url value='${jsFile}?v=${v10MashupUI.lastModifiedDate}' />" charset="utf-8"></script>
		</c:forEach>
		<c:if test="${include_header_js != null && fn:length(include_header_js) > 0}">
			<script type="text/javascript" charset="utf-8">
				${include_header_js}
			</script>
		</c:if>
	</c:when>
	<c:when test="${position == 'BODY'}">
		<c:forEach var="jsFile" items="${include_body_jsFiles}">
			<script type="text/javascript" src="<c:url value='${jsFile}?v=${v10MashupUI.lastModifiedDate}' />" charset="utf-8"></script>
		</c:forEach>
		<c:if test="${include_body_js != null && fn:length(include_body_js) > 0}">
			<script type="text/javascript" charset="utf-8">
				${include_body_js}
			</script>
		</c:if>
	</c:when>
</c:choose>
