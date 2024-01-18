<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="url" uri="http://www.exalead.com/jspapi/url" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="request" uri="http://www.exalead.com/jspapi/request" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>

<config:getOption name="action" var="action" defaultValue="" />
<config:getOption name="searchLabel" var="searchLabel" defaultValue="" />
<config:getOption name="inputName" var="optionInputName" defaultValue="q" />

<config:getOption name="geoEnable" var="geoEnable" defaultValue="false" />
<c:if test="${geoEnable == 'true'}">
	<config:getOption name="geoLatitude" var="geoLatitude" defaultValue="lat" />
	<config:getOption name="geoLongitude" var="geoLongitude" defaultValue="lon" />
	<config:getOption name="geoMaximumAge" var="geoMaximumAge" defaultValue="5000" />
</c:if>
<config:getOption name="iconEnable" var="iconEnable" defaultValue="false" />
<c:if test="${iconEnable == 'true'}">
	<config:getOption name="iconSrc" var="iconSrc" defaultValue="" />
	<config:getOption name="iconUrl" var="iconUrl" />
	<url:resource var="iconSrc" file="${iconSrc}" />
</c:if>

<widget:widget extraCss="headerSearch" varCssId="cssId">
	<form method="get" action="<url:url value="${action}" />" class="centered ${iconEnable == 'true' ? ' with-logo' : ''}">
		<c:if test="${iconEnable == 'true'}">
			<div class="logo-container">
				<a href="<url:url value="${iconUrl}" />"><img src="${iconSrc}" /></a>
			</div>
		</c:if>
		<div class="search-input">
			<input type="text" name="${optionInputName}" placeholder="${searchLabel}" value="<request:getParameterValue name="${optionInputName}" defaultValue="" />" autocomplete="off" />
		</div>
		<div class="search-button">
			<button class="btn">
				<span class="btn-text">Search</span>
				<span class="btn-icon icon-search">&nbsp;</span>
			</button>
		</div>	
	</form>
</widget:widget>
<c:if test="${geoEnable == 'true'}">
	<render:renderScript>
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				$('#${cssId} form').append('<input type="hidden" name="${geoLatitude}" value="' + position.coords.latitude + '" />')
									.append('<input type="hidden" name="${geoLongitude}" value="' + position.coords.longitude + '" />');
			}, null, { maximumAge: ${geoMaximumAge} });
		}
	</render:renderScript>
</c:if>
