<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="url" uri="http://www.exalead.com/jspapi/url" %>
<%@ taglib prefix="list" uri="http://www.exalead.com/jspapi/list" %>
<%@ taglib prefix="i18n" uri="http://www.exalead.com/jspapi/i18n" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="string" uri="http://www.exalead.com/jspapi/string" %>

<render:import parameters="accessFeeds,feed,entry,widget" />
<render:import parameters="hitUrl" ignore="true" />

<%-- retrieve the widget options --%>
<config:getOption var="metaUrlTarget" name="metaUrlTarget" defaultValue="" />
<config:getOption var="showThumbnail" name="showThumbnail" defaultValue="on the left" />
<config:getOption var="showHitFacets" name="showHitFacets" defaultValue="true" />
<config:getOption var="showHitMetas" name="showHitMetas" defaultValue="true" />
<config:getOption var="showContent" name="showTextOnTop" defaultValue="true" />
<config:getOption var="showHitId" name="showHitId" defaultValue="true" />
<c:if test="${showHitFacets == 'true'}">
	<config:getOption var="templateBasePath" name="templateBasePath" defaultValue="templates/" />
	<config:getOption var="hitFilterFacetsType" name="hitFilterFacetsType" defaultValue="No filtering" />
	<config:getOption var="hitFacetsList" name="hitFacetsList" defaultValue="" />
	<config:getOption var="sortModeFacets" name="sortModeFacets" defaultValue="default" />
    <config:getOption var="showEmptyFacets" name="showEmptyFacets" defaultValue="true" />
</c:if>
<c:if test="${showHitMetas == 'true'}">
	<config:getOption var="filterMetas" name="filterMetas" defaultValue="No filtering"/>
	<config:getOption var="metasList" name="metas" />
	<config:getOption var="showEmptyMetas" name="showEmptyMetas" defaultValue="true" />
	<config:getOption var="sortModeMetas" name="sortModeMetas" defaultValue="default" />
	<config:getOption var="customDisplay" name="customDisplay" defaultValue="false" />
</c:if>

<c:set var="metaUrlTarget" value="${metaUrlTarget == 'New Page' ? '_blank' : ''}" />
<c:set var="hasContent" value="${showContent && entry.content != null && entry.content != ''}" />

<%-- Hit Text & Thumbnail --%>
<c:if test="${showThumbnail != 'none' || hasContent}">
	<table class="contentWrapper hitContent hitText">
		<tr>
			<c:if test='${showThumbnail == "on the left"}'>
				<td class="thumbnail left">
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

			<td class="text" width="100%">
				<c:if test="${hasContent}">
					<config:getOption var="showTextOnTopTruncate" name="showTextOnTopTruncate" defaultValue="500" />
					<p>
						<i18n:message var="i18nShow" code="truncate-tag-show" />
						<i18n:message var="i18nHide" code="truncate-tag-hide" />
						<string:truncate text="${entry.content}" labelHide="${i18nHide}" labelShow="${i18nShow}"  truncateFrom="${showTextOnTopTruncate}" />
					</p>
				</c:if>
			</td>

			<c:if test='${showThumbnail == "on the right"}'>
				<td class="thumbnail right">
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
		</tr>
	</table>
</c:if>

<table class="contentWrapper hitContent hitMetasFacets table table-condensed table-hover-cell table-transparent">
	<%-- Displays Hit Metas --%>
	<c:if test="${showHitMetas == 'true'}">
	<c:choose>
		<c:when test="${customDisplay == 'true'}">
			<tr>
				<td colspan="2">
					<config:getOption name="customMetasDisplay" defaultValue="" entry="${entry}" feed="${feed}"/>
				</td>
			</tr>
		</c:when>

		<c:otherwise>
			<list:new var="metas"/>
			<search:forEachMeta
				var="meta"
				entry="${entry}"
				filterMode="${filterMetas}"
				metasList="${metasList}"
				showEmptyMetas="${showEmptyMetas}"
				sortMode="${sortModeMetas}">
				<list:add value="${meta}" list="${metas}" />
			</search:forEachMeta>

			<c:forEach varStatus="loopStatus" items="${metas}" step="2">
				<tr class="metas">
					<c:forEach var="idx" begin="${loopStatus.index}" end="${loopStatus.index + 1}">
						<c:choose>
							<c:when test="${metas[idx] == null}">
								<td class="hover meta cell-half">
									<table>
										<tr>
											<td class="text-light metaName cell-half"></td>
											<td class="metaValue cell-half"></td>
										</tr>
									</table>
								</td>
							</c:when>
							<c:otherwise>
								<td class="hover meta cell-half">
									<table>
										<tr>
											<td class="text-light metaName cell-half"><search:getMetaLabel meta="${metas[idx]}" /></td>
											<td class="metaValue cell-half">
												<search:forEachMetaValue entry="${entry}" meta="${metas[idx]}" var="metaValue" varUrl="metaUrl" varStatus="status">
													<render:link href="${metaUrl}" target="${metaUrlTarget}">${metaValue}</render:link><c:if test="${status.last == false}">,</c:if>
												</search:forEachMetaValue>
											</td>
										</tr>
									</table>
								</td>
							</c:otherwise>
						</c:choose>
						<c:if test="${idx == loopStatus.index}">
							<td>&nbsp;</td>
						</c:if>
					</c:forEach>
				</tr>
			</c:forEach>
		</c:otherwise>
	</c:choose>
	</c:if>

	<%-- Displays Hit Facets --%>
	<c:if test="${showHitFacets == 'true'}">
		<c:if test="${metas != null && fn:length(metas) > 0}">
			<tr class="separator">
				<td colspan="3">&nbsp;</td>
			</tr>
		</c:if>

		<c:set var="facetTemplateDirectory" value="" />

		<%-- Preload all Facets into List --%>
		<list:new var="facets"/>
		<search:forEachFacet
			var="facet"
			entry="${entry}"
			filterMode="${hitFilterFacetsType}"
			facetsList="${hitFacetsList}"
			showEmptyFacets="${showEmptyFacets}"
			sortMode="${sortModeFacets}">
				<list:add value="${facet}" list="${facets}"/>
		</search:forEachFacet>

		<c:forEach varStatus="loopStatus" items="${facets}" step="2">
			<tr class="facets">
				<c:forEach var="idx" begin="${loopStatus.index}" end="${loopStatus.index + 1}">
					<c:choose>
						<c:when test="${facets[idx] == null}">
							<td class="hover facet cell-half">
								<table>
									<tr>
										<td class="facetName text-light cell-half"></td>
										<td class="facetValue cell-half"></td>
									</tr>
								</table>
							</td>
						</c:when>
						<c:otherwise>
							<td class="hover facet cell-half">
								<render:template template="${templateBasePath}tabulated/${fn:toLowerCase(facets[idx].path)}/facet.jsp" defaultTemplate="${templateBasePath}tabulated/facet.jsp">
									<render:parameter name="widget" value="${widget}" />
									<render:parameter name="accessFeeds" value="${accessFeeds}" />
									<render:parameter name="feed" value="${feed}" />
									<render:parameter name="entry" value="${entry}" />
									<render:parameter name="facet" value="${facets[idx]}" />
								</render:template>
							</td>
						</c:otherwise>
					</c:choose>
					<c:if test="${idx == loopStatus.index}">
						<td>&nbsp;</td>
					</c:if>
				</c:forEach>
			</tr>
		</c:forEach>
	</c:if>

	<%-- Displays Hit ID --%>
	<c:if test="${showHitId == 'true'}">
		<c:if test="${metas != null && fn:length(metas) > 0 || facets != null && fn:length(facets) > 0}">
			<tr class="separator">
				<td colspan="3">&nbsp;</td>
			</tr>
		</c:if>

		<tr class="uri">
			<td colspan="3">
				<c:choose>
					<c:when test="${url:isUrl(entry.id)}">
						<render:link href="${entry.id}" target="${metaUrlTarget}" title="id" extraCss="green">${entry.id}</render:link>
					</c:when>
					<c:otherwise><span class="uriName">id:</span>&nbsp;<span class="uriValue text-uri" title="id">${entry.id}</span></c:otherwise>
				</c:choose>
			</td>
		</tr>
	</c:if>

	<%-- Similar query --%>
	<config:getOption var="similarUrl" name="similarUrl" entry="${entry}" feed="${feed}" defaultValue="" />
	<c:if test="${similarUrl != ''}">
		<tr class="similar">
			<td colspan="3">
				<a href="${similarUrl}" title="similar"><i18n:message code="more-like-this" /></a>
			</td>
		</tr>
	</c:if>
</table>