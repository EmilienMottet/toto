<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>

<config:getOption var="height" name="height" />
<widget:widget disableStyles="true" extraStyles="height:${height}px;">&nbsp;</widget:widget>
