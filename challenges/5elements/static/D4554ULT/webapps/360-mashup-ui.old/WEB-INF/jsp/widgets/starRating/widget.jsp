<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="string" uri="http://www.exalead.com/jspapi/string" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>

<render:import varWidget="widget" varFeeds="feeds" />

<config:getOption var="starWidth" name="starWidth" defaultValue="24" />
<config:getOption var="numStars" name="numStars" />
<config:getOption var="increment" name="increment" />
<config:getOption var="dbMeta" name="dbMeta" defaultValue=""/>
<config:getOption var="dbKey" name="dbKey" defaultValue="StarRating360Vote" />
<config:getOption var="showNumVotes" name="showNumVotes" defaultValue="false" />
<config:getOption var="rants" name="rants" defaultValue="" />
<config:getOption var="showAvgAfterVote" name="showAvgAfterVote" defaultValue="Average rating" />
<config:getOption var="showUnrated" name="showUnrated" defaultValue="false" />
<config:getOption var="numVotesFormat" name="numVotesFormat" defaultValue="(@numvotes@ votes)" />
<config:getOption var="exportMeta" name="exportMeta" />
<config:getOption var="readonly" name="readonly" defaultValue="false"/>

<search:getEntry var="entry" feeds="${feeds}" />
<c:choose>
	<c:when test="${dbMeta != ''}">
		<search:getMetaValue var="documentId" entry="${entry}" metaName="${dbMeta}" isHighlighted="false" />
	</c:when>
	<c:otherwise>
		<search:getEntryInfo var="documentId" name="url" entry="${entry}" />
	</c:otherwise>
</c:choose>
<search:getEntryInfo var="buildGroup" name="buildGroup" entry="${entry}" />
<search:getEntryInfo var="source" name="source" entry="${entry}" />

<c:set var="starContainerWidth" value="${starWidth * numStars}" />
<widget:widget varCssId="cssId" extraCss="starRating-wrapper">
	<div class="starRating">
		<div style="width: ${starContainerWidth}px;" class="stars empty"></div>
		<div style="width: 0px;" class="stars full"></div>
		<div style="width: ${starContainerWidth}px" class="sections"></div>
		<div class="offsetLeft" style="left: ${starContainerWidth}px">
			<c:if test="${showNumVotes == true}">
				<div class="totalVotes" title="Total number of votes">-</div>
			</c:if>
			<c:if test="${rants != ''}">
				<div class="rant"></div>
			</c:if>
		</div>
	</div>
	<div class="rating">Rating: <span class="value"></span></div>
</widget:widget>

<render:renderScript>
	StarRating360Service.registerWidget({widgetId: '${cssId}', numStars: ${numStars}, starWidth: ${starWidth}, increment: ${increment}, showAvgAfterVote: ${showAvgAfterVote == 'Average rating'}, showUnrated: ${showUnrated == true}, docBuildGroup: '${buildGroup}', docSource: '${source}', docId: "<string:escape value="${documentId}" />", meta: '${exportMeta}', rants: '${rants}', numVotesFormat: '${numVotesFormat}', dbKey: '${dbKey}' ,readonly: ${readonly} });
</render:renderScript>

<render:renderOnce id="StarRating360ServiceReady">
	<render:renderScript position="READY">
		StarRating360Service.start();
	</render:renderScript>
</render:renderOnce>
