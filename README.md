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
### Building generation
### Shading and Lighting
### Sky
