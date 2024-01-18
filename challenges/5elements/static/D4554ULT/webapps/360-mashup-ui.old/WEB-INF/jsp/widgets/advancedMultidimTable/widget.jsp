<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="url" uri="http://www.exalead.com/jspapi/url" %>
<%@ taglib prefix="list" uri="http://www.exalead.com/jspapi/list" %>
<%@ taglib prefix="i18n" uri="http://www.exalead.com/jspapi/i18n" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="string" uri="http://www.exalead.com/jspapi/string" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="storage" uri="http://www.exalead.com/jspapi/storage" %>
<%@ taglib prefix="request" uri="http://www.exalead.com/jspapi/request" %>
<%@ taglib prefix="security" uri="http://www.exalead.com/jspapi/security" %>
<%@ taglib prefix="data" uri="http://www.exalead.com/jspapi/data" %>

<render:import varWidget="widget" varFeeds="feeds" />
<widget:widget varUcssId="ucssid">
	<widget:header>
		<config:getOption name="title" defaultValue="" />
	</widget:header>
	
	<config:getOption var="facetId" name="facetId" />
	<data:matrix var="mainDataSource" feeds="${feeds}" facet="${facetId}" />
	
	<c:choose>
		<%-- If widget has no Feed --%>
		<c:when test="${search:hasFeeds(feeds) == false}">
			<widget:content>
				<render:definition name="noFeeds">
					<render:parameter name="widget" value="${widget}" />
					<render:parameter name="showSuggestion" value="true" />
				</render:definition>
			</widget:content>
		</c:when>
		
		<c:when test="${mainDataSource == null}">
			<%-- If all feeds have no results --%>
			<config:getOption var="noResultsJspPathHit" name="noResultsJspPathHit" defaultValue="/WEB-INF/jsp/commons/noFacets.jsp" />
			<widget:content>
				<render:template template="${noResultsJspPathHit}">
					<render:parameter name="accessFeeds" value="${feeds}" />
					<render:parameter name="showSuggestion" value="true" />
				</render:template>
			</widget:content>
			<%-- /If all feeds have no results --%>
		</c:when>

		<c:otherwise>
			
			<config:getOption var="aggregation" name="aggregation" defaultValue="count" />
			
			<config:getOption var="showRowNumber" name="showRowNumber" defaultValue="true" />
			<config:getOption var="draggableColumn" name="draggableColumn" defaultValue="true" />
			
			<config:getOption var="enablePagination" name="enablePagination" defaultValue="false" />
			<config:getOption var="paginationSize" name="paginationSize" defaultValue="10" />
			
			<config:getOption var="enablePermalink" name="enablePermalink" defaultValue="true" />
			<config:getOption var="enableSave" name="enableSave" defaultValue="true" />
			
			<config:getOption var="localStorageKey" name="storageKey"/>
			
			<div id="${ucssid}_content">
			</div>
			
			<render:renderScript position="READY">
				(function () {
									
					var data = new exa.data.DataTable();
					
					<data:categoryList var="vCategoryList" data="${mainDataSource}" facetId="${mainDataSource.dimensionList[1]}" />
					<data:categoryList var="hCategoryList" data="${mainDataSource}" facetId="${mainDataSource.dimensionList[0]}" />
					
					var columnIdx = data.addColumn('string', '<i18n:message javaScriptEscape="true" text="${mainDataSource.dimensionList[1]}" code="${mainDataSource.dimensionList[1]}" />', 'id');
					data.setColumnProperty(columnIdx, 'className', 'advanced-table-column-id');
					
					<list:new var="hcatList" />					
					<c:forEach var="cat" items="${hCategoryList}">
						<search:getCategoryUrl var="categoryUrl" varClassName="className" baseUrl="${baseUrl}" category="${cat}" feeds="${feeds}" forceRefineOn="${forceRefineOnFeeds}" />
						
						<list:clear list="${hcatList}" />
						<list:add value="${cat}" list="${hcatList}" />
						<data:getValueType var="type" categories="${hcatList}" aggregation="${aggregation}" data="${mainDataSource}" />
						
						<c:choose>
							<c:when test="${type == 'STRING'}">
								columnIdx = data.addColumn('string',
									'<string:escape escapeType="JAVASCRIPT"><search:getCategoryLabel category="${cat}" /></string:escape>',
									'${cat.id}',
									'<render:link href="${categoryUrl}" extraCss="${className}"><search:getCategoryLabel category="${cat}" /></render:link>'
								);
							</c:when>
							<c:otherwise>
								columnIdx = data.addColumn('number',
									'<string:escape escapeType="JAVASCRIPT"><search:getCategoryLabel category="${cat}" /></string:escape>',
									'${cat.id}',
									'<render:link href="${categoryUrl}" extraCss="${className}"><search:getCategoryLabel category="${cat}" /></render:link>'
								);
							</c:otherwise>
						</c:choose>
						
						data.setColumnProperty(columnIdx, 'className', 'advanced-table-column-${cat.id}');
					</c:forEach>
					
					<c:forEach varStatus="varStatus" var="vCat" items="${vCategoryList}">
							
						<search:getCategoryUrl var="categoryUrl" varClassName="className" baseUrl="${baseUrl}" category="${vCat}" feeds="${feeds}" forceRefineOn="${forceRefineOnFeeds}" />
						data.addRow([
						'<render:link href="${categoryUrl}" extraCss="${className}"><search:getCategoryLabel category="${vCat}" /></render:link>'
						<list:new var="catList" />
						<c:forEach var="hCat" items="${hCategoryList}">
							<list:clear list="${catList}" />
							<list:add value="${vCat}" list="${catList}" />
							<list:add value="${hCat}" list="${catList}" />
							<data:getValue var="val" categories="${catList}" aggregation="${aggregation}" data="${mainDataSource}" />
							<c:choose>
								<c:when test="${val != null }">											
								<data:getValueType var="type" categories="${catList}" aggregation="${aggregation}" data="${mainDataSource}" />
								<c:choose>
									<c:when test="${type == 'STRING'}">
										,'${val}'
									</c:when>
									<c:otherwise>
										,<string:formatNumber>${val}</string:formatNumber>
									</c:otherwise>
								</c:choose>
								</c:when>
								<c:otherwise>
									,NaN
								</c:otherwise>
							</c:choose>
						</c:forEach>
						]);
					</c:forEach>					
					
	                var widget2DFacetTable_${ucssid} = new TableWidget('${ucssid}_content', data, {
						<c:if test="${enablePagination}">
						page:'enable',
						pageSize:${paginationSize},
						</c:if>
						showRowNumber:${showRowNumber},
						draggableColumn:${draggableColumn},
						columnFilter: <config:getOption name="enableColumnFilter" defaultValue="true" />,
						formatter:<config:getOption name="enableFormatter" defaultValue="true" />,
						alternatingRowStyle:true,
						enableSort:<config:getOption name="enableSort" defaultValue="true" />						
	               	});
	               	
	                var configurationLoaded = false;
	                <request:getParameterValue var="storageKey" name="${widget.wuid}_strgkey" defaultValue=""/>
					<c:if test="${fn:length(storageKey) > 0}">
	                	<storage:getSharedValue key="AdvancedTableConfigurations[]" var="storageConf" uniqueKey="${storageKey}"/>
	                	<c:if test="${storageConf != null}">
	                		/* Load permalink */
	                		configurationLoaded = widget2DFacetTable_${ucssid}.loadConfiguration(${storageConf});
	             	   </c:if>	
	               	</c:if>
					
					<c:if test="${storageConf == null}">
						<storage:getUserValues key="${localStorageKey}" var="storageConf"/>
						<c:if test="${storageConf != null && fn:length(storageConf) > 0}">
							/* Load user configuration from storage */
							configurationLoaded = widget2DFacetTable_${ucssid}.loadConfiguration(${storageConf[0]});
	             	   </c:if>
					</c:if>
					
					<c:if test="${storageConf == null || fn:length(storageConf) == 0}">
						/* Load user configuration from cookie */
						configurationLoaded = widget2DFacetTable_${ucssid}.loadConfigurationString($.cookie('advancedTable_${widget.wuid}'));

						<config:getOption name="defaultConfigurationKey" var="storageKey" defaultValue="" />
						<c:if test="${fn:length(storageKey) > 0}">
		                	<storage:getSharedValue key="AdvancedTableConfigurations[]" var="storageConf" uniqueKey="${storageKey}"/>
		                	<c:if test="${storageConf != null}">
		                		if (!configurationLoaded) {
			                		/* Load default configuration */
			                		configurationLoaded = widget2DFacetTable_${ucssid}.loadConfiguration(${storageConf});
								}
		             	   </c:if>	
		               	</c:if>
					</c:if>
					
					<c:if test="${enableSave}">
						<security:isUserConnected var="isUserConnected" />
						<c:if test="${fn:length(localStorageKey) == 0}">
							<c:set var="isUserConnected">false</c:set>
						</c:if>								
						widget2DFacetTable_${ucssid}.enableSaveButton(${isUserConnected}, '${localStorageKey}', 'advancedTable_${widget.wuid}', true);
					</c:if>
					<c:if test="${enablePermalink}">
	                	widget2DFacetTable_${ucssid}.enablePermalink('${widget.wuid}', true);
	                </c:if>
	                
	                <data:getRefines var="horizontalRefinedCategories" data="${mainDataSource}" dimension="${mainDataSource.dimensionList[0]}"/>
					<data:getRefines var="verticalRefinedCategories" data="${mainDataSource}" dimension="${mainDataSource.dimensionList[1]}"/>						
						
					<c:set var="lastLevelHorizontalRefined" value="false" />
					<c:if test="${fn:length(horizontalRefinedCategories) == 1}">
						<c:forEach var="horizontalCategory" items="${hCategoryList}">
							<search:getCategoryState varClassName="hState" category="${horizontalCategory}" />
							<c:set var="lastLevelHorizontalRefined" value="${ hState == 'refined' }" />
						</c:forEach>
					</c:if>
					<c:set var="lastLevelVerticalRefined" value="false" />
					<c:if test="${fn:length(verticalRefinedCategories) == 1}">
						<c:forEach var="verticalCategory" items="${vCategoryList}">
							<search:getCategoryState varClassName="vState" category="${verticalCategory}" />
							<c:set var="lastLevelVerticalRefined" value="${ vState == 'refined' }" />
						</c:forEach>
					</c:if>
					<c:set var="nbColumns">${fn:length(hCategoryList) }</c:set>
					<c:if test="${showSummaries}">
						<c:set var="nbColumns" value="${nbColumns + fn:length(aggregations)}" />
					</c:if>
					<c:if test="${fn:length(verticalRefinedCategories) > 0 && !lastLevelVerticalRefined}">
						widget2DFacetTable_${ucssid}.table.get$element().prepend('<string:escape escapeType="JAVASCRIPT"><div class="exa-advancedtable-refinements"><span><i18n:message code="verticalRefinedCategories" />:</span>
								<c:forEach var="verticalRefine" items="${verticalRefinedCategories}">
									<search:getCategoryState varClassName="className" category="${verticalRefine}" />
									<search:getCategoryUrl var="categoryUrl" baseUrl="${baseUrl}" category="${verticalRefine}" feeds="${feeds}" forceRefineOn="${forceRefineOnFeeds}" />
									<render:link href="${categoryUrl}" extraCss="${className}">
										<search:getCategoryLabel category="${verticalRefine}" />
									</render:link> 
								</c:forEach></div></string:escape>');
					</c:if>
					<c:if test="${fn:length(horizontalRefinedCategories) > 0 && !lastLevelHorizontalRefined}">
						widget2DFacetTable_${ucssid}.table.get$element().prepend('<string:escape escapeType="JAVASCRIPT"><div class="exa-advancedtable-refinements"><span><i18n:message code="horizontalRefinedCategories"/>:</span>
								<c:forEach var="horizontalRefine" items="${horizontalRefinedCategories}">
									<search:getCategoryState varClassName="className" category="${horizontalRefine}" />
									<search:getCategoryUrl var="categoryUrl" baseUrl="${baseUrl}" category="${horizontalRefine}" feeds="${feeds}" forceRefineOn="${forceRefineOnFeeds}" />
									<render:link href="${categoryUrl}" extraCss="${className}">
										<search:getCategoryLabel category="${horizontalRefine}" />
									</render:link>
								</c:forEach></div></string:escape>');
					</c:if>
				})();
			</render:renderScript>
		</c:otherwise>
	</c:choose>
</widget:widget>

