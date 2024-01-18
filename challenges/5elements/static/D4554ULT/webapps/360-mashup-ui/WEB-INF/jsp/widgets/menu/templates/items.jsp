<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="url" uri="http://www.exalead.com/jspapi/url" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>

<render:import parameters="items,align" />

<div class="header-${align}">
	<div class="top-menu">
		<table class="table-top-menu">
			<tbody>
				<tr>
					<c:if test="${align == 'left'}">
						<td class="top-menu-separator"></td>
					</c:if>
					<c:forEach var="item" items="${items}" varStatus="s">
						<c:if test="${align == 'right'}">
							<td class="top-menu-separator"></td>
						</c:if>
						<c:choose>
							<%-- drop-down item --%>
							<c:when test="${fn:length(item.items) > 0}">
								<td class="top-menu-item item-${s.index+1}${item.active ? ' active' : ''} has-popup-menu">
									<div class="container">
										<div class="text">${item.label}</div>
										<div class="arrow"></div>
									</div>
									<ul class="top-popup-menu" style="display: none;">
										<c:forEach var="subitem" items="${item.items}" varStatus="ss">
											<li class="top-popup-item item-${s.index+1}-${ss.index+1}${subitem.active ? ' active' : ''}">
												<a href="<url:url value="${subitem.target}" />" class="top-menu-link">${subitem.label}</a>
											</li>
										</c:forEach>
									</ul>
								</td>
							</c:when>
							<%-- simple item --%>
							<c:otherwise>
								<td class="top-menu-item item-${s.index+1}${item.active ? ' active' : ''}">
									<a href="<url:url value="${item.target}" />" class="top-menu-item-link">${item.label}</a>
								</td>
							</c:otherwise>
						</c:choose>
						<c:if test="${align == 'left'}">
							<td class="top-menu-separator"></td>
						</c:if>
					</c:forEach>
				</tr>
			</tbody>
		</table>
	</div>
</div>