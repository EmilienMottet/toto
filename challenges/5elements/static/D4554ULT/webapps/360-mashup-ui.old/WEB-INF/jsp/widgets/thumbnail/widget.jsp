<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="url" uri="http://www.exalead.com/jspapi/url" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>

<render:import varWidget="widget" varFeeds="feeds" />

<widget:widget extraCss="thumbnailsWidget">
	<widget:header>
		<config:getOption name="title" defaultValue="" />
	</widget:header>

	<widget:content htmlTag="ul">
		<search:forEachFeed feeds="${feeds}" var="feed">
			<search:forEachEntry var="entry" feed="${feed}">
				<config:getOption var="hitUrl" name="hitUrl" feed="${feed}" entry="${entry}" />
				<url:url var="hitUrl" value="${hitUrl}" />
				<li>
					<render:template template="thumbnail.jsp">
						<render:parameter name="feed" value="${feed}" />
						<render:parameter name="entry" value="${entry}" />
						<render:parameter name="widget" value="${widget}" />
						<render:parameter name="hitUrl" value="${hitUrl}" />
					</render:template>
				</li>
			</search:forEachEntry>
		</search:forEachFeed>
	</widget:content>
</widget:widget>
