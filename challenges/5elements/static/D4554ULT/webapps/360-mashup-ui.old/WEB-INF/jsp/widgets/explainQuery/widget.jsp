<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>

<render:import varWidget="widget" varFeeds="feeds"/>

<config:getOption var="displayOptionsArgs" name="displayOptionsArgs" />
<config:getOption var="displayOptionsOpts" name="displayOptionsOpts" />
<config:getOption var="displayOptionsEstCounts" name="displayOptionsEstCounts" />
<config:getOption  var="displayOptionsContribCounts" name="displayOptionsContribCounts" />
<config:getOption  var="displayOptionsLWFromContribution" name="displayOptionsLWFromContribution" />
<config:getOption  var="expandedByDefault" name="expandedByDefault" />

<search:getFeed var="feed" feeds="${feeds}" />
<c:set var="astjson" value="${feed.infos.queryASTJson}" />

<widget:widget varCssId="cssId" extraCss="explainQueryWidget">

	<widget:header>
		<config:getOption var="title" name="title" />
	</widget:header>

	<widget:content>
		<div class="explainQuery">
			<div class="toggleExplain">
				<c:choose>
					<c:when test="${! empty astjson}">
						<a class="toggleExplain" href="#">Display the query explanation</a>

						<render:renderScript>
							$(document).ready(function() {
								$("#${cssId}").find("a.toggleExplain").click(function() {
									$(this).hide();
									drawQueryAST("${cssId}",$("#${cssId} div.explainQueryContainer"), ${astjson},{args:${displayOptionsArgs}, opts:${displayOptionsOpts}, estCounts:${displayOptionsEstCounts}, contribCounts:${displayOptionsContribCounts}, lwFromContribution:${displayOptionsLWFromContribution}});
									return false;
								});
							<c:if test="${expandedByDefault}">
								$("#${cssId}").find("a.toggleExplain").trigger('click');
							</c:if>
							});
						</render:renderScript>

						<render:renderOnce id="queryExplainExecuteOnce">
							<render:renderScript position="BEFORE">
								function queryRemoveExplain(cssId) {
									var w = $("#" + cssId);
									w.find("a.toggleExplain").show();
									w.find("div.explainQueryContainer").empty();
								}
							</render:renderScript>
						</render:renderOnce>
					</c:when>
					<c:otherwise>
						<p>[no query ast for answer. Make sure that the 'debug' parameter contains at least 'ast'.]</p>
					</c:otherwise>
				</c:choose>
			</div>
			<div class="explainQueryContainer"></div>
		</div>
	</widget:content>
</widget:widget>