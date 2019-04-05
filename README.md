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

The first step of the rasterization was filling in black for water.  To do this, I iterated over a 2D grid and sampled the terrain texture at the position corresponding to each grid cell. If the texture returned a water value, a 0 was placed in the grid.  Otherwise, a 1.

Next was to rasterize the roads into that same 2D grid.  I iterated over each road in the map. For an individual road segment, I created a vertical bounding box out of the minimum and maximum y values of the edge endpoints. For each integer y value within this range, I perform a line intersection test with a horizontal line at that y value and the road edge.  Once this intersection point is found, the grid cells within a given width to the left and right of that intersection are colored black, giving the road thickness. For vertical and horizontal roads, rather than performing an intersection test, I just filled in a black rectangle that covered the given width around the edge.

Once this black and white grid was generated, I generated 2000 random positions. If a random posision falls in a white grid pixel, it is be added to a set of building locations.

### Building generation


### Shading and Lighting
### Sky
