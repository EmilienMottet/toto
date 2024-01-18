<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="url" uri="http://www.exalead.com/jspapi/url" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>

<render:import parameters="widget,accessFeeds" />

<search:getPaginationInfos varFeed="feedWithMaxResults" varCurrentPage="currentPage" varLastPage="lastPage" feeds="${accessFeeds}" />
<config:getOption var="nbPageToShowInPagination" name="nbPageToShowInPagination" defaultValue="9" />
<config:getOption var="optionMoreResultsUrl" name="moreResultsUrl" feed="${feedWithMaxResults}" defaultValue="" />

<c:set var="displayPagination" value="${feedWithMaxResults != null && nbPageToShowInPagination > 0 && lastPage > 1}" />
<c:if test="${feedWithMaxResults != null && (displayPagination || optionMoreResultsUrl != '')}">
	<widget:content>
		<%-- Pagination --%>
		<c:if test="${displayPagination}">
			<ol class="btn-group">
				<c:if test="${currentPage > 1}">
					<search:getPageFirst varUrl="urlFirstPage" feeds="${accessFeeds}" />
					<search:getPagePrevious varUrl="urlPreviousPage" feeds="${accessFeeds}" />
					<li class="btn"><a href="${urlFirstPage}">&laquo;</a></li>
					<li class="btn"><a href="${urlPreviousPage}">&lsaquo;</a></li>
				</c:if>
				<search:forEachPage var="pageNumber" varUrl="pageUrl" varIsSelected="isCurrentPage" feeds="${accessFeeds}" nbPageToShow="${nbPageToShowInPagination}">
					<li class="btn"><a href="${pageUrl}" class="${isCurrentPage ? 'current' : ''}">${pageNumber}</a></li>
				</search:forEachPage>
				<c:if test="${currentPage < lastPage}">
					<search:getPageNext varUrl="urlNextPage" feeds="${accessFeeds}" />
					<search:getPageLast varUrl="urlLastPage" feeds="${accessFeeds}" />
					<li class="btn"><a href="${urlNextPage}">&rsaquo;</a></li>
					<li class="btn"><a href="${urlLastPage}">&raquo;</a></li>
				</c:if>
			</ol>
		</c:if>
		<%-- /Pagination --%>

		<%-- Show more results --%>
		<c:if test="${optionMoreResultsUrl != ''}">
			<url:url var="moreResultUrl" value="${optionMoreResultsUrl}" feeds="${accessFeeds}" />
			<div class="moreResults">
				<a href="${moreResultUrl}"><config:getOption name="moreResultsLabel" defaultValue="More results ..." /></a>
			</div>
		</c:if>
		<%-- /Show more results --%>

	</widget:content>
</c:if>
