<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>

<%-- retrieve widget options --%>
<config:getOption var="btnAction" name="btnAction" defaultValue="#" />
<config:getOption var="btnForceActiveState" name="btnForceActiveState" defaultValue="false" />
<config:getOption var="btnTheme" name="btnTheme" defaultValue="" />
<config:getOption var="btnInline" name="btnInline" defaultValue="false" />
<config:getOption var="btnIcon" name="btnIcon" defaultValue="" />
<c:if test="${btnIcon != ''}">
	<config:getOption var="btnIconPosition" name="btnIconPosition" defaultValue="left" />
</c:if>

<c:url value="${btnAction}" var="btnHref" />

<%-- render widget --%>
<mobile:button
	extraCss="mobileButton"
	forceActiveState="${btnForceActiveState}"
	href="${btnHref}"
	theme="${btnTheme}"
	inline="${btnInline}"
	icon="${btnIcon}"
	iconPosition="${btnIconPosition}">
	<config:getOption name="btnText" defaultValue="" />
</mobile:button>
