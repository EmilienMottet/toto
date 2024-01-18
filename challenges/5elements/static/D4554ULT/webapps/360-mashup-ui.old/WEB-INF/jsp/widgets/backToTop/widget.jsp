<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>
<%@ taglib prefix="i18n" uri="http://www.exalead.com/jspapi/i18n" %>

<render:import varWidget="widget" varFeeds="feeds" />

<widget:widget extraCss="btn backToTop">^ <i18n:message code="back-to-top"/></widget:widget>

<render:renderScript>
$(function() {
	$(window).scroll(function() {
		if($(this).scrollTop() != 0) {
			$('.backToTop').fadeIn();	
		} else {
			$('.backToTop').fadeOut();
		}
	});
 
	$('.backToTop').click(function() {
		$('body,html').animate({scrollTop:0},800);
	});	
});
</render:renderScript>