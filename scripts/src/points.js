/*global define*/
define(
	[ 'jquery' ],
	function( $ )
	{
		var signals;
		var points = [ ];

		function init( shared )
		{
			signals = shared.signals;

			signals['items-updated'].add( update );
		}

		function update( obj )
		{
			points = getPointsByItems( obj.items );

			signals['points-updated'].dispatch( points );
		}

		function getPointsByItems( els )
		{
			var result = [ ];
			var len = els.length;

			for ( var i = 0; i < len; i++ )
			{
				var item = $( els[i] );
				var point = item.position();

				point.left += item.width() / 2;
				point.top += item.height() / 2;
				point.id = item.attr( 'id' );

				result.push( point );
			}

			return result;
		}

		return { init: init };
	}
);