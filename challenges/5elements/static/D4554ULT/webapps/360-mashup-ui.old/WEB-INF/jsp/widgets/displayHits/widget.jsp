<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="string" uri="http://www.exalead.com/jspapi/string" %>

<render:import varWidget="widget" varFeeds="feeds" />

<widget:widget extraCss="displayHits" varCssId="cssId">
	<c:choose>

		<%-- If widget has no Feed --%>
		<c:when test="${search:hasFeeds(feeds) == false}">
			<widget:header>
				<config:getOption name="title" defaultValue="" />
			</widget:header>
			<widget:content>
				<render:definition name="noFeeds">
					<render:parameter name="widget" value="${widget}" />
					<render:parameter name="showSuggestion" value="true" />
				</render:definition>
			</widget:content>
		</c:when>

		<%-- If all feeds have no results --%>
		<c:when test="${search:hasEntries(feeds) == false}">
			<widget:header>
				<config:getOption name="title" defaultValue="" />
			</widget:header>
			<widget:content>
				<config:getOption var="noResultsJspPathHit" name="noResultsJspPathHit" defaultValue="/WEB-INF/jsp/commons/noResults.jsp" />
				<render:template template="${noResultsJspPathHit}">
					<render:parameter name="accessFeeds" value="${feeds}" />
					<render:parameter name="showSuggestion" value="true" />
				</render:template>
			</widget:content>
			<%-- /If all feeds have no results --%>
		</c:when>

		<c:otherwise>

			<config:getOption var="templateBasePath" name="templateBasePath" defaultValue="templates/" />
			<config:getOption var="defaultJspPathHit" name="defaultJspPathHit" defaultValue="default/default.jsp" />

			<widget:header extraCss="rounded">
				<config:getOption name="title" defaultValue="" />
			</widget:header>

			<%-- Results --%>
			<ul class="hits">
				<search:forEachFeed feeds="${feeds}" var="feed" varStatus="accessFeedsStatus">
					<search:forEachEntry var="entry" feed="${feed}" varStatus="entryStatus">

						<%-- Retrieve hit properties  --%>
						<config:getOption var="hitTitle" name="hitTitle" defaultValue="${entry.title}" entry="${entry}" feed="${feed}" />
						<config:getOption var="hitUrl" name="hitUrl" entry="${entry}" feed="${feed}" />

						<%-- Renders a custom view for this hit --%>
						<config:getOption var="customJspPathHit" name="customJspPathHit" entry="${entry}" feed="${feed}" defaultValue="" />
						<render:template template="${templateBasePath}${customJspPathHit}" defaultTemplate="${templateBasePath}${defaultJspPathHit}">
							<render:parameter name="accessFeeds" value="${feeds}" />
							<render:parameter name="feed" value="${feed}" />
							<render:parameter name="entry" value="${entry}" />
							<render:parameter name="widget" value="${widget}" />
							<c:if test="${hitUrl != null}">
								<render:parameter name="hitUrl" value="${hitUrl}" />
							</c:if>
							<c:if test="${hitTitle != null}">
								<render:parameter name="hitTitle" value="${hitTitle}" />
							</c:if>
							<render:parameter name="accessFeedsStatus" value="${accessFeedsStatus}" />
							<render:parameter name="entryStatus" value="${entryStatus}" />
						</render:template>

					</search:forEachEntry>
				</search:forEachFeed>
			</ul>
			<%--  Handle HitDecorationInterface --%>
			<config:getOptionsComposite var="decorators" name="exa.io.HitDecorationInterface" separator="##" />
			<c:if test="${fn:length(decorators)>0}">
				<render:renderScript position="READY">	
					<c:forEach var="decorator" items="${decorators}">
						<c:if test="${fn:length(decorator[1])>0}">
							<c:set var="insertMethod" value="${decorator[2]}"/>
							<c:if test="${fn:length(insertMethod)==0}">
								<c:set var="insertMethod" value="prepend"/>
							</c:if>
							exa.io.register('exa.io.HitDecorationInterface', '${decorator[0]}', function (hitDecorationInterface) {
								<search:forEachFeed feeds="${feeds}" var="feed" varStatus="accessFeedsStatus">
									<search:forEachEntry var="entry" feed="${feed}">
										$('#${cssId}').find('<string:eval string="${decorator[1]}" entry="${entry}" feed="${feed}" />')
											.each(function() {
												var decorationHtml = hitDecorationInterface.getDecoration('${search:cleanEntryId(entry)}');
												if (decorationHtml) {
													$(decorationHtml).${insertMethod}To(this);
													hitDecorationInterface.afterDecorating('${search:cleanEntryId(entry)}');
												}
											});
									</search:forEachEntry>
								</search:forEachFeed>
							});
						</c:if>
					</c:forEach>					
				</render:renderScript>
			</c:if>
		</c:otherwise>
	</c:choose>
</widget:widget>

