<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>

<render:import varWidget="widget" varFeeds="feeds" />

<render:renderOnce id="lightBoxPage">
	<render:renderScript>
		var l = new LighBoxPage(<config:getOption name="width" defaultValue="1050"/>, <config:getOption name="height" defaultValue="600"/>);
		
		<config:getOptions var="selectors" name="selectors" />
		<c:forEach var="selector" items="${selectors}">
			l.addSelector('${selector}');
		</c:forEach>
	</render:renderScript>
</render:renderOnce>