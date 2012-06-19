function Application()
{
	var _self = this;
	var _container = $( '.items' );
	var _button = $( '.button' );
	var _widths = [ 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340, 360, 380, 400 ];
	var _heights = [ 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340, 360, 380, 400 ];
	var _canvas_options = { container: _container };
	var _masonry_options = { itemSelector: '.item', columnWidth: 20 };
	var _update_timeout_id;
	var _canvas = new Canvas( _canvas_options );
	var _point_calculator = new PointCalculator();
	var _route_calculator = new RouteCalculator();

	function init()
	{
		_container.masonry( _masonry_options );
		
		itemsAdd( 30 );
		
		$( window ).resize( resized );
		_button.click( buttonClicked );
	}

	function buttonClicked( $event )
	{
		$event.preventDefault();
		itemsAdd( 10 );
	}

	function itemsAdd( $count )
	{
		var count = typeof $count === 'number' ? parseInt( $count ) : 10;
		var items_html = '';
		var item_index = $( '.item', _container ).length;

		for ( var i = 0; i < count; i++ )
		{
			var index = item_index + i;
			var width_index = Math.floor( Math.random() * _widths.length );
			var height_index = Math.floor( Math.random() * _heights.length );
			var styles = ' style="width: ' + _widths[width_index] + 'px; height: ' + _heights[height_index] + 'px;"';
			
			items_html += '<div id="item-' + index + '" class="item"' + styles + '><p>Item ' + index + '</p></div>';
		}

		_container
			.append( items_html )
			.masonry( 'reload' );

		_canvas.updateSize();

		updateLines();
	}

	function updateLines()
	{
		var points = _point_calculator.updatePoints( $( '.item' ) );

		_route_calculator.setPoints( points );

		var lines = _route_calculator.getLines();

		_canvas.clear();
		_canvas.drawPoints( points );
		_canvas.drawLines( lines );
	}

	function resized()
	{
		clearTimeout( _update_timeout_id );

		_canvas.updateSize();	
		
		_update_timeout_id = setTimeout( updateLines, 500 );
	}

	_self.init = init;
}

var application;

$( document ).ready(
	function()
	{
		application = new Application();
		application.init();
	}
);