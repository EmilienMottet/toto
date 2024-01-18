<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>

<render:import parameters="accessFeeds,feed,entry,widget" />
<render:import parameters="hitUrl" ignore="true" />

<config:getOption var="showThumbnail" name="showThumbnail" defaultValue="on the left" />

<%-- Thumbnail displaying (no left/right) --%>
<c:if test='${showThumbnail != "none"}'>
	<li class="hit index_flickr">

		<c:if test="${hitUrl == null}">
			<search:getMetaValue var="hitUrl" entry="${entry}" metaName="flickr_uri" isHighlighted="false" />
		</c:if>

		<div class="thumbnail">
			<render:template template="thumbnail.jsp" widget="thumbnail">
				<render:parameter name="feed" value="${feed}" />
				<render:parameter name="entry" value="${entry}" />
				<render:parameter name="widget" value="${widget}" />
				<render:parameter name="hitUrl" value="${hitUrl}" />
			</render:template>
		</div>

		<div class="title">${entry.title}</div>
	</li>
</c:if>
<%-- /Thumbnail displaying (no left/right) --%>
