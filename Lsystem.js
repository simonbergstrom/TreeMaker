var	boundsx,boundsy,
    mouse = {
		down: false, button:1, x:0,	y:0, px:0,py:0	};
var ic = 0x1000000;
var random_color = '#0';

function Params() {
  this.iterations= 2;
  this.theta= 18;
  this.thetaRandomness= 0;
  this.angle= 0;
  this.scale= 4;
  this.scaleRandomness= 0;
  this.constantWidth= true;
  this.deltarota =30;
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
var colors = new Colors();


  
var clear = { clear: function(){
        canvas.width = canvas.width;}};

window.addEventListener('mousemove', function (event) {
        mouse.x = event.clientX;
        mouse.y = event.clientY;   });

window.onmousemove = function(e) {
		mouse.px = mouse.x;
		mouse.py = mouse.y;
		//var rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - window.innerWidth/2;
  mouse.y = -(e.clientY - window.innerHeight/2);
    if (mouse.down) {
      
     //addTree(mouse.x, mouse.y);
    }
		e.preventDefault();
	};

window.onmousedown = function(e){
    mouse.down = true;
  	mouse.px = mouse.x;
		mouse.py = mouse.y;
		//var rect = window.getBoundingClientRect();
  mouse.x = e.clientX - window.innerWidth/2;
  mouse.y = -(e.clientY - window.innerHeight/2);
  public_color =  getRandomColor();
  addTree(mouse.x, mouse.y);

  
}
window.onmouseup = function(e){
    mouse.down = false;
}

window.onload = function(){
  //setRules1();
}

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


function setRules0(){
  rules.axiom = "F";
  rules.mainRule = "F-F[-F+F[LLLLLLLL]]++F[+F[LLLLLLLL]]--F[+F[LLLLLLLL]]";
  params.iterations =3;
  params.angle = 0;
  params.theta = 30;
  params.scale = 6;    
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

var camera, scene, renderer;
var plant, mesh;
var material;
var tmp = new THREE.Vector3();

init();
animate();

function init() {

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	camera = new THREE.PerspectiveCamera( 45, 800 / 800, 1, 1000 );
  //camera = new THREE.Camera();
	camera.position.z = 300;
	camera.position.y = 150;

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
  
  setRules0();
  
  var material = new THREE.MeshBasicMaterial({color: 0x333333});
  var line_geometry = new THREE.Geometry();
  line_geometry = DrawTheTree(line_geometry, 0, -150, 0);  
  //plant = new THREE.Mesh(line_geometry, material);
  plant = new THREE.Line(line_geometry, material, THREE.LinePieces);
  scene.add(plant);
         
	renderer.setClearColor(0xeeeeee);
	window.addEventListener( 'resize', onWindowResize, false );
}

function addTree(x,y){
  var material = new THREE.MeshBasicMaterial({color: 0xaaa});
  var line_geometry = new THREE.Geometry();
  line_geometry = DrawTheTree(line_geometry, x, y, 0);
  //scene.add(new THREE.Line(line_geometry, material, THREE.LinePieces));
  //scene.add(new THREE.MorphAnimMesh(line_geometry, material));
}

function onWindowResize() {
	//camera.aspect = window.innerWidth / window.innerHeight;
	//camera.updateProjectionMatrix();
	//renderer.setSize( window.innerWidth, window.innerHeight );
}
function animate() {
	requestAnimationFrame( animate );
	//t0 = Date.now() / 60;
  //scene.rotation.y = t0;
  plant.rotation.y += 0.01;
  camera.lookAt(plant.position);
	renderer.render( scene, camera );
}

window.onkeypress = function(e) {
  e = e || window.event;
  if(e.keyCode == 87) params.deltarota +=1;
}
