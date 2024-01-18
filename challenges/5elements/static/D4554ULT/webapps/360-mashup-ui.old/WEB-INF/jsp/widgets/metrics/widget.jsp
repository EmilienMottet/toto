<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="tiles" uri="http://tiles.apache.org/tags-tiles" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="string" uri="http://www.exalead.com/jspapi/string" %>

<render:import varWidget="widget" varFeeds="feeds" />

<widget:widget>	
   	<widget:header>
   		<config:getOption name="title" defaultValue=""/>
	</widget:header>
	<widget:content extraCss="metrics">		
		<config:getOptionsComposite var="metrics" name="metrics" doEval="false" mapIndex="true" />
		<c:set var="width" value="${fn:substringBefore(100 / fn:length(metrics), '.') }" />		
		<c:forEach items="${metrics}" var="metric">
			<c:set var="evolutionClass"></c:set>
			<c:set var="evolutionValue"></c:set>
			<c:if test="${fn:length(metric.evolution) > 0}">
				<string:eval var="evolutionCondition" string="${metric.evolution}" feeds="${feeds}"/>				
				<c:choose>
					<c:when test="${evolutionCondition > 0.0}">
						<c:set var="evolutionValue"><span>&#9650;</span></c:set>												
						<c:set var="evolutionClass">positive</c:set>
						<c:if test="${metric.invertColor == 'true'}">
							<c:set var="evolutionClass">negative</c:set>	
						</c:if>
					</c:when>
					<c:when test="${evolutionCondition < 0.0}">
						<c:set var="evolutionValue"><span>&#9660;</span></c:set>						
						<c:set var="evolutionClass">negative</c:set>
						<c:if test="${metric.invertColor == 'true'}">
							<c:set var="evolutionClass">positive</c:set>	
						</c:if>
					</c:when>
					<c:otherwise>
						<c:set var="evolutionValue"><span>=</span></c:set>
					</c:otherwise>
				</c:choose>
			</c:if>
			<div class="metric-wrapper" style="width:${width}%;">
				<div class="metric-subwrapper">
					<div class="main ${evolutionClass}">${evolutionValue}<string:eval string="${metric.value}" feeds="${feeds}"/></div>
					<div class="description"><string:eval string="${metric.description}" feeds="${feeds}"/></div>
				</div>
			</div>
		</c:forEach>
		<div style="clear:both;"></div>
	</widget:content>
	<render:renderOnce id="metrics">
    	<render:renderScript position="READY">
			$('.metrics .main').scaleTextToFit();
		</render:renderScript>
    </render:renderOnce>
</widget:widget>