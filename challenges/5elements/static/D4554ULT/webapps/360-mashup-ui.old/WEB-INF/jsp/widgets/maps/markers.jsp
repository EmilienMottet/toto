<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="string" uri="http://www.exalead.com/jspapi/string" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>
<%@ taglib prefix="url" uri="http://www.exalead.com/jspapi/url" %>

<render:import varFeeds="feeds" />

<%--
	*********
	 ENTRIES
	*********
--%>
<config:getOption var="location" name="location" defaultValue="" doEval="false"/>
<config:getOption var="addr" name="addr" defaultValue="" doEval="false"/>
<c:if test="${fn:length(location) > 0 || fn:length(addr) > 0 }">
	<search:forEachFeed var="feed" feeds="${feeds}">
		<search:forEachEntry var="entry" feed="${feed}">
			<config:getOption var="location" name="location" entry="${entry}" feed="${feed}" isHighlighted="false" defaultValue=""/>
			<config:getOption var="addr" name="addr" entry="${entry}" feed="${feed}" isHighlighted="false" defaultValue=""/>
			<c:if test="${fn:length(location) > 1 || fn:length(addr) > 0}">
				<config:getOption var="iconUrl" name="iconUrl" entry="${entry}" feed="${feed}" defaultValue=""/>
				<config:getOption var="hitUrl" name="hitUrl" entry="${entry}" feed="${feed}" defaultValue=""/>
				<c:if test="${fn:length(hitUrl)>0}">
					<url:url var="hitUrl" value="${hitUrl}" />
					<c:if test="${hitUrl == null}">
						<c:set var="hitUrl"></c:set>
					</c:if>
				</c:if>				
				<config:getOption var="messagePopup" name="messagePopup" entry="${entry}" feed="${feed}" defaultValue=""/>
				<config:getOption var="popupTemplatePath" name="popupTemplatePath" entry="${entry}" feed="${feed}" defaultValue=""/>		
				<string:escape escapeType="JAVASCRIPT" var="messagePopup">
					<c:choose>
						<c:when test="${fn:length(popupTemplatePath) > 0}">
							<render:template template="${popupTemplatePath}">
								<render:parameter name="feed" value="${feed}" />
								<render:parameter name="entry" value="${entry}" />
							</render:template>
						</c:when>
						<c:when test="${fn:length(messagePopup) > 0}">
							${messagePopup}
						</c:when>
					</c:choose>
				</string:escape>
				<render:template template="addMarker.jsp">		
					<render:parameter name="id" value="${search:cleanEntryId(entry)}"/>
					<render:parameter name="addr" value="${addr}"/>
					<render:parameter name="location" value="${location}"/>
					<render:parameter name="iconUrl" value="${iconUrl}"/>
					<render:parameter name="hitUrl" value="${hitUrl}"/>
					<render:parameter name="messagePopup" value="${messagePopup}"/>			
				</render:template>
			</c:if>
		</search:forEachEntry>
	</search:forEachFeed>
</c:if>
<%--
	********
	 FACETS 
	********
--%>
<config:getOption var="facetsList" name="facetsList" defaultValue=""/>
<c:if test="${fn:length(facetsList) > 0}">
	<config:getOption var="facet_popupTemplatePath" name="facet_popupTemplatePath" defaultValue=""/>
	<config:getOption var="facet_iterMode" name="facet_iterMode" defaultValue="flat"/>
	<config:getOption var="facet_nbSubFacets" name="facet_nbSubFacets" defaultValue="1000"/>
	<config:getOptions var="forceRefineOnFeeds" name="forceRefineOnFeeds" defaultValue=""/>

	<%-- For each Facets used by this widget --%>
	<search:forEachFacet 
		var="facet"
		feeds="${feeds}"
		filterMode="INCLUDE"
		facetsList="${facetsList}">
		<search:forEachCategory 
			root="${facet}"
			var="category"
			iteration="${facet_nbSubFacets}"
			iterationMode="${facet_iterMode}">				
			<config:getOption var="location" name="facet_location" feeds="${feeds}" facet="${facet}" category="${category}" isHighlighted="false" defaultValue=""/>
			<config:getOption var="addr" name="facet_addr" feeds="${feeds}" facet="${facet}" category="${category}" isHighlighted="false" defaultValue=""/>
			<c:if test="${fn:length(location) > 1 || fn:length(addr) > 0}">				
				<config:getOption var="iconUrl" name="facet_iconUrl" feeds="${feeds}" facet="${facet}" category="${category}" defaultValue=""/>
				<config:getOption var="facet_hitFacetPageName" name="facet_hitFacetPageName" feeds="${feeds}" facet="${facet}" category="${category}" defaultValue=""/>
				<config:getOption var="facet_messagePopup" name="facet_messagePopup" feeds="${feeds}" facet="${facet}" category="${category}" defaultValue="" />
				<search:getCategoryUrl var="hitUrl" baseUrl="${facet_hitFacetPageName}" category="${category}" feeds="${feeds}" forceRefineOn="${forceRefineOnFeeds}" forHtml="false"  />
				
				<string:escape escapeType="JAVASCRIPT" var="messagePopup">
					<c:choose>
						<c:when test="${fn:length(facet_popupTemplatePath) > 0}">
							<render:template template="${facet_popupTemplatePath}">
								<render:parameter name="facet" value="${facet}" />
								<render:parameter name="category" value="${category}" />
							</render:template>
						</c:when>					
						<c:when test="${fn:length(facet_messagePopup) > 0}">
							<config:getOption name="facet_messagePopup" defaultValue="" feeds="${feeds}" facet="${facet}" category="${category}"/>
						</c:when>
					</c:choose>
				</string:escape>
				<render:template template="addMarker.jsp">		
					<render:parameter name="id" value="${category.id}"/>
					<render:parameter name="addr" value="${addr}"/>
					<render:parameter name="location" value="${location}"/>
					<render:parameter name="iconUrl" value="${iconUrl}"/>
					<render:parameter name="hitUrl" value="${hitUrl}"/>
					<render:parameter name="messagePopup" value="${messagePopup}"/>			
				</render:template>
			</c:if>
		</search:forEachCategory>
	</search:forEachFacet>
	<%-- /For each Facets used by this widget --%>
</c:if>