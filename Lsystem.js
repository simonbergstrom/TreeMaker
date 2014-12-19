var	boundsx,boundsy,
mouse = {
  down: false, button:1, x:0,	y:0, px:0,py:0	};

function Params() {
  this.iterations= 2;
  this.theta= 18;
  this.thetaRandomness= 0;
  this.angle= 0;
  this.scale= 4;
  this.scaleRandomness= 0;
  this.constantWidth= true;
  this.deltarota =30;
  this.treeWidth = 40;
  this.treeDecrease = 2;
}
function Colors() {
  this.background = "#000000";
  this.general = "#111faa";
  this.random= true;
  this.alpha= 0.8;
}
function Rules()  {
  this.axiom = 'F';
  this.mainRule = 'FF-[-F+F+F]+[+F-F-F]';
  this.Rule2 = '';
}

var rules = new Rules();
var params = new Params();
//var colors = new Colors();

function GetAxiomTree() {
  var Waxiom = rules.axiom;
  var newf = rules.mainRule;
  var newb = 'bb';
  var newx = rules.Rule2;
  var level = params.iterations;
  while (level > 0) {
  var m = Waxiom.length;
  var T = '';
  for (var j=0; j < m; j++) {
  var a = Waxiom[j];
  if (a == 'F'){T += newf;}
  else
  if (a == 'b'){T += newb;}
  else
    if (a == 'X'){T += newx;}
      else
        T += a;
      }
      Waxiom = T;
      level--;
    }
    return Waxiom;
}

// The draw function for the Tree which takes a empty geometry and  
// inital position as input and returns geometry with added vertices
function DrawTheTree(geom, x_init, y_init, z_init){
  var geometry = geom;
  var Wrule = GetAxiomTree();
  var n = Wrule.length;
  var stackX = []; var stackY = [];  var stackZ = []; var stackA = [];
  var stackV = []; var stackAxis = [];

  var theta = params.theta * Math.PI / 180;
  var scale = params.scale;
  var angle = params.angle * Math.PI / 180;

  var x0 = x_init;    var y0 = y_init;   var z0 = z_init ;
  var x;    var y;    var z;
  var rota = 0, rota2 = 0,
  deltarota = 18 * Math.PI/180;
  var newbranch = false;
  var axis_x = new THREE.Vector3( 1, 0, 0 );
  var axis_y = new THREE.Vector3( 0, 1, 0 );
  var axis_z = new THREE.Vector3( 0, 0, 1 );
  var zero = new THREE.Vector3( 0, 0, 0 );
  var axis_delta = new THREE.Vector3(),
  prev_startpoint = new THREE.Vector3();

  var startpoint = new THREE.Vector3(x0,y0,z0),
  endpoint = new THREE.Vector3();
  var bush_mark;
  var vector_delta = new THREE.Vector3(scale, scale, 0);

  for (var j=0; j<n; j++){
    var a = Wrule[j];
    if (a == "+"){angle -= theta;
    }
    if (a == "-"){angle += theta;
    }
    if (a == "F"){

      var a = vector_delta.clone().applyAxisAngle( axis_y, angle );
      endpoint.addVectors(startpoint, a);

      geometry.vertices.push(startpoint.clone());
      geometry.vertices.push(endpoint.clone());

      prev_startpoint.copy(startpoint);
      startpoint.copy(endpoint);

      axis_delta = new THREE.Vector3().copy(a).normalize();
      rota += deltarota;// + (5.0 - Math.random()*10.0);

    }
    if (a == "L"){
      endpoint.copy(startpoint);
      endpoint.add(new THREE.Vector3(0, scale*1.5, 0));
      var vector_delta2 = new THREE.Vector3().subVectors(endpoint, startpoint);
      vector_delta2.applyAxisAngle( axis_delta, rota2 );
      endpoint.addVectors(startpoint, vector_delta2);

      geometry.vertices.push(startpoint.clone());
      geometry.vertices.push(endpoint.clone());

      rota2 += 45 * Math.PI/180;
    }
    if (a == "%"){

    }
    if (a == "["){
      stackV.push(new THREE.Vector3(startpoint.x, startpoint.y, startpoint.z));
      stackA[stackA.length] = angle;
    }
    if (a == "]"){
      var point = stackV.pop();
      startpoint.copy(new THREE.Vector3(point.x, point.y, point.z));
      angle = stackA.pop();
    }
    bush_mark = a;
  }
  return geometry;
}
// Some predefined rules for the L-system
function setRules0(){
  rules.axiom = "F";
  rules.mainRule = "F[--F++][F]";
  params.iterations =1;
  params.theta = 12;
  params.scale = 16;
}
function setRules1(){
  rules.axiom = "F";
  rules.mainRule = "FF--[-F--F+F]+[+F-F-F]";
  params.iterations =4;
  params.theta = 36;
  params.scale = 6;
}
function setRules2(){
  //rules.axiom = "F[+F+F][-F-F][++F][--F]F";
  rules.axiom = "F[F]+[F]+[F]---[F]-[F]";
  rules.mainRule = "FF[++F][+F][F][-F][--F]";
  params.iterations = 3;
  params.theta = 20;
  params.scale = 10;
}
function setRules3(){
  rules.axiom = "F++[F]--[F]-[F]-[F]";
  rules.mainRule = "FF++[F[F-F]]--[+F[--F]][---F[-F]]F[-F][F]";
  params.iterations = 3;
  params.theta = 15;
  params.scale = 3;
}
function setRules4(){
  rules.axiom = "X";
  rules.mainRule = "F";
  rules.Rule2 = "F[+X]+F[-X]+X";
  params.iterations = 8;
  params.theta = 30;
  params.scale = 9.5;
}
function setRules5(){
  rules.axiom = "X";
  rules.mainRule = "FF";
  rules.Rule2 = "F[%+X][%-X]FX";
  params.iterations = 6;
  params.theta = 25;
  params.scale = 1.5;
}
function setRules6(){
  rules.axiom = "X";
  rules.mainRule = "FF";
  rules.Rule2 = "F-[[X]+X]+F[+FX]-X";
  params.iterations = 6;
  params.theta = 25;
  params.scale = 2;
}
function setRules7(){
  rules.axiom = "F";
  rules.mainRule = "F+[F]--[F]";
  params.iterations = 5;
  params.theta = 25;
  params.scale = 10;
}

// The draw function for the Tree which takes a empty geometry and  
// Return cylindermesh!
function DrawTheTree2(geom, x_init, y_init, z_init){
  var geometry = geom;
  var Wrule = GetAxiomTree();
  var n = Wrule.length;
  var stackX = []; var stackY = [];  var stackZ = []; var stackA = [];
  var stackV = []; var stackAxis = [];

  var theta = params.theta * Math.PI / 180;
  var scale = params.scale;
  var angle = params.angle * Math.PI / 180;

  var x0 = x_init;    var y0 = y_init;   var z0 = z_init ;
  var x;    var y;    var z;
  var rota = 0, rota2 = 0,
  deltarota = 18 * Math.PI/180;
  var newbranch = false;
  var axis_x = new THREE.Vector3( 1, 0, 0 );
  var axis_y = new THREE.Vector3( 0, 1, 0 );
  var axis_z = new THREE.Vector3( 0, 0, 1 );
  var zero = new THREE.Vector3( 0, 0, 0 );
  var axis_delta = new THREE.Vector3(),
  prev_startpoint = new THREE.Vector3();


  // NEW
  var decrease  = params.treeDecrease;
  var treeWidth = params.treeWidth;
  // END


  var startpoint = new THREE.Vector3(x0,y0,z0),
  endpoint = new THREE.Vector3();
  var bush_mark;
  var vector_delta = new THREE.Vector3(scale, scale, 0);
  var cylindermesh = new THREE.Object3D();

  for (var j=0; j<n; j++){

    treeWidth = treeWidth-decrease;
    var a = Wrule[j];
    if (a == "+"){angle -= theta;}
    if (a == "-"){angle += theta;}
    if (a == "F"){

      var a = vector_delta.clone().applyAxisAngle( axis_y, angle );
      endpoint.addVectors(startpoint, a);

      cylindermesh.add(cylinderMesh(startpoint,endpoint,treeWidth));

      prev_startpoint.copy(startpoint);
      startpoint.copy(endpoint);

      axis_delta = new THREE.Vector3().copy(a).normalize();
      rota += deltarota;
    }
    if (a == "L"){
      endpoint.copy(startpoint);
      endpoint.add(new THREE.Vector3(0, scale*1.5, 0));
      var vector_delta2 = new THREE.Vector3().subVectors(endpoint, startpoint);
      vector_delta2.applyAxisAngle( axis_delta, rota2 );
      endpoint.addVectors(startpoint, vector_delta2);

      cylindermesh.add(cylinderMesh(startpoint,endpoint,treeWidth));

      rota2 += 45 * Math.PI/180;
    }
    if (a == "%"){

    }
    if (a == "["){
      stackV.push(new THREE.Vector3(startpoint.x, startpoint.y, startpoint.z));
      stackA[stackA.length] = angle;
    }
    if (a == "]"){
      var point = stackV.pop();
      startpoint.copy(new THREE.Vector3(point.x, point.y, point.z));
      angle = stackA.pop();
    }
    bush_mark = a;
  }
  return cylindermesh;
}

// Convert vector between point X and Y to a cylinder...
function cylinderMesh(pointX, pointY,treeWidth) {
    var direction = new THREE.Vector3().subVectors(pointY, pointX);
    var orientation = new THREE.Matrix4();
    orientation.lookAt(pointX, pointY, new THREE.Object3D().up);
    orientation.multiply(new THREE.Matrix4(1, 0, 0, 0,
                                           0, 0, 1, 0,
                                           0, -1, 0, 0,
                                           0, 0, 0, 1));
    var edgeGeometry = new THREE.CylinderGeometry(0.5, 0.5, direction.length(), 8, 1);
    var edge = new THREE.Mesh(edgeGeometry);
    edge.applyMatrix(orientation);
    // position based on midpoints - there may be a better solution than this
    edge.position.x = (pointY.x + pointX.x) / 2;
    edge.position.y = (pointY.y + pointX.y) / 2;
    edge.position.z = (pointY.z + pointX.z) / 2;
    return edge;
}
