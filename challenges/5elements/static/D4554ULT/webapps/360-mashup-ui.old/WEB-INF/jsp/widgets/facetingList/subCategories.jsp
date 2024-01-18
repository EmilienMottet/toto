<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>
<%@ taglib prefix="string" uri="http://www.exalead.com/jspapi/string" %>
<%@ taglib prefix="url" uri="http://www.exalead.com/jspapi/url" %>
<%@ taglib prefix="list" uri="http://www.exalead.com/jspapi/list" %>
<%@ taglib prefix="request" uri="http://www.exalead.com/jspapi/request" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>

<render:import parameters="category,aggregation,feeds,isDisjunctive,forceRefineOnFeeds,sortMode,filterNullAggregation,defaultValue" />

<search:getCategoryState var="state" category="${category}" />
<search:getCategoryUrl var="categoryUrl" category="${category}" feeds="${feeds}" forHtml="false" zapRefinements="${!isDisjunctive}" forceRefineOn="${forceRefineOnFeeds}" />
<search:getCategoryValueType var="type" category="${category}" name="${aggregation}" />
{
	<c:choose>
		<c:when test="${type == 'STRING'}">
			<search:getCategoryValue var="catValue" category="${category}" name="${aggregation}" defaultValue="${defaultValue}" />
		</c:when>
		<c:otherwise>
			<search:getCategoryValue var="catValue" category="${category}" name="${aggregation}" defaultValue="" />
			<c:choose>
				<c:when test="${catValue == ''}">
					<c:set var="catValue" value="${defaultValue}"/>
				</c:when>
				<c:otherwise>
					<string:formatNumber var="catValue">
						<search:getCategoryValue category="${category}" name="${aggregation}" defaultValue="0" />
					</string:formatNumber>
				</c:otherwise>
			</c:choose>
		</c:otherwise>
	</c:choose>

	aggregation:'${catValue}',
	label:'<string:escape escapeType="JAVASCRIPT"><search:getCategoryLabel category="${category}"/></string:escape>',
	<c:if test="${categoryUrl != null}">
	url: '${categoryUrl}',
	</c:if>
	<c:if test="${state == 'REFINED'}">
	refined:true,
	</c:if>
	children: [
	<search:forEachCategory aggregationToPreserve="${aggregation}" filterNullAggregation="${filterNullAggregation}" root="${category}" var="subcat" iterationMode="FLAT" sortMode="${sortMode}" varStatus="status">
		<c:if test="${!status.first}">,</c:if>
		<render:template template="subCategories.jsp">
			<render:parameter name="category" value="${subcat}" />
			<render:parameter name="aggregation" value="${aggregation}" />
			<render:parameter name="feeds" value="${feeds}" />
			<render:parameter name="isDisjunctive" value="${isDisjunctive}" />
			<render:parameter name="forceRefineOnFeeds" value="${forceRefineOnFeeds}" />
			<render:parameter name="sortMode" value="${sortMode}" />
			<render:parameter name="filterNullAggregation" value="${filterNullAggregation}" />
			<render:parameter name="defaultValue" value="${defaultValue}" />
		</render:template>
	</search:forEachCategory>
	]
}