<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="request" uri="http://www.exalead.com/jspapi/request" %>

<render:import parameters="facet" />

<request:getCookieValue var="cookieValue" name="refine-${search:cleanFacetId(facet)}" defaultValue="" />
<h3 name="${search:cleanFacetId(facet)}" class="header_2 ${cookieValue}">
	<span class="collapsible"></span>
	<search:getFacetLabel facet="${facet}" />
	<span class="infos"></span>	
</h3>
