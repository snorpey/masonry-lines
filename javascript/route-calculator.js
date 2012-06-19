function RouteCalculator()
{
	var _self = this;

	var _points = [ ];
	var _positions = [ ];
	var _sizes = [ ];
	var _indexes = { };

	var _points_checked = [ ];
	var _lines = [ ];

	function setPoints( $points )
	{
		if ( _.isArray( $points ) )
		{
			_points = $points;
			
			_indexes = [ ];
			_points_checked = [ ];
			_lines = [ ];
			
			updatePositions();
			updateSizes();
		}
	}

	function getLines()
	{
		_lines = [];

		var topmost_point = getTopMostPoint( _points );
		
		getPath( topmost_point );

		return _lines;
	}

	function getPath( $point )
	{
		_points_checked.push( $point.id );
		
		var next_points = getNextPoints( $point );

		for ( var i = 0; i < next_points.length; i++ )
		{
			if ( _points_checked.indexOf( next_points[i].id ) === -1 )
			{
				addLine( $point, next_points[i] );
				getPath( next_points[i] );
			}
		}
	}

	function addLine( $point_1, $point_2 )
	{
		_lines.push( [ $point_1, $point_2 ] );
	}

	function getNextPoints( $point )
	{
		var next_points = [];

		for ( var i = 0; i < _points.length; i++ )
		{
			if (
				$point.id !== _points[i].id &&
				isDirectNeighbour( $point, _points[i] )
			)
			{
				next_points.push( _points[i] );
			}
		}

		return next_points;
	}

	function isDirectNeighbour( $point_1, $point_2 )
	{
		var index_1 = getIndex( $point_1 );
		var index_2 = getIndex( $point_2 );

		var distance_left =		Math.abs( _positions[index_2].left + _sizes[index_2].width - _positions[index_1].left );
		var distance_top =		Math.abs( _positions[index_2].top + _sizes[index_2].height - _positions[index_1].top );
		var distance_right =	Math.abs( _positions[index_1].left + _sizes[index_1].width - _positions[index_2].left );
		var distance_bottom =	Math.abs( _positions[index_1].top + _sizes[index_1].height - _positions[index_2].top );

		var is_neighbour = false;
		var axis = '';
		
		if ( distance_left == 20 )
		{
			is_neighbour = true;
			axis = 'horizontal';
		}

		if ( distance_top == 20 )
		{
			is_neighbour = true;
			axis = 'vertical';
		}

		if ( distance_right == 20 )
		{
			is_neighbour = true;
			axis = 'horizontal';
		}

		if ( distance_bottom == 20 )
		{
			is_neighbour = true;
			axis = 'vertical';
		}

		if ( is_neighbour )
		{
			is_neighbour = isIntersecting( $point_1, $point_2, axis );
		}

		return is_neighbour;
	}

	function isIntersecting( $point_1, $point_2, $axis )
	{
		var index_1 = getIndex( $point_1 );
		var index_2 = getIndex( $point_2 );

		var is_intersecting = false;

		if ( $axis === 'horizontal' )
		{
			if (
				_positions[index_1].top >= _positions[index_2].top &&
				_positions[index_1].top <= _positions[index_2].top + _sizes[index_2].height
			)
			{
				is_intersecting = true;
			}

			if (
				_positions[index_2].top >= _positions[index_1].top &&
				_positions[index_2].top <= _positions[index_1].top + _sizes[index_1].height
			)
			{
				is_intersecting = true;
			}
		}

		if ( $axis === 'vertical' )
		{
			if (
				_positions[index_1].left >= _positions[index_2].left &&
				_positions[index_1].left <= _positions[index_2].left + _sizes[index_2].width
			)
			{
				is_intersecting = true;
			}

			if (
				_positions[index_2].left >= _positions[index_1].left &&
				_positions[index_2].left <= _positions[index_1].left + _positions[index_1].width
			)
			{
				is_intersecting = true;
			}
		}

		return is_intersecting;
	}

	function getIndex( $point )
	{
		var index = -1;

		if ( typeof _indexes[$point.id] === 'number' )
		{
			index = _indexes[$point.id];
		}

		else
		{
			for ( var i = 0; i < _points.length; i++ )
			{
				if ( $point.id === _points[i].id )
				{
					index = i;
				}
			}

			_indexes[$point.id] = index;
		}

		return index;
	}

	function getTopMostPoint( $points )
	{
		var top_index = -1;
		var top_value = Infinity;

		if ( $points.length )
		{
			for ( var i = 0; i < $points.length; i++ )
			{
				if ( $points[i].top < top_value )
				{
					top_index = i;
					top_value = $points[i].top;
				}
			}
		}

		return $points[top_index];
	}

	function updatePositions()
	{
		_positions = getPositions();
	}

	function getPositions()
	{
		var positions = [ ];

		for ( var i = 0; i < _points.length; i++ )
		{
			var item = $( '#' + _points[i].id );
			var position = item.position();

			positions.push( position );
		}

		return positions;
	}

	function updateSizes()
	{
		_sizes = getSizes();
	}

	function getSizes()
	{
		var sizes = [ ];

		for ( var i = 0; i < _points.length; i++ )
		{
			var item = $( '#' + _points[i].id );
			var size = { width: item.width(), height: item.height() };

			sizes.push( size );
		}

		return sizes;
	}

	function getDistance( $point_1, $point_2 )
	{
		var left_diff = Math.abs( $point_1.left - $point_2.left );
		var top_diff = Math.abs( $point_1.top - $point_2.top );
		var distance = Math.sqrt( left_diff * left_diff + top_diff * top_diff );

		return distance;
	}


	_self.setPoints = setPoints;
	_self.getLines = getLines;
}