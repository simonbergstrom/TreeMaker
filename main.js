function drawLine(x,y, x0,y0, color, width) {
  ctx.beginPath();
  ctx.moveTo(x,y);
  ctx.lineTo(x0,y0);
  ctx.strokeStyle = color;
  if (params.constantWidth) ctx.lineWidth = 1; else
  ctx.lineWidth = width;
  ctx.stroke();
}
function getRandomColor() {
  //return '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6)
  var r = ~~( 255 * Math.random());
  var g = ~~( 255 * Math.random());
  var b = ~~( 255 * Math.random() );
  var a = colors.alpha;
  return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
}

var camera, scene, renderer,controls;
var plant, mesh,tree_mesh;
var material;
var tmp = new THREE.Vector3();

init();
animate();

function init() {
  // Basic settings for WebGL
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize(800,800); // Make Canvas 800x800
  document.body.appendChild( renderer.domElement );

  // Camera settings...
  camera = new THREE.PerspectiveCamera( 45, 800 / 800, 1, 1000 );
  camera.position.z = 300;
  camera.position.y = 150;

  // Steering 
  controls = new THREE.TrackballControls( camera );

  controls.rotateSpeed = 2.0;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;

  controls.noZoom = false;
  controls.noPan = false;

  controls.staticMoving = true;
  controls.dynamicDampingFactor = 0.3;

  controls.keys = [ 65, 83, 68 ];

  //controls = new THREE.OrbitControls(camera);
  //controls.damping = 0.2;

  // Scene settings..
  scene = new THREE.Scene();
  light2 = new THREE.PointLight( 0xffffff, 1, 100 );
  light2.position.set(0, 100, -200);
  scene.add( light2 );
  directionalLight = new THREE.DirectionalLight( 0xffffff );
  directionalLight.position.set(0, 0.5, -0.5);
  directionalLight.position.normalize();
  scene.add( directionalLight );
  light2.position.y = 100;
  light2.position.z = 100;

  // Startrule for the L-system for Tree build
  setRules3();

  //var material = new THREE.MeshBasicMaterial({color: 0x333333});
  var line_geometry = new THREE.Geometry();
  tree_mesh = new THREE.Mesh();



  //line_geometry = DrawTheTree(line_geometry, 0, -50, 0);
  //plant = new THREE.Line(line_geometry, material, THREE.LinePieces);
  tree_mesh = DrawTheTree2(line_geometry,0,-150,0);

  console.log("Kolla funktionen merge för att skapa en mesh av alla meshes som finnd just nu....");

  scene.add(tree_mesh);
  //scene.add(plant);

  renderer.setClearColor(0xeeeeee);
}

/*function addTree(x,y){
  var material = new THREE.MeshBasicMaterial({color: 0xaaa});
  var line_geometry = new THREE.Geometry();
  line_geometry = DrawTheTree(line_geometry, x, y, 0);
  scene.add(new THREE.Line(line_geometry, material, THREE.LinePieces));
  scene.add(new THREE.MorphAnimMesh(line_geometry, material));
}*/

function animate() {
  requestAnimationFrame( animate );
  controls.update();
  //t0 = Date.now() / 60;
  //scene.rotation.y = t0;
  //tree_mesh.rotation.y += 0.001;
  //camera.lookAt(plant.position);
  camera.lookAt(tree_mesh.position);
  renderer.render( scene, camera );
}

window.onkeypress = function(e) {
  e = e || window.event;
  if(e.keyCode == 87) params.deltarota +=1;
}
