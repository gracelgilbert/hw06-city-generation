import {vec3, vec2, mat3, vec4, quat, glMatrix} from 'gl-matrix';
import Turtle from './turtle';
import TurtleStack from './turtleStack'
import Edge from './edge';
import Intersection from './intersection'
import { gl } from './globals';
import Road from './Road';

class BuildingSystem {
    roadSystem: Road;
    grid: Array<number> =  new Array<number>();
    positions: Array<vec2> = new Array<vec2>();
    width: number;

    constructor (roadSystem: Road, width: number) {
        this.roadSystem = roadSystem;
        this.width = width;
        this.grid = this.roadSystem.rasterize(this.width);
        this.populateBuildings();
    }

    populateBuildings() {
        for (var i = 0; i < this.roadSystem.mapWidth; i++) {
             for (var j = 0; j < this.roadSystem.mapHeight; j++) {
                if (this.grid[i + this.roadSystem.mapWidth * j] == 0) {
                    // this.positions.push(vec2.fromValues(14.3 * (i /  this.roadSystem.mapWidth) - 4.0, 8.0 * (j / this.roadSystem.mapHeight) - 4.0));
                    this.positions.push(vec2.fromValues( (8.0 * i /  this.roadSystem.mapWidth) - 4.0, (8.0 * j / this.roadSystem.mapHeight) - 4.0)) ;
                } 
            }
        }
        // for (var i = 0; i < 10; i++) {
        //     this.positions.push(vec2.fromValues(Math.random(), Math.random()));
        // }
    }




}

export default BuildingSystem;