<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="request" uri="http://www.exalead.com/jspapi/request" %>
<%@ taglib prefix="string" uri="http://www.exalead.com/jspapi/string" %>

<render:import parameters="facet" />

<request:getCookieValue var="cookieVal" name="refineWidget" defaultValue="" />
<string:unescape var="cookieVal" escapeType="URL">${cookieVal}</string:unescape>
<string:split var="cookieValues" separator=";" string="${cookieVal}"/>

<c:set var="isCollapsed" value="false" />
<c:forEach var="val" items="${cookieValues}">
	<c:if test="${val == search:cleanFacetId(facet)}">
		<c:set var="isCollapsed" value="true" />
	</c:if>
</c:forEach>

<c:choose>
	<c:when test="${isCollapsed == 'false'}">
		<h3 name="${search:cleanFacetId(facet)}" class="sub-header-collapsable">
			<span class="icon-collapsable"></span>
			<search:getFacetLabel facet="${facet}" />
			<span class="infos"></span>	
		</h3>
	</c:when>

	<c:otherwise>
		<h3 name="${search:cleanFacetId(facet)}" class="sub-header-collapsed">
			<span class="icon-collapsed"></span>
			<search:getFacetLabel facet="${facet}" />
			<span class="infos"></span>	
		</h3>
	</c:otherwise>
</c:choose>
