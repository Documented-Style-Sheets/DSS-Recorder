var cursor = $('.cursor');
var box = $('.box');
var noisey = true;
var events = [];
var currentTarget = null;
var currentEvent = null;
var time = new Date().getTime();

var addClasses = function () {
  var css = '';
  for (var x = 0; x < document.styleSheets.length; x++) {
    var rules = document.styleSheets[x].cssRules;
    for (var i = 0; i < rules.length; i++) {
      var matches = rules[i].selectorText.match( /(:hover|:active|:focus)/g );
      if ( matches ) {
        matches.forEach( function ( name ) {
          var className = '.dss-' + name.substring( 1, i.length );
          css += rules[i].cssText.replace( name, className );
        });
      }
    }
  }
  $('body').append('<style>' + css + '</style>');
};

var customEvent = function ( target, type, options ) {
  options = options || {};
  options.delay = options.delay || 0;
  return { type: type, target: target, options: options  };
};

var play = function ( events, position ) {
  if ( !position ) {
    currentTarget = null;
    currentEvent = null;
  }
  position = position || 0;
  var e = events[ position ];
  trigger( e, cursor );
  position++;
  if ( position < events.length ) {
      setTimeout( function () {
          play( events, position );
      }, e.options.delay);
  }
};

var trigger = function ( e, cursor ) {

  // Remove DSS Pseudo Classes from Previous Target
  if ( currentTarget ) {
    currentTarget.removeClass(function ( index, css ) {
      return (css.match(/(^|\s)dss-\S+/g) || []).join(' ');
    });
  }

  // Update Target
  currentTarget = e.target.first();

  // Move Cursor
  var x = e.options.x;
  var y = e.options.y;

  if ( x && y ) {

    var speed = e.options.speed || 0;
    var options = { duration: speed };

    if ( cursor.css('opacity') == 0 ) {
      cursor.css( { left: x + 'px', top: y + 'px' } ).animate( { opacity: 1 }, options );
    } else {
      cursor.animate( { left: x + 'px', top: y + 'px' }, options );
    }

  } else {
    cursor.animate( { opacity: 0 }, options );
  }

  // Add Classes to Mimc Pseudo Events
  if ( e.type == 'mouseover' || e.type == 'hover' ) {
    e.target.addClass('dss-hover');
  } else if ( e.type == 'click' ) {
    e.target.addClass('dss-active')
  } else if ( e.type == 'focus' ) {
    e.target.addClass('dss-focus');
  }

  // Trigger Event
  e.target.trigger( e.type );

};

// Add Classes
addClasses();

// Cursor Positioning Relative to Target
var coord = { x: box.offset().left, y: box.offset().top };
var dim = { x: ( box.width() / 2 ), y: ( box.height() / 2 ) };
var off = { x: ( cursor.width() / 2 ), y: ( cursor.height() / 2 ) };
var x = coord.x + dim.x - off.x;
var y = coord.y + dim.y - off.y;

// Record Events
var record = function (e) {
  if ( currentTarget != e.target || currentEvent != e.type || noisey ) {
    var diff = new Date().getTime();
    var delay = diff - time;
    var off = { x: ( cursor.width() / 2 ), y: ( cursor.height() / 2 ) };
    var x = e.pageX - off.x;
    var y = e.pageY - off.y;
    events.push( new customEvent( $(e.target), e.type, { x: x, y: y, speed: 300, delay: delay } ) );
    time = diff;
  }
  currentTarget = e.target;
  currentEvent = e.type;
};

// Play Button
$('.playback').on('click', function(e) {
  e.preventDefault();
  e.stopPropagation();
  var el = $(this);
  play( events );
});

// Record Button
$('.record').on('click', function(e){
  e.preventDefault();
  e.stopPropagation();
  var el = $(this);
  if ( el.hasClass('recording') ) {
    el.removeClass('recording').text('Start Recording');
    $(document).off('click mouseover mouseout mousemove scroll');
  } else {
    events = [];
    el.addClass('recording').text('Stop Recording');
    $(document).on('click mouseover mouseout mousemove scroll', $.throttle( 300, record ));
  }
});
