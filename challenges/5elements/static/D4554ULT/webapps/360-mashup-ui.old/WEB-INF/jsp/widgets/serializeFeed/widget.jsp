<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>

<render:import varFeeds="feeds" />

<config:getOption var="varSerialize" name="varSerialize" defaultValue="" />
<c:if test="${varSerialize != ''}">
	<render:renderScript position="BEFORE">
		<config:getOption var="serializeFacets" name="serializeFacets" defaultValue="true" />
		<config:getOption var="serializeHits" name="serializeHits" defaultValue="true" />
		var ${varSerialize} = <search:serializeFeed feeds="${feeds}" serializeFacets="${serializeFacets}" serializeHits="${serializeHits}" />;
	</render:renderScript>
</c:if>

<config:getOption var="jsRules" name="jsRules" defaultValue="" />
<c:if test="${jsRules != ''}">
	<render:renderScript>
		${jsRules}
	</render:renderScript>
</c:if>
