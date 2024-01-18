<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="i18n" uri="http://www.exalead.com/jspapi/i18n" %>
<%@ taglib prefix="string" uri="http://www.exalead.com/jspapi/string" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>
<%@ taglib prefix="datatable" uri="http://www.exalead.com/jspapi/widget-datatable" %>

<render:import varWidget="widget" varFeeds="feeds" />

<config:getOption var="facetName" name="facetName" defaultValue="" />
<search:getFacet var="facet" feeds="${feeds}" facetId="${facetName}" />

<widget:widget extraCss="scalableRefinesAsTable">

	<widget:header>
		<config:getOption name="title" defaultValue="" />
	</widget:header>

	<c:choose>
		<%-- If widget has no Feed --%>
		<c:when test="${search:hasFeeds(feeds) == false}">
			<widget:content>
				<render:definition name="noFeeds">
					<render:parameter name="widget" value="${widget}" />
					<render:parameter name="showSuggestion" value="false" />
				</render:definition>
			</widget:content>
		</c:when>

		<%-- If facet is not present in response --%>
		<c:when test="${facet == null}">
			<widget:content>
				<config:getOption var="noResultsJspPathHit" name="noResultsJspPathHit" defaultValue="/WEB-INF/jsp/commons/noFacets.jsp" />
				<render:template template="${noResultsJspPathHit}">
					<render:parameter name="accessFeeds" value="${feeds}" />
					<render:parameter name="showSuggestion" value="true" />
				</render:template>
			</widget:content>
		</c:when>

		<c:otherwise>
			<config:getOption var="facetPageName" name="facetPageName" defaultValue="" />
			<config:getOptionComposite var="sortMode" name="sortMode" defaultValue="" />
			<config:getOption var="iterMode" name="iterMode" defaultValue="flat" />
			<config:getOption var="itemCountPerPage" name="itemCountPerPage" defaultValue="20" />
			<config:getOption var="clientSideFilter" name="clientSideFilter" defaultValue="false" />
			<config:getOption var="nameDescription" name="nameDescription" defaultValue="Description" />
			<config:getOption var="totalDescription" name="totalDescription" defaultValue="Total" />
			<config:getOption var="displayTitle" name="displayTitle" defaultValue="true" />
			<config:getOption var="displayTotal" name="displayTotal" defaultValue="true" />
			<config:getOptionsComposite var="columns" name="columns" />
			<config:getOptions var="forceRefineOnFeeds" name="forceRefineOnFeeds" />

			<string:getRandomId var="id" prefix="table_" />
			<table id="${id}" class="table-striped table-grid table-hover data-table"><tbody><tr><td class="tableLoading"><i18n:message code="table.loading" text="Loading..." /></td></tr></tbody><tfoot><tr class="bottom"></tr></tfoot></table>
			<render:renderScript position="READY">
				$("#${id}").dataTableForJson(<datatable:json
					facet="${facet}"
					columns="${columns}"
					titleLabel="${nameDescription}"
					totalLabel="${totalDescription}"
					baseUrl="${facetPageName}"
					iterationMode="${iterMode}"
					showFilter="${clientSideFilter}"
					sortOn="${sortMode[0]}"
					sortOrder="${sortMode[1]}"
					feeds="${feeds}"
					perPage="${itemCountPerPage}"
					showTitle="${displayTitle}"
					showTotal="${displayTotal}"
					forceRefineOn="${forceRefineOnFeeds}"
					/>, translateDataTable);
			</render:renderScript>

			<render:renderOnce id="scalableDataTableTranslation">
				<render:renderScript>
					var translateDataTable = {
						"sInfo": "<i18n:message code="navigation.results" arguments="<span>_START_-_END_</span>,<span>_TOTAL_</span>" />",
						"sInfoEmpty": "<i18n:message code="navigation.noresult" />",
						"sInfoFiltered": "<i18n:message code="navigation.filtred" arguments="<span>_MAX_</span>" />",
						"sSearch": "<i18n:message code="navigation.search" />",
						"sEmptyTable": "<i18n:message code="navigation.empty" />",
						"oPaginate": {
							"sFirst": "<i18n:message code="navigation.first" />",
							"sLast": "<i18n:message code="navigation.last" />",
							"sPrevious": "<i18n:message code="navigation.previous" />",
							"sNext": "<i18n:message code="navigation.next" />"
						}
					};
				</render:renderScript>
			</render:renderOnce>
		</c:otherwise>
	</c:choose>
</widget:widget>
