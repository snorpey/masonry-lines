/*global define*/
define(
	[ 'jquery' ],
	function( $ )
	{
		var signals;
		var canvas;
		var container;
		var ctx;
		var size;
		var lines;
		var timeout_id;

		function init( shared )
		{
			signals = shared.signals;
			container = $( '.items' );
			canvas = $( '#canvas' );
			ctx = canvas[0].getContext( '2d' );

			signals['resized'].add( resized );

			signals['lines-updated'].add( updateSize );
			signals['lines-updated'].add( resizeCanvas );
			signals['lines-updated'].add( updateLines );
			signals['lines-updated'].add( clear );
			signals['lines-updated'].add( drawLines );
		}

		function updateSize()
		{
			size = {
				width: container.width(),
				height: container.height()
			};
		}

		function updateLines( new_lines )
		{
			lines = new_lines;
		}

		function drawLines()
		{
			if ( lines )
			{
				var len = lines.length;

				ctx.beginPath();

				for ( var i = 0; i < len; i++ )
				{
					ctx.moveTo( lines[i][0].left, lines[i][0].top );
					ctx.lineTo( lines[i][1].left, lines[i][1].top );
				}

				ctx.closePath();
				ctx.stroke();
			}
		}

		function clear()
		{
			ctx.clearRect( 0, 0, size.width, size.height );
		}

		function resizeCanvas()
		{
			var pos = container.position();

			pos.top += parseInt( container.css( 'margin-top' ), 10 );

			canvas
				.attr( size )
				.css( pos );
		}

		function resized()
		{
			var date = new Date().getTime();

			clearTimeout( timeout_id );

			timeout_id = setTimeout( updateAfterResize, 50 );
		}

		function updateAfterResize()
		{
			clear();
			updateSize();
		}

		return { init: init };
	}
);