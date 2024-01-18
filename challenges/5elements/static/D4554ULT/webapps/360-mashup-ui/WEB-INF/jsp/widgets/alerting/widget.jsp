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
<c:if test="${user != null}">
	<widget:widget varCssId="ucssId" extraStyles="position:relative;">
		<a id="alerting-create-${ucssId}" href="#create" class="alerting-create rounded"><i18n:message code="buttontext" /><span></span></a>
	</widget:widget>
	<render:renderLater>
		<div id="alerting-form-layer-${ucssId}" class="alerting-form-layer" style="display:none;"></div>
		<form id="alerting-form-${ucssId}" class="alerting-form rounded" style="display:none;">
			<input name="page" value="<search:getPageName />" type="hidden"/>
			<input name="uiLevelQueryArgs" value='${pageContext.request.queryString}' type="hidden"/>
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
			<div class="arrow-top-right" style="right:24px;"></div>
		</form>
	</render:renderLater>
	<render:renderScript>
		(function () {
			var model = AlertingModel.getInstance('<c:url value="/" />');
			model.init();
			var form = new AlertingForm('${ucssId}', model);
			form.decorate();
			$('#alerting-create-${ucssId}').click(function () {
				var offset = $(this).offset();				
				form.open({
					top:offset.top + $(this).outerHeight(true),
					left:offset.left + $(this).outerWidth(true) - 312, // width + padding + border - extrapadding = 300 + 20 - 10
					width:300 
				});
				return false;
			});			
			
		}());
	
	</render:renderScript>
</c:if>