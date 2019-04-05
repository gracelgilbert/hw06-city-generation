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

### Lighting and Shading
All buildings are rendered with lambertian shading. There are two main light sources tha contribute to the lambertian shading. One light is a warm light shining in the -Z direction.  The second light is a cooler light shining in the +Z direction, creating a warm and cool tone contrast and ensuring that no portion of a building is in complete darkness.  

The base color of the building depends on the population density of its location.  In high population areas, the buildings are textured with thin vertical stripes created using a high frequency sin curve. I chose not to add horizontal lines to create definied windows, as the vertical lines alone creates more of a skyscraper look, like modern tall glass buildings. The color of these skyscraper buildings is gray toned to mimic city colors. The RGB parameters vary according to an FBM noise function, but are all a fairly neutral gray. 

In low population areas, the buildings are textured with and FBM pattern. This makes them look a little more rustic and constrasts the straight lines of the urban buildings. These buildings are also more colorful.  There are three saturated color options for the low population buildings, red, blue, and yellow, each of which is subtly varied according to an FBM parameter. The color of the buildings is distributed using worley noise, so buildings in a certain region are the same base color. 

An issue I ran into was that parts of some buildings ended up over water. While the rasterization step avoids placing the original tower position over water, the other towers of buildings may end up over a road or over water. Because the population of the water regions is 0, when part of a building was over water, its color would fall into the saturated FBM texture, whereas the rest of the building would be in the high population shoreline region and have the stripe patter.  To fix this, whenever the population is 0, the color of the building is set to be closer to the striped city pattern than the FBM suburban pattern. It will not be exactly consistent throughout the building, becasue the shoreline population is not constant, but it makes the contrast less jarring and nearly unnoticeable. 

### Sky
The sky is a 2D texture rendered onto a quad at the far clip plane.  The clouds are generated using FBM elongated along the x direction. There are two layers of clouds, one white and fluffier, and one layer of pinker thinner clouds. In order to create a sense of perspective, the speed, horizontal, and vertical scale of the clouds are scaled according to the screen space y value. The higher on the screen, the faster the clouds will go and the larger they will appear. Further down the screen, the clouds move slower and are stretched in the x direction and compressed in the y direction to appear farther away. The clouds are also less visible further down the screen so they fade out in the distance. This affect adds depth to the scene, making the sky feel less flat and more a part of the environment.

## Elements to Improve
### Snapping to Terrain
While I ensured that there are no floating buildings, the method I used to snap buildings to the terrain height creates slants in the tops of building towers. I transform all vertices down by the distance between the terrain height and the max terrain height. This includes vertices at the tops of the towers, create the terrain slant at the roof as well. Ideally, this should only be applied to vertices at the base of the towers, rather than all vertices in the tower. To accomplish this, I could add an instance variable that acts as a boolean to determine if a vertex should be snapped to the terrain height or not.

### Invalid Tower Placements
As mentioned when discussing texturing, the rasterization process ensures that a building's original tower position will not intersect with a road or water, but the added towers might.  To avoid this, I could simply increase the width of the edges in the rasterization process, but this is not failproof either. A more thorough solution would be to test each tower's position against the rasterized grid and only add a tower if it is in a valid location.

### Patchy Textures
While I resolved the issue of having shoreline buildings be partially striped and partially textured with FBM, there are some instances where part of a building happens to be in a high population position and another part in a low population region, causing the building to have mismatched textures. To resolve this, I could add an instance variable that is set for all geometry that is part of a specific building.  This would ensure that blocks in the same building all receive the same texture.

### Sky Warping
Because the FBM pattern for clouds is animated at different rates depending on the height, after some time, the pattern stretches and no longer looks like clouds. To avoid this, I could modulo the sin function to reset the animation speed after some time so it returns to the original unstretched state. There also may be other methods of creating that sense of perspective that I could look into.
