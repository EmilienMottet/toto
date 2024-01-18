<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>

<render:import varFeeds="feeds" varWidget="widget" parameters="facet,category" />

<%-- Aggregation Functions --%>
<config:getOptions var="aggregFuncs" name="facet_funcsAggregation" defaultValue="" />


<h1>${facet.id} (${facet.path})</h1>

<h2>${category.description}</h2>
Count: ${category.count} <br />
Score: ${category.score} <br />
<c:forEach var="aggregFunc" items="${aggregFuncs}">
	<search:getCategoryValue var="aggregValue" category="${category}" name="${aggregFunc}" defaultValue="0" />
	${aggregFunc}: ${aggregValue}<br />
</c:forEach>

<search:getCategoryUrl var="categoryUrl" category="${category}" feeds="${feeds}" />
<search:getCategoryState varClassName="className" category="${category}" />

<a href="${categoryUrl}" class="${className}">Refine</a> - <a href="http://exalead.com">Exalead.com</a>

<script>
	console.log('hey hey hey', this);
</script>

<hr />

<c:if test="true">This condition is true</c:if>


<h1>
	<a href="${categoryUrl}" class="${className}">
		<search:getCategoryLabel category="${category}" />
	</a>
</h1>

<hr />

<search:forEachCategory var="subCategory" root="${category}">
	<search:getCategoryLabel category="${subCategory}" /> (${subCategory.count})
</search:forEachCategory>