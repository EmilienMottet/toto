<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="url" uri="http://www.exalead.com/jspapi/url" %>
<%@ taglib prefix="list" uri="http://www.exalead.com/jspapi/list" %>
<%@ taglib prefix="i18n" uri="http://www.exalead.com/jspapi/i18n" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="string" uri="http://www.exalead.com/jspapi/string" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>

<render:import varFeeds="feeds" varWidget="widget" />

<widget:widget extraCss="displayHitsAsTable" varCssId="cssId">

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

				<config:getOption var="summary" name="summary" defaultValue="" />
				<config:getOption var="showThumbnail" name="showThumbnail" defaultValue="false" />
				<config:getOption var="showTitle" name="showTitle" defaultValue="true" />
				<config:getOption var="showContent" name="showContent" defaultValue="false" />
				<config:getOption var="showScore" name="showScore" defaultValue="false" />
				<config:getOption var="showHitMetas" name="showHitMetas" defaultValue="true" />
				<config:getOption var="showHitFacets" name="showHitFacets" defaultValue="true" />
				<config:getOption var="showPreview" name="showPreview" defaultValue="false" />
				<config:getOption var="showDownload" name="showDownload" defaultValue="false" />
				<config:getOption var="wrapLimit" name="wrapLimit" defaultValue="300" />
				<config:getOptionsComposite var="columnTitle" name="columnTitle" />
				<list:toMap var="columnTitle" list="${columnTitle}" />

				<c:if test="${showTitle == true}">
					<config:getOption var="hitUrlTarget" name="hitUrlTarget" defaultValue="" />
					<c:set var="hitUrlTarget" value="${hitUrlTarget == 'New Page' ? '_blank' : ''}" />
				</c:if>

				<c:choose>
					<c:when test="${showHitMetas == true}">
						<config:getOption var="metaFilterMode" name="filterMetas" defaultValue="No filtering" />
						<config:getOption var="metaList" name="metas" defaultValue="" />
						<config:getOption var="metaShowEmpty" name="showEmptyMetas" defaultValue="false" />
						<config:getOption var="metaSortMode" name="sortModeMetas" defaultValue="default" />
						<config:getOption var="metaUrlTarget" name="metaUrlTarget" defaultValue="" />
						<c:set var="metaUrlTarget" value="${metaUrlTarget == 'New Page' ? '_blank' : ''}" />
						<config:getOptionsComposite var="sortableMetas" name="sortableMetas" />
						<list:toMap var="sortableMetas" list="${sortableMetas}" />
						<search:getMetasList var="metaNames" feeds="${feeds}" showEmptyMetas="${metaShowEmpty}" filterMode="${metaFilterMode}" metasList="${metaList}" sortMode="${metaSortMode}" />
					</c:when>
					<c:otherwise>
						<list:new var="metaNames" />
					</c:otherwise>
				</c:choose>

				<c:choose>
					<c:when test="${showHitFacets == true}">
						<config:getOption var="facetFilterMode" name="hitFacetsListMode" defaultValue="No filtering" />
						<config:getOption var="facetList" name="hitFacetsList" defaultValue="" />
						<config:getOption var="facetShowEmpty" name="showEmptyFacets" defaultValue="false" />
						<config:getOption var="facetSortMode" name="sortModeFacets" defaultValue="default" />
						<config:getOption var="templateBasePath" name="templateBasePath" defaultValue="templates/" />
						<config:getOption var="facetTemplateDirectory" name="facetTemplateDirectory" defaultValue="default" />
						<c:set var="facetTemplateDirectory" value="${templateBasePath}${facetTemplateDirectory}" />
						<search:getFacetsList var="facetIds" varPaths="facetPaths" feeds="${feeds}" showEmptyFacets="${facetShowEmpty}" filterMode="${facetFilterMode}" facetsList="${facetList}" sortMode="${facetSortMode}" />
					</c:when>
					<c:otherwise>
						<list:new var="facetIds" />
					</c:otherwise>
				</c:choose>

				<table summary="${summary}" class="table table-striped table-grid table-hover data-table fixed">
					<%-- Table Header --%>
					<tr class="top">
						<c:if test="${showThumbnail == 'true'}">
							<th class="column column_thumbnail">
								<c:choose>
									<c:when test="${columnTitle['image'] != null}">
										<string:eval string="${columnTitle['image'][0]}" feeds="${feeds}" />
									</c:when>
									<c:otherwise>
										<i18n:message code="image"/>
									</c:otherwise>
								</c:choose>
							</th>
						</c:if>

						<c:if test="${showTitle == 'true'}">
							<th class="column column_title">
								<c:choose>
									<c:when test="${columnTitle['title'] != null}">
										<string:eval string="${columnTitle['title'][0]}" feeds="${feeds}" />
									</c:when>
									<c:otherwise>
										<i18n:message code="title"/>
									</c:otherwise>
								</c:choose>
							</th>
						</c:if>

						<c:if test="${showContent == 'true'}">
							<th class="column column_content">
								<c:choose>
									<c:when test="${columnTitle['content'] != null}">
										<string:eval string="${columnTitle['content'][0]}" feeds="${feeds}" />
									</c:when>
									<c:otherwise>
										<i18n:message code="content"/>
									</c:otherwise>
								</c:choose>
							</th>
						</c:if>

						<c:if test="${showScore == 'true'}">
							<th class="column column_score">
								<c:choose>
									<c:when test="${columnTitle['score'] != null}">
										<string:eval string="${columnTitle['score'][0]}" feeds="${feeds}" />
									</c:when>
									<c:otherwise>
										<i18n:message code="score"/>
									</c:otherwise>
								</c:choose>
							</th>
						</c:if>

						<%-- Iteration over Metas --%>
						<c:forEach var="metaName" items="${metaNames}" varStatus="status">
							<th class="column column_${status.index} column_meta column_${search:cleanMetaId(metaName)}">
								<c:choose>
									<c:when test="${columnTitle[metaName] != null}">
										<string:eval string="${columnTitle[metaName][0]}" feeds="${feeds}" />
									</c:when>
									<c:otherwise>
										<search:getMetaLabel metaName="${metaName}" />
									</c:otherwise>
								</c:choose>

								<%-- Check if this column can be sorted --%>
								<c:if test="${sortableMetas[metaName] != null}">
									<search:getSortUrl var="sortUrlDisabled" feeds="${feeds}" />
									<search:getSortUrl var="sortUrlAsc" varState="sortStateAsc" feeds="${feeds}" expr="${sortableMetas[metaName][0]}" forceReverse="true"/>
									<search:getSortUrl var="sortUrlDesc" varState="sortStateDesc" feeds="${feeds}" expr="${sortableMetas[metaName][0]}" forceReverse="false"/>
									<c:choose>
										<c:when test="${sortStateDesc == 'ordered_desc'}">
											<a href="${sortUrlDisabled}" class="sort" title="<i18n:message code="sort_disable_descending" />"><img src="<url:resource file="images/arrow_state_blue_expanded.png" />" /></a>
											<a href="${sortUrlAsc}" class="sort" title="<i18n:message code="sort_ascending" />"><img src="<url:resource file="images/arrow_state_grey_collapsed.png" />" /></a>
										</c:when>
										<c:when test="${sortStateAsc == 'ordered_asc'}">
											<a href="${sortUrlDesc}" class="sort" title="<i18n:message code="sort_descending" />"><img src="<url:resource file="images/arrow_state_grey_expanded.png" />" /></a>
											<a href="${sortUrlDisabled}" class="sort" title="<i18n:message code="sort_disable_ascending" />"><img src="<url:resource file="images/arrow_state_blue_collapsed.png" />" /></a>
										</c:when>
										<%-- Sort is disable --%>
										<c:otherwise>
											<a href="${sortUrlDesc}" class="sort" title="<i18n:message code="sort_descending" />"><img src="<url:resource file="images/arrow_state_grey_expanded.png" />" /></a>
											<a href="${sortUrlAsc}" class="sort" title="<i18n:message code="sort_ascending" />"><img src="<url:resource file="images/arrow_state_grey_collapsed.png" />" /></a>
										</c:otherwise>
									</c:choose>
								</c:if>
							</th>
						</c:forEach>
						<%-- /Iteration over Metas --%>

						<%-- Iteration over Facets --%>
						<c:set var="nbMetas" value="${fn:length(metaNames)}" />
						<c:forEach var="facetId" items="${facetIds}" varStatus="status">
							<th class="column column_${status.index + nbMetas} column_facet column_${search:cleanFacetId(facetId)}">
								<c:choose>
									<c:when test="${columnTitle[facetId] != null}">
										<string:eval string="${columnTitle[facetId][0]}" feeds="${feeds}" />
									</c:when>
									<c:otherwise>
										<search:getFacetLabel var="facetTitle" facetPath="${facetPaths[status.index]}" />
                                        <c:if test="${fn:length(facetTitle) == 0 || facetTitle == facetPaths[status.index]}">
											<c:set var="facetTitle" value="${facetId}" />
										</c:if>
                                       ${facetTitle}
									</c:otherwise>
								</c:choose>
							</th>
						</c:forEach>
						<%-- /Iteration over Facets --%>
					</tr>
					<%-- /Table Header --%>

					<%-- For each Feed used by this widget --%>
					<search:forEachFeed feeds="${feeds}" var="feed">
						<search:forEachEntry var="entry" feed="${feed}" varStatus="varStatus">

							<config:getOption name="hitUrl" var="hitUrl" feed="${feed}" entry="${entry}" />
							<url:url var="hitUrl" value="${hitUrl}" />

							<tr class="${varStatus.index % 2 == 0 ? 'even' : 'odd'} source_${feed.id} ${search:cleanEntryId(entry)} hover">
								<c:if test="${showThumbnail == 'true'}">
									<td class="column_thumbnail">
										<div class="thumbnail">
											<render:template template="thumbnail.jsp" widget="thumbnail">
												<render:parameter name="feed" value="${feed}" />
												<render:parameter name="entry" value="${entry}" />
												<render:parameter name="widget" value="${widget}" />
												<render:parameter name="hitUrl" value="${hitUrl}" />
											</render:template>
										</div>
									</td>
								</c:if>

								<c:if test="${showTitle == 'true'}">
									<td class="column_title title">
										<h4>
											<%-- Title --%>
											<render:link href="${hitUrl}" target="${hitUrlTarget}">
												<config:getOption name="hitTitle" defaultValue="\${entry.title}" entry="${entry}" feed="${feed}" />
											</render:link>

											<%-- Preview --%>
											<c:if test="${showPreview == 'true' && (search:hasEntryImagePreviewUrl(entry) || search:hasEntryHtmlPreviewUrl(entry))}">
												<span class="preview">
													-
													<render:template template="previewInLightBox.jsp" widget="preview">
														<render:parameter name="feed" value="${feed}" />
														<render:parameter name="entry" value="${entry}" />
														<render:parameter name="widget" value="${widget}" />
													</render:template>
												</span>
											</c:if>

											<%-- Download --%>
											<c:if test="${showDownload == 'true' && search:hasEntryDownloadUrl(entry)}">
												<span class="raw">
													- 
													<render:template template="download.jsp" widget="download">
														<render:parameter name="feed" value="${feed}" />
														<render:parameter name="entry" value="${entry}" />
														<render:parameter name="widget" value="${widget}" />
													</render:template>
												</span>
											</c:if>

											<%-- Similar query --%>
											<config:getOption var="similarUrl" name="similarUrl" entry="${entry}" feed="${feed}" defaultValue="" />
											<c:if test="${similarUrl != ''}">
												- <a href="${similarUrl}"><i18n:message code="more-like-this" /></a>
											</c:if>
										</h4>
									</td>
								</c:if>

								<%-- Show hit content ? --%>
								<c:if test="${showContent == 'true'}">
									<td class="column_content">
										<div class="tdWrapper">
											<string:escape escapeType="html" var="escapedEntryContent">${entry.content}</string:escape>
											<string:truncate truncateFrom="${wrapLimit}" text="${escapedEntryContent}" var="strStart" varTruncated="strEnd" />
											<c:choose>
												<c:when test="${strEnd != ''}">
													<div class="abstract">
														${strStart}...
														<span class="more" onclick="displayHitsAsTable.showMore(this);"><i18n:message code="truncate-tag-show" /></span>
													</div>
													<div class="expand">
														${escapedEntryContent}
														<span class="less" onclick="displayHitsAsTable.showLess(this);"><i18n:message code="truncate-tag-hide" /></span>
													</div>
												</c:when>
												<c:otherwise>
													${escapedEntryContent}
												</c:otherwise>
											</c:choose>
										</div>
									</td>
								</c:if>
								<%-- /Show hit content ? --%>

								<%-- Show hit scores ? --%>
								<c:if test="${showScore == 'true'}">
									<td class="column_score">
										<div class="tdWrapper">
											<search:getEntryInfo name="score" entry="${entry}" />
										</div>
									</td>
								</c:if>
								<%-- /Show hit scores ? --%>

								<%-- Iteration over metas --%>
								<c:forEach var="metaName" items="${metaNames}">
									<td class="meta meta_${search:cleanMetaId(metaName)}">
										<search:getMeta var="meta" entry="${entry}" metaName="${metaName}" />
										<c:if test="${meta != null}">
											<div class="tdWrapper">
												<search:getMetaValues var="value" meta="${meta}" glue=", " />
												<string:truncate truncateFrom="${wrapLimit}" text="${value}" var="strStart" varTruncated="strEnd" />
												<c:choose>
													<c:when test="${strEnd != ''}">
														<div class="abstract">
															${strStart}...
															<span class="more" onclick="displayHitsAsTable.showMore(this);"><i18n:message code="truncate-tag-show" /></span>
														</div>
														<div class="expand">
															<search:forEachMetaValue entry="${entry}" meta="${meta}" var="metaValue" varUrl="metaUrl" varStatus="status">
																<render:link href="${metaUrl}" target="${metaUrlTarget}">${metaValue}</render:link><c:if test="${status.last == false}">,</c:if>
															</search:forEachMetaValue>
															<span class="less" onclick="displayHitsAsTable.showLess(this);"><i18n:message code="truncate-tag-hide" /></span>
														</div>
													</c:when>

													<c:otherwise>
														<div class="abstract">
															<search:forEachMetaValue entry="${entry}" meta="${meta}" var="metaValue" varUrl="metaUrl" varStatus="status">
																<render:link href="${metaUrl}" target="${metaUrlTarget}">${metaValue}</render:link><c:if test="${status.last == false}">,</c:if>
															</search:forEachMetaValue>
														</div>
													</c:otherwise>
												</c:choose>
											</div>
										</c:if>
									</td>
								</c:forEach>
								<%-- /Iteration over metas --%>

								<%-- Iteration over Facets --%>
								<c:forEach var="facetId" items="${facetIds}">
									<td class="facet facet_${search:cleanFacetId(facetId)}">
										<search:getFacet var="facet" facetId="${facetId}" entry="${entry}" />
										<c:if test="${facet != null}">
											<render:template template="${facetTemplateDirectory}/${fn:toLowerCase(facet.path)}/facet.jsp" defaultTemplate="${facetTemplateDirectory}/facet.jsp">
												<render:parameter name="widget" value="${widget}" />
												<render:parameter name="feeds" value="${feeds}" />
												<render:parameter name="feed" value="${feed}" />
												<render:parameter name="entry" value="${entry}" />
												<render:parameter name="facet" value="${facet}" />
											</render:template>
										</c:if>
									</td>
								</c:forEach>
								<%-- /Iteration over Facets --%>

							</tr>
						</search:forEachEntry>
					</search:forEachFeed>
				</table>
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
