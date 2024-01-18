$(document).ready(function() {
	$('img.switch').on('click', function() {
		var $form = $(this).closest('form');
		$selects = $form.find('select');
		var valx = $($selects.get(0)).val();
		var valy = $($selects.get(1)).val();

		$($selects.get(0)).val(valy);
		$($selects.get(1)).val(valx);
	});
});
