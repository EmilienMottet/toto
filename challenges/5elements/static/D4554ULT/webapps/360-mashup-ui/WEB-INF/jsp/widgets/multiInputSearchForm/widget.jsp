<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="request" uri="http://www.exalead.com/jspapi/request" %>
<%@ taglib prefix="string" uri="http://www.exalead.com/jspapi/string" %>
<%@ taglib prefix="list" uri="http://www.exalead.com/jspapi/list" %>

<render:import varWidget="widget" />

<config:getOption name="inputSize" var="inputSize" defaultValue="300" />
<config:getOption var="keepRefinements" name="keepRefinements" defaultValue="false" />
<config:getOption var="defaultValuesSeparator" name="defaultValuesSeparator" defaultValue="," />
<config:getOption var="hasGeolocation" name="geoEnable" defaultValue="false"/>

<config:getOptionsComposite name="inputFields" var="inputFields" />
<config:getOptionsComposite var="actions" name="action" doEval="true" />
<config:getOptionsComposite name="defaultValues" var="defaultValues" />

<list:toMap var="defaultValues" list="${defaultValues}" />

<widget:widget extraCss="searchForm multiSearchForm" varCssId="cssId">
	<c:set var="formAction" value="${actions[0][1]}" />
	<form method="get" action="<c:url value="${formAction}" />">
		<table cellpadding="0" cellspacing="0" border="0" class="searchWidget">
			<tbody>
				<c:if test="${fn:length(actions) > 1}">
					<tr>
						<td colspan="4" class="actions">
							<c:forEach var="action" items="${actions}">
								<span data-action="${action[1]}">${action[0] == '' ? (action[1] == '' ? feedName : action[1]) : action[0]}</span>
							</c:forEach>
						</td>
					</tr>
				</c:if>

				<config:getOption var="nbInputByRow" name="nbInputByRow" defaultValue="2" />
				<c:if test="${fn:length(inputFields) < nbInputByRow}">
					<c:set var="nbInputByRow" value="${fn:length(inputFields)}" />
				</c:if>
				<c:forEach items="${inputFields}" var="field" varStatus="status">
					<c:set var="inputName" value="${string:trim(field[0])}" />
					<c:if test="${status.index == 0 || status.index % nbInputByRow == 0}">
						<tr>
					</c:if>
					<td align="right" style="padding: 5px" valign="middle">
						${field[1] == '' ? inputName : field[1]}:
					</td>
					<td align="right" style="padding: 5px" valign="middle">
						<div class="searchFormContent">

							<list:new var="inputValues" />
							<c:if test="${defaultValues[inputName] != null}">
								<c:forEach var="rawValue" items="${defaultValues[inputName]}">
									<string:split string="${rawValue}" var="rawValues" separator="${defaultValuesSeparator}"/>
									<c:forEach var="value" items="${rawValues}">
										<list:add list="${inputValues}" value="${value}" />
									</c:forEach>
								</c:forEach>
							</c:if>

							<c:choose>
								<c:when test="${fn:length(inputValues) > 0}">
									<c:set var="defaultValue" value="${inputValues[0]}" />
								</c:when>
								<c:otherwise>
									<c:set var="defaultValue" value="" />
								</c:otherwise>
							</c:choose>
							<request:getParameterValue var="defaultValue" name="${inputName}" defaultValue="${defaultValue}" />

							<c:choose>
								<c:when test="${fn:length(inputValues) > 1}">
									<select name="${inputName}" style="width:${inputSize}px" class="decorate">
										<c:forEach var="value" items="${inputValues}">
											<option value="${value}"<c:if test="${value == defaultValue}"> selected</c:if>>${value}</option>
										</c:forEach>
									</select>
								</c:when>
								<c:otherwise>
									<input type="text" name="${inputName}" value="${defaultValue}" style="width:${inputSize}px" class="searchInput" />
								</c:otherwise>
							</c:choose>
						</div>
						<c:if test="${field[2] != '' && fn:length(inputValues) <= 1}">
							<render:renderScript position="READY">
								$('#${cssId} input[name=${inputName}]').enableSuggest('<c:url value="/utils/suggest/${feedName}" />', '${feedName}', '${widget.wuid}', {autoSubmit: false});
							</render:renderScript>
						</c:if>
					</td>
					<c:if test="${status.index % nbInputByRow == (nbInputByRow - 1)}">
						</tr>
					</c:if>
				</c:forEach>

				<tr>
					<td colspan="${nbInputByRow * 2}" align="right" style="padding: 5px">
						<c:if test="${keepRefinements}">
							<div class="options">
								<span><input type="checkbox" id="${widget.wuid}_opt_keepRefinements" data-name="keepRefinements" /><label for="${widget.wuid}_opt_keepRefinements">Keep refinements</label></span>
							</div>
						</c:if>
						<div class="searchButton">
							<input type="submit" value="<config:getOption name="buttonName" defaultValue="" />" />
						</div>
					</td>
				</tr>
			</tbody>
		</table>
	</form>
</widget:widget>

<render:renderScript position="READY">
	<config:getOptionsComposite var="geoForm" name="exa.io.GeoInterface" separator="##" />		
	$('#${cssId} form').searchForm({
		uid: '${widget.wuid}',
		focus: <config:getOption name="focus" defaultValue="true" />,
		<c:if test="${fn:length(geoForm)>0}">
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
		},
		keepRefinements: ${keepRefinements},
		keepRefinementsState: <config:getOption name="keepRefinementsDefaultState" defaultValue="false" />
	});
</render:renderScript>
