<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="i18n" uri="http://www.exalead.com/jspapi/i18n" %>

<render:import parameters="feed,entry,widget" />
<render:import parameters="inline" ignore="true" />

<c:if test="${inline == null}">
	<c:set var="inline" value="false" />
</c:if>

<search:getEntryDownloadUrl var="downloadUrl" entry="${entry}" feed="${feed}" inline="${inline}" />
<c:choose>
	<c:when test="${downloadUrl != null}"><render:link href="${downloadUrl}" target="${inline?'_blank':null}"><i18n:message code="download" /></render:link></c:when>
	<c:otherwise><i18n:message code="download-unavailable" /></c:otherwise>
</c:choose>
