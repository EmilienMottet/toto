<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="i18n" uri="http://www.exalead.com/jspapi/i18n" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="string" uri="http://www.exalead.com/jspapi/string" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>

<render:import varWidget="widget" varFeeds="feeds" parameters="category" />

<config:getOptions var="values" name="values" />
<config:getOptions var="forceRefineOnFeeds" name="forceRefineOnFeeds" />
<config:getOption var="displayExclude" name="displayExclude" defaultValue="false" />
<config:getOption var="baseUrl" name="facetPageName" defaultValue="" />
<config:getOption var="sort" name="sort" defaultValue="default" />
<config:getOption var="nbSubFacets" name="nbSubFacets" defaultValue="0" />
<config:getOption name="filterNullAggregation" var="filterNullAggregation" defaultValue="false"/>	
<config:getOption name="defaultValue" var="defaultValue" defaultValue="0"/>

<c:set var="displayExtra" value="${fn:length(values) > 0 || displayExclude}" />
<string:join var="valuesToPreserve" list="${values}" separator=","  />
	<c:choose>
		<c:when test="${fn:length(category.categories) == 1}">
			<%-- There is only one category to retrieve on this level --%>
			
			<search:forEachCategory filterNullAggregation="${filterNullAggregation}" aggregationToPreserve="${valuesToPreserve}" root="${category}" var="subCategory" sortMode="${sort}" iteration="${nbSubFacets}">
				<search:getCategoryState varClassName="className" category="${subCategory}" />
				<search:getCategoryUrl var="categoryUrl" category="${subCategory}" feeds="${feeds}" baseUrl="${baseUrl}" forceRefineOn="${forceRefineOnFeeds}" />
				<li class="alone">
					<render:link href="${categoryUrl}" extraCss="${className}"><search:getCategoryLabel category="${subCategory}" /></render:link>
					<c:if test="${displayExtra}">
						<span class="extra">
							<c:forEach var="value" items="${values}">
								<search:getCategoryValue var="catValue" category="${subCategory}" name="${value}" defaultValue="" />
								<c:if test="${filterNullAggregation == false or catValue != ''}">
								(<i class="${value}">
									<search:getCategoryValueType var="type" category="${subCategory}" name="${value}" />
									<c:choose>
										<c:when test="${type == 'STRING'}">
											<search:getCategoryValue category="${subCategory}" name="${value}" defaultValue="${defaultValue}" />
										</c:when>
										<c:otherwise>
											<search:getCategoryValue var="catValue" category="${subCategory}" name="${value}" defaultValue="" />
											<c:choose>
												<c:when test="${catValue == ''}">
													<c:out value="${defaultValue}"/>
												</c:when>
												<c:otherwise>
													<string:formatNumber>
														<search:getCategoryValue category="${subCategory}" name="${value}" defaultValue="0" />
													</string:formatNumber>
												</c:otherwise>
											</c:choose>
										</c:otherwise>
									</c:choose>
								</i>)
								</c:if>
							</c:forEach>
							<c:if test="${displayExclude && subCategory.state == 'DISPLAYED'}">
								<%-- Show exclude link if needed --%>
								<search:getCategoryUrl var="categoryExcludeUrl" category="${subCategory}" feeds="${feeds}" baseUrl="${baseUrl}" forceState="EXCLUDED" forceRefineOn="${forceRefineOnFeeds}" />
								<a href="${categoryExcludeUrl}" class="exclude" title="<i18n:message code="refines.exclude" />"><i18n:message code="refines.x" /></a>
							</c:if>
						</span>
					</c:if>
				</li>
				<c:if test="${search:hasCategories(subCategory)}">
					<li class="separator">&gt;</li>
					<render:template template="subCategory.jsp">
						<render:parameter name="category" value="${subCategory}" />
					</render:template>
				</c:if>
			</search:forEachCategory>
		</c:when>

		<c:otherwise>
			<%-- There is more than one category to display, do not recurse --%>
			<li class="subCategories">
				<ul class="categories">
					<search:forEachCategory filterNullAggregation="${filterNullAggregation}" aggregationToPreserve="${valuesToPreserve}" root="${category}" var="subCategory" varStatus="status" sortMode="${sort}" iteration="${nbSubFacets}">
						<search:getCategoryState varClassName="className" category="${subCategory}" />
						<search:getCategoryUrl var="categoryUrl" category="${subCategory}" feeds="${feeds}" baseUrl="${baseUrl}" forceRefineOn="${forceRefineOnFeeds}" />
						<li>
							<render:link href="${categoryUrl}" extraCss="${className}"><search:getCategoryLabel category="${subCategory}" /></render:link>
							<c:if test="${displayExtra}">
								<span class="extra">
									<c:forEach var="value" items="${values}">
										<search:getCategoryValue var="catValue" category="${subCategory}" name="${value}" defaultValue="" />
										<c:if test="${filterNullAggregation == false or catValue != ''}">
										(<i class="${value}">
											<search:getCategoryValueType var="type" category="${subCategory}" name="${value}" />
											<c:choose>
												<c:when test="${type == 'STRING'}">
													<search:getCategoryValue category="${subCategory}" name="${value}" defaultValue="${defaultValue}" />
												
												</c:when>
												<c:otherwise>
													<search:getCategoryValue var="catValue" category="${subCategory}" name="${value}" defaultValue="" />
													<c:choose>
														<c:when test="${catValue == ''}">
															<c:out value="${defaultValue}"/>
														</c:when>
														<c:otherwise>
															<string:formatNumber>
																<search:getCategoryValue category="${subCategory}" name="${value}" defaultValue="0" />
															</string:formatNumber>
														</c:otherwise>
													</c:choose>
												</c:otherwise>
											</c:choose>
										</i>)
										</c:if>									
									</c:forEach>
									<c:if test="${displayExclude && subCategory.state == 'DISPLAYED'}">
										<%-- Show exclude link if needed --%>
										<search:getCategoryUrl var="categoryExcludeUrl" category="${subCategory}" feeds="${feeds}" baseUrl="${baseUrl}" forceState="EXCLUDED" forceRefineOn="${forceRefineOnFeeds}" />
										<a href="${categoryExcludeUrl}" class="exclude" title="<i18n:message code="refines.exclude" />"><i18n:message code="refines.x" /></a>
									</c:if>
								</span>
							</c:if>
							<c:if test="${status.last == false}">,</c:if>
						</li>
					</search:forEachCategory>
				</ul>
			</li>
		</c:otherwise>
	</c:choose>
