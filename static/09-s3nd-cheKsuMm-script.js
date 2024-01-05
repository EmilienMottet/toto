// multifield - connects several input fields to each-other
// By Yair Even Or / 2011 / dropthebit.com
;(function(){
  var fixedEvent = 0;
	/* fix a bug in Chrome where 'keypress' isn't fired for "non-visisble" keys */
  
  
	function funnel(e){
    // some pre-validation using HTML5 pattern attribute to allow only digits
    if( e.charCode && this.pattern ){
      var regex = this.pattern,
          char = String.fromCharCode(e.charCode),
          valid = new RegExp("^"+regex+"$").test( char );
      console.log(valid);
      if( !valid )
        return false;
    }
    
		fixedEvent++;
		var that = this;
		setTimeout(function(){
			keypress.call(that, e);
			fixedEvent = 0;
		},0);
	}
  
	function keypress(e){
		var nextPrevField,
			  sel = [this.selectionStart, this.selectionEnd];
    
		if( !e.charCode && e.keyCode != 37 && e.keyCode != 39 && e.keyCode != 8 )			
			return;	
			
		// if hit Backspace key when caret was at the beginning, or if the 'left' arrow key was pressed and the caret was at the start -> go back to previous field	
		else if( (e.keyCode == 8 && sel[1] == 0) || (e.keyCode == 37 && sel[1] == 0) )			
			setCaret( $(this).prev(':text')[0], 100);
		
		// if the 'right' arrow key was pressed and caret was at the end -> advance to the next field
		else if( e.keyCode == 39 && sel[1] == this.value.length )	
			setCaret( $(this).next(':text')[0], 0);
		
		// automatically move to the next field once user has filled the current one completely		
		else if( e.charCode && sel[1] == sel[0] && sel[0] == this.maxLength )
			setCaret( $(this).next(':text')[0], 100);

		function setCaret(input, pos){
			if( !input ) return;
			if (input.setSelectionRange){
				input.focus();
				input.setSelectionRange(pos, pos);
			}
			else if( input.createTextRange ){
				var range = input.createTextRange();
				range.collapse(true);
				range.moveEnd('character', pos);
				range.moveStart('character', pos);
				range.select();
			}
		}
		
		combine.apply(this);
	};
	// After each 'change' event of any of the fields, combine all the values to the hidden input.	
	function combine(){
		var hidden =  $(this).siblings('input[type=hidden]').val('')[0];		
    $(this.parentNode).find('input:not(:hidden)').each( function(){			
			hidden.value += this.value;
		});
	}

	$('div.multifield').on({'keydown.multifeild':funnel,'keypress.multifeild':funnel, 'change.multifeild':combine}, 'input');
})();

// Mod-10 general validator
// By Yair Even Or / 2011 / Dropthebit.com
function mod10_validation(num){
  if( !num ) return false;
	num = num.replace(/-/g,'');

	var calc, i, check, checksum = 0, r = [2,1]; // alternating routing table (cnofigured for credit cards)
	
	// iterate on all the numbers in 'num'
	for( i=num.length-1; i--; ){
		calc = num.charAt(i) * r[i % r.length];
		// handle cases where it's a 2 digits number
		calc = ((calc/10)|0) + (calc % 10);
		checksum += calc;
	}
	check = (10-(checksum % 10)) % 10; // make sure to get '0' if checksum is '10'
	checkDigit = num % 10;

	return check == checkDigit;
}

// a quick validation just for this dem
var timer;
$('button').on('click', function(){ 
  var num = $('input:hidden').val(),
      valid = num.length > 14 && mod10_validation(num),
      state = valid ? 'valid' : 'invalid';
  
  
  $('.credit-card').addClass(state);
  clearTimeout(timer);
  timer = setTimeout(function(){ $('.credit-card').removeClass(state);  },1000);
});