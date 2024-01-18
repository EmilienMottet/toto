<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="url" uri="http://www.exalead.com/jspapi/url" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="i18n" uri="http://www.exalead.com/jspapi/i18n"%>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>
<%@ taglib prefix="menu" uri="http://www.exalead.com/jspapi/widget-menu" %>

<render:import varWidget="widget" />

<config:getOptionsComposite var="leftItems" name="menuitems" mapIndex="true" />
<config:getOption var="logoLinkUrl" name="logoLinkUrl" defaultValue="" />
<config:getOption var="logoImageUrl" name="logoImageUrl" defaultValue="images/logo.png" />
<config:getOption var="logoAlt" name="logoAlt" defaultValue="" />
<config:getOption var="useCompass" name="compass" defaultValue="false" />
<config:getOption var="useCompassOnly" name="compassOnly" defaultValue="false" />

<widget:widget extraCss="header ${useCompass ? 'with-compass' : ''}">
	<div>

		<%-- Logo --%>

		<div class="header-logo-wrapper">
			<render:link href="${logoLinkUrl}" extraCss="header-logo">
				<img class="header-logo-img" src="<url:resource file="${logoImageUrl}" />" alt="${logoAlt}" />
			</render:link>
		</div>

		<%-- 3DS Compass --%>

		<c:if test="${useCompass}">
			<div class="header-compass">
				<map id="compass" name="compass">
					<c:if test="${leftItems[0] != null}"><area shape="circle" alt="<i18n:message code="compass.play" />" title="<i18n:message code="compass.play" />" coords="55,55,31" href="${leftItems[0].target}"/></c:if>
					<c:if test="${leftItems[1] != null}"><area shape="poly" alt="<i18n:message code="compass.people" />" title="<i18n:message code="compass.people" />" coords="16,16,31,34,55,24,76,35,95,18,66,0,44,0" href="${leftItems[1].target}" /></c:if>
					<c:if test="${leftItems[2] != null}"><area shape="poly" alt="<i18n:message code="compass.ii" />" title="<i18n:message code="compass.ii" />" coords="95,18,76,34,85,54,76,77,94,95,108,71,108,40" href="${leftItems[2].target}" /></c:if>
					<c:if test="${leftItems[3] != null}"><area shape="poly" alt="<i18n:message code="compass.virt" />" title="<i18n:message code="compass.virt" />" coords="16,95,37,108,78,108,94,94,76,77,55,86,31,75" href="${leftItems[3].target}" /></c:if>
					<c:if test="${leftItems[4] != null}"><area shape="poly" alt="<i18n:message code="compass.3D" />" title="<i18n:message code="compass.3D" />" coords="15,17,31,36,23,54,31,74,14,96,-2,67,-4,50" href="${leftItems[4].target}" /></c:if>
				</map>
				<img usemap="compass" src="<url:resource file="images/compass.png" />" />
			</div>
		</c:if>

		<%-- Left items --%>

		<c:if test="${!useCompassOnly}">
			<menu:getItems items="${leftItems}" var="leftItems" />
			<c:if test="${fn:length(leftItems) > 0}">
				<render:template template="templates/items.jsp">
					<render:parameter name="items" value="${leftItems}" />
					<render:parameter name="align" value="left" />
				</render:template>
			</c:if>
		</c:if>

		<%-- Sub-Widgets --%>

		<c:if test="${widget:hasSubWidgets(widget)}">
			<div class="header-widgets">
				<render:subWidgets />
			</div>
		</c:if>

		<%-- Right items --%>

		<c:if test="${!useCompassOnly}">
			<config:getOptionsComposite var="rightItems" name="menurightitems" mapIndex="true" />
			<menu:getItems items="${rightItems}" var="rightItems" />
			<c:if test="${fn:length(rightItems) > 0}">
				<render:template template="templates/items.jsp">
					<render:parameter name="items" value="${rightItems}" />
					<render:parameter name="align" value="right" />
				</render:template>
			</c:if>
		</c:if>

	</div>
</widget:widget>
