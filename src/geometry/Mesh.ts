import {vec3, vec4} from 'gl-matrix';
import Drawable from '../rendering/gl/Drawable';
import {gl} from '../globals';
import * as Loader from 'webgl-obj-loader';

class Mesh extends Drawable {
  indices: Uint32Array;
  positions: Float32Array;
  normals: Float32Array;
  colors: Float32Array;
  uvs: Float32Array;
  center: vec4;
  offsets: Float32Array; // Data for bufTranslate

  col1s: Float32Array; // Data for bufTranslate
  col2s: Float32Array; // Data for bufTranslate
  col3s: Float32Array; // Data for bufTranslate
  col4s: Float32Array; // Data for bufTranslate


  objString: string;

  constructor(objString: string, center: vec3) {
    super(); // Call the constructor of the super class. This is required.
    this.center = vec4.fromValues(center[0], center[1], center[2], 1);

    this.objString = objString;
  }

  create() {  
    let posTemp: Array<number> = [];
    let norTemp: Array<number> = [];
    let uvsTemp: Array<number> = [];
    let idxTemp: Array<number> = [];

    var loadedMesh = new Loader.Mesh(this.objString);

    //posTemp = loadedMesh.vertices;
    for (var i = 0; i < loadedMesh.vertices.length; i++) {
      posTemp.push(loadedMesh.vertices[i]);
      if (i % 3 == 2) posTemp.push(1.0);
    }

    for (var i = 0; i < loadedMesh.vertexNormals.length; i++) {
      norTemp.push(loadedMesh.vertexNormals[i]);
      if (i % 3 == 2) norTemp.push(0.0);
    }

    uvsTemp = loadedMesh.textures;
    idxTemp = loadedMesh.indices;

    // white vert color for now
    // this.colors = new Float32Array(posTemp.length);
    // for (var i = 0; i < posTemp.length; ++i){
    //   this.colors[i] = 1.0;
    // }

    this.indices = new Uint32Array(idxTemp);
    this.normals = new Float32Array(norTemp);
    this.positions = new Float32Array(posTemp);
    this.uvs = new Float32Array(uvsTemp);

    this.generateIdx();
    this.generatePos();
    this.generateNor();
    this.generateUV();
    this.generateTranslate();

    this.generateTransform1();
    this.generateTransform2();
    this.generateTransform3();
    // this.generateTransform4();

    this.generateCol();

    this.count = this.indices.length;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIdx);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufNor);
    gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPos);
    gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW);

    // gl.bindBuffer(gl.ARRAY_BUFFER, this.bufCol);
    // gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufUV);
    gl.bufferData(gl.ARRAY_BUFFER, this.uvs, gl.STATIC_DRAW);

    console.log(`Created Mesh from OBJ`);
    this.objString = ""; // hacky clear
  }

  setInstanceVBOs(colors: Float32Array, col1s: Float32Array, col2s: Float32Array, col3s: Float32Array, col4s: Float32Array) {
    this.colors = colors;

    this.col1s = col1s;
    this.col2s = col2s;
    this.col3s = col3s;
    this.col4s = col4s;


    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufCol);
    gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);


    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufTransform1);
    gl.bufferData(gl.ARRAY_BUFFER, this.col1s, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufTransform2);
    gl.bufferData(gl.ARRAY_BUFFER, this.col2s, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufTransform3);
    gl.bufferData(gl.ARRAY_BUFFER, this.col3s, gl.STATIC_DRAW);

    // gl.bindBuffer(gl.ARRAY_BUFFER, this.bufTransform4);
    // gl.bufferData(gl.ARRAY_BUFFER, this.col4s, gl.STATIC_DRAW);
  }
};

export default Mesh;
