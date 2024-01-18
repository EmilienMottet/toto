<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="url" uri="http://www.exalead.com/jspapi/url" %>
<%@ taglib prefix="list" uri="http://www.exalead.com/jspapi/list" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="string" uri="http://www.exalead.com/jspapi/string" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="storage" uri="http://www.exalead.com/jspapi/storage" %>
<%@ taglib prefix="request" uri="http://www.exalead.com/jspapi/request" %>
<%@ taglib prefix="security" uri="http://www.exalead.com/jspapi/security" %>

<render:import varWidget="widget" varFeeds="feeds" />
<widget:widget varUcssId="ucssid">
	<widget:header>
		<config:getOption name="title" defaultValue="" />
	</widget:header>
	
	<config:getOption var="facetId" name="facetId" />
	<search:getFacet var="facet" facetId="${facetId}" feeds="${feeds}"/>
	
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
		
		<c:when test="${facet == null}">
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
			
			<config:getOption var="showRowNumber" name="showRowNumber" defaultValue="true" />
			<config:getOption var="draggableColumn" name="draggableColumn" defaultValue="true" />
			
			<config:getOption var="enablePagination" name="enablePagination" defaultValue="false" />
			<config:getOption var="paginationSize" name="paginationSize" defaultValue="10" />
			<config:getOption var="wrapLimit" name="wrapLimit" defaultValue="300" />
			
			<config:getOption var="enablePermalink" name="enablePermalink" defaultValue="true" />
			<config:getOption var="enableSave" name="enableSave" defaultValue="true" />			
			
			<config:getOption var="localStorageKey" name="storageKey"/>
			
			
			<config:getOption var="sortMode" name="sortMode" defaultValue="default" />
			<config:getOption var="iterMode" name="iterMode" defaultValue="default" />			

			<div id="${ucssid}_content">
			</div>
			
			<render:renderScript position="READY">
				(function () {
									
					var data = new exa.data.DataTable();
					var columnIdx;
					
					<config:getOptionsComposite name="columns" var="columns" doEval="false" mapIndex="true"/>
					<c:forEach items="${columns}" var="column">
						columnIdx = data.addColumn('${(column.type == 'url') ? 'url' : column.type}', '<string:escape escapeType="JAVASCRIPT"><string:eval string="${column[\"name\"]}" feeds="${feeds}" /></string:escape>', '<string:escape escapeType="JAVASCRIPT"><string:eval string="${column.id}" feeds="${feeds}" /></string:escape>');
						data.setColumnProperty(columnIdx, 'className', 'advanced-table-column-<string:escape escapeType="JAVASCRIPT"><string:eval string="${column.id}" feeds="${feeds}" /></string:escape>');						 
					</c:forEach>
					
					<search:forEachCategory 
						var="category"
						root="${facet}"
						sortMode="${sortMode}"
						iterationMode="${iterMode}"
						showEmptyCategories="false">
						<c:set var="isFirstValue" value="true" />
						data.addRow([
						<c:forEach items="${columns}" var="column">
							<c:choose>
								<c:when test="${isFirstValue}">
									<c:set var="isFirstValue" value="false" />
								</c:when>
								<c:otherwise>,</c:otherwise>
							</c:choose>
							<string:eval string="${column.value}" var="value" feeds="${feeds}" facet="${facet}" category="${category}"/>																
							<c:choose>
								<c:when test="${column.type == 'string'}">
									'<string:escape escapeType="JAVASCRIPT" value="${value}"/>'
								</c:when>
								<c:when test="${column.type == 'number'}">
									<c:choose>
										<c:when test="${fn:length(value) == 0}">
											<c:set var="value">{v:Number.NaN,f:''}</c:set>
										</c:when>
										<c:when test="${fn:length(column.numberDisplayedValue) > 0 }">												
											<string:eval var="numberDisplayedValue" string="${column.numberDisplayedValue}" feeds="${feeds}" facet="${facet}" category="${category}"/>		
											<c:set var="value">{v:${value},f:'<string:escape escapeType="JAVASCRIPT">${numberDisplayedValue}</string:escape>'}</c:set>
										</c:when>
									</c:choose>
									${value}
								</c:when>
								<c:when test="${column.type == 'date'}">
									<c:choose>
										<c:when test="${fn:length(value) == 0}">
											{
												v:null,
												f:'',
												l:''
											}
										</c:when>
										<c:otherwise>
											<string:eval var="inDateFormatter" string="${column.inDateFormatter}" feeds="${feeds}" facet="${facet}" category="${category}"/>
											<string:eval var="outDateFormatter" string="${column.outDateFormatter}" feeds="${feeds}" facet="${facet}" category="${category}"/>
											<fmt:parseDate var="dateObj" value="${value}" pattern="${inDateFormatter}"/>
											<fmt:formatDate var="month" value="${dateObj}" pattern="M"/> 										
											{
												v:new Date(<fmt:formatDate value="${dateObj}" pattern="yyyy"/>,${month-1},<fmt:formatDate value="${dateObj}" pattern="d"/>,<fmt:formatDate value="${dateObj}" pattern="H"/>,<fmt:formatDate value="${dateObj}" pattern="m"/>,<fmt:formatDate value="${dateObj}" pattern="s"/>,<fmt:formatDate value="${dateObj}" pattern="S"/>),
												f:'<fmt:formatDate value="${dateObj}" pattern="${outDateFormatter}"/>',
												l:''
											}
										</c:otherwise>
									</c:choose>
								</c:when>
								<c:when test="${column.type == 'url'}">	
									
									<string:escape var="value" value="${value}" escapeType="JAVASCRIPT"/>
									{
										v:'${value}',
										f:'<a href="${fn:startsWith(value,'http://') ? '' : 'http://'}${value}"><string:escape escapeType="JAVASCRIPT"><string:eval string="${column.urlLabel}" feeds="${feeds}" facet="${facet}" category="${category}" /></string:escape></a>',
										l:'<string:escape escapeType="JAVASCRIPT"><string:eval string="${column.urlLabel}" feeds="${feeds}" category="${category}" facet="${facet}" /></string:escape>'
									}
								</c:when>
								<c:otherwise>
									${value}
								</c:otherwise>
							</c:choose>
						</c:forEach>
						]);						
					</search:forEachCategory>					
				
					var widgetAdvancedFacetTable_${ucssid} = new TableWidget('${ucssid}_content', data, {
						<c:if test="${enablePagination}">
						page:'enable',
						pageSize:${paginationSize},
						</c:if>
						showRowNumber:${showRowNumber},
						draggableColumn:${draggableColumn},
						alternatingRowStyle:true,
						columnFilter: <config:getOption name="enableColumnFilter" defaultValue="true" />,
						formatter:<config:getOption name="enableFormatter" defaultValue="true" />,
						enableSort:<config:getOption name="enableSort" defaultValue="true" />						
	               	});
	               	
	                var configurationLoaded = false;
	                <request:getParameterValue var="storageKey" name="${widget.wuid}_strgkey" defaultValue=""/>
					<c:if test="${fn:length(storageKey) > 0}">
	                	<storage:getSharedValue key="AdvancedTableConfigurations[]" var="storageConf" uniqueKey="${storageKey}"/>
	                	<c:if test="${storageConf != null}">
	                		/* Load permalink */
	                		configurationLoaded = widgetAdvancedFacetTable_${ucssid}.loadConfiguration(${storageConf});
	             	   </c:if>	
	               	</c:if>
					
					<c:if test="${storageConf == null}">
						<storage:getUserValues key="${localStorageKey}" var="storageConf"/>
						<c:if test="${storageConf != null && fn:length(storageConf) > 0}">
							/* Load user configuration from storage */
							configurationLoaded = widgetAdvancedFacetTable_${ucssid}.loadConfiguration(${storageConf[0]});
	             	   </c:if>
					</c:if>
					
					<c:if test="${storageConf == null || fn:length(storageConf) == 0}">
						/* Load user configuration from cookie */
						configurationLoaded = widgetAdvancedFacetTable_${ucssid}.loadConfigurationString($.cookie('advancedTable_${widget.wuid}'));

						<config:getOption name="defaultConfigurationKey" var="storageKey" defaultValue="" />
						<c:if test="${fn:length(storageKey) > 0}">
		                	<storage:getSharedValue key="AdvancedTableConfigurations[]" var="storageConf" uniqueKey="${storageKey}"/>
		                	<c:if test="${storageConf != null}">
		                		if (!configurationLoaded) {
			                		/* Load default configuration */
			                		configurationLoaded = widgetAdvancedFacetTable_${ucssid}.loadConfiguration(${storageConf});
								}
		             	   </c:if>	
		               	</c:if>
					</c:if>
					
					<c:if test="${enableSave}">
						<security:isUserConnected var="isUserConnected" />
						<c:if test="${fn:length(localStorageKey) == 0}">
							<c:set var="isUserConnected">false</c:set>
						</c:if>								
						widgetAdvancedFacetTable_${ucssid}.enableSaveButton(${isUserConnected}, '${localStorageKey}', 'advancedTable_${widget.wuid}');
					</c:if>
					<c:if test="${enablePermalink}">
	                	widgetAdvancedFacetTable_${ucssid}.enablePermalink('${widget.wuid}');
	                </c:if>
				})();
			</render:renderScript>
		</c:otherwise>
	</c:choose>
</widget:widget>

