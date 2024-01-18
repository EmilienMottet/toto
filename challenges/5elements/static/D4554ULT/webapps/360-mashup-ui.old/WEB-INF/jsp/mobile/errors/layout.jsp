<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="i18n" uri="http://www.exalead.com/jspapi/i18n" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>

<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta name="baseurl" content="<c:url value="/" />" />
		<title><i18n:message code="html.title" /></title>
		<link rel="shortcut icon" type="image/ico" href="<c:url value='/resources/images/favicon.ico' />" />
		<link type="text/css" media="screen" rel="stylesheet" href="<c:url value='/resources/mobile/jquery.mobile.structure.css' />" />
		<link type="text/css" media="screen" rel="stylesheet" href="<c:url value='/resources/mobile/jquery.mobile.theme.css' />" />
		<script type="text/javascript" src="<c:url value='/resources/javascript/jquery-1.12.3.min.js' />" type="text/javascript" charset="utf-8"></script>
		<script type="text/javascript" src="<c:url value='/resources/javascript/jquery-migrate-1.4.0.min.js' />" type="text/javascript" charset="utf-8"></script>
		
		<script type="text/javascript" src="<c:url value='/resources/mobile/jquery.mobile.js' />" type="text/javascript" charset="utf-8"></script>
	</head>
	<body id="body" class="mashup mashup-style mobile">
		<div data-role="page" data-theme="c">
			<div data-role="header">
				<a href="<c:url value='/' />" data-role="button" data-icon="home" data-iconpos="notext" data-ajax="false"></a>
				<h2>&nbsp;</h2>
			</div>
			<div data-role="content">
				<render:attribute name="body" ignore="true" />
			</div>
		</div>
	</body>
</html>
