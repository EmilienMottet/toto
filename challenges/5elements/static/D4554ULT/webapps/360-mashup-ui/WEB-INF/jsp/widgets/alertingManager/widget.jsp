<%@ taglib prefix="tiles" uri="http://tiles.apache.org/tags-tiles" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="string" uri="http://www.exalead.com/jspapi/string" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>
<%@ taglib prefix="request" uri="http://www.exalead.com/jspapi/request" %>
<%@ taglib prefix="security" uri="http://www.exalead.com/jspapi/security" %>
<%@ taglib prefix="i18n" uri="http://www.exalead.com/jspapi/i18n" %>
<%@ taglib prefix="url" uri="http://www.exalead.com/jspapi/url" %>


<render:import varWidget="widget" varParentEntry="rootEntry" />
<security:getUser var="user" />

<widget:widget varCssId="ucssId">
	<widget:header>
		<config:getOption name="title" defaultValue=""/>
	</widget:header>
	<c:choose>
		<c:when  test="${user != null}">
			<widget:content cssId="alerting-content-${ucssId}" extraCss="alerting-content alerting-loading">
				<ul id="alerting-list-${ucssId}" class="alerting-list">
				</ul>
				<div id="alerting-error-${ucssId}"><i18n:message code="erroralerts" /></div>
			</widget:content>
			<render:renderLater>
				<div id="alerting-form-layer-${ucssId}" class="alerting-form-layer" style="display:none;"></div>
				<form id="alerting-form-${ucssId}" class="alerting-form rounded">
					<input name="key" type="hidden"/>
					<input class="decorate" name="name" type="text" placeholder="<i18n:message code="name" />"/>
					<textarea class="decorate" name="description" rows="2" placeholder="<i18n:message code="description" />"></textarea>
					<p><i18n:message code="groups" /> :</p>
					<ul id="alerting-form-groups-${ucssId}" class="alerting-form-groups">			
					</ul>
					<div class="alerting-form-buttons">
						<input class="decorate" type="submit" value="<i18n:message code="save" />"/>
						<input class="decorate" type="button" name ="cancel" value="<i18n:message code="cancel" />"/>
					</div>
					<div style="clear:both;"></div>
					<div id ="alerting-form-error-save-${ucssId}" class="alerting-form-error"><i18n:message code="errorsave" /></div>
					<div id ="alerting-form-error-groups-${ucssId}" class="alerting-form-error"><i18n:message code="errorgroups" /></div>
					<div class="arrow-top-right"></div>
				</form>
			</render:renderLater>
			<render:renderScript>
				(function () {
					var model = AlertingModel.getInstance('<c:url value="/" />');
					var form = new AlertingForm('${ucssId}', model);
					var i18n = {
						goTo:'<i18n:message code="gotoalert" javaScriptEscape="true"/>',
						editAlert:'<i18n:message code="editalert" javaScriptEscape="true"/>',
						deleteAlert:'<i18n:message code="deletealert" javaScriptEscape="true"/>'
					};
					var manager = new AlertingManagerWidget('${ucssId}', model, form, i18n);
					
					model.init();
					form.decorate();
					manager.decorate();
					
				}());
			
			</render:renderScript>
		</c:when>
		<c:otherwise>
			<widget:content><i18n:message code="errorlogin" /></widget:content>		
		</c:otherwise>
	</c:choose>
</widget:widget>
