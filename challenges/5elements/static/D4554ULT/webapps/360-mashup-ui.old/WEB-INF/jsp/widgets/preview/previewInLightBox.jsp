<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="i18n" uri="http://www.exalead.com/jspapi/i18n" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="string" uri="http://www.exalead.com/jspapi/string" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>
<%@ taglib prefix="url" uri="http://www.exalead.com/jspapi/url" %>

<render:import parameters="feed,entry,widget" />

<%--
	Required options in the widget
		@hitTitle
--%>

<render:renderOnce id="previewBrowserJS">
	<%-- This css style is automatically injected in the iframe (retrieve with the title name) --%>
	<style title="currentNavigationTermStyle">
		span.highlight {
			border-radius: 4px;
			padding: 0px 2px;
		}

		span.highlight_1, span.highlight_11 {color: #fff; background-color: #3990d1; background-image: -moz-linear-gradient(top, #69c0f1, #3990d1); background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #69c0f1), color-stop(1, #3990d1)); background-image: -webkit-linear-gradient(#69c0f1, #3990d1); background-image: linear-gradient(top, #69c0f1, #3990d1); background-image: -o-linear-gradient(top, #69c0f1, #3990d1);background-image: -ms-linear-gradient(top, #69c0f1, #3990d1); }
		span.highlight_2, span.highlight_12 {color: #fff; background-color: #7634D1; background-image: -moz-linear-gradient(top, #a664f1, #7634D1); background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #a664f1), color-stop(1, #7634D1)); background-image: -webkit-linear-gradient(#a664f1, #7634D1); background-image: linear-gradient(top, #a664f1, #7634D1); background-image: -o-linear-gradient(top, #a664f1, #7634D1); background-image: -ms-linear-gradient(top, #a664f1, #7634D1); }
		span.highlight_3, span.highlight_13 {color: #fff; background-color: #D17634; background-image: -moz-linear-gradient(top, #f1a664, #D17634); background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #f1a664), color-stop(1, #D17634)); background-image: -webkit-linear-gradient(#f1a664, #D17634); background-image: linear-gradient(top, #f1a664, #D17634); background-image: -o-linear-gradient(top, #f1a664, #D17634); background-image: -ms-linear-gradient(top, #f1a664, #D17634); }
		span.highlight_4, span.highlight_14 {color: #fff; background-color: #69A6D1; background-image: -moz-linear-gradient(top, #99d6f1, #69A6D1); background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #99d6f1), color-stop(1, #69A6D1)); background-image: -webkit-linear-gradient(#99d6f1, #69A6D1); background-image: linear-gradient(top, #99d6f1, #69A6D1); background-image: -o-linear-gradient(top, #99d6f1, #69A6D1); background-image: -ms-linear-gradient(top, #99d6f1, #69A6D1); }
		span.highlight_5, span.highlight_15 {color: #fff; background-color: #9469D1; background-image: -moz-linear-gradient(top, #c499f1, #9469D1); background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #c499f1), color-stop(1, #9469D1)); background-image: -webkit-linear-gradient(#c499f1, #9469D1); background-image: linear-gradient(top, #c499f1, #9469D1); background-image: -o-linear-gradient(top, #c499f1, #9469D1); background-image: -ms-linear-gradient(top, #c499f1, #9469D1); }
		span.highlight_6, span.highlight_16 {color: #fff; background-color: #D19469; background-image: -moz-linear-gradient(top, #f1c499, #D19469); background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #f1c499), color-stop(1, #D19469)); background-image: -webkit-linear-gradient(#f1c499, #D19469); background-image: linear-gradient(top, #f1c499, #D19469); background-image: -o-linear-gradient(top, #f1c499, #D19469); background-image: -ms-linear-gradient(top, #f1c499, #D19469); }
		span.highlight_7, span.highlight_17 {color: #fff; background-color: #79a139; background-image: -moz-linear-gradient(top, #A6D169, #79a139); background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #A6D169), color-stop(1, #79a139)); background-image: -webkit-linear-gradient(#A6D169, #79a139); background-image: linear-gradient(top, #A6D169, #79a139); background-image: -o-linear-gradient(top, #A6D169, #79a139); background-image: -ms-linear-gradient(top, #A6D169, #79a139); }
		span.highlight_8, span.highlight_18 {color: #fff; background-color: #860; background-image: -moz-linear-gradient(top, #a93, #860); background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #a93), color-stop(1, #860)); background-image: -webkit-linear-gradient(#a93, #860); background-image: linear-gradient(top, #a93, #860); background-image: -o-linear-gradient(top, #a93, #860); background-image: -ms-linear-gradient(top, #a93, #860); }
		span.highlight_9, span.highlight_19 {color: #fff; background-color: #049; background-image: -moz-linear-gradient(top, #37c, #049); background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #37c), color-stop(1, #049)); background-image: -webkit-linear-gradient(#37c, #049); background-image: linear-gradient(top, #37c, #049); background-image: -o-linear-gradient(top, #37c, #049); background-image: -ms-linear-gradient(top, #37c, #049); }
		span.highlight_10, span.highlight_20 {color: #fff; background-color: #909; background-image: -moz-linear-gradient(top, #c3c, #909); background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #c3c), color-stop(1, #909)); background-image: -webkit-linear-gradient(#c3c, #909); background-image: linear-gradient(top, #c3c, #909); background-image: -o-linear-gradient(top, #c3c, #909); background-image: -ms-linear-gradient(top, #c3c, #909); }
		span.currentNavigationTerm { color: #000; background-color: #ff0; background-image: -moz-linear-gradient(top, #ee0, #ff0); background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #ee0), color-stop(1, #ff0)); background-image: -webkit-linear-gradient(#ee0, #ff0); background-image: linear-gradient(top, #ee0, #ff0); background-image: -o-linear-gradient(top, #ee0, #ff0); background-image: -ms-linear-gradient(top, #ee0, #ff0); text-decoration: underline; }

	</style>

	<render:renderLater>
		<div style="display: none;">
			<div id="previewOverlayTemplate"></div>
			<div id="previewWrapperTemplate">
				<div class="top">
					<div class="title"></div>
					<a href="#!" class="closeButton">&times;</a>
					<div class="buttonBar pages">
						<a href="#!" class="selected doOpenPreviewAsImage"><i18n:message code="previewAsImage"/></a><a href="#!" class="doOpenPreviewAsHTML"><i18n:message code="previewAsHTML"/></a>
					</div>
					<div class="buttonBar documents">
						<a href="#!" class="doOpenPreviousDocument"><i18n:message code="previousDocument"/></a><a href="#!" class="doOpenNextDocument"><i18n:message code="nextDocument"/></a>
					</div>
				</div>
				<div class="content"></div>
				<div class="pageNav"></div>
			</div>
		</div>
	</render:renderLater>

	<render:renderScript position="READY">
		$('a.openPreview').preview({
			baseUrl: "<url:url value="/" />"
		});
	</render:renderScript>
</render:renderOnce>

<config:getOption var="hitTitle" name="hitTitle" defaultValue="${entry.title}" entry="${entry}" feed="${feed}" />
<search:getEntryInfo var="numPages" name="extracted_numpages" entry="${entry}" defaultValue="1" />
<search:getEntryHtmlPreviewUrl var="htmlPreviewUrl" entry="${entry}" feed="${feed}" />
<search:getEntryImagePreviewUrl var="imagePreviewUrl" entry="${entry}" feed="${feed}" />

<a	class="openPreview"
	href="${htmlPreviewUrl != null ? htmlPreviewUrl : imagePreviewUrl}"
	target="_blank"
	data-htmlpreview="<string:escape value="${htmlPreviewUrl}" escapeType="url" />"
	data-imagepreview="<string:escape value="${imagePreviewUrl}" escapeType="url" />"
	data-title="<string:escape value="${hitTitle}" escapeType="url" />"
	data-numpages="${numPages}">
	<i18n:message code="preview" />
</a>
