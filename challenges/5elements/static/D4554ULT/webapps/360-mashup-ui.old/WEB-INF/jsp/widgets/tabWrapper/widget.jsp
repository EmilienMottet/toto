<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="string" uri="http://www.exalead.com/jspapi/string" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>

<render:import varWidget="widget" varFeeds="feeds" />

<c:if test="${widget:hasSubWidgets(widget)}">

	<config:getOption var="display" name="display" defaultValue="tabs" />
	<config:getOption var="valign" name="valign" defaultValue="top" />
	<config:getOption var="defaultOpenTab" name="defaultOpenTab" defaultValue="0" />

	<string:getRandomId var="uniqueDOMId" prefix="tab-" />
	<widget:widget extraCss="tabWrapper ${uniqueDOMId}">

		<widget:header extraCss="${display == 'tabs' ? 'rounded' : ''}">
			<config:getOption name="title" defaultValue="" />
		</widget:header>

		<widget:content extraCss="widget-tabs-wrapper display-${display}">

			<%-- Render tab menu --%>
			<c:if test="${valign == 'top'}">
				<render:template template="templates/tabs.jsp">
					<render:parameter name="defaultOpenTab" value="${defaultOpenTab}" />
					<render:parameter name="valign" value="${valign}" />
					<render:parameter name="display" value="${display}" />
				</render:template>
			</c:if>

			<%-- Render tabs content --%>
			<widget:forEachSubWidget varStatus="status">
				<config:getOption var="height" name="height" />
				<c:if test="${height != null}"><c:set var="cssStyle" value="height:${height}px;" /></c:if>
				<config:getOption var="width" name="width" />
				<c:if test="${width != null}"><c:set var="cssStyle" value="${cssStyle}width:${width}px;" /></c:if>
				<c:set var="cssClass" value="widget-tab-container container-${status.index+1}" />
				<c:if test="${status.index != defaultOpenTab}">
					<c:set var="cssClass" value="${cssClass} widget-tab-hidden" />
				</c:if>
				<render:widget>
					<c:if test="${cssStyle != null}"><render:parameter name="cssStyle" value="${cssStyle}" /></c:if>
					<render:parameter name="cssClass" value="${cssClass}" />
				</render:widget>
			</widget:forEachSubWidget>

			<%-- Render tab menu --%>
			<c:if test="${valign == 'bottom'}">
				<render:template template="templates/tabs.jsp">
					<render:parameter name="defaultOpenTab" value="${defaultOpenTab}" />
					<render:parameter name="valign" value="${valign}" />
					<render:parameter name="display" value="${display}" />
				</render:template>
			</c:if>
		</widget:content>

	</widget:widget>

	<render:renderScript position="BEFORE">
		TabWrapper.init('${uniqueDOMId}', { saveState: <config:getOption name="saveUserState" defaultValue="true" /> });
	</render:renderScript>
</c:if>