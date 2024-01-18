<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>
<%@ taglib prefix="request" uri="http://www.exalead.com/jspapi/request" %>
<%@ taglib prefix="url" uri="http://www.exalead.com/jspapi/url" %>
<%@ taglib prefix="dev" uri="http://www.exalead.com/jspapi/dev" %>

<widget:widget>
	<widget:header>
		<config:getOption name="title" defaultValue="" />
	</widget:header>

	<widget:content>
		<config:getOptionsComposite var="items" name="items" defaultValue=""/>
		<config:getOption var="pageParameter" name="pageParameter" />
		<config:getOption var="submitLabel" name="submitLabel" defaultValue="Select" />

		<url:url var="target_url" varParameters="parameters" keepQueryString="true">	
			<url:parameter name="${pageParameter}" value="" override="true"/>
		</url:url>

		<form method="GET" action="${target_url}">
			<%-- Copy params from the current url --%>
			<c:forEach items="${parameters}" var="paramEntry"> 
				<c:forEach items="${paramEntry.value}" var="paramValue">
					<input type="hidden" name="${paramEntry.key}" value="${paramValue}"/>
				</c:forEach> 
			</c:forEach>
			
			<request:getParameterValue var="id_val" name="${pageParameter}" defaultValue="" />
			<select name="${pageParameter}" class="decorate">
				<c:forEach var="item" items="${items}">
					<option value="${item[1]}"<c:if test="${id_val == item[1]}"> selected="selected"</c:if>>${item[0]}</option>
				</c:forEach>
			</select>
			<input type="submit" class="decorate" value="${submitLabel}" />
		</form>
	</widget:content>
</widget:widget>
