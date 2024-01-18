<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="url" uri="http://www.exalead.com/jspapi/url" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>

<render:import parameters="category" />
<render:import parameters="categoryUrl" ignore="true" />

<%-- Refinements links --%>
<render:link href="${categoryUrl}">
	<url:resource var="flagUrl" file="/resources/images/flags/${fn:toLowerCase(category.description)}.png" testIfExists="true"/>
	<c:if test="${flagUrl == null}">
		<url:resource var="flagUrl" file="/resources/images/flags/unknow.png" />
	</c:if>
	<img class="flag" src="${flagUrl}" />
	<search:getCategoryLabel category="${category}" />
</render:link>
