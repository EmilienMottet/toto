<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<%@ taglib prefix="config" uri="http://www.exalead.com/jspapi/config" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>
<%@ taglib prefix="widget" uri="http://www.exalead.com/jspapi/widget" %>
<%@ taglib prefix="search" uri="http://www.exalead.com/jspapi/search" %>
<%@ taglib prefix="string" uri="http://www.exalead.com/jspapi/string" %>

<render:import varFeeds="feeds" varWidget="widget"/>

<config:getOption var="width" name="width" />
<c:if test="${width != null}"><c:set var="width" value="width:${width}px;" /></c:if>

<config:getOption var="height" name="height" />				
<widget:widget varCssId="cssId" extraCss="highcharts lineChart" extraStyles="${width}">
	<widget:header>
		<config:getOption name="title" defaultValue="" />
	</widget:header>
	<widget:content cssId="${cssId}_gauge" extraStyles="height:${height}px;">
	</widget:content>
	
	<config:getOption name="value" var="value"/>
	<config:getOption name="minValue" var="minValue"/>
	<config:getOption name="maxValue" var="maxValue"/>
	<config:getOption name="unit" var="unit"/>
	<config:getOptionsComposite name="ranges" var="ranges" doEval="true" mapIndex="true" feeds="${feeds}"/>
	<render:renderScript>
	var data = {
    	chart: {
	        renderTo: '${cssId}_gauge',
	        type: 'gauge'
	    },
	    // the value axis
	    yAxis: {
	        min: ${minValue},
	        max: ${maxValue},	        
	        title: {
	            text: '${unit}'
	        },
	        plotBands: [
	        <c:forEach items="${ranges}" var="range" varStatus="status">
	        	<c:if test="${!status.first}">,</c:if>
			 	{
			 		from: ${range.minRange},
	            	to: ${range.maxRange},
	            	color: '${range.colorRange}'
            	}
			</c:forEach>
			]        
	    },
	    tooltip: {
            valueSuffix: '${unit}'
		},
	    series: [{
	        name: 'Value:',
	        data: [${value}]
	    }]	
	};
	new Highcharts.Chart($.extend(true, <config:getOption name="opts" />, data));
	</render:renderScript>
		
</widget:widget>
