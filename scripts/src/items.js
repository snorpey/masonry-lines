/*global define*/
define(
	[ 'jquery', 'masonry' ],
	function( $ )
	{
		var signals;
		var container;
		var items;
		var sizes;
		var timeout_id;
		var widths, heights;

		var masonry_options = { itemSelector: '.item', columnWidth: 20 };

		widths = heights = [ 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340, 360, 380, 400 ];

		function init( shared )
		{
			signals = shared.signals;
			container = $( '.items' );
			items = $( '.item', container );

			container.masonry( masonry_options );

			signals['resized'].add( resized );
			signals['button-clicked'].add( addItems );
			signals['items-add'].add( addItems );
		}

		function resized()
		{
			clearTimeout( timeout_id );

			timeout_id = setTimeout( updateItems, 500 );
		}

		function updateItems()
		{
			sizes = getItemSizes();

			signals['items-updated'].dispatch( { items: items, sizes: sizes } );
		}

		function addItems( count )
		{
			var len = typeof count === 'number' && count > 0 ? count : 20;
			var items_html = '';
			var item_index = items.length;

			for ( var i = 0; i < len; i++ )
			{
				var index = item_index + i;
				var width = widths[Math.floor( Math.random() * widths.length )];
				var height = heights[Math.floor( Math.random() * heights.length )];
				var styles = ' style="width: ' + width + 'px; height: ' + height + 'px;"';

				items_html += '<div id="item-' + index + '" class="item"' + styles + '><p>Item ' + index + '</p></div>';
			}

			container
				.append( items_html )
				.masonry( 'reload' );

			items = $( '.item', container );

			updateItems();
		}

		function getItemSizes()
		{
			var result = [ ];
			var len = items.length;

			for ( var i = 0; i < len; i++ )
			{
				var el = $( items[i] );
				var pos = el.position();

				result[i] = { width: el.width(), height: el.height(), left: pos.left, top: pos.top };
			}

			return result;
		}

		return { init: init };
	}
);