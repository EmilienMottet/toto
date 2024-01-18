<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="string" uri="http://www.exalead.com/jspapi/string" %>
<%@ taglib prefix="i18n" uri="http://www.exalead.com/jspapi/i18n" %>
<%@ taglib prefix="request" uri="http://www.exalead.com/jspapi/request" %>

<render:import varWidget="widget" />

<config:getOption name="inputSize" var="inputSize" defaultValue="400" />
<config:getOption name="inputName" var="optionInputName" defaultValue="q" />
<config:getOption name="buttonName" var="buttonName" defaultValue="" />
<config:getOption var="hasSuggest" name="enableSuggest" defaultValue="false"/>
<config:getOption var="hasGeolocation" name="geoEnable" defaultValue="false"/>
<config:getOption var="keepRefinements" name="keepRefinements" defaultValue="false" />
<config:getOption var="hasAdvancedSearch" name="advancedSearchEnabled" defaultValue="false" />
<config:getOptions var="wuids" name="ajaxWUIDs" />
<config:getOptionsComposite var="actions" name="action" doEval="true" />

<widget:widget extraCss="searchForm" varCssId="cssId" disableStyles="true">
	<c:set var="formAction" value="${actions[0][1]}" />
	<form method="get" action="<c:url value="${formAction}" />">
		<table cellpadding="0" cellspacing="0" border="0" class="searchWidget">
			<tbody>
				<%-- Search actions --%>
				<c:if test="${fn:length(actions) > 1}">
					<tr>
						<td<c:if test="${hasAdvancedSearch}"> colspan="2"</c:if> class="actions">
							<c:forEach var="action" items="${actions}">
								<span data-action="${action[1]}">${action[0] == '' ? (action[1] == '' ? feedName : action[1]) : action[0]}</span>
							</c:forEach>
						</td>
					</tr>
				</c:if>

				<%-- Search form & Advanced search --%>
				<tr>
					<td>
						<div class="searchFormContent">
							<c:if test="${hasAdvancedSearch}">
								<div class="advancedSearchFormContent"></div>
							</c:if>
							<input type="text" name="${optionInputName}" value="<request:getParameterValue name="${optionInputName}" defaultValue="" />" style="width:${inputSize}px" class="searchInput" /><div class="searchButton"><input class="btn" type="submit" value="${buttonName}" /></div>
						</div>
					</td>
					<c:if test="${hasAdvancedSearch}">
						<td>
							<div class="advancedsearch">
								<a class="advancedSearchLink" href="#" title="Show advanced search dialog"><i18n:message code="advancedSearch" /></a>
							</div>
						</td>
					</c:if>
				</tr>

				<%-- Search Form options --%>
				<c:if test="${keepRefinements}">
					<tr>
						<td class="options">
							<span><input type="checkbox" id="${widget.wuid}_opt_keepRefinements" data-name="keepRefinements" /><label for="${widget.wuid}_opt_keepRefinements"><i18n:message code="keep-refinements"/></label></span>
						</td>
						<c:if test="${hasAdvancedSearch}">
							<td></td>
						</c:if>
					</tr>
				</c:if>

			</tbody>
		</table>
	</form>
</widget:widget>

<render:renderScript position="READY">
	<config:getOptionsComposite var="geoForm" name="exa.io.GeoInterface" separator="##" />	
	<%-- Init Search Form --%>
	$('#${cssId} form').searchForm({
		uid: '${widget.wuid}',
		focus: <config:getOption name="focus" defaultValue="true" />,
		keepRefinements: ${keepRefinements},
		keepRefinementsState: <config:getOption name="keepRefinementsDefaultState" defaultValue="false" />,
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

	<%-- Suggest --%>
	<c:if test="${hasSuggest == 'true'}">
		$('#${cssId} input[name=${optionInputName}]').enableSuggest('<c:url value="/utils/suggest/${feedName}" />', '${feedName}', '${widget.wuid}', {autoSubmit: false});
	</c:if>

	<%-- Advanced Search Init JS --%>
	<c:if test="${hasAdvancedSearch}">
		<render:template template="advancedSearch/${i18nLang}.jsp" defaultTemplate="advancedSearch/en.jsp" />
		AS.initSingle($('#${cssId} div.advancedSearchFormContent'), context);
	</c:if>

	<%-- Instant Search --%>
	<c:if test="${fn:length(wuids) > 0}">
		$('#${cssId}').instantSearch({
			parameter: '${optionInputName}',
			expandQueryAfter: '<config:getOption name="expandQueryAfter" defaultValue="3" />',
			wuids: ['<string:join list="${wuids}" separator="','" />'],
			success: <config:getOption name="instantSearchOnLoad" defaultValue="function() {}" />,
		});
	</c:if>

</render:renderScript>