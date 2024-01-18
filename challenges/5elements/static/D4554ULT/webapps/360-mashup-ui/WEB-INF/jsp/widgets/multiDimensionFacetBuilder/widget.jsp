<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>
<%@ taglib prefix="string" uri="http://www.exalead.com/jspapi/string" %>
<%@ taglib prefix="url" uri="http://www.exalead.com/jspapi/url" %>
<%@ taglib prefix="request" uri="http://www.exalead.com/jspapi/request" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>

<render:import varWidget="widget" varFeeds="feeds"/>

<widget:widget extraCss="matrixFacetBuilder">
	
	<string:getRandomId var="form_id" prefix="mfb" />
	<string:getRandomId var="id_x" prefix="mfb" />
	<string:getRandomId var="id_y" prefix="mfb" />
	<string:getRandomId var="id_a" prefix="mfb" />
	
	<config:getOption var="createAggr" name="createAggr" defaultValue="false" />

	<render:renderScript position="READY">
		$('#${form_id}').submit(function(e) {
			var url = new BuildUrl('<url:url keepQueryString="true" xmlEscape="false" feeds="${feeds}" />');
			url.addParameter('w\$${widget.wuid}.x', $('#${id_x}').val(), true);
			url.addParameter('w\$${widget.wuid}.y', $('#${id_y}').val(), true);
			
			<c:if test="${createAggr == 'true'}">
				url.addParameter('w\$${widget.wuid}.a', $('#${id_a}').val(), true);
			</c:if>

			<search:forEachFeed var="feed" feeds="${feeds}">
				url.clearRefinements('${feed.id}');
			</search:forEachFeed>

			exa.redirect(url.toString());
			return false;
		});
	</render:renderScript>
	
	<widget:header>
		<config:getOption name="title" defaultValue=""/>
	</widget:header>
	
	<widget:content>
		<config:getOption var="facetId" name="facetId" />
		
		<config:getOption var="facetsListMode" name="facetsListMode" />
		<config:getOption var="facetsList" name="facetsList" defaultValue="" />
		
		<config:getOption var="differentFacetsOnXY" name="differentFacetsOnXY" defaultValue="false"/>
		<c:choose>
			<c:when test="${differentFacetsOnXY == 'true'}">
				<config:getOption var="facetsListMode_y" name="facetsListMode_y" defaultValue="No filtering"/>
				<config:getOption var="facetsList_y" name="facetsList_y" defaultValue="" />
			</c:when>
			<c:otherwise>
				<c:set var="facetsListMode_y" value="${facetsListMode}" />
				<c:set var="facetsList_y" value="${facetsList}" />
			</c:otherwise>
		</c:choose>

		<form method="GET" id="${form_id}">
			<request:getParameterValue var="id_x_val" name="w\$${widget.wuid}.x" defaultValue="" />
			<label for="${id_x}">x:</label>
			<select id="${id_x}" class="decorate">
				<search:forEachFacet var="facet" facetsList="${facetsList}" filterMode="${facetsListMode}" feeds="${feeds}" showEmptyFacets="true" sortMode="DESCRIPTION-ASC">
					<c:if test="${facet.id != facetId && facet.type != 'H2D' && facet.type != 'MULTI' && facet.type != 'NUM_DYNAMIC' && facet.type != 'DYNDATE' && facet.type != 'AUTOTILE'}">
						<option value="${facet.id}" <c:if test="${id_x_val == facet.id}">selected='true'</c:if>>${facet.id}</option>
					</c:if>
				</search:forEachFacet>
			</select>
			
			<img src='<url:resource file="images/switch.png"/>' class="switch" />
			
			<request:getParameterValue var="id_y_val" name="w\$${widget.wuid}.y" defaultValue="" />
			<label for="${id_y}">y:</label>
			<select id="${id_y}" class="decorate">
				<search:forEachFacet var="facet" facetsList="${facetsList_y}" filterMode="${facetsListMode_y}" feeds="${feeds}" showEmptyFacets="true" sortMode="DESCRIPTION-ASC">
					<c:if test="${facet.id != facetId && facet.type != 'H2D' && facet.type != 'MULTI' && facet.type != 'NUM_DYNAMIC' && facet.type != 'DYNDATE' && facet.type != 'AUTOTILE'}">
						<option value="${facet.id}" <c:if test="${id_y_val == facet.id}">selected='true'</c:if>>${facet.id}</option>
					</c:if>
				</search:forEachFacet>
			</select>
			
			<c:if test="${createAggr == 'true'}">
				<config:getOptionsComposite var="aggregations" name="aggregations" />
				<request:getParameterValue var="id_a_val" name="w\$${widget.wuid}.a" defaultValue="" />
				<label for="${id_a}">Aggregation:</label> 
				<select id="${id_a}" class="decorate">
					<c:forEach varStatus="status" var="agg" items="${aggregations}">
						<option value="${status.index}" <c:if test="${id_a_val == status.index}">selected='true'</c:if>>${agg[0]}</option>
					</c:forEach>
				</select>
			</c:if>

			<input type="submit" class="decorate" name="" value="Create" />
		</form>
	</widget:content>
</widget:widget>
