/*global require, requirejs, define, Modernizr, _basepath_ */
// http://requirejs.org/docs/api.html#config 
var path = typeof _basepath_ === 'string' ? _basepath_ + '/' : '';

requirejs.config(
	{
		baseUrl: path + 'scripts/',
		waitSeconds: 5,
		urlArgs: 'bust=' + ( new Date() ).getTime(),
		paths: {
			'jquery' : 'lib/jquery-2.0.0',
			'underscore' : 'lib/underscore-1.4.4',
			'masonry' : 'lib/jquery.masonry-2.1.08',
			'signals' : 'lib/signals-1.0.0'
		},
		shim: {
			'masonry' : [ 'jquery' ],
			'underscore': { exports: '_' }
		}
	}
);

require(
	[
		'src/button',
		'src/items',
		'src/points',
		'src/lines',
		'src/canvas',
		'signals',
		'jquery'
	],
	function(
		button,
		items,
		points,
		lines,
		canvas,
		Signal,
		$
	)
	{
		var shared = {
			win: $( window ),
			signals : {
				'resized'        : new Signal(),
				'button-clicked' : new Signal(),
				'items-updated'  : new Signal(),
				'points-updated' : new Signal(),
				'lines-updated'  : new Signal(),
				'items-add'      : new Signal()
			}
		};

		$( document ).ready( init );

		function init()
		{
			$( window ).resize( resized );

			button.init( shared );
			items.init( shared );
			lines.init( shared );
			points.init( shared );
			canvas.init( shared );

			setTimeout( shared.signals['items-add'].dispatch, 100 );
			setTimeout( resized, 200 );
		}

		function resized()
		{
			var size = {
				width: shared.win.width(),
				height: shared.win.height()
			};

			shared.signals['resized'].dispatch( size );
		}
	}
);