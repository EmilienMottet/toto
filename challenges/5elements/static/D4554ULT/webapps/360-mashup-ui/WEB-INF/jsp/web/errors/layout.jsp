<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="string" uri="http://www.exalead.com/jspapi/string" %>
<%@ taglib prefix="i18n" uri="http://www.exalead.com/jspapi/i18n" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>

<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta name="baseurl" content="<c:url value="/" />" />
		<meta http-equiv="X-UA-Compatible" content="IE=9; IE=8;" />
		<title><i18n:message code="html.title" /></title>
		<link rel="shortcut icon" type="image/ico" href="<c:url value='/resources/images/favicon.ico' />" />
		<link type="text/css" media="screen,print" rel="stylesheet" href="<c:url value='/resources/themes/theme_enterprise/css/theme.less' />" />
		<script type="text/javascript" src="<c:url value='/resources/javascript/jquery-1.12.3.min.js' />" charset="utf-8"></script>
		<script type="text/javascript" src="<c:url value='/resources/javascript/jquery-migrate-1.4.0.min.js' />" type="text/javascript" charset="utf-8"></script>
	</head>
	<body id="body" class="mashup mashup-style web">
		<div id="mainWrapper">
			<render:attribute name="body" ignore="true" />
		</div>
		<br style="clear: both" />
		<div class="copyright"></div>
	</body>
</html>