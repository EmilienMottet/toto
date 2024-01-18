<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>
<%@ taglib prefix="string" uri="http://www.exalead.com/jspapi/string" %>
<%@ taglib prefix="url" uri="http://www.exalead.com/jspapi/url" %>
<%@ taglib prefix="request" uri="http://www.exalead.com/jspapi/request" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>

<render:import varWidget="widget" varFeeds="feeds"/>

<widget:widget varCssId="cssId">
	
	<widget:header>
   		<config:getOption name="title" defaultValue=""/>
	</widget:header>
	
	<c:choose>
		<c:when test="${search:hasFeeds(feeds) == false}">
			<%-- If widget has no Feed --%>
			<render:definition name="noFeeds">
				<render:parameter name="widget" value="${widget}" />
				<render:parameter name="showSuggestion" value="false" />
			</render:definition>
			<%-- /If widget has no Feed --%>
		</c:when>
		<c:otherwise>
			<config:getOption var="facetId" name="facetId"/>	
			<search:getFacet var="facet" facetId="${facetId}" feeds="${feeds}"/>	
			
			<c:choose>
				<c:when test="${facet != null}">
					<config:getOptions var="forceRefineOnFeeds" name="forceRefineOnFeeds" />					
					<render:renderScript position="READY">
						(function () {
							
							var select = new exa.ui.SelectMenu('<div class="faceting-select-arrow"></div><search:getFacetLabel facet="${facet}"/>: ', ${facet.refinementPolicy == 'DISJUNCTIVE' }),
								item;
							select.addClass('faceting-select');
							<search:forEachCategory root="${facet}" var="category" varLevel="depthLevel" iterationMode="ALL">
									<search:getCategoryState var="state" category="${category}"/>
									<c:set var="catLabel"></c:set>
									<search:forEachCategoryPath var="subCat" category="${category}" varStatus="status">
											<c:set var="catLabel">${catLabel}<c:if test="${!status.first}">></c:if><string:escape escapeType="JAVASCRIPT"><search:getCategoryLabel category="${subCat}" /></string:escape></c:set>
									</search:forEachCategoryPath>						
									<c:choose>
										<c:when test="${facet.refinementPolicy == 'DISJUNCTIVE' }">
											item = new exa.ui.CheckBoxMenuItem('${catLabel}', '<search:getCategoryUrl category="${category}" feeds="${feeds}" forHtml="false" forceRefineOn="${forceRefineOnFeeds}"/>');
											<c:if test="${state == 'REFINED'}">
												item.setValue(true);
											</c:if>
										</c:when>
										<c:otherwise>
											item = new exa.ui.MenuItem('${catLabel}', '<search:getCategoryUrl category="${category}" feeds="${feeds}" forHtml="false" forceRefineOn="${forceRefineOnFeeds}"/>');
											<c:if test="${state == 'REFINED'}">
												item.addClass('refined');
											</c:if>
										</c:otherwise>
									</c:choose>				
									select.addItem(item);
									<c:if test="${state == 'REFINED'}">
										select.setSelected(item);
									</c:if>
							</search:forEachCategory>
						
							select.render(document.getElementById('${cssId}'));
							select.bind('action', function (e, data) {				
								exa.redirect(data.getData());
							});
							
							select.getMenu().addClass('faceting-select-menu');
						})();
					
					</render:renderScript>
				</c:when>
				<c:otherwise>
					<%-- If all feeds have no results --%>
					<config:getOption var="noResultsJspPathHit" name="noResultsJspPathHit" defaultValue="/WEB-INF/jsp/commons/noFacets.jsp" />
					<render:template template="${noResultsJspPathHit}">
						<render:parameter name="accessFeeds" value="${feeds}" />
						<render:parameter name="showSuggestion" value="true" />
					</render:template>
					<%-- /If all feeds have no results --%>
				</c:otherwise>
			</c:choose>
		</c:otherwise>
	</c:choose>
</widget:widget>
