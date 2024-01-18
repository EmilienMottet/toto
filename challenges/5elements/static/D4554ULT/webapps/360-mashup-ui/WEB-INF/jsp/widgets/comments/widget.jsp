<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="url" uri="http://www.exalead.com/jspapi/url" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="string" uri="http://www.exalead.com/jspapi/string" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>
<%@ taglib prefix="security" uri="http://www.exalead.com/jspapi/security" %>

<render:import varWidget="widget" varFeeds="feeds" />

<config:getOption var="storageKey" name="storageKey" defaultValue="Comments360Entry[]" />
<config:getOption var="title" name="title" defaultValue="" />
<config:getOption var="metaName" name="metaName" defaultValue=""/>
<config:getOption var="who" name="who" />
<config:getOption var="commentTemplate" name="commentTemplate" defaultValue="basic" />
<config:getOption var="commentMetaName" name="commentMetaName" defaultValue="" />
<config:getOption var="commentCountMetaName" name="commentCountMetaName" defaultValue="" />
<config:getOption var="maxDisplay" name="maxDisplay" defaultValue="5" />
<config:getOption var="maxStore" name="maxStore" defaultValue="100" />

<search:getEntry var="entry" feeds="${feeds}" />
<c:choose>
	<c:when test="${metaName != ''}">
		<search:getMetaValue var="documentId" entry="${entry}" metaName="${metaName}" isHighlighted="false" />
	</c:when>
	<c:otherwise>
		<search:getEntryInfo var="documentId" name="url" entry="${entry}" />
	</c:otherwise>
</c:choose>
<search:getEntryInfo var="buildGroup" name="buildGroup" entry="${entry}" />
<search:getEntryInfo var="source" name="source" entry="${entry}" />

<security:getUser var="user" />

<c:set var="forceUserName" value="" />
<c:if test="${who == 'Logged-in'}">
	<c:set var="forceUserName" value="${user != null ? user.login : ''}" />
</c:if>

<widget:widget varCssId="cssId" extraCss="comments-wrapper">

	<c:if test="${title != ''}">
		<widget:header htmlTag="div">
			${title} <span class="comments-count"></span>
		</widget:header>
	</c:if>

	<widget:content extraCss="med-padding">
		<ul class="commentslist"></ul>
		<a class="toggleremaining" style="display: none;" href="#">Show remaining &darr;</a>
		<div class="comments-form">
			<b>New comment</b>
			<form action="#">
				<table>
					<tr>
						<td style="width:75px;"><span class="name-title">Name : </span></td>
						<td><input name="name" type="text" class="decorate name" /></td>
					</tr>
					<tr><td colspan="2"><textarea name="body" class="decorate"></textarea></td></tr>
					<tr class="comment-send"><td colspan="2"><input type="submit" class="decorate" value="Post" /> or <a class="addcomment inactive" href="#">close</a></td></tr>
				</table>
			</form>
		</div>

		<c:if test="${who == 'Anonymous' || (who == 'Logged-in' && user != null)}">
			<a class="addcomment" href="#">Add comment</a>
		</c:if>

	</widget:content>
</widget:widget>

<render:renderScript>
	Comments360Service.registerWidget('${widget.wuid}',{ docUri: "<string:escape value="${documentId}" />", docBuildGroup: '${buildGroup}', docSource: '${source}', widgetId: '${cssId}', storageKey: '${commentMetaName}', storageKeyCount: '${commentCountMetaName}', maxDisplay: ${maxDisplay}, maxStore: ${maxStore},forceUserName: "${forceUserName}" });
</render:renderScript>

<render:renderOnce id="Comments360Service_${widget.wuid}_init">
	<render:renderScript position="BEFORE">
		Comments360Service.init('${widget.wuid}','${storageKey}');
	</render:renderScript>
</render:renderOnce>

<render:renderOnce id="Comments360Service_${widget.wuid}_template">
	<render:renderLater>
		<config:getOption var="displayPhoto" name="displayPhoto" defaultValue="false" />
		<ul id="comments-template-${widget.wuid}" style="display: none;">
			<li class="comment hidden-class<c:if test="${displayPhoto == true}"> with-photo</c:if>">
				<c:if test="${displayPhoto == true}">
					<config:getOption var="photoUrl" name="photoUrl" defaultValue="" />
					<c:if test="${photoUrl == ''}">
						<url:resource var="photoUrl" file="img/anonymous.png" />
					</c:if>
					<div class="comment-image">
						<img src="${photoUrl}"/>
					</div>
				</c:if>
				<c:choose>
					<c:when test="${commentTemplate == 'basic'}">
						<div class="comment-content"><span class="name">{{name}}</span> <span class="sep">&rsaquo;</span> {{body}} <span class="quiet small date">&ndash;&nbsp;{{date}}</span></div>
					</c:when>
					<c:when test="${commentTemplate == 'multiline'}">
						<div class="comment-content">
							<div class="comment-row name">{{name}}</div>
							<div class="comment-row">{{body}}</div>
							<div class="comment-row quiet small date">&ndash;&nbsp;{{date}}</div>
						</div>
					</c:when>
				</c:choose>
			</li>
		</ul>
	</render:renderLater>
</render:renderOnce>

<render:renderOnce id="Comments360Service">
	<render:renderScript position="READY">
		Comments360Service.start();
	</render:renderScript>
</render:renderOnce>
