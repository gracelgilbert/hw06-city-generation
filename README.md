# City Generation: Grace Gilbert (gracegi)

## image here

## Demo Link
https://gracelgilbert.github.io/hw06-city-generation/

## External Resources
- [Real-time Procedural Generation of 'Pseudo Infinite' Cities](procedural_infinite_cities.pdf)
- [IQ's article on artistic lighting](http://iquilezles.org/www/articles/outdoorslighting/outdoorslighting.htm)

## Implementation
### 3D Terrain Generation
To get a 3D Terrain with a road map and population density, I converted the map texture generated [here](https://github.com/gracelgilbert/hw05-road-generation) into a 3D plane with height displacement.  The ground geometry is a densely subdivided plane.  The vertex shader of that plane takes in the map texture as input.  The red value of this map texture represents the height field of the terrain. When the height value exceeds a value of 1.3, the height of the plane is capped to 1.3, and when it is below 1.1, the height of the plane is capped to 1.1.  The height is a smooth gradient in between this range, creating a transition along the shoreline.  

The roads are placed in the same way they were placed previously in the 2D map using instanced square geometry, but now they are simply projected into 3D space and offset to be slightly above the ground level using the same 1.1 to 1.3 range. 
### Rasterization and Building Placement
In order to determine placements for buildings that do not fall on roads or water, I rasterized the terrain and road map into a black and white grid, black indicating an invalid location for a building.  

The first step of the rasterization was filling in black for water.  To do this, I iterated over a 2D grid and sampled the terrain texture at the position corresponding to each grid cell. If the texture returned a water value, a 0 was placed in the grid, otherwise, a 1.

Next was to rasterize the roads into that same 2D grid.  I iterated over each road in the map. For an individual road segment, I created a vertical bounding box out of the minimum and maximum y values of the edge endpoints. For each integer y value within this range, I perform a line intersection test with a horizontal line at that y value and the road edge.  Once this intersection point is found, the grid cells within a given width to the left and right of that intersection are colored black, giving the road thickness. For vertical and horizontal roads, rather than performing an intersection test, I just filled in a black rectangle that covered the given width around the edge.

Once this black and white grid was generated, I generated 2000 random positions. If a random posision falls in a white grid pixel, it is be added to a set of building locations with a probability based on the population density.  The higher the population density, the more likely the position will be added to the set.  The created more densely packed buildings in high population regions and more sparse buildings in low population regions.

### Building generation
Each building consists of multiple towers of different heights. The first tower is located at the building position, determined in the above process. The height of this tower depends on the population density at that location.  The higher the population, the taller the tower. The places tall skyscrapers in the dense areas and shorter row home type houses in the less populated areas.  There are then shorter towers placed nearby the original tower to create a stacked effect and a more interesting building geometry.

Each tower consists of indivudal building blocks. A building block is placed at the initial height of the first tower and then the height value is decremented. With probability 1/2, a new tower is added with this lower height and is positioned a random offset away from the original. Both blocks are now drawn at this new height.  The process continues until the height is 0, effectively extruding the towers down and probabilistically adding new shorter towers along the way.

There are 3 different potential shapes for the towers: a square tower, a pentagon tower, and an octogon tower. Whenever a new tower is generated, one of these three shapes is chosen at random, creating more variety in the building designs.  Each building block shape is instanced geometry. The square block is made with hard coded VBO data and the pentagon and octogon are imported OBJ files.

Because the terrain slopes down towards the water, I had to ensure that the buildings were not floating.  To do this, I took the distance between the maximum terrain height (1.3) and the terrain height at the current vertex's position and subtracted this from the vertex height.  This ensures that the base vertices of each building is level with the terrain, even when the terrain slopes down.

### Shading and Lighting


### Sky
