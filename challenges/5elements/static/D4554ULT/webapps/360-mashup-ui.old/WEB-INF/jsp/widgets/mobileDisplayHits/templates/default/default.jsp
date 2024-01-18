<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="url" uri="http://www.exalead.com/jspapi/url" %>
<%@ taglib prefix="i18n" uri="http://www.exalead.com/jspapi/i18n" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="string" uri="http://www.exalead.com/jspapi/string" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>

<render:import varFeeds="feeds" varWidget="widget" parameters="feed,entry" />
<render:import parameters="hitUrl,hitTitle" ignore="true" />

<config:getOption var="buttonTheme" name="themeButton" defaultValue="" />
<config:getOption var="showThumbnail" name="showThumbnail" defaultValue="false" />
<config:getOption var="showHitId" name="showHitId" defaultValue="true" />
<config:getOption var="showTextOnTop" name="showTextOnTop" defaultValue="true" />
<config:getOption var="showTextOnTopTruncate" name="showTextOnTopTruncate" defaultValue="500" />
<config:getOption var="templateBasePath" name="templateBasePath" defaultValue="templates/" />
<config:getOption var="buttonAlignment" name="buttonAlignment" defaultValue="left" />
<config:getOption var="showPreview" name="showPreview" defaultValue="false" />
<config:getOption var="showDownload" name="showDownload" defaultValue="false" />
<config:getOption var="similarUrl" name="similarUrl" defaultValue="" feed="${feed}" entry="${entry}" />

<%-- class="${search:cleanEntryId(entry)}" is used by GMap widgets to append markers --%>
<li class="hit hit-list hit-tabulated ${search:cleanEntryId(entry)}">
	<%-- Title --%>
	<c:if test="${(hitTitle != null && hitTitle != '')}">
		<config:getOption var="showHitIcon" name="showHitIcon" feed="${feed}" entry="${entry}" defaultValue="false" />
		<h3 class="${showHitIcon ? 'has-icon' : ''} hitHeader sub-header-emphasize">
			<%-- Icon based on the mime type of the entry --%>
			<c:if test="${showHitIcon == 'true'}">
				<search:getEntryIconUrl var="iconUrl" entry="${entry}" />
				<img class="icon" src="${iconUrl}" />
			</c:if>
			<%-- /Icon based on the mime type of the entry --%>

			<c:choose>
				<c:when test="${hitUrl != null}">
					<a href="${hitUrl}">${hitTitle}</a>
				</c:when>
				<c:otherwise>
					${hitTitle}
				</c:otherwise>
			</c:choose>
		</h3>
	</c:if>
	<%-- /Title --%>
	<div class="hitInfo">
	<%-- Thumbnail displaying --%>
	<c:if test="${showThumbnail == 'true'}">
		<div class="thumbnail left">
			<render:template template="thumbnail.jsp" widget="thumbnail">
				<render:parameter name="feed" value="${feed}" />
				<render:parameter name="entry" value="${entry}" />
				<render:parameter name="widget" value="${widget}" />
			</render:template>
		</div>
	</c:if>
	<%-- /Thumbnail displaying --%>
	
	<%-- Content --%>
	<c:if test="${showTextOnTop == 'true' && entry.content != null && entry.content != ''}">
		<p>
			<i18n:message var="i18nShow" code="truncate-tag-show" />
			<i18n:message var="i18nHide" code="truncate-tag-hide" />
			<string:truncate text="${entry.content}" labelHide="${i18nHide}" labelShow="${i18nShow}" truncateFrom="${showTextOnTopTruncate}" />
		</p>
	</c:if>
	<%-- /Content --%>

	<%-- Metas/Facets --%>
	<render:template template="${templateBasePath}default/default-metas.jsp">
		<render:parameter name="feed" value="${feed}" />
		<render:parameter name="entry" value="${entry}" />
	</render:template>
	<%-- /Metas/Facets --%>

	<%-- Hit ID--%>
	<c:if test="${showHitId == 'true'}">
		<p title="id">
			<c:choose>
				<c:when test="${url:isUrl(entry.id)}">
					<a href="${entry.id}" class="green">${entry.id}</a>
				</c:when>
				<c:otherwise><strong>id:</strong> ${entry.id}</c:otherwise>
			</c:choose>
		</p>
	</c:if>
	<%-- /Hit ID --%>
	
	<p align="${buttonAlignment}">
		<%-- Preview --%>
		<c:if test="${showPreview != 'false'}">
			<search:getEntryHtmlPreviewUrl var="previewUrl" entry="${entry}" feed="${feed}"/>
			<c:if test="${previewUrl != null}">
				<a rel="external" href="${previewUrl}" target="_blank">Preview</a>
			</c:if>
		</c:if>
		<%-- /Preview --%>
	
		<%-- Download --%>
		<c:if test="${showDownload != 'false'}">
			<search:getEntryDownloadUrl var="rawUrl" feed="${feed}" entry="${entry}"/>
			<c:if test="${rawUrl != null}">
				<a rel="external" href="${rawUrl}" target="_blank">Download</a>
			</c:if>
		</c:if>
		<%-- /Download --%>

		<%-- Similar query --%>
		<c:if test="${similarUrl != ''}">
			<c:url var="similarUrl" value="${similarUrl}" />
			<a href="${similarUrl}"><i18n:message code="more-like-this" /></a>
		</c:if>
		<%-- /Similar query --%>
	</p>
	</div>
</li>
