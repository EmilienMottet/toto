<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="url" uri="http://www.exalead.com/jspapi/url" %>
<%@ taglib prefix="i18n" uri="http://www.exalead.com/jspapi/i18n" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>
<%@ taglib prefix="export" uri="http://www.exalead.com/jspapi/export" %>

<render:import varWidget="widget" varFeeds="feeds" />

<config:getOption var="csv" name="csvExport" defaultValue="true" />
<config:getOption var="atom" name="atomExport" defaultValue="true" />
<config:getOption var="pdf" name="pdfExport" defaultValue="true" />
<config:getOption var="png" name="pngExport" defaultValue="true" />

<search:getFeed feeds="${feeds}" var="feed" />

<widget:widget extraCss="exportCSV">
	<widget:header>
		<config:getOption name="title" defaultValue="" />
	</widget:header>

	<widget:content extraCss="small-padding">
		<config:getOption name="title" defaultValue="" />
		<c:if test="${csv == 'true'}">
			<config:getOption var="fileName" name="fileName" />
			<config:getOption var="csvMethod" name="csvMethod" defaultValue="GET" />
			<c:choose>			
				<c:when test="${csvMethod == 'GET' }" >
					<a href='<export:getCsvUrl feed="${feed}" fileName="${fileName}" />'>
						<img src="<url:resource file="images/excel.png" />" title='<i18n:message code="csvExport" />' />
					</a>
				</c:when>
				<c:otherwise>
					<export:getCsvInfo parametersVar="csvParams" urlVar="csvUrl" feed="${feed}" fileName="${fileName}" />
					<form action="${csvUrl}" method="post" style="display:inline-block;">			
						<c:forEach var="csvParam" items="${csvParams}">
		                	<input type="hidden" name="${csvParam.key}" value="${csvParam.value}" />
		     			</c:forEach>
						<input type="image" src="<url:resource file="images/excel.png" />" alt="<i18n:message code="csvExport" />"/>
					</form>					
				</c:otherwise>
			</c:choose>
		</c:if>
		<c:if test="${atom == 'true'}">
			<config:getOption var="atomMethod" name="atomMethod" defaultValue="GET" />
			<c:choose>
				<c:when test="${atomMethod == 'GET' }" >
					<a href="<export:getAtomUrl feed="${feed}" />">
						<img src="<url:resource file="images/rss.png" />" title='<i18n:message code="atomExport" />' />
					</a>
			    </c:when>
			    <c:otherwise>
					<export:getAtomInfo urlVar="atomUrl" feed="${feed}" feedUriVar="feedUri" />
					<form action="${atomUrl}" method="post" style="display:inline-block;">		
						<input type="hidden" name="feedUri" value="${feedUri}" />		     			
						<input type="image" src="<url:resource file="images/rss.png" />" alt="<i18n:message code="atomExport" />"/>
					</form>					
				</c:otherwise>
			</c:choose>
		</c:if>
		<c:if test="${pdf == 'true'}">
			<config:getOption var="filename" name="pdfFileName" />
			<config:getOption var="customExportURL" name="customExportURL" />
			<a href="<export:getPdfUrl fileName="${filename}" exportUrl="${customExportURL}" />">
				<img src="<url:resource file="images/pdf.png" />" title='<i18n:message code="pdfExport" />' />
			</a>
		</c:if>
		<c:if test="${png == 'true'}">
			<config:getOption var="filename" name="pngFileName" />
			<config:getOption var="customExportURL" name="pngCustomExportURL" />
			<config:getOption var="pngWidth" name="pngWidth" defaultValue="" />
			<config:getOption var="pngHeight" name="pngHeight" defaultValue="" />
			<a href="<export:getPngUrl fileName="${filename}" exportUrl="${customExportURL}" width="${pngWidth}" height="${pngHeight}" />">
				<img src="<url:resource file="images/png.png" />" title='<i18n:message code="pngExport" />' />
			</a>
		</c:if>
	</widget:content>
</widget:widget>
