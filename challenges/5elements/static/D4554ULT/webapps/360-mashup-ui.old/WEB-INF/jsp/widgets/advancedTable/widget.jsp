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

		<%-- If all feeds have no results --%>
		<c:when test="${search:hasEntries(feeds) == false}">
			<widget:content>
				<config:getOption var="noResultsJspPathHit" name="noResultsJspPathHit" defaultValue="/WEB-INF/jsp/commons/noResults.jsp" />
				<render:template template="${noResultsJspPathHit}">
					<render:parameter name="accessFeeds" value="${feeds}" />
					<render:parameter name="showSuggestion" value="true" />
				</render:template>
			</widget:content>
		</c:when>

		<c:otherwise>

			<config:getOption var="showThumbnail" name="showThumbnail" defaultValue="false" />
			<config:getOption var="showPreview" name="showPreview" defaultValue="false" />
			
			<config:getOption var="showRowNumber" name="showRowNumber" defaultValue="true" />
			<config:getOption var="draggableColumn" name="draggableColumn" defaultValue="true" />
			
			<config:getOption var="enablePagination" name="enablePagination" defaultValue="false" />
			<config:getOption var="paginationSize" name="paginationSize" defaultValue="10" />
			<config:getOption var="showDownload" name="showDownload" defaultValue="false" />
			<config:getOption var="wrapLimit" name="wrapLimit" defaultValue="300" />
			
			<config:getOption var="enablePermalink" name="enablePermalink" defaultValue="true" />
			<config:getOption var="enableSave" name="enableSave" defaultValue="true" />
			
			<config:getOption var="localStorageKey" name="storageKey"/>

			<div id="${ucssid}_content">
			</div>
			
			<render:renderScript position="READY">
				(function () {
					var columnIdx;
					var data = new exa.data.DataTable();
					<config:getOptionsComposite name="columns" var="columns" doEval="false" mapIndex="true"/>
					<c:if test="${showPreview || showDownload }">
						columnIdx = data.addColumn('string', 'Misc', 'misc');
						data.setColumnProperty(columnIdx, 'className', 'advanced-table-column-misc');
					</c:if>
					<c:if test="${showThumbnail}">
						columnIdx = data.addColumn('string', 'Thumbnail', 'thumbnail');
						data.setColumnProperty(columnIdx, 'className', 'advanced-table-column-thumbnail');
					</c:if>
					<c:forEach items="${columns}" var="column">
						columnIdx = data.addColumn('${(column.type == 'url') ? 'url' : column.type}', '<string:escape escapeType="JAVASCRIPT"><string:eval string="${column[\"name\"]}" feeds="${feeds}" /></string:escape>', '<string:escape escapeType="JAVASCRIPT"><string:eval string="${column.id}" feeds="${feeds}" /></string:escape>');
						data.setColumnProperty(columnIdx, 'className', 'advanced-table-column-<string:escape escapeType="JAVASCRIPT"><string:eval string="${column[\"id\"]}" feeds="${feeds}" /></string:escape>'); 
					</c:forEach>
										
					<%-- For each Feed used by this widget --%>
					<search:forEachFeed feeds="${feeds}" var="feed">
						<search:forEachEntry var="entry" feed="${feed}" varStatus="varStatus">
							<config:getOption name="hitUrl" var="hitUrl" feed="${feed}" entry="${entry}" />
							<url:url var="hitUrl" value="${hitUrl}" />
							<c:set var="isFirstValue" value="true" />
	 						data.addRow([
	 						<c:if test="${showPreview || showDownload }">
	 							<c:set var="isFirstValue" value="false" />
								'<string:escape escapeType="JAVASCRIPT">
									<c:if test="${showPreview == 'true'}">
										<c:choose>
											<c:when test="${search:hasEntryImagePreviewUrl(entry) || search:hasEntryHtmlPreviewUrl(entry)}">
												<span class="exa-button">
													<render:template template="previewInLightBox.jsp" widget="preview">
														<render:parameter name="feed" value="${feed}" />
														<render:parameter name="entry" value="${entry}" />
														<render:parameter name="widget" value="${widget}" />
													</render:template>
												</span>
											</c:when>
											<c:otherwise>
												<span class="exa-button exa-button-disabled">
													<span class="advancedtable-misc-btn advancedtable-preview-btn"></span>
												</span>
											</c:otherwise>
										</c:choose>
									</c:if>
									<c:if test="${showDownload == 'true'}">
										<search:getEntryDownloadUrl var="downloadUrl" entry="${entry}" feed="${feed}" />										
										<c:choose>
											<c:when test="${downloadUrl != null }">
												<span class="exa-button">
													<a class="advancedtable-misc-btn advancedtable-download-btn" href="${downloadUrl}"></a>
												</span>		
											</c:when>
											<c:otherwise>
												<span class="exa-button exa-button-disabled">
													<span class="advancedtable-misc-btn advancedtable-download-btn"></span>
												</span> 
											</c:otherwise>
										</c:choose>
									</c:if>
								</string:escape>'
	 						</c:if>
	 						<c:if test="${showThumbnail}">
	 							<c:choose>
									<c:when test="${isFirstValue}">
										<c:set var="isFirstValue" value="false" />
									</c:when>
									<c:otherwise>,</c:otherwise>
								</c:choose>
	 							'<string:escape escapeType="JAVASCRIPT"><div class="thumbnail"><render:template template="thumbnail.jsp" widget="thumbnail">
									<render:parameter name="feed" value="${feed}" />
									<render:parameter name="entry" value="${entry}" />
									<render:parameter name="widget" value="${widget}" />
									<render:parameter name="hitUrl" value="${hitUrl}" />
								</render:template></div></string:escape>'
	 						</c:if>
							<c:forEach items="${columns}" var="column">
								<c:choose>
									<c:when test="${isFirstValue}">
										<c:set var="isFirstValue" value="false" />
									</c:when>
									<c:otherwise>,</c:otherwise>
								</c:choose>
								<string:eval string="${column.value}" var="value" entry="${entry}" />																
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
												<string:eval var="numberDisplayedValue" string="${column.numberDisplayedValue}" feeds="${feeds}" entry="${entry}"/>		
												<c:set var="value">{v:${value},f:'<string:escape escapeType="JAVASCRIPT">${numberDisplayedValue}</string:escape>',l:''}</c:set>
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
												<string:eval var="inDateFormatter" string="${column.inDateFormatter}" feeds="${feeds}" entry="${entry}" />
												<string:eval var="outDateFormatter" string="${column.outDateFormatter}" feeds="${feeds}" entry="${entry}"/>
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
											<c:if test="${value != ''}">
											v:'${value}',
											f:'<a href="${value}"><string:escape escapeType="JAVASCRIPT"><string:eval string="${column.urlLabel}" entry="${entry}" /></string:escape></a>',
											l:'<string:escape escapeType="JAVASCRIPT"><string:eval string="${column.urlLabel}" entry="${entry}" /></string:escape>'
											</c:if>
											
											<c:if test="${value == ''}">
											v:'',
											f:'',
											l:''
											</c:if>
										}
									</c:when>
									<c:otherwise>
										${value}
									</c:otherwise>
								</c:choose>
							</c:forEach>
							]);
						</search:forEachEntry>
					</search:forEachFeed>
							
					var widgetTable = new TableWidget('${ucssid}_content', data, {
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
	                		configurationLoaded = widgetTable.loadConfiguration(${storageConf});
	             	   </c:if>	
	               	</c:if>
					
					<c:if test="${storageConf == null}">
						<storage:getUserValues key="${localStorageKey}" var="storageConf"/>
						<c:if test="${storageConf != null && fn:length(storageConf) > 0}">
							/* Load user configuration from storage */
							configurationLoaded = widgetTable.loadConfiguration(${storageConf[0]});
	             	   </c:if>
					</c:if>
					
					<c:if test="${storageConf == null || fn:length(storageConf) == 0}">
						/* Load user configuration from cookie */
						configurationLoaded = widgetTable.loadConfigurationString($.cookie('advancedTable_${widget.wuid}'));

						<config:getOption name="defaultConfigurationKey" var="storageKey" defaultValue="" />
						<c:if test="${fn:length(storageKey) > 0}">
		                	<storage:getSharedValue key="AdvancedTableConfigurations[]" var="storageConf" uniqueKey="${storageKey}"/>
		                	<c:if test="${storageConf != null}">
		                		if (!configurationLoaded) {
			                		/* Load default configuration */
			                		configurationLoaded = widgetTable.loadConfiguration(${storageConf});
								}
		             	   </c:if>	
		               	</c:if>
					</c:if>
										
					<c:if test="${enableSave}">
						<security:isUserConnected var="isUserConnected" />
						<c:if test="${fn:length(localStorageKey) == 0}">
							<c:set var="isUserConnected">false</c:set>
						</c:if>								
						widgetTable.enableSaveButton(${isUserConnected}, '${localStorageKey}', 'advancedTable_${widget.wuid}');
					</c:if>
					<c:if test="${enablePermalink}">
	                	widgetTable.enablePermalink('${widget.wuid}');
	                </c:if>
	                	                
	                <c:if test="${showPreview || showThumbnail }">
	                	widgetTable.bindRedrawFunction(${showPreview}, ${showThumbnail});
                	</c:if>
				})();
			</render:renderScript>
		</c:otherwise>
	</c:choose>
</widget:widget>

