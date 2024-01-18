<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>

<render:import parameters="category" />
<render:import parameters="categoryUrl" ignore="true" />

<%-- Refinements links --%>
<render:link href="${categoryUrl}">
	<search:getCategoryLabel category="${category}" />
</render:link>
