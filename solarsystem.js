
Qt.include("three.js")
Qt.include("orbit.js")

var camera, scene, renderer;
var distance;
var theta;
var phi;
var camera_x, camera_y, camera_z;
var start_x, start_y, end_x, end_y;
var theta0, phi0, delta_theta, delta_phi;
var frame = 0;
var positionVelocityArray;
var sphere1;
var sphere2;
var galaxySphere;
var spotLight;
var phiAscending = true;
var m1, m2, Mass1PositionX, Mass1PositionY, Mass1PositionZ, Mass2PositionX, Mass2PositionY, Mass2PositionZ;
var Mass1VelocityX, Mass1VelocityY, Mass1VelocityZ, Mass2VelocityX, Mass2VelocityY, Mass2VelocityZ;
var orbitGeometry2, lineOrbit2, orbitMaterial2;
var autoRotate;
var scaleFactor;
var showOrbits = true;
var axes, plane;

function initializeGL(canvas, eventSource) {

    scene = new THREE.Scene();


    initVariables();
    evaluateArray();

    //This is very important
    //Set camera length
    camera = new THREE.PerspectiveCamera( 15, canvas.width / canvas.height, 1, 10000);
    camera.target = new THREE.Vector3(0, 0, 0);
    camera.position.set( camera_x, camera_y, camera_z);

    addReferencePlane();
    addSpheres();
    addLights();
    addOrbits();

    renderer = new THREE.Canvas3DRenderer(
                { canvas: canvas, antialias: true, devicePixelRatio: canvas.devicePixelRatio });
    renderer.setPixelRatio( canvas.devicePixelRatio );
    renderer.setSize( canvas.width, canvas.height );

    eventSource.mouseDown.connect(onDocumentMouseDown);
    eventSource.mouseUp.connect(onDocumentMouseUp);
    eventSource.mouseMove.connect(onDocumentMouseMove);
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

    var sphere1X = 0;
    var sphere1Y = 0;
    var sphere1Z = 0;
    var sphere2X;
    var sphere2Y;
    var sphere2Z;
    var sphere1VelX = 0;
    var sphere1VelY = 0;
    var sphere1VelZ = 0;
    var sphere2VelX;
    var sphere2VelY;
    var sphere2VelZ;


    sphere2X = positionVelocityArray[frame][3] - positionVelocityArray[frame][0];
    sphere2Y = positionVelocityArray[frame][4] - positionVelocityArray[frame][1];
    sphere2Z = positionVelocityArray[frame][5] - positionVelocityArray[frame][2];
    sphere2VelX = positionVelocityArray[frame][9] - positionVelocityArray[frame][6];
    sphere2VelY = positionVelocityArray[frame][10] - positionVelocityArray[frame][7];
    sphere2VelZ = positionVelocityArray[frame][11] - positionVelocityArray[frame][8];


    sphere1.position.x = sphere1X;
    sphere1.position.y = sphere1Y;
    sphere1.position.z = sphere1Z;
    galaxySphere.position.x = sphere1X;
    galaxySphere.position.y = sphere1Y;
    galaxySphere.position.z = sphere1Z;
    sphere2.position.x = sphere2X;
    sphere2.position.y = sphere2Y;
    sphere2.position.z = sphere2Z;

    if (dragging)
    {
        delta_theta = (end_x - start_x) * 0.01;
        delta_phi = (end_y - start_y) * 0.01;
    }
    else
    {
        delta_theta = 0;
        delta_phi = 0;
    }
    theta = theta0 - delta_theta;
    phi = phi0 + delta_phi;

    if (phi > Math.PI / 2)
        phi = Math.PI / 2;
    if (phi < -Math.PI / 2)
        phi = -Math.PI / 2;
    if (theta > Math.PI )
        theta = Math.PI ;
    if (theta < -Math.PI)
        theta = -Math.PI;


    //Sun lights the earth
    spotLight.position.set(sphere1X, sphere1Y, sphere1Z);




    var timer = 0.00000000000002 * Date.now();
    if (frame < positionVelocityArray.length - 1 )
        sphere2.rotation.y +=  timer;

    if (autoRotate)
    {
        theta0 += 0.001;
        if (theta0 > Math.PI)
            theta0 = -Math.PI;

        if (phiAscending)
        {
            phi0 += 0.001;
            if (phi0 > Math.PI / 2)
            {
                phi0 = Math.PI / 2
                phiAscending = false
            }
        }
        else
        {
            phi0 -= 0.001;
            if (phi0 < 0)
            {
                phi0 = 0;
                phiAscending = true;
            }
        }
    }

    //theta = theta0 - delta_theta;
    //phi = phi0 + delta_phi;
    camera_x = distance * Math.sin(theta)*Math.cos(phi);
    camera_z = distance * Math.cos(theta)*Math.cos(phi);
    camera_y = distance * Math.sin(phi);
    camera.position.x = camera_x;
    camera.position.z = camera_z;
    camera.position.y = camera_y;
    //camera.lookAt( sphere1.position );
    camera.lookAt( scene.position );
    renderer.render( scene, camera );
}

function setTheta(value)
{
    theta0 = value;
}

function setPhi(value)
{
    phi0 = value;
}

function setDistance(value)
{
    distance = -value + 2600;
}

function onDocumentMouseDown(x, y) {
    start_x = x;
    start_y = y;
    end_x = x;
    end_y = y;
    theta0 = theta;
    phi0 = phi;
    delta_theta = 0;
    delta_phi = 0;
    dragging = true;
}

function onDocumentMouseUp(x, y) {
    end_x = x;
    end_y = y;
    theta0 = theta;
    phi0 = phi;
    dragging = false;
}

function onDocumentMouseMove(x, y) {
    end_x = x;
    end_y = y;
}

function resetView()
{
    theta0 = -Math.PI / 8;
    phi0 = Math.PI / 4;
    distance = 1300;
}

function maxZRotation()
{
    setPhi(90);
}

function initVariables()
{
    //theta = theta0  = -Math.PI / 18;
    theta = theta0 = Math.PI / 4;
    delta_theta = 0.0;
    phi = phi0 = Math.PI / 4;
    delta_phi = 0.0;
    distance = 1295
    camera_x = distance*Math.sin(theta);
    camera_z = distance*Math.cos(theta);
    camera_y = distance * Math.sin(phi);

    dragging = false;
    start_x = start_y = end_x = end_y =  0;

    //    m1 = 1.988e+30;
    //    m2 = 5.9726e+24;
    //    Mass1PositionX = 0;
    //    Mass1PositionY = 0;
    //    Mass1PositionZ = 0;
    //    Mass2PositionX = 149.6e+6;
    //    Mass2PositionY = 2;
    //    Mass2PositionZ = 0;
    //    Mass1VelocityX = -220000;
    //    Mass1VelocityY = 0;
    //    Mass1VelocityZ = 5;
    //    Mass2VelocityX = -220000;
    //    Mass2VelocityY = 2;
    //    Mass2VelocityZ = 5-29.78;

    scaleFactor = 1000000;

    m1 = 1.988e+30 / scaleFactor;
    m2 = 5.9726e+24 / scaleFactor;
    Mass1PositionX = 0;
    Mass1PositionY = 0;
    Mass1PositionZ = 0;
    Mass2PositionX = 149.6e+6 / scaleFactor;
    Mass2PositionY = 0;
    Mass2PositionZ = 0;
    Mass1VelocityX = -10;
    Mass1VelocityY = 0;
    Mass1VelocityZ = 0;
    Mass2VelocityX = -10;
    Mass2VelocityY = 0;
    Mass2VelocityZ = -29.78;


    orbitGeometry2 = new THREE.Geometry();

    orbitMaterial2 = new THREE.LineBasicMaterial({color: 0x4900ff, linewidth: 2});
    autoRotate = true;
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

    var distance1 = Math.sqrt(y[0]*y[0] + y[1]*y[1] + y[2]*y[2]);
    var distance2 = Math.sqrt(y[3]*y[3] + y[4]*y[4] + y[5]*y[5]);
    var maxDistance;
    if (distance1 > distance2)
        maxDistance = distance1;
    else
        maxDistance = distance2;

    rk4(x, xstop, h, y, m1, m2, G, positionVelocityArray, nrows);
    frame = 0;
}

function addLights()
{
    // add subtle ambient lighting
    var ambiColor = "#1c1c1c";
    var ambientLight = new THREE.AmbientLight(ambiColor);
    //scene.add(ambientLight);

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

    var texture = THREE.ImageUtils.loadTexture("qrc:/images/sunmap.jpg");
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

    var geometry3	= new THREE.SphereGeometry(500, 30, 30)
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
            floor = -30000000 / scaleFactor, step = 25;

    // floor - the y (height of the floor)
    //step how close the grid will be
    // 40 -> 5000 / 250
    // this grid goes from -5000 to 5000

    for ( var i = 0; i <= 4000; i ++ ) {

        geometry.vertices.push( new THREE.Vector3( - 50000, floor, i * step - 50000 ) );
        geometry.vertices.push( new THREE.Vector3(   50000, floor, i * step - 50000 ) );

        geometry.vertices.push( new THREE.Vector3( i * step - 50000, floor, -50000 ) );
        geometry.vertices.push( new THREE.Vector3( i * step - 50000, floor,  50000 ) );

    }

    plane = new THREE.Line( geometry, line_material, THREE.LinePieces );
    scene.add( plane );
}

function evaluate(mass1, mass2, x1, y1, z1, x2, y2, z2, velx1, vely1, velz1, velx2, vely2, velz2)
{
    m1 = mass1;
    m2 = mass2;
    Mass1PositionX = x1;
    Mass1PositionY = y1;
    Mass1PositionZ = z1;
    Mass2PositionX = x2;
    Mass2PositionY = y2;
    Mass2PositionZ = z2;
    Mass1VelocityX = velx1;
    Mass1VelocityY = vely1;
    Mass1VelocityZ = velz1;
    Mass2VelocityX = velx2;
    Mass2VelocityY = vely2;
    Mass2VelocityZ = velz2;
    positionVelocityArray = [];
    delete positionVelocityArray;
    positionVelocityArray = null;
    //scene.remove(line);
    //delete line;
    //line = null;
    evaluateArray();
}

function addOrbits()
{
    for (var i = 0; i < positionVelocityArray.length - 1; i++)
    {
        orbitGeometry2.vertices.push(new THREE.Vector3(positionVelocityArray[i][3] - positionVelocityArray[i][0],
                                                       positionVelocityArray[i][4] - positionVelocityArray[i][1],
                                                       positionVelocityArray[i][5] - positionVelocityArray[i][2]));
    }
    lineOrbit2 = new THREE.Line(orbitGeometry2, orbitMaterial2);
    lineOrbit2.name = "lineOrbit2";
    scene.add(lineOrbit2);
}

function setRotate(value)
{
    autoRotate = value;
}

function setRelativeMotion(value)
{
    relativeMotion = value;
    positionVelocityArray = [];
    delete positionVelocityArray;
    positionVelocityArray = null;
    evaluateArray();
}

function setVelFactor(value)
{
    velFactor = value;
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
        scene.add(lineOrbit2);
        scene.add(axes);
        scene.add(plane);
    }
    else
    {
        scene.remove(lineOrbit2);
        scene.remove(axes);
        scene.remove(plane);
    }
}
