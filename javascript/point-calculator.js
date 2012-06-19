function PointCalculator()
{
	var _self = this;
	var _points = [ ];

	function getPoints()
	{
		return _points;
	}

	function setPoints( $points )
	{
		if ( _.isArray( $points ) )
		{
			_points = $points;
		}
	}

	function updatePoints( $items )
	{
		var points = getItemPoints( $items );
		
		setPoints( points );

		return getPoints();
	}

	function getItemPoints( $items )
	{
		var points = [ ];

		$items.each(
			function( $index, $item )
			{
				var item = $( $item )
				var point = item.position();
					point.left += item.width() / 2;
					point.top += item.height() / 2;
					
					point.id = item.attr( 'id' );

				points.push( point );
			}
		);

		return points;
	}

	_self.getPoints = getPoints;
	_self.updatePoints = updatePoints;
}