/*global define*/
define(
	[ 'jquery' ],
	function( $ )
	{
		var signals;
		var button;

		function init( shared )
		{
			signals = shared.signals;
			button = $( '.button' );

			button.click( signals['button-clicked'].dispatch );
		}

		return { init: init };
	}
);