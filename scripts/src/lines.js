/*global define*/
define(
	[ 'jquery' ],
	function( $ )
	{
		var signals;
		var sizes = [ ];
		var point_indexes = [ ];

		function init( shared )
		{
			signals = shared.signals;

			signals['items-updated'].add( updateSizes );
			signals['points-updated'].add( updateLines );
		}

		function updateSizes( obj )
		{
			sizes = obj.sizes;
		}

		function updateLines( points )
		{
			var lines = getLines( points );

			signals['lines-updated'].dispatch( lines );
		}

		function getLines( points )
		{
			var topmost_point = getTopMostPoint( points );
			var path = getPath( points, topmost_point );

			path = addMissingItems( points, path );

			return removeDuplicateLines( path.lines );
		}

		function getTopMostPoint( points )
		{
			var top_index = -1;
			var top_value = Infinity;
			var len = points.length;

			for ( var i = 0; i < len; i++ )
			{
				if ( points[i].top < top_value )
				{
					top_index = i;
					top_value = points[i].top;
				}
			}

			return points[top_index];
		}

		function getPath( points, point, data )
		{
			if (
				point &&
				points.length
			)
			{
				data = data || { };
				data.checked = data.checked || [ ];
				data.lines = data.lines || [ ];

				data.checked.push( point.id );

				var next_points = getNextPoints( points, point );

				for ( var i = 0; i < next_points.length; i++ )
				{
					if ( data.checked.indexOf( next_points[i].id ) === -1 )
					{
						data.lines.push( [ point, next_points[i] ] );

						data = getPath( points, next_points[i], data );
					}
				}
			}

			return data;
		}

		function addMissingItems( points, data )
		{
			var missing_points = [ ];
			var len_points = points.length;

			for ( var i = 0; i < len_points; i++ )
			{
				if ( data.checked.indexOf( points[i].id ) === -1 )
				{
					missing_points.push( points[i] );
				}
			}

			var len_missing = missing_points.length;

			for ( i = 0; i < len_missing; i++ )
			{
				var shortest_distance = Infinity;
				var closest_index = -1;

				for ( var j = 0; j < len_points; j++ )
				{
					if ( points[j].id !== missing_points[i].id )
					{
						var distance = getDistance( missing_points[i], points[j] );

						if ( distance < shortest_distance )
						{
							closest_index = j;
							shortest_distance = distance;
						}
					}
				}

				data.lines.push( [ missing_points[i], points[closest_index] ] );
			}

			return data;
		}

		function getNextPoints( points, point )
		{
			var result = [ ];
			var len = points.length;

			for ( var i = 0; i < len; i++ )
			{
				if (
					typeof point.id !== 'undefined' &&
					typeof points[i].id !== 'undefined' &&
					point.id !== points[i].id &&
					isDirectNeighbour( points, point, points[i] )
				)
				{
					result.push( points[i] );
				}
			}

			return result;
		}

		function isDirectNeighbour( points, point_1, point_2 )
		{
			var index_1 = getIndex( points, point_1 );
			var index_2 = getIndex( points, point_2 );

			var distance_left =		Math.abs( sizes[index_2].left + sizes[index_2].width - sizes[index_1].left );
			var distance_top =		Math.abs( sizes[index_2].top + sizes[index_2].height - sizes[index_1].top );
			var distance_right =	Math.abs( sizes[index_1].left + sizes[index_1].width - sizes[index_2].left );
			var distance_bottom =	Math.abs( sizes[index_1].top + sizes[index_1].height - sizes[index_2].top );

			var is_neighbour = false;
			var axis = '';

			if ( distance_left === 20 )
			{
				is_neighbour = true;
				axis = 'horizontal';
			}

			if ( distance_top === 20 )
			{
				is_neighbour = true;
				axis = 'vertical';
			}

			if ( distance_right === 20 )
			{
				is_neighbour = true;
				axis = 'horizontal';
			}

			if ( distance_bottom === 20 )
			{
				is_neighbour = true;
				axis = 'vertical';
			}

			if ( is_neighbour )
			{
				is_neighbour = isIntersecting( points, point_1, point_2, axis );
			}

			return is_neighbour;
		}

		function isIntersecting( points, point_1, point_2, axis )
		{
			var index_1 = getIndex( points, point_1 );
			var index_2 = getIndex( points, point_2 );

			var is_intersecting = false;

			if ( axis === 'horizontal' )
			{
				if (
					sizes[index_1].top >= sizes[index_2].top &&
					sizes[index_1].top <= sizes[index_2].top + sizes[index_2].height
				)
				{
					is_intersecting = true;
				}

				if (
					sizes[index_2].top >= sizes[index_1].top &&
					sizes[index_2].top <= sizes[index_1].top + sizes[index_1].height
				)
				{
					is_intersecting = true;
				}
			}

			if ( axis === 'vertical' )
			{
				if (
					sizes[index_1].left >= sizes[index_2].left &&
					sizes[index_1].left <= sizes[index_2].left + sizes[index_2].width
				)
				{
					is_intersecting = true;
				}

				if (
					sizes[index_2].left >= sizes[index_1].left &&
					sizes[index_2].left <= sizes[index_1].left + sizes[index_1].width
				)
				{
					is_intersecting = true;
				}
			}

			return is_intersecting;
		}

		function getIndex( points, point )
		{
			var index = -1;

			if ( typeof point_indexes[point.id] === 'number' )
			{
				index = point_indexes[point.id];
			}

			else
			{
				var len = points.length;

				for ( var i = 0; i < len; i++ )
				{
					if ( point.id === points[i].id )
					{
						index = i;
					}
				}

				point_indexes[point.id] = index;
			}

			return index;
		}

		function removeDuplicateLines( lines )
		{
			var new_lines = [ ];
			var new_line_ids = [ ];

			for ( var i = 0; i < lines.length; i++ )
			{
				var add_line = true;

				var line_id_1 = lines[i][0].id + '-' + lines[i][1].id;
				var line_id_2 = lines[i][1].id + '-' + lines[i][0].id;

				if (
					new_line_ids.indexOf( line_id_1 ) !== -1 &&
					new_line_ids.indexOf( line_id_2 ) !== -1
				)
				{
					add_line = false;

					break;
				}

				if ( add_line )
				{
					new_line_ids.push( line_id_1, line_id_2 );
					new_lines.push( lines[i] );
				}
			}

			return new_lines;
		}

		function getDistance( point_1, point_2 )
		{
			var left_diff = Math.abs( point_1.left - point_2.left );
			var top_diff = Math.abs( point_1.top - point_2.top );
			var distance = Math.sqrt( left_diff * left_diff + top_diff * top_diff );

			return distance;
		}

		return { init: init };
	}
);
