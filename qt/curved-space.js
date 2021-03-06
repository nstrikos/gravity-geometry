
Qt.include("three.js")
Qt.include("orbit.js")

var camera, scene, renderer;
var distance;
var theta;
var phi;
var camera_x, camera_y, camera_z;
var dragging;
var start_x, start_y, end_x, end_y;
var theta0, phi0, delta_theta, delta_phi;
var frame = 0;
var positionVelocityArray;
var runSimulation = true;
var sphere1;
var sphere2;
var spotLight;
var spotLight2;
var phiAscending = true;
var m1, m2, Mass1PositionX, Mass1PositionY, Mass1PositionZ, Mass2PositionX, Mass2PositionY, Mass2PositionZ;
var Mass1VelocityX, Mass1VelocityY, Mass1VelocityZ, Mass2VelocityX, Mass2VelocityY, Mass2VelocityZ;
var orbitGeometry, lineOrbit, orbitMaterial;
var orbitGeometry2, lineOrbit2, orbitMaterial2;
var velGeometry, velGeometry2, velLine, velLine2, velMaterial;
var autoRotate, relativeMotion;
var velFactor;
var sphereRadius;
var depth;
var x, xstop, h, G;
var axes;

var thetaSender = Qt.createQmlObject('import QtQuick 2.0; QtObject { signal thetaChanged(double value) }', Qt.application, 'ThetaSender');
var phiSender = Qt.createQmlObject('import QtQuick 2.0; QtObject { signal phiChanged(double value) }', Qt.application, 'PhiSender');
var draggingSender = Qt.createQmlObject('import QtQuick 2.0; QtObject { signal draggingSignal(bool value) }', Qt.application, 'DraggingSender');


function initializeGL(canvas, eventSource) {

    scene = new THREE.Scene();

    initVariables();
    evaluateArray();

    //This is very important
    //Set camera length

    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 10, 50000 );
    camera.target = new THREE.Vector3(0, 0, 0);
    camera.position.set( camera_x, camera_y, camera_z);


    addReferencePlane();
    addGraph();
    addSpheres();
    addLights();
    addOrbits();
    addVelocities();

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
        if (runSimulation == true)
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


    sphere1X = 0;
    sphere1Y = 0;
    sphere1Z = 0;
    sphere1VelX = 0;
    sphere1VelY = 0;
    sphere1VelZ = 0;
    sphere2X = positionVelocityArray[frame][3] - positionVelocityArray[frame][0];
    //sphere2Y = positionVelocityArray[frame][4] - positionVelocityArray[frame][1];
    sphere2Z = positionVelocityArray[frame][5] - positionVelocityArray[frame][2];
    sphere2Y = planeFunction(sphere2X, sphere2Z);
    sphere2VelX = positionVelocityArray[frame][9] - positionVelocityArray[frame][6];
    sphere2VelY = positionVelocityArray[frame][10] - positionVelocityArray[frame][7];
    sphere2VelZ = positionVelocityArray[frame][11] - positionVelocityArray[frame][8];


    sphere1.position.x = sphere1X;
    sphere1.position.y = -depth + sphereRadius;
    sphere1.position.z = sphere1Z;
    sphere2.position.x = sphere2X;
    sphere2.position.y = planeFunction(sphere2X, sphere2Z) + sphereRadius;
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

    thetaSender.thetaChanged(theta);
    phiSender.phiChanged(phi);

    camera_x = distance * Math.sin(theta)*Math.cos(phi);
    camera_z = distance * Math.cos(theta)*Math.cos(phi);
    camera_y = distance * Math.sin(phi);
    camera.position.x = camera_x;
    camera.position.z = camera_z;
    camera.position.y = camera_y;

    //Light two spheres
    spotLight.position.set(camera_x, camera_y, camera_z);
    spotLight2.position.set(camera_x, camera_y, camera_z);

    camera.lookAt( scene.position );

    //    var timer = 0.00000000000002 * Date.now();
    //    if (frame < positionVelocityArray.length - 1 )
    //        sphere2.rotation.y +=  timer;

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
            if (phi0 < - Math.PI / 2)
            {
                phi0 = -Math.PI / 2;
                phiAscending = true;
            }
        }
    }



    for (var i = frame - 1; i < positionVelocityArray.length - 1; i++)
    {
        orbitGeometry.dynamic = true;
        orbitGeometry2.dynamic = true;
        orbitGeometry.vertices[i].x = sphere1X;
        orbitGeometry.vertices[i].y = sphere1Y;
        orbitGeometry.vertices[i].z = sphere1Z;
        orbitGeometry2.vertices[i].x = sphere2X;
        orbitGeometry2.vertices[i].y = sphere2Y + 15;
        orbitGeometry2.vertices[i].z = sphere2Z;
    }
    orbitGeometry.verticesNeedUpdate = true;
    orbitGeometry2.verticesNeedUpdate = true;

    velGeometry.vertices[0].x = sphere1X;
    velGeometry.vertices[0].y = sphere1Y;
    velGeometry.vertices[0].z = sphere1Z;
    velGeometry.vertices[1].x = sphere1X + sphere1VelX * velFactor;
    velGeometry.vertices[1].y = sphere1Y + sphere1VelY * velFactor;
    velGeometry.vertices[1].z = sphere1Z + sphere1VelZ * velFactor;
    velGeometry.verticesNeedUpdate = true;
    velGeometry2.vertices[0].x = sphere2X;
    velGeometry2.vertices[0].y = sphere2Y;
    velGeometry2.vertices[0].z = sphere2Z;
    velGeometry2.vertices[1].x = sphere2X + sphere2VelX * velFactor;
    velGeometry2.vertices[1].y = sphere2Y + sphere2VelY * velFactor;
    velGeometry2.vertices[1].z = sphere2Z + sphere2VelZ * velFactor;
    velGeometry2.verticesNeedUpdate = true;


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
    distance = 16000 - value;
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
    draggingSender.draggingSignal(true);
}

function onDocumentMouseUp(x, y) {
    end_x = x;
    end_y = y;
    theta0 = theta;
    phi0 = phi;
    dragging = false;
    draggingSender.draggingSignal(false);
}

function onDocumentMouseMove(x, y) {
    end_x = x;
    end_y = y;
}

function resetView()
{
    theta0 = -Math.PI / 8;
    phi0 = Math.PI / 4;
    distance = 8000;
}

function maxZRotation()
{
    setPhi(90);
}

function initVariables()
{
    //theta = theta0  = -Math.PI / 18;
    theta = theta0 = Math.PI / 8;
    delta_theta = 0.0;
    phi = phi0 = Math.PI / 4;
    delta_phi = 0.0;
    distance = 8000;
    camera_x = distance*Math.sin(theta);
    camera_z = distance*Math.cos(theta);
    camera_y = distance * Math.sin(phi);

    dragging = false;
    start_x = start_y = end_x = end_y =  0;

    depth = 2000;
    sphereRadius = 250;

    x = 0;
    xstop = 540;
    h = 1;
    G = 6.67384e-20;

    m1 = 1e+25;
    m2 = 1e+25;
    Mass1PositionX = 5000;
    Mass1PositionY = 0;
    Mass1PositionZ = 1000;
    Mass2PositionX = 0;
    Mass2PositionY = 0;
    Mass2PositionZ = 0;
    Mass1VelocityX = -60;
    Mass1VelocityY = 0;
    Mass1VelocityZ = 0;
    Mass2VelocityX = 0;
    Mass2VelocityY = 0;
    Mass2VelocityZ = 0;

    velFactor = 80;

    orbitGeometry = new THREE.Geometry();
    orbitGeometry2 = new THREE.Geometry();

    orbitMaterial = new THREE.LineBasicMaterial({color: 0xff0049, linewidth: 2});
    orbitMaterial2 = new THREE.LineBasicMaterial({color: 0x4900ff, linewidth: 2});

    velGeometry = new THREE.Geometry();
    velGeometry2 = new THREE.Geometry();
    velMaterial = new THREE.LineBasicMaterial({color: 0x00ffff, linewidth: 2});

    autoRotate = true;
    relativeMotion = true;
}

function evaluateArray()
{
    //var m1 = 1e+26;
    //var m2 = 1e+25;
    var x = 0;
    var xstop = 3000;
    var h = 1;
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

function addLights() {
    // add subtle ambient lighting
    var ambiColor = "#1c1c1c";
    var ambientLight = new THREE.AmbientLight(ambiColor);
    scene.add(ambientLight);

    var spotColor = "#8f8f8f";
    spotLight = new THREE.SpotLight(spotColor);
    spotLight.position.set(0, 0, 0);
    spotLight.castShadow = true;
    spotLight.target = sphere1;
    scene.add(spotLight);
    console.log("SpotLight 1 added");

    spotLight2 = new THREE.SpotLight(spotColor);
    spotLight2.position.set(0, 0, 0);
    spotLight2.castShadow = true;
    spotLight2.target = sphere2;
    scene.add(spotLight2);
    console.log("SpotLight 2 added");
}

function planeFunction(x, z) {
    return -depth * Math.exp( -(x*x + z*z) / 4000000 );
}

function addGraph()    {
    var xMax = 6000.0;
    var xMin = -6000.0;
    var yMax = 6000.0;
    var yMin = -6000.0;
    var segments = 100;
    var graphMesh;
    var wireMaterial;
    var xRange = xMax - xMin;
    var yRange = yMax - yMin;
    //zFunc = Parser.parse(zFuncText).toJSFunction( ['x','y'] );
    var meshFunction = function(x, y)
    {
        x = xRange * x + xMin;
        y = yRange * y + yMin;
        //var z = zFunc(x,y); //= Math.cos(x) * Math.sqrt(y);
        var z = planeFunction(x, y);
        if ( isNaN(z) )
            return new THREE.Vector3(0,0,0); // TODO: better fix
        else
            return new THREE.Vector3(x, y, z);
    };

    // true => sensible image tile repeat...
    var graphGeometry = new THREE.ParametricGeometry( meshFunction, segments, segments, true );

    ///////////////////////////////////////////////
    // calculate vertex colors based on Z values //
    ///////////////////////////////////////////////
    graphGeometry.computeBoundingBox();
    var zMin = graphGeometry.boundingBox.min.z;
    var zMax = graphGeometry.boundingBox.max.z;
    var zRange = zMax - zMin;
    var color, point, face, numberOfSides, vertexIndex;
    // faces are indexed using characters
    var faceIndices = [ 'a', 'b', 'c', 'd' ];
    // first, assign colors to vertices as desired
    for ( var i = 0; i < graphGeometry.vertices.length; i++ )
    {
        point = graphGeometry.vertices[ i ];
        color = new THREE.Color( 0x0000ff );
        color.setHSL( 0.7 * (zMax - point.z) / zRange, 1, 0.5 );
        graphGeometry.colors[i] = color; // use this array for convenience
    }
    // copy the colors as necessary to the face's vertexColors array.
    for ( var i = 0; i < graphGeometry.faces.length; i++ )
    {
        face = graphGeometry.faces[ i ];
        numberOfSides = ( face instanceof THREE.Face3 ) ? 3 : 4;
        for( var j = 0; j < numberOfSides; j++ )
        {
            vertexIndex = face[ faceIndices[ j ] ];
            //face.vertexColors[ j ] = graphGeometry.colors[ vertexIndex ];
            face.vertexColors[ j ] = new THREE.Color( 0xCFCFCF);
        }
    }
    ///////////////////////
    // end vertex colors //
    ///////////////////////

    // material choices: vertexColorMaterial, wireMaterial , normMaterial , shadeMaterial

    if (graphMesh)
    {
        scene.remove( graphMesh );
        // renderer.deallocateObject( graphMesh );
    }

    // "wireframe texture"
    var wireTexture = new THREE.ImageUtils.loadTexture( '../images/square.png' );
    wireTexture.wrapS = wireTexture.wrapT = THREE.RepeatWrapping;
    wireTexture.repeat.set( 40, 40 );
    wireMaterial = new THREE.MeshBasicMaterial( { map: wireTexture, vertexColors: THREE.VertexColors, side:THREE.DoubleSide } );
    wireMaterial = new THREE.MeshPhongMaterial( { map: wireTexture, vertexColors: THREE.VertexColors, side:THREE.DoubleSide } );

    wireMaterial.map.repeat.set( segments, segments );

    var material = new THREE.MeshPhongMaterial( { color: 0x880088, side:THREE.DoubleSide } );

    graphMesh = new THREE.Mesh( graphGeometry, wireMaterial );
    //graphMesh = new THREE.Mesh( graphGeometry, material );
    graphMesh.doubleSided = true;
    scene.add(graphMesh);
    graphMesh.rotation.x -= Math.PI / 2;
}

function addSpheres() {
        var sphereGeometry = new THREE.SphereGeometry(sphereRadius, 20, 20);
        var material = new THREE.MeshPhongMaterial({color: 0xff7777});
        var material2 = new THREE.MeshPhongMaterial({color: 0x7777ff});
        sphere1 = new THREE.Mesh(sphereGeometry, material);
        sphere1.name = "sphere1";
        scene.add(sphere1);
        console.log("sphere1 added");
        sphere2 = new THREE.Mesh(sphereGeometry, material2);
        sphere2.name = "sphere2";
        scene.add(sphere2);
        console.log("sphere2 added");
    }

function addReferencePlane() {

        axes = new THREE.AxisHelper(5000);
        axes.position.set(0, -depth + 1000, 0);
        scene.add(axes);


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
        orbitGeometry.vertices.push(new THREE.Vector3(undefined, undefined, undefined));
        orbitGeometry2.vertices.push(new THREE.Vector3(undefined, undefined, undefined));
    }
    lineOrbit = new THREE.Line(orbitGeometry, orbitMaterial);
    lineOrbit.name = "lineOrbit";
    lineOrbit2 = new THREE.Line(orbitGeometry2, orbitMaterial2);
    lineOrbit2.name = "lineOrbit2";
    scene.add(lineOrbit);
    scene.add(lineOrbit2);

}

function addVelocities()
{
    velGeometry.vertices.push(new THREE.Vector3(undefined, undefined, undefined));
    velGeometry.vertices.push(new THREE.Vector3(undefined, undefined, undefined));
    velLine =  new THREE.Line(velGeometry, velMaterial);
    scene.add(velLine);
    velGeometry2.vertices.push(new THREE.Vector3(undefined, undefined, undefined));
    velGeometry2.vertices.push(new THREE.Vector3(undefined, undefined, undefined));
    velLine2 =  new THREE.Line(velGeometry2, velMaterial);
    scene.add(velLine2);

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
