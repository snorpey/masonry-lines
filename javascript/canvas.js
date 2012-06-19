function Canvas( $options )
{
	var _self = this;
	var _canvas = $( '#lines' );
	var _container = $options.container || $( '.items' );
	var _ctx = _canvas[0].getContext( '2d' );

	function drawPoints( $points )
	{
		if ( _.isArray( $points) )
		{
			for ( var i = 0; i < $points.length; i++ )
			{
				drawPoint( $points[i] );
			}
		}
	}

	function drawPoint( $point )
	{
		_ctx.fillRect( $point.left, $point.top, 2, 2 );
	}

	function drawLines( $lines )
	{
		if ( _.isArray( $lines ) )
		{
			for ( var i = 0; i < $lines.length; i++ )
			{
				drawLine( $lines[i] );
			}
		}
	}

	function drawLine( $line )
	{
		if (
			_.isArray( $line ) &&
			$line.length === 2
		)
		{
			_ctx.beginPath();
			_ctx.moveTo( $line[0].left, $line[0].top );
			_ctx.lineTo( $line[1].left, $line[1].top );
			_ctx.closePath();
			_ctx.stroke();
		}
	}

	function clear( $top, $left, $width, $height )
	{
		var top = $top || 0;
		var left = $left || 0;
		var width = $width || _canvas.height();
		var height = $height || _canvas.width();

		_ctx.clearRect( top, left, width, height );
	}

	function updateSize()
	{
		var canvas_size = { width: _container.width(), height: _container.height() };
		var canvas_position = _container.position();
			canvas_position.top += parseInt( _container.css( 'margin-top' ) );

		_canvas
			.attr( canvas_size )
			.css( canvas_position );
	}

	_self.drawPoints = drawPoints;
	_self.drawLines = drawLines;
	_self.updateSize = updateSize;
	_self.clear = clear;
}