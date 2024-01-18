<%@ page import="java.io.File"%>
<%@ page import="java.util.Locale" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="url" uri="http://www.exalead.com/jspapi/url" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="i18n" uri="http://www.exalead.com/jspapi/i18n" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>

<render:import varWidget="widget" />

<config:getOption var="selectSize" name="selectSize" defaultValue="150" />
<config:getOption var="visibleOptionCount" name="visibleOptionCount" defaultValue="5" />
<config:getOptions var="languages" name="languages" />

<widget:widget varCssId="cssId" extraCss="languageSelector">
	<select name="language" style="width:${selectSize}px;" class="select7">
		<c:forEach items="${languages}" var="language">
			<url:resource var="flagUrl" file="/resources/images/flags/${language}.png" testIfExists="true" />
			<option <c:if test="${flagUrl != null}"> data-icon="${flagUrl}"</c:if> value="<c:url value="/lang/${language}" />"<c:if test="${flagUrl != null}"> title="${flagUrl}"</c:if><c:if test="${i18nLang == language}"> selected="selected"</c:if>>
				<i18n:language language="${language}" />
			</option>
		</c:forEach>
	</select>
	<div style="clear:both;"></div>
</widget:widget>

<render:renderScript position="READY">
	$('#${cssId} select').bind('change', function() {
		var path = $(this).val(), gotoUrl = new BuildUrl(window.location.href.substr(window.location.href.indexOf('/page/'))).addParameter('l', path.substr(path.lastIndexOf('/') + 1), true);
		exa.redirect(new BuildUrl(path).addParameter('goto', gotoUrl.toString()).toString());
		return false;
	});
	$('#${cssId} select').select7({visibleOptionCount:${visibleOptionCount}});
</render:renderScript>