<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>

<render:import varWidget="widget" varFeeds="feeds" varParentFeed="feed" varParentEntry="entry" />

<%-- retrieve widget options --%>
<config:getOption var="itemType" name="itemType" defaultValue="text" />
<config:getOption var="itemDesc" name="itemDesc" entry="${entry}" feed="${feed}"/>
<config:getOption var="itemText" name="itemText" entry="${entry}" feed="${feed}"/>
<config:getOption var="itemThumbnail" name="itemThumbnail" entry="${entry}" feed="${feed}" />
<config:getOption var="itemCount" name="itemCount" entry="${entry}" feed="${feed}" />
<config:getOption var="itemAside" name="itemAside" entry="${entry}" feed="${feed}" />
<config:getOption var="itemTheme" name="itemTheme" defaultValue="" />
<c:if test="${itemType == 'link'}">
	<config:getOption var="itemAction" name="itemAction" defaultValue="" />
</c:if>

<%-- render widget --%>
<widget:widget htmlTag="li" extraCss="mobileListItem ${itemType}">
	<c:if test="${itemType == 'link'}">
		<a href="${itemAction}">
	</c:if>
		<%-- Thumbnail / Icon --%>
		<c:if test="${itemThumbnail != null}">
			<c:url var="thumbUrl" value="${itemThumbnail}" />
			<img src="${thumbUrl}" class="ul-li-thumb" />
		</c:if>

		<%-- Item text and description --%>
		<c:choose>
			<c:when test="${itemDesc != null}">
				<h3>${itemText}</h3>
				<p>${itemDesc}</p>
			</c:when>
			<c:otherwise>
				${itemText}
			</c:otherwise>
		</c:choose>

		<%-- Item count --%>
		<c:if test="${itemCount != null}">
			<span class="ui-li-count">${itemCount}</span>
		</c:if>

		<%-- Item aside content --%>
		<c:if test="${itemAside != null}">
			<p class="ui-li-aside">${itemAside}</p>
		</c:if>
		
	<c:if test="${itemType == 'link'}">	
		<span class="icon-wrapper"><span class="icon-arrow">&#8250;</span></span>	
		</a>
	</c:if>

	<%-- NestedList --%>
	<render:subWidgets />
</widget:widget>
