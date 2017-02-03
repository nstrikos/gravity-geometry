Qt.include("three.js")

var camera, scene, renderer;
var cone, plane, parabolaPlane, circlePlane, ellipsisPlane, hyperbolaPlane;
var distance;
var theta;
var phi;
var camera_x, camera_y, camera_z;
var dragging;
var start_x, start_y, end_x, end_y;
var theta0, phi0, delta_theta, delta_phi;
var coneAngle;
var showPlane;
var showParabola;
var showCircle;
var showEllipse;
var showHyperbola;

var thetaSender = Qt.createQmlObject('import QtQuick 2.0; QtObject { signal thetaChanged(int value) }', Qt.application, 'ThetaSender');
var phiSender = Qt.createQmlObject('import QtQuick 2.0; QtObject { signal phiChanged(int value) }', Qt.application, 'PhiSender');
var draggingSender = Qt.createQmlObject('import QtQuick 2.0; QtObject { signal draggingSignal(bool value) }', Qt.application, 'DraggingSender');


function initializeGL(canvas, eventSource) {
    theta = theta0 = Math.PI / 4;
    phi = phi0 = Math.PI / 4;
    distance = 400;
    camera_x = distance*Math.sin(theta);
    camera_z = distance*Math.cos(theta);
    camera_y = 0;
    dragging = false;
    start_x = start_y = end_x = end_y = 0;
    showParabola = false;
    showCircle = false;
    showPlane = true;

    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 0.1, 1000 );
    camera.position.set( camera_x, camera_y, camera_z);

    scene = new THREE.Scene();

    // Grid

    var line_material = new THREE.LineBasicMaterial( { color: 0x303030 } ),
            geometry = new THREE.Geometry(),
            floor = -75, step = 25;

    for ( var i = 0; i <= 40; i ++ ) {

        geometry.vertices.push( new THREE.Vector3( - 500, floor, i * step - 500 ) );
        geometry.vertices.push( new THREE.Vector3(   500, floor, i * step - 500 ) );

        geometry.vertices.push( new THREE.Vector3( i * step - 500, floor, -500 ) );
        geometry.vertices.push( new THREE.Vector3( i * step - 500, floor,  500 ) );

    }

    var line = new THREE.Line( geometry, line_material, THREE.LinePieces );
    scene.add( line );


    //var material = new THREE.MeshBasicMaterial( { color: 0x000099, transparent: true, blending: THREE.AdditiveBlending });
    var material = new THREE.MeshPhongMaterial({color: 0x7777ff});
    cone = new THREE.Mesh(new THREE.CylinderGeometry(0, 50, 100, 50, 50, false), material);
    scene.add(cone);

    var pointColor = "#ccffcc";
    var pointLight = new THREE.PointLight(pointColor);
    pointLight.distance = 400;
    //scene.add(pointLight);
    pointLight.position.set(50, 250, 50);
    pointLight.intensity = 1.0;

    // add subtle ambient lighting
    var ambiColor = "#1c1c1c";
    var ambientLight = new THREE.AmbientLight(ambiColor);
    //scene.add(ambientLight);

    var spotColor = "#ffffff";
    var spotLight = new THREE.SpotLight(spotColor);
    spotLight.position.set(40, 260, 10);
    spotLight.castShadow = true;
    spotLight.target = cone;
    scene.add(spotLight);

    var spotLight2 = new THREE.SpotLight(spotColor);
    spotLight2.position.set(40, -260, 10);
    spotLight2.castShadow = true;
    spotLight2.target = cone;
    scene.add(spotLight2);

    var spotLight3 = new THREE.SpotLight(spotColor);
    spotLight3.position.set(0, 0, 240);
    spotLight3.castShadow = true;
    spotLight3.target = cone;
    scene.add(spotLight3);

    var spotLight4 = new THREE.SpotLight(spotColor);
    spotLight4.position.set(0, 0, -240);
    spotLight4.castShadow = true;
    spotLight4.target = cone;
    scene.add(spotLight4);

    var planeGeometry = new THREE.PlaneBufferGeometry(150,150,8,1);
    //var planeMaterial = new THREE.MeshBasicMaterial( { color: 0xff9900, transparent: true, blending: THREE.AdditiveBlending });
    var planeMaterial = new THREE.MeshPhongMaterial({color: 0xff9900});
    plane = new THREE.Mesh(planeGeometry,planeMaterial);
    plane.material.side = THREE.DoubleSide;
    plane.rotation.x=-0.5*Math.PI;
    scene.add(plane);

    var parabolaGeometry = new THREE.PlaneBufferGeometry(150,150,8,1);
    //var parabolaMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00, transparent: true, blending: THREE.AdditiveBlending });
    var parabolaMaterial = new THREE.MeshPhongMaterial({color: 0x00ff00});
    parabolaPlane = new THREE.Mesh(parabolaGeometry,parabolaMaterial);
    parabolaPlane.material.side = THREE.DoubleSide;
    coneAngle = Math.atan2(100,50) - Math.PI / 2;
    parabolaPlane.rotation.x = coneAngle;
    scene.add(parabolaPlane);

    var circleGeometry = new THREE.PlaneBufferGeometry(150,150,8,1);
    //var circleMaterial = new THREE.MeshBasicMaterial( { color: 0xff8888, transparent: true, blending: THREE.AdditiveBlending });
    var circleMaterial = new THREE.MeshPhongMaterial({color: 0xff8888});
    circlePlane = new THREE.Mesh(circleGeometry,circleMaterial);
    circlePlane.material.side = THREE.DoubleSide;
    circlePlane.rotation.x=-0.5*Math.PI;
    scene.add(circlePlane);

    var ellipsisGeometry = new THREE.PlaneBufferGeometry(150,150,8,1);
    //var ellipsisMaterial = new THREE.MeshBasicMaterial( { color: 0x2288ff, transparent: true, blending: THREE.AdditiveBlending });
    var ellipsisMaterial = new THREE.MeshPhongMaterial({color: 0x2288ff});
    ellipsisPlane = new THREE.Mesh(ellipsisGeometry,ellipsisMaterial);
    ellipsisPlane.material.side = THREE.DoubleSide;
    ellipsisPlane.rotation.x=-0.4*Math.PI;
    scene.add(ellipsisPlane);

    var hyperbolaGeometry = new THREE.PlaneBufferGeometry(150,150,8,1);
    //var hyperbolaMaterial = new THREE.MeshBasicMaterial( { color: 0xff2222, transparent: true, blending: THREE.AdditiveBlending });
    var hyperbolaMaterial = new THREE.MeshPhongMaterial({color: 0xff2222});
    hyperbolaPlane = new THREE.Mesh(hyperbolaGeometry,hyperbolaMaterial);
    hyperbolaPlane.material.side = THREE.DoubleSide;
    hyperbolaPlane.rotation.x=-0.05*Math.PI;
    scene.add(hyperbolaPlane);

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

    if (dragging)
    {
        delta_theta = (end_x - start_x) * Math.PI / 180;
        delta_phi = (end_y - start_y) * Math.PI / 180;
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

    thetaSender.thetaChanged(Math.round(theta * 180 / Math.PI));
    phiSender.phiChanged(Math.round(phi * 180 / Math.PI));

    camera_x = distance * Math.sin(theta)*Math.cos(phi);
    camera_z = distance * Math.cos(theta)*Math.cos(phi);
    camera_y = distance * Math.sin(phi);
    camera.position.x = camera_x;
    camera.position.z = camera_z;
    camera.position.y = camera_y;

    camera.lookAt( scene.position );

    var timer = 0.000000000000002 * Date.now();

    plane.rotation.x += timer;

    if (showParabola)
        scene.add(parabolaPlane);
    else
        scene.remove(parabolaPlane);

    if (showPlane)
        scene.add(plane);
    else
        scene.remove(plane);

    if (showCircle)
        scene.add(circlePlane);
    else
        scene.remove(circlePlane);

    if (showEllipse)
        scene.add(ellipsisPlane);
    else
        scene.remove(ellipsisPlane);

    if (showHyperbola)
        scene.add(hyperbolaPlane);
    else
        scene.remove(hyperbolaPlane);

    renderer.render( scene, camera );
}

function setTheta(value)
{
    theta0 = value * Math.PI / 180;
}

function setPhi(value)
{
    phi0 = value * Math.PI / 180;
}

function setDistance(value)
{
    distance = 800 - value;
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

function toggleShowParabola() {
    showParabola = !showParabola;
}

function toggleShowPlane() {
    showPlane = !showPlane;
}

function toggleShowCircle() {
    showCircle = !showCircle;
}

function toggleShowEllipse() {
    showEllipse = !showEllipse;
}

function toggleShowHyperbola() {
    showHyperbola = !showHyperbola;
}

function resetView()
{
    theta0 = Math.PI / 4;
    phi0 = Math.PI / 4;
    distance = 400;
    showPlane = true;
    showCircle = false;
    showParabola = false;
    showEllipse = false;
    showHyperbola = false;
}

function maxZRotation()
{
    setPhi(90);
}
