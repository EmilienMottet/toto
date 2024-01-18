<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>
<%@ taglib prefix="composite" uri="http://www.exalead.com/jspapi/widget-composite" %>

<render:import varWidget="widget" varFeeds="feeds" />

<composite:getWidget var="pageWidget" varPageFeed="pageFeed" />
<search:getEntry var="parentEntry" feed="${pageFeed}" />

<%-- FIXME: should be set by WidgetRender --%>
<c:set var="composite_dataWidgetWrapper" value="${dataWidgetWrapper}" scope="request" />

<config:getOption var="enclosingTag" name="enclosingTag" defaultValue="div" component="${pageWidget}" />
<widget:widget varCssId="cssId" disableStyles="true" extraCss="compositeWidget ${widget.id}">
	<c:choose>
		<c:when test="${enclosingTag == 'form'}">

			<%-- must be appended before its components --%>
			<render:renderScript position="READY">
				$('#${cssId} form').searchForm({ uid: '${widget.wuid}' });
				$('#${cssId} > form').validate({ errorClass : "formError" });
			</render:renderScript>

			<config:getOption var="enclosingTagAction" name="enclosingTagAction" defaultValue="" component="${pageWidget}" feeds="${feeds}" doEval="true" />
			<config:getOption var="enclosingTagMethod" name="enclosingTagMethod" defaultValue="GET" component="${pageWidget}" />
			<form action="${enclosingTagAction}" method="${enclosingTagMethod}">
				<render:definition name="tableLayout">
					<render:parameter name="layout" value="${pageWidget.layout}"/>
					<render:parameter name="parentFeed" value="${pageFeed}"/>
					<render:parameter name="parentEntry" value="${parentEntry}"/>
					<render:parameter name="prefix" value="${widget.wuid}_"/>
					<render:parameter name="wrapperCssClass" value="widgetLayout"/>
				</render:definition>
                <c:if test="${enclosingTagMethod == 'POST'}">
				    <render:csrf />
                </c:if>
			</form>
		</c:when>
		<c:otherwise>
			<render:definition name="tableLayout">
				<render:parameter name="layout" value="${pageWidget.layout}"/>
				<render:parameter name="parentFeed" value="${pageFeed}"/>
				<render:parameter name="parentEntry" value="${parentEntry}"/>
				<render:parameter name="prefix" value="${widget.wuid}_"/>
				<render:parameter name="wrapperCssClass" value="widgetLayout"/>
			</render:definition>
		</c:otherwise>
	</c:choose>
</widget:widget>
