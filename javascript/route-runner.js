function RouteRunner( $options )
{
	var _self = this;
	var _start_point = $options.start_point;
	var _distances = $options.distances;
	var _points = $options.points;
	var _point_count = _points.length;

	//Ant Constants
	var _ant_count = 20;//20;
	var _rho = 0.1; // The decay rate of the pheromone trails
	var _beta = 3.0;// The importance of the durations   
	var _alpha = 0.1;// The importance of the previous trails
	var _q = 1.0; //see wikipedia - updating pheromones

	var _result = getPheromones();
	var _pheromones = result.pheromones;
	var _next_pheromone = result.pheromone_updates;

	var _route = [ ];

	function getPheromones()
	{
		return _pheromones;
	}

	function runOnce()
	{
		var result = sendWave( _ant_count, _pheromones, _next_pheromone );

		_routes = result.paths;
		_distances = result.distances;
	}

	function getPheromones()
	{
        //init pheremons
        var pheromones = [ ]
        var pheromone_updates = [ ]
         
        /*
        Get the average distance between points - http://www.ugosweb.com/Download/JavaACSFramework.pdf
         
        Note that for each point, the distance to itself is 0.  This means that
        the total number of valid distances is numPoints*(numPoints-1) since the distance
        to itself is not valid
        */
        var distance_sum = 0;
        
        for ( var i = 0; i < _point_count; i++ )
        {
			distance_sum += points[i].distanceTo( points[j] );
        }
         
        //each point has n-1 edges
        var total_edges = ( _point_count * ( _point_count - 1 ) );
        var average_distance = distance_sum / total_edges;
        var init_value = _q / average_distance;
         
        for ( var i = 0; i < _point_count; i++ )
        {
			pheromones[i] = [ ];
			pheromone_updates[i] = [ ];
           
			for ( var j = 0; j < _point_count; j++ )
			{
				pheromones[i][j] = init_value;
				pherUpdates[i][j] = 0.0;
			}
        }
         
        return { pheromones: pheromones, pheromone_updates: pheromone_updates };
    }

    function sendWave( $ant_count, $pheromones, $pheromone_updates )
    {
		var start_point = null;//parseInt(Math.random()*_numPoints);
		var paths =  [ ];
		var distances = [ ];
		var changed = false;

		for ( var ant = 0; ant < _ant_count; ant++ ) 
		{
		    var result = findAntPath( $pheromones, $pheromone_updates, start_point );
		    
		    paths[ant] = result.path;
		    distances[ant] = result.distance;
		     
		    if(that.route.length ==0 || result.distance<that.distance){
		        that.distance = result.distance;
		        that.route = result.path;
		        changed = true;
		    }
		}
         
        //update the smell globally
        for (var i = 0; i < _numPoints; ++i) 
        {
            for (var j = 0; j < _numPoints; ++j) 
            {
                pheromones[i][j] = 
                //decay old pheromone
                pheromones[i][j] * (1.0 - RHO)
                //add new pheromone
                + pherUpdates[i][j];
                 
                pherUpdates[i][j] = 0.0;
            }
        }
         
        return {paths:paths, distances:distances, changed:changed};
    }
}