<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="render" uri="http://www.exalead.com/jspapi/render" %>

<render:import varFeeds="feeds" varWidget="widget" parameters="entry,feed" />

<h1>${entry.title}</h1>

<a href="http://exalead.com">Exalead.com</a> <br />

<script>
	console.log('hey hey hey', this);
</script>

<hr />

<c:if test="true">It's true dude !</c:if>