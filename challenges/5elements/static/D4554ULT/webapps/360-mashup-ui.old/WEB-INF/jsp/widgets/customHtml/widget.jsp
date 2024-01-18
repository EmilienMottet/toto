<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="string" uri="http://www.exalead.com/jspapi/string" %>

<render:import varFeeds="feeds"/>
<config:getOption var="disableWidgetTag" name="disableWidgetTag" defaultValue="false" />
<config:getOption var="optionHtmlFile" name="htmlFile" defaultValue="" />

<widget:widget disableStyles="true" disableWrapper="${disableWidgetTag}" varCssId="cssId">
	<c:if test="${optionHtmlFile != ''}">
		<render:template template="${optionHtmlFile}">
			<render:parameter name="dataWidgetWrapper" value="${dataWidgetWrapper}" />
		</render:template>
	</c:if>
	<config:getOption name="htmlRules" defaultValue="" />
	
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
</widget:widget>
