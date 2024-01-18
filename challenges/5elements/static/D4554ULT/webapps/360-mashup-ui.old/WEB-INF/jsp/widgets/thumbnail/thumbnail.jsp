<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="url" uri="http://www.exalead.com/jspapi/url" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="string" uri="http://www.exalead.com/jspapi/string" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>

<render:import parameters="feed,entry,widget" />
<render:import parameters="hitUrl" ignore="true" />

<%--
	Required options in the widget
		@hitTitle
		@hitUrlTarget
		@useThumbnailPreview
		@urlDefaultThumbnail
--%>

<config:getOption var="useFetchClient" name="useThumbnailPreview" defaultValue="false" />
<config:getOption var="defaultThumbnail" name="urlDefaultThumbnail" defaultValue="" feed="${feed}" entry="${entry}" />

<search:getEntryThumbnailUrl var="thumbnailUrl" entry="${entry}" feed="${feed}" useFetchClient="${useFetchClient}" defaultThumbnail="${defaultThumbnail}" />
<c:if test="${thumbnailUrl != null}">

	<%-- Height & Width --%>
	<config:getOption name="tbWidth" var="tbWidth" defaultValue="" feed="${feed}" entry="${entry}" />
	<config:getOption name="tbHeight" var="tbHeight" defaultValue="" feed="${feed}" entry="${entry}" />
	<c:set var="tbStyle" value="" />
	<c:if test="${tbWidth != ''}"><c:set var="tbStyle" value="${tbStyle}width:${tbWidth}px;" /></c:if>
	<c:if test="${tbHeight != ''}"><c:set var="tbStyle" value="${tbStyle}height:${tbHeight}px;" /></c:if>

	<%-- HTML Output --%>
	<config:getOption var="hitUrlTarget" name="hitUrlTarget" defaultValue="" />
	<render:link href="${hitUrl}" target="${hitUrlTarget == 'New Page' ? '_blank' : ''}">

		<c:choose>
			<c:when test="${useFetchClient == 'false'}">
				<img src="<url:url value="${thumbnailUrl}" />" class="thumbnail" alt="thumbnail" style="${tbStyle}" />
			</c:when>
			<c:otherwise>

				<url:url var="thumbnailUrl" value="${thumbnailUrl}">
					<url:parameter name="height" value="${tbHeight}" override="true" />
					<url:parameter name="width" value="${tbWidth}" override="true" />
				</url:url>

				<config:getOption var="hitTitle" name="hitTitle" defaultValue="${entry.title}" entry="${entry}" feed="${feed}" />
				<search:getEntryInfo var="numPages" name="extracted_numpages" entry="${entry}" defaultValue="1" />
				<search:getEntryHtmlPreviewUrl var="htmlPreviewUrl" urlEscape="true" entry="${entry}" feed="${feed}" />
				<search:getEntryImagePreviewUrl var="imagePreviewUrl" urlEscape="true" entry="${entry}" feed="${feed}" />

				<img	
						class="thumbnail productThumbnail"
						alt="thumbnail"
						style="${tbStyle}"
						data-src="${thumbnailUrl}"
						data-htmlpreview="${htmlPreviewUrl}"
						data-imagepreview="${imagePreviewUrl}"
						data-title="<string:escape value="${hitTitle}" escapeType="url" />"
						data-numpages="${numPages}" />

				<render:renderOnce id="smallPreviewBrowserJS">
					<render:renderScript position="READY">
						$('img.productThumbnail').smallPreview({
							showPreviewLink: false,
							baseUrl: "<url:url value="/" />",
							mainContainerId: '<config:getOption name="mainContainerId" defaultValue=""/>'
						});
					</render:renderScript>
				</render:renderOnce>

			</c:otherwise>
		</c:choose>
	</render:link>
</c:if>
