<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>

<render:import varWidget="widget" varFeeds="feeds"/>

<%-- Fetch widget options --%>
<config:getOption var="displayOptionsArgs" name="displayOptionsArgs" />
<config:getOption var="displayOptionsOpts" name="displayOptionsOpts" />
<config:getOption var="displayOptionsPos" name="displayOptionsPos" />
<config:getOption var="displayOptionsRankings" name="displayOptionsRankings" />
<config:getOption var="expandedByDefault" name="expandedByDefault" />

<search:getEntry var="entry" feeds="${feeds}" />
<c:set var="astjson" value="${entry.infos.hitASTJson}" />

<widget:widget varCssId="widgetCssId" extraCss="explainMatch">
	<widget:header>
		<config:getOption var="title" name="title" />
	</widget:header>
	
	<widget:content>
		<div class="explainMatch">
			<div class="toggleExplain">
				<c:choose>
					<c:when test="${! empty astjson}">
						<a class="toggleExplain" href="#">Display the matching explanation for this hit</a>
						<render:renderScript>
						$(document).ready(function() {
							explainmatch("${widgetCssId}",${astjson},{args:${displayOptionsArgs}, opts:${displayOptionsOpts}, pos:${displayOptionsPos}, rankings:${displayOptionsRankings}, expanded:${expandedByDefault} });
						});
						</render:renderScript>
					</c:when>
					<c:otherwise>
						<p>[no hit ast information for entry. Make sure that the 'ast' hit_info option is supplied.]</p>
					</c:otherwise>
				</c:choose>
			</div>
			<div class="explainMatchContainer"></div>
		</div>
	</widget:content>
</widget:widget>
