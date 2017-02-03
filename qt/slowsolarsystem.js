
Qt.include("three.js")
Qt.include("orbit.js")

var camera, scene, renderer;
var frame = 0;
var positionVelocityArray;
var sphere1;
var sphere2;
var galaxySphere;
var spotLight;
var m1, m2, Mass1PositionX, Mass1PositionY, Mass1PositionZ, Mass2PositionX, Mass2PositionY, Mass2PositionZ;
var Mass1VelocityX, Mass1VelocityY, Mass1VelocityZ, Mass2VelocityX, Mass2VelocityY, Mass2VelocityZ;
var orbitGeometry, lineOrbit, orbitMaterial;
var orbitGeometry2, lineOrbit2, orbitMaterial2;
var scaleFactor;
var showOrbits = true;
var axes, plane;

function initializeGL(canvas, eventSource) {

    scene = new THREE.Scene();

    initVariables();
    evaluateArray();

    //This is very important
    //Set camera length
    camera = new THREE.PerspectiveCamera( 15, canvas.width / canvas.height, 1, 100000);

    addReferencePlane();
    addSpheres();
    addLights();
    addOrbits();

    renderer = new THREE.Canvas3DRenderer(
                { canvas: canvas, antialias: true, devicePixelRatio: canvas.devicePixelRatio });
    renderer.setPixelRatio( canvas.devicePixelRatio );
    renderer.setSize( canvas.width, canvas.height );
}

function resizeGL(canvas) {

    renderer.setPixelRatio( canvas.devicePixelRatio );
    camera.aspect = canvas.width / canvas.height;
    camera.updateProjectionMatrix ();
    renderer.setSize( canvas.width, canvas.height );
}

function paintGL(canvas) {

    if (frame < positionVelocityArray.length - 1 ) {
        frame++;
    }

    var sphere1X;
    var sphere1Y;
    var sphere1Z;
    var sphere2X;
    var sphere2Y;
    var sphere2Z;
    var sphere1VelX;
    var sphere1VelY;
    var sphere1VelZ;
    var sphere2VelX;
    var sphere2VelY;
    var sphere2VelZ;

    sphere1X = positionVelocityArray[frame][0];
    sphere1Y = positionVelocityArray[frame][1];
    sphere1Z = positionVelocityArray[frame][2];
    sphere2X = positionVelocityArray[frame][3];
    sphere2Y = positionVelocityArray[frame][4];
    sphere2Z = positionVelocityArray[frame][5];
    sphere1VelX = positionVelocityArray[frame][6];
    sphere1VelY = positionVelocityArray[frame][7];
    sphere1VelZ = positionVelocityArray[frame][8];
    sphere2VelX = positionVelocityArray[frame][9];
    sphere2VelY = positionVelocityArray[frame][10];
    sphere2VelZ = positionVelocityArray[frame][11];

    sphere1.position.x = sphere1X;
    sphere1.position.y = sphere1Y;
    sphere1.position.z = sphere1Z;
    galaxySphere.position.x = sphere1X;
    galaxySphere.position.y = sphere1Y;
    galaxySphere.position.z = sphere1Z;
    sphere2.position.x = sphere2X;
    sphere2.position.y = sphere2Y;
    sphere2.position.z = sphere2Z;

    camera.position.x = sphere1.position.x + 1000000000 / scaleFactor;
    camera.position.z = sphere1.position.z - 400000000 / scaleFactor;
    camera.position.y = sphere1.position.y + 400000000 / scaleFactor;


    //Sun lights the earth
    spotLight.position.set(sphere1X, sphere1Y, sphere1Z);

    camera.lookAt( sphere1.position );

    var timer = 0.00000000000002 * Date.now();
    if (frame < positionVelocityArray.length - 1 )
        sphere2.rotation.y +=  timer;

    renderer.render( scene, camera );
}

function initVariables()
{
    scaleFactor = 1000000;

    m1 = 1.988e+30 / scaleFactor;
    m2 = 5.9726e+24 / scaleFactor;
    Mass1PositionX = 0;
    Mass1PositionY = 0;
    Mass1PositionZ = 0;
    Mass2PositionX = 149.6e+6 / scaleFactor;
    Mass2PositionY = 0;
    Mass2PositionZ = 0;
    Mass1VelocityX = -40;
    Mass1VelocityY = 0;
    Mass1VelocityZ = 0;
    Mass2VelocityX = -40;
    Mass2VelocityY = 0;
    Mass2VelocityZ = -29.78;

    orbitGeometry = new THREE.Geometry();
    orbitGeometry2 = new THREE.Geometry();

    orbitMaterial = new THREE.LineBasicMaterial({color: 0xff0049, linewidth: 2});
    orbitMaterial2 = new THREE.LineBasicMaterial({color: 0x4900ff, linewidth: 2});
}

function evaluateArray()
{
    var x = 0;
    var xstop = 20 * 31558118.4 / scaleFactor; //Earth period
    var h = 30000 /  scaleFactor;
    var G = 6.67384e-20;

    var ncolumns = 12;
    var nrows = Math.ceil ((xstop-x)/h);
    positionVelocityArray = new Array(nrows);
    for (var i = 0; i < nrows; i++)
    {
        positionVelocityArray[i] = new Array(ncolumns);
    }

    var y = new Array();
    y[0] = Mass1PositionX;
    y[1] = Mass1PositionY;
    y[2] = Mass1PositionZ;
    y[3] = Mass2PositionX;
    y[4] = Mass2PositionY;
    y[5] = Mass2PositionZ;
    y[6] = Mass1VelocityX;
    y[7] = Mass1VelocityY;
    y[8] = Mass1VelocityZ;
    y[9] = Mass2VelocityX;
    y[10] = Mass2VelocityY;
    y[11] = Mass2VelocityZ;

    rk4(x, xstop, h, y, m1, m2, G, positionVelocityArray, nrows);
    frame = 0;
}

function addLights()
{
    var spotColor = "#ffffff";
    spotLight = new THREE.SpotLight(spotColor);
    spotLight.position.set(0, 0, 0);
    spotLight.castShadow = true;
    spotLight.target = sphere2;
    scene.add(spotLight);
}

function addSpheres()
{
    var sphereGeometry = new THREE.SphereGeometry(30000000 / scaleFactor, 30, 30);
    var sphereGeometry2 = new THREE.SphereGeometry(18000000 / scaleFactor, 30, 20);

    var texture = THREE.ImageUtils.loadTexture("../images/sunmap.jpg");
    var material = new THREE.MeshBasicMaterial({
                                                   map: texture,
                                                   bumpMap: texture,
                                                   bumpScale: 0.05
                                               });
    sphere1 = new THREE.Mesh(sphereGeometry, material);
    scene.add(sphere1);

    var texture2 = THREE.ImageUtils.loadTexture("../images/earthmap1k.jpg");
    var mat2 = new THREE.MeshPhongMaterial();
    mat2.map = texture2;
    sphere2 = new THREE.Mesh(sphereGeometry2, mat2);
    var cloudMaterial = new THREE.MeshPhongMaterial({
                                                        map: THREE.ImageUtils.loadTexture("../images/earthcloudmapcolortrans.png"),
                                                        side: THREE.DoubleSide,
                                                        transparent: true,
                                                        opacity: 0.8
                                                    });
    var cloud = new THREE.Mesh(sphereGeometry2, cloudMaterial);
    sphere2.add(cloud);
    scene.add(sphere2);

    var geometry3	= new THREE.SphereGeometry(1500, 30, 30)
    var texture3 = THREE.ImageUtils.loadTexture("../images/galaxy_starfield.png");
    var material3 = new THREE.MeshBasicMaterial({
                                                    map: texture3,
                                                    //bumpMap: texture3,
                                                    //bumpScale: 0.05,
                                                    side	: THREE.BackSide
                                                });
    galaxySphere = new THREE.Mesh(geometry3, material3);
    scene.add(galaxySphere);
}

function addReferencePlane()
{
    axes = new THREE.AxisHelper(1000);
    scene.add(axes);

    // Grid

    var line_material = new THREE.LineBasicMaterial( { color: 0x303030 } ),
            geometry = new THREE.Geometry(),
            floor = -20, step = 50;

    // floor - the y(height of the floor)
    //step how close the grid will be
    // 40 -> 5000 / 250
    // this grid goes from -5000 to 5000

    //For real speed
    // step = 1000
    // length = 5000000
    // color = 0x808080
    //For slow speed
    // step = 50
    // length = 50000
    // color = 0x303030
    var length = 50000;

    for ( var i = 0; i <= 50000; i++ ) {

        geometry.vertices.push( new THREE.Vector3( - length, floor, i * step - length ) );
        geometry.vertices.push( new THREE.Vector3(   length, floor, i * step - length ) );

        geometry.vertices.push( new THREE.Vector3( i * step - length, floor, -length ) );
        geometry.vertices.push( new THREE.Vector3( i * step - length, floor,  length ) );

    }

    plane = new THREE.Line( geometry, line_material, THREE.LinePieces );
    scene.add( plane );
}

function addOrbits()
{
    for (var i = 0; i < positionVelocityArray.length - 1; i++)
    {
        orbitGeometry.vertices.push(new THREE.Vector3(positionVelocityArray[i][0], positionVelocityArray[i][1], positionVelocityArray[i][2]));
        orbitGeometry2.vertices.push(new THREE.Vector3(positionVelocityArray[i][3], positionVelocityArray[i][4], positionVelocityArray[i][5]));
    }
    lineOrbit = new THREE.Line(orbitGeometry, orbitMaterial);
    lineOrbit.name = "lineOrbit";
    lineOrbit2 = new THREE.Line(orbitGeometry2, orbitMaterial2);
    lineOrbit2.name = "lineOrbit2";
    scene.add(lineOrbit);
    scene.add(lineOrbit2);

}

function restart()
{
    frame = 0;
}

function setShowOrbits(value)
{
    showOrbits = value;
    if (showOrbits)
    {
        scene.add(lineOrbit);
        scene.add(lineOrbit2);
        scene.add(axes);
        scene.add(plane);
    }
    else
    {
        scene.remove(lineOrbit);
        scene.remove(lineOrbit2);
        scene.remove(axes);
        scene.remove(plane);
    }
}

