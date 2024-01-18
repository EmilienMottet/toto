<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="url" uri="http://www.exalead.com/jspapi/url" %>
<%@ taglib prefix="list" uri="http://www.exalead.com/jspapi/list" %>
<%@ taglib prefix="map" uri="http://www.exalead.com/jspapi/map" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>

<render:import varWidget="widget" varFeeds="feeds" />

<config:getOption var="maxFontSize" name="maxFontSize" />
<config:getOption var="minFontSize" name="minFontSize" />
<config:getOption var="minFontThreshold" name="minFontThreshold" />
<config:getOption var="fadeEnabled" name="fadeEnabled" />
<config:getOption var="randomDisplace" name="randomDisplace" />
<config:getOption var="distinctFacets" name="distinctFacets" defaultValue="false"/>

<widget:widget extraCss="tc-wrapper-outer">

	<widget:header>
		<config:getOption name="title" defaultValue="" />
	</widget:header>

	<widget:content>
		<c:choose>
			<%-- If widget has no Feed --%>
			<c:when test="${search:hasFeeds(feeds) == false}">
				<render:definition name="noFeeds">
					<render:parameter name="widget" value="${widget}" />
					<render:parameter name="showSuggestion" value="false" />
				</render:definition>
			</c:when>

			<c:otherwise>

				<config:getOption var="facetPageName" name="facetPageName" defaultValue="" />
				<config:getOption var="countOrScore" name="countOrScore" />
				<config:getOption var="sortFacetMode" name="sortModeFacets" defaultValue="default" />
				<config:getOption var="facetRoot" name="facetRoot" />
				<config:getOption var="iterMode" name="iteration" />
				<config:getOption var="sortMode" name="sort" />
				<config:getOption var="limit" name="limit" defaultValue="0" />
				<config:getOptions var="forceRefineOnFeeds" name="forceRefineOnFeeds" />

				<%-- Get MAX/MIN values for 'scoring' and retrieve categories --%>
				<c:set var="scoreMax" value="0" />
				<c:set var="scoreMin" value="999999999" />
				<c:set var="categoriesCount" value="0" />
				<list:new var="categories" removeDuplicates="true"/>
				<map:new var="categoryGroup" />
				<search:forEachFacet var="facet" filterMode="include" facetsList="${facetRoot}" feeds="${feeds}" sortMode="${sortFacetMode}">
					<search:forEachCategory var="category" root="${facet}" iterationMode="${iterMode}" sortMode="${sortMode}" iteration="${limit}">
						<c:if test="${limit == 0 || categoriesCount < limit}">
							<search:getCategoryValue var="score" name="${countOrScore}" category="${category}" />
							<c:set var="scoreMax" value="${scoreMax > score ? scoreMax : score}" />
							<c:set var="scoreMin" value="${scoreMin < score ? scoreMin : score}" />
							<list:add value="${category}" list="${categories}"/>
							<c:set var="categoriesCount" value="${categoriesCount + 1}" />
						</c:if>
					</search:forEachCategory>
					<map:put key="${facet.id}" value="${categories}" map="${categoryGroup}"/>
					<list:new var="categories" removeDuplicates="true"/>
				</search:forEachFacet>
				<c:set var="scoreRange" value="${scoreMax-scoreMin == 0 ? 1 : scoreMax-scoreMin}" />
				<c:remove var="scoreMax" />

				<div class="med-padding tc-randdisp-${randomDisplace}" style="line-height: ${maxFontSize + 2}px">
					<c:choose>
						<c:when test="${categoriesCount > 0}">
							<c:forEach var="map" items="${categoryGroup}" varStatus="status">
								<c:forEach var="cat" items="${map.value}">
									<search:getCategoryUrl var="refineUrl" category="${cat}" feeds="${feeds}" baseUrl="${facetPageName}" forceRefineOn="${forceRefineOnFeeds}"/>
									<search:getCategoryState varClassName="className" category="${cat}" />
									<search:getCategoryValue var="catScore" name="${countOrScore}" category="${cat}" defaultValue="0" />
	
									<c:set var="catScore" value="${catScore - scoreMin}" />
									<c:set var="catScoreByRange" value="${catScore / scoreRange}" />
									<c:if test="${distinctFacets}">
										<c:set var="tagClass" value="tc-tag-${status.count}" />
									</c:if>
									<a class="${className} tc-tag ${tagClass} ${fadeEnabled && catScoreByRange < minFontThreshold ? 'tc-fade-this' : ''}"
										href="${refineUrl}" style="font-size: ${catScoreByRange > minFontThreshold ? (catScore*(maxFontSize-minFontSize) / scoreRange) + minFontSize : minFontSize}px;">
										<search:getCategoryLabel category="${cat}" />
										<span style="display: none;" class="tc-annotation-score">${catScoreByRange}</span>
									</a>
								</c:forEach>
							</c:forEach>
							<div class="clear"></div>
						</c:when>
						<c:otherwise>
							(No tags to display)
						</c:otherwise>
					</c:choose>
				</div>
			</c:otherwise>
		</c:choose>
	</widget:content>
</widget:widget>

<%-- JS to tweak opacity of tags that score < minFontThreshold --%>
<c:if test="${fadeEnabled}">
	<render:renderOnce id="tc-fade-js">
		<render:renderScript position="READY">
			$(".tc-cloud .tc-fade-this").fadeTo("fast", 0.8 + ($(this).find("span").html() / ${minFontThreshold}) * 0.2);
		</render:renderScript>
	</render:renderOnce>
</c:if>

<c:if test="${randomDisplace}">
	<render:renderOnce id="tc-random-js">
		<render:renderScript position="READY">
			<%-- Randomly displace tags --%>
			$(".tc-randdisp-true a").css({
				'left': function(){return parseInt(Math.random() * 10) - 5},
				'top': function(){return parseInt(Math.random() * 20) - 10}
			});
		</render:renderScript>
	</render:renderOnce>
</c:if>