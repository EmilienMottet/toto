<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="url" uri="http://www.exalead.com/jspapi/url" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="string" uri="http://www.exalead.com/jspapi/string" %>

<render:import parameters="accessFeeds,feed,entry,widget" />
<render:import parameters="hitUrl,hitTitle" ignore="true" />

<%-- retrieve the widget options --%>
<config:getOption var="showIcon" name="showHitIcon" defaultValue="false" />
<config:getOption var="showDownload" name="showDownload" defaultValue="false" />
<config:getOption var="showPreview" name="showPreview" defaultValue="false" />
<config:getOption var="showThumbnail" name="showThumbnail" defaultValue="on the left" />
<config:getOption var="templateBasePath" name="templateBasePath" defaultValue="templates/" />
<config:getOption var="hitUrlTarget" name="hitUrlTarget" defaultValue="" />

<c:set var="hitUrlTarget" value="${hitUrlTarget == 'New Page' ? '_blank' : ''}" />
<c:set var="hasPreview" value="${showPreview && (search:hasEntryHtmlPreviewUrl(entry) || search:hasEntryImagePreviewUrl(entry))}" />
<c:set var="hasDownload" value="${showDownload && search:hasEntryDownloadUrl(entry)}" />
<c:set var="hasHeader" value="${hitTitle != null && hitTitle != '' || showIcon || hasDownload || hasPreview}" />

<%-- class="${wh:cleanEntryId(entry.id)}" is used by GMap widgets to append markers --%>
<li class="hit hit-list ${search:cleanEntryId(entry)} hit-default">

	<table class="contentWrapper">
		<tr>
			<c:if test="${showThumbnail == 'on the left'}">
				<td valign="top" class="thumbnail left thumbnail-standalone">
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

			<td valign="top" width="100%">
				<c:if test="${hasHeader}">
					<h3 class="rounded-top hitHeader sub-header-emphasize">
						<%-- Icon based on the mime type of the entry --%>
						<c:if test="${showIcon}">
							<search:getEntryIconUrl var="iconUrl" entry="${entry}" />
							<img class="icon" src="${iconUrl}" />
						</c:if>

						<%-- Preview --%>
						<c:if test="${hasPreview}">
							<span class="btn btn-small preview">
								<render:template template="previewInLightBox.jsp" widget="preview">
									<render:parameter name="feed" value="${feed}" />
									<render:parameter name="entry" value="${entry}" />
									<render:parameter name="widget" value="${widget}" />
								</render:template>
							</span>
						</c:if>

						<%-- Download --%>
						<c:if test="${hasDownload}">
							<config:getOption var="downloadInline" name="downloadInline" defaultValue="false" />
							<span class="btn btn-small raw">
								<render:template template="download.jsp" widget="download">
									<render:parameter name="feed" value="${feed}" />
									<render:parameter name="entry" value="${entry}" />
									<render:parameter name="widget" value="${widget}" />
									<render:parameter name="inline" value="${downloadInline}" />
								</render:template>
							</span>
						</c:if>

						<%-- Title --%>
						<c:if test="${hitTitle != null && hitTitle != ''}">
							<render:link href="${hitUrl}" target="${hitUrlTarget}">${hitTitle}</render:link>
						</c:if>
					</h3>
				</c:if>

				<%-- Displays Hit Content --%>
				<div class="hitInfo  ${hasHeader ? 'rounded-bottom' : 'rounded'} thumbnail-standalone">
					<render:template template="${templateBasePath}default/hit-content.jsp">
						<render:parameter name="feed" value="${feed}" />
						<render:parameter name="entry" value="${entry}" />
						<render:parameter name="widget" value="${widget}" />
						<render:parameter name="accessFeeds" value="${accessFeeds}" />
						<render:parameter name="hitUrl" value="${hitUrl}" />
					</render:template>
				</div>
			</td>

			<c:if test="${showThumbnail == 'on the right'}">
				<td valign="top" class="thumbnail right">
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

	<%-- Displays sub-widgets --%>
	<c:if test="${widget:hasSubWidgets(widget)}">
		<div class="subWidget">
			<widget:forEachSubWidget widgetContainer="${widget}" feed="${feed}" entry="${entry}">
				<render:widget />
			</widget:forEachSubWidget>
		</div>
	</c:if>

</li>
