$(function() {
    var data = [
    { 
      action: 'type',
      strings: ["npm install -g michelin^400"],
      output: '<span class="gray">+michelin@1.3.3.7 installed</span><br>&nbsp;',
      postDelay: 1000
    },
    { 
      action: 'type',
      strings: ["cd tests^400"],
      output: ' ',
      postDelay: 1000
    },
    { 
      action: 'type',
      //clear: true,
      strings: ['michelin run^400'],
      output: $('.mimik-run-output').html()
    },
    { 
      action: 'type',
      strings: ["that was easy!", ''],
      postDelay: 2000
    },
    // { 
    //   action: 'type confidential data',
    //   strings: ["02-m4r10-n3v3r-d13d.html", 'This is the way'],
    //   postDelay: 2000
    // },    
  ];
    runScripts(data, 0);
  });
  
  function runScripts(data, pos) {
      var prompt = $('.prompt'),
          script = data[pos];
      if(script.clear === true) {
        $('.history').html(''); 
      }
      switch(script.action) {
          case 'type':
            // cleanup for next execution
            prompt.removeData();
            $('.typed-cursor').text('');
            prompt.typed({
              strings: script.strings,
              typeSpeed: 30,
              callback: function() {
                var history = $('.history').html();
                history = history ? [history] : [];
                history.push('$ ' + prompt.text());
                if(script.output) {
                  history.push(script.output);
                  prompt.html('');
                  $('.history').html(history.join('<br>'));
                }
                // scroll to bottom of screen
                $('section.terminal').scrollTop($('section.terminal').height());
                // Run next script
                pos++;
                if(pos < data.length) {
                  setTimeout(function() {
                    runScripts(data, pos);
                  }, script.postDelay || 1000);
                }
              }
            });
            break;
          case 'view':
  
            break;
      }
  }