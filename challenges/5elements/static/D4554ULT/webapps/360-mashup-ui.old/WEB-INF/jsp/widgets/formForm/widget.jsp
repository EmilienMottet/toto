<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="url" uri="http://www.exalead.com/jspapi/url" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>
<%@ taglib prefix="request" uri="http://www.exalead.com/jspapi/request" %>

<render:import varWidget="widget" />

<config:getOption var="action" name="action" defaultValue="" />
<config:getOption var="method" name="method" />
<config:getOption var="hasGeolocation" name="geoEnable" defaultValue="false"/>

<widget:widget varCssId="cssId" disableStyles="true">
	<%-- must be appended before its components --%>
	<render:renderScript position="READY">
		<config:getOptionsComposite var="geoForm" name="exa.io.GeoInterface" separator="##" />
		$('#${cssId} form').searchForm({
			uid: '${widget.wuid}',
			focus: <config:getOption name="focus" defaultValue="true" />,
			<c:if test="${fn:length(geoForm) > 0}">
			geoForm:[
				<c:forEach var="rowGeoForm" items="${geoForm}" varStatus="status">
				{
					wuid:'${rowGeoForm[0]}',
					parameter:'${rowGeoForm[1]}',
					value:'<request:getParameterValue name="${rowGeoForm[1]}" defaultValue="" />',
					geoMetaName:'${rowGeoForm[2]}'
				}<c:if test="${!status.last}">,</c:if>
				</c:forEach>
			],
			</c:if>
			geolocation: {
				enable: ${hasGeolocation},
				latitude: '<config:getOption name="geoLatitude" defaultValue="lat" />',
				longitude: '<config:getOption name="geoLongitude" defaultValue="lon" />',
				options: {
					maximumAge: '<config:getOption name="geoMaximumAge" defaultValue="5000" />'
				}
			}
		});
		$('#${cssId} > form').validate({ errorClass : "formError" });
	</render:renderScript>

	<form action="<c:url value="${action}" />" method="${method}">
		<render:subWidgets />
        <c:if test="${method == 'POST'}">
        <render:csrf/>
        </c:if>
	</form>
</widget:widget>
