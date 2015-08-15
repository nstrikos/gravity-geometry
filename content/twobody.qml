import QtQuick 2.0
import QtCanvas3D 1.0
import QtQuick.Controls 1.3
import QtQuick.Layouts 1.1

import "../twobody.js" as GLCode

Rectangle {
    id: mainview
    width: 1280
    height: 768
    color: "#000000"
    opacity: 1
    visible: true


//    property bool dragging
    property int userInfoWidth
    property bool autoRotate : true
    property bool relativeMotion : false
    userInfoWidth: 300

//    function setDragging(value) {
//        mainview.dragging = value;
//    }



    SplitView {
        id: splitView
        anchors.fill: parent
        orientation: Qt.Horizontal

        Item {
            id: controlsItem
            width : mainview.width / 3
            Layout.maximumWidth: 200
            Layout.minimumWidth: 10
            Flickable {
                id: flickable
                anchors.fill: parent
                flickableDirection: Flickable.VerticalFlick
                clip: true

//                Label {
//                    id: xLabel
//                    color: "#ffffff"
//                    text: "Rotate x axis"
//                }
//                Slider {
//                    id: thetaSlider
//                    anchors.top: xLabel.bottom
//                    value: Math.PI / 8;
//                    activeFocusOnPress: true
//                    maximumValue: Math.PI
//                    minimumValue: -Math.PI
//                    height: 20
//                    width: parent.width
//                    onValueChanged: {
//                        if (mainview.dragging == false)
//                            GLCode.setTheta(thetaSlider.value)
//                    }
//                    function setTheta(value)
//                    {
//                        thetaSlider.value = value;
//                    }
//                }
//                Label {
//                    id: zLabel
//                    color: "#ffffff"
//                    text: "Rotate z axis"
//                    anchors.top: thetaSlider.bottom
//                }
//                Slider {
//                    id: phiSlider
//                    value: Math.PI / 4;
//                    activeFocusOnPress: true
//                    minimumValue: -Math.PI / 2
//                    maximumValue: Math.PI / 2
//                    height: 20
//                    width: parent.width
//                    anchors.top: zLabel.bottom
//                    onValueChanged: {
//                        if (mainview.dragging == false)
//                            GLCode.setPhi(phiSlider.value)
//                    }

//                    function setPhi(value)
//                    {
//                        phiSlider.value = value;
//                    }
//                }
                Label {
                    id: distanceLabel
                    color: "#ffffff"
                    text: "Zoom"
                    //anchors.top: phiSlider.bottom
                }
                Slider {
                    id: distanceSlider
                    value: 8000
                    activeFocusOnPress: true
                    stepSize: 1
                    minimumValue: 1
                    maximumValue: 12000
                    height: 20
                    width: parent.width
                    anchors.top: distanceLabel.bottom
                    onValueChanged: GLCode.setDistance(distanceSlider.value)
                }

                Button {
                    id: autoRotateButton
                    text: "Auto rotate on"
                    anchors.top: distanceSlider.bottom
                    anchors.topMargin: 20
                    width:parent.width
                    onClicked:
                    {
                        if (autoRotate == true)
                        {
                            autoRotate = false;
                            autoRotateButton.text = "Auto rotate off";
                        }
                        else
                        {
                            autoRotate = true;
                            autoRotateButton.text = "Auto rotate on";
                        }
                        GLCode.setRotate(autoRotate);
                    }
                }
                Button {
                    id: relativeMotionButton
                    text: "Relative motion off"
                    anchors.top: autoRotateButton.bottom
                    anchors.topMargin: 20
                    width:parent.width
                    onClicked:
                    {
                        if (relativeMotion == true)
                        {
                            relativeMotion = false;
                            relativeMotionButton.text = "Relative motion off";
                        }
                        else
                        {
                            relativeMotion = true;
                            relativeMotionButton.text = "Relative motion on";
                        }
                        GLCode.setRelativeMotion(relativeMotion);
                    }
                }

                Button {
                    id: evaluateButton
                    width:parent.width
                    anchors.top: relativeMotionButton.bottom
                    anchors.topMargin: 20
                    anchors.left : parent.left
                    text:"Evaluate"
                    onClicked: {
                        var mass1 = m1Slider.value * 1e24;
                        var mass2 = m2Slider.value * 1e24;
                        var x1 = mass1XSlider.value;
                        var y1 = mass1YSlider.value;
                        var z1 = mass1ZSlider.value;
                        var x2 = mass2XSlider.value;
                        var y2 = mass2YSlider.value;
                        var z2 = mass2ZSlider.value;
                        var velx1 = m1VelXSlider.value;
                        var vely1 = m1VelYSlider.value;
                        var velz1 = m1VelZSlider.value;
                        var velx2 = m2VelXSlider.value;
                        var vely2 = m2VelYSlider.value;
                        var velz2 = m2VelZSlider.value;
                        GLCode.evaluate(mass1, mass2, x1, y1, z1, x2, y2, z2,
                                        velx1, vely1, velz1, velx2, vely2, velz2);
                    }
                }
                Button {
                    id: setMassesButton
                    width: parent.width
                    anchors.top: evaluateButton.bottom
                    anchors.topMargin: 20
                    text: "Set object masses"
                    onClicked: {
                        if (setMassesItem.width == 0)
                            setMassesItem.width = userInfoWidth
                        else
                        {
                            userInfoWidth = setMassesItem.width
                            setMassesItem.width = 0
                        }
                    }
                }
                Button {
                    id: setPositionsButton
                    width: parent.width
                    anchors.top: setMassesButton.bottom
                    anchors.topMargin: 20
                    text: "Set objects position"
                    onClicked: {
                        if (setObjectsPositionItem.width == 0)
                            setObjectsPositionItem.width = userInfoWidth
                        else
                        {
                            userInfoWidth = setObjectsPositionItem.width
                            setObjectsPositionItem.width = 0
                        }
                    }
                }
                Button {
                    id: setVelocitiesButton
                    width: parent.width
                    anchors.top: setPositionsButton.bottom
                    anchors.topMargin: 20
                    text: "Set objects velocity"
                    onClicked: {
                        if (setObjectsVelocitiesItem.width == 0)
                            setObjectsVelocitiesItem.width = userInfoWidth
                        else
                        {
                            userInfoWidth = setObjectsVelocitiesItem.width
                            setObjectsVelocitiesItem.width = 0
                        }
                    }
                }
            }
        }

        Item {
            id: canvasItem
            Layout.minimumWidth: 50
            Layout.fillWidth: true

            Canvas3D {
                id: canvas3d
                width: parent.width
                height: parent.height
                onInitializeGL: {
                    GLCode.initializeGL(canvas3d, eventSource);
                }
                onPaintGL: {
                    GLCode.paintGL(canvas3d);
                }
                onResizeGL: {
                    GLCode.resizeGL(canvas3d);
                }
                ControlEventSource {
                    anchors.fill: parent
                    focus: true
                    id: eventSource
                }
            }
        }

        Item {
            id : setMassesItem
            width: 0
            Flickable {
                anchors.fill: parent
                //contentHeight: contentItem.childrenRect.height
                flickableDirection: Flickable.VerticalFlick
                clip: true

                Label {
                    id: m1Label
                    color: "#ffffff"
                    text: "Mass1 "
                    //anchors.top: evaluateButton.bottom
                    anchors.topMargin: 20
                }
                Slider {
                    id: m1Slider
                    value: 100
                    activeFocusOnPress: true
                    stepSize: 1
                    minimumValue: 1
                    maximumValue: 100
                    height: 40
                    width: parent.width
                    anchors.top: m1Label.bottom
                    onValueChanged: {
                        var i = m1Slider.value * 1e24;
                        m1Label.text = "Mass1 : " + i.toExponential(0)
                    }
                }
                Label {
                    id: m2Label
                    color: "#ffffff"
                    text: "Mass2 "
                    anchors.top: m1Slider.bottom
                }
                Slider {
                    id: m2Slider
                    value: 10
                    activeFocusOnPress: true
                    stepSize: 1
                    minimumValue: 1
                    maximumValue: 100
                    height: 40
                    width: parent.width
                    anchors.top: m2Label.bottom
                    onValueChanged: {
                        var i = m2Slider.value * 1e24;
                        m2Label.text = "Mass2 : " + i.toExponential(0)
                    }
                }

            }
        }
        Item {
            id : setObjectsPositionItem
            width: 0
            Flickable {
                anchors.fill: parent
                //contentHeight: contentItem.childrenRect.height
                flickableDirection: Flickable.VerticalFlick
                clip: true

                Label {
                    id: m1PositionXLabel
                    color: "#ffffff"
                    text: "Mass1 Position X: 0"
                    //anchors.top: evaluateButton.bottom
                }
                Slider {
                    id: mass1XSlider
                    value: 0
                    activeFocusOnPress: true
                    stepSize: 1
                    minimumValue: -3000
                    maximumValue: 3000
                    height: 40
                    width: parent.width
                    anchors.top: m1PositionXLabel.bottom
                    onValueChanged: {
                        m1PositionXLabel.text = "Mass1 Position X: " + mass1XSlider.value
                    }
                }
                Label {
                    id: m1PositionYLabel
                    color: "#ffffff"
                    text: "Mass1 Position Y: 0"
                    anchors.top: mass1XSlider.bottom
                }
                Slider {
                    id: mass1YSlider
                    value: 0
                    activeFocusOnPress: true
                    stepSize: 1
                    minimumValue: -3000
                    maximumValue: 3000
                    height: 40
                    width: parent.width
                    anchors.top: m1PositionYLabel.bottom
                    onValueChanged: {
                        m1PositionYLabel.text = "Mass1 Position Y: " + mass1YSlider.value
                    }
                }
                Label {
                    id: m1PositionZLabel
                    color: "#ffffff"
                    text: "Mass1 Position Z: 0"
                    anchors.top: mass1YSlider.bottom
                }
                Slider {
                    id: mass1ZSlider
                    value: 0
                    activeFocusOnPress: true
                    stepSize: 1
                    minimumValue: -3000
                    maximumValue: 3000
                    height: 40
                    width: parent.width
                    anchors.top: m1PositionZLabel.bottom
                    onValueChanged: {
                        m1PositionZLabel.text = "Mass1 Position Z: " + mass1ZSlider.value
                    }
                }
                Label {
                    id: m2PositionXLabel
                    color: "#ffffff"
                    text: "Mass2 Position X: 0"
                    anchors.top: mass1ZSlider.bottom
                }
                Slider {
                    id: mass2XSlider
                    value: 0
                    activeFocusOnPress: true
                    stepSize: 1
                    minimumValue: -3000
                    maximumValue: 3000
                    height: 40
                    width: parent.width
                    anchors.top: m2PositionXLabel.bottom
                    onValueChanged: {
                        m2PositionXLabel.text = "Mass2 Position X: " + mass2XSlider.value
                    }
                }
                Label {
                    id: m2PositionYLabel
                    color: "#ffffff"
                    text: "Mass2 Position Y: 0"
                    anchors.top: mass2XSlider.bottom
                }
                Slider {
                    id: mass2YSlider
                    value: -3000
                    activeFocusOnPress: true
                    stepSize: 1
                    minimumValue: -3000
                    maximumValue: 3000
                    height: 40
                    width: parent.width
                    anchors.top: m2PositionYLabel.bottom
                    onValueChanged: {
                        m2PositionYLabel.text = "Mass2 Position Y: " + mass2YSlider.value
                    }
                }
                Label {
                    id: m2PositionZLabel
                    color: "#ffffff"
                    text: "Mass2 Position Z: 0"
                    anchors.top: mass2YSlider.bottom
                }
                Slider {
                    id: mass2ZSlider
                    value: -3000
                    activeFocusOnPress: true
                    stepSize: 1
                    minimumValue: -3000
                    maximumValue: 3000
                    height: 40
                    width: parent.width
                    anchors.top: m2PositionZLabel.bottom
                    onValueChanged: {
                        m2PositionZLabel.text = "Mass2 Position Z: " + mass2ZSlider.value

                    }
                }
            }
        }
        Item {
            id : setObjectsVelocitiesItem
            width: 0
            Flickable {
                anchors.fill: parent
                //contentHeight: contentItem.childrenRect.height
                flickableDirection: Flickable.VerticalFlick
                clip: true
                Label {
                    id: m1VelXLabel
                    color: "#ffffff"
                    text: "Mass1 Velocity X: 0"
                    //anchors.top: mass2ZSlider.bottom
                }
                Slider {
                    id: m1VelXSlider
                    value: 0
                    activeFocusOnPress: true
                    stepSize: 1
                    minimumValue: -300
                    maximumValue: 300
                    height: 20
                    width: parent.width
                    anchors.top: m1VelXLabel.bottom
                    onValueChanged: {
                        m1VelXLabel.text = "Mass1 Velocity X: " + m1VelXSlider.value
                    }
                }
                Label {
                    id: m1VelYLabel
                    color: "#ffffff"
                    text: "Mass1 Velocity Y: 5"
                    anchors.top: m1VelXSlider.bottom
                }
                Slider {
                    id: m1VelYSlider
                    value: 5
                    activeFocusOnPress: true
                    stepSize: 1
                    minimumValue: -300
                    maximumValue: 300
                    height: 20
                    width: parent.width
                    anchors.top: m1VelYLabel.bottom
                    onValueChanged: {
                        m1VelYLabel.text = "Mass1 Velocity Y: " + m1VelYSlider.value
                    }
                }
                Label {
                    id: m1VelZLabel
                    color: "#ffffff"
                    text: "Mass1 Velocity Z: 0"
                    anchors.top: m1VelYSlider.bottom
                }
                Slider {
                    id: m1VelZSlider
                    value: 0
                    activeFocusOnPress: true
                    stepSize: 1
                    minimumValue: -300
                    maximumValue: 300
                    height: 20
                    width: parent.width
                    anchors.top: m1VelZLabel.bottom
                    onValueChanged: {
                        m1VelZLabel.text = "Mass1 Velocity Z: " + m1VelZSlider.value
                    }
                }
                Label {
                    id: m2VelXLabel
                    color: "#ffffff"
                    text: "Mass2 Velocity X: 12"
                    anchors.top: m1VelZSlider.bottom
                }
                Slider {
                    id: m2VelXSlider
                    value: 12
                    activeFocusOnPress: true
                    stepSize: 1
                    minimumValue: -300
                    maximumValue: 300
                    height: 20
                    width: parent.width
                    anchors.top: m2VelXLabel.bottom
                    onValueChanged: {
                        m2VelXLabel.text = "Mass2 Velocity X: " + m2VelXSlider.value
                    }
                }
                Label {
                    id: m2VelYLabel
                    color: "#ffffff"
                    text: "Mass2 Velocity Y: -3"
                    anchors.top: m2VelXSlider.bottom
                }
                Slider {
                    id: m2VelYSlider
                    value: -3
                    activeFocusOnPress: true
                    stepSize: 1
                    minimumValue: -300
                    maximumValue: 300
                    height: 20
                    width: parent.width
                    anchors.top: m2VelYLabel.bottom
                    onValueChanged: {
                        m2VelYLabel.text = "Mass2 Velocity Y: " + m2VelYSlider.value
                    }
                }
                Label {
                    id: m2VelZLabel
                    color: "#ffffff"
                    text: "Mass2 Velocity Z: 12"
                    anchors.top: m2VelYSlider.bottom
                }
                Slider {
                    id: m2VelZSlider
                    value: 12
                    activeFocusOnPress: true
                    stepSize: 1
                    minimumValue: -300
                    maximumValue: 300
                    height: 20
                    width: parent.width
                    anchors.top: m2VelZLabel.bottom
                    onValueChanged: {
                        m2VelZLabel.text = "Mass2 Velocity Z: " + m2VelZSlider.value
                    }
                }
                Label {
                    id: velFactorLabel
                    color: "#ffffff"
                    text: "Velocity display factor"
                    anchors.top: m2VelZSlider.bottom
                }
                Slider {
                    id: velFactorSlider
                    value: 80
                    activeFocusOnPress: true
                    stepSize: 1
                    minimumValue: 0
                    maximumValue: 100
                    height: 20
                    width: parent.width
                    anchors.top: velFactorLabel.bottom
                    onValueChanged: {
                        GLCode.setVelFactor(velFactorSlider.value)
                    }
                }
            }
        }
    }
    Component.onCompleted: {
        //GLCode.thetaSender.thetaChanged.connect(thetaSlider.setTheta);
        //GLCode.draggingSender.draggingSignal.connect(mainview.setDragging);
        //GLCode.phiSender.phiChanged.connect(phiSlider.setPhi);
        //We set here the flickable content height property
        //because of a binding property issue
        flickable.contentHeight = flickable.contentItem.childrenRect.height;
    }
}

