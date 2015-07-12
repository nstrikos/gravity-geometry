import QtQuick 2.0
import QtCanvas3D 1.0
import QtQuick.Controls 1.3
import QtQuick.Layouts 1.1

import "../gravity.js" as GLCode

Rectangle {
    id: mainview
    width: 1280
    height: 768
    color: "#000000"
    opacity: 1
    visible: true

    property bool dragging
    property int userInfoWidth
    userInfoWidth: 300

    function setDragging(value) {
        mainview.dragging = value;
    }



    SplitView {
        id: splitView
        anchors.fill: parent
        orientation: Qt.Horizontal

        Item {
            id: controlsItem
            width : mainview.width / 3
            Layout.maximumWidth: 150
            Layout.minimumWidth: 10
            Flickable {
                id: flickable
                anchors.fill: parent
                flickableDirection: Flickable.VerticalFlick
                clip: true

                Label {
                    id: xLabel
                    color: "#ffffff"
                    text: "Rotate x axis"
                }
                Slider {
                    id: thetaSlider
                    anchors.top: xLabel.bottom
                    value: 0
                    activeFocusOnPress: true
                    stepSize: 1
                    maximumValue: 180
                    minimumValue: -180
                    height: 40
                    width: parent.width
                    onValueChanged: {
                        if (mainview.dragging == false)
                            GLCode.setTheta(thetaSlider.value)
                    }
                    function setTheta(value)
                    {
                        thetaSlider.value = value;
                    }
                }
                Label {
                    id: zLabel
                    color: "#ffffff"
                    text: "Rotate z axis"
                    anchors.top: thetaSlider.bottom
                }
                Slider {
                    id: phiSlider
                    value: 0
                    activeFocusOnPress: true
                    stepSize: 1
                    minimumValue: -90
                    maximumValue: 90
                    height: 40
                    width: parent.width
                    anchors.top: zLabel.bottom
                    onValueChanged: {
                        if (mainview.dragging == false)
                            GLCode.setPhi(phiSlider.value)
                    }

                    function setPhi(value)
                    {
                        phiSlider.value = value;
                    }
                }
                Label {
                    id: distanceLabel
                    color: "#ffffff"
                    text: "Zoom"
                    anchors.top: phiSlider.bottom
                }
                Slider {
                    id: distanceSlider
                    value: 400
                    activeFocusOnPress: true
                    stepSize: 1
                    minimumValue: 0
                    maximumValue: 800
                    height: 40
                    width: parent.width
                    anchors.top: distanceLabel.bottom
                    onValueChanged: GLCode.setDistance(distanceSlider.value)
                }
                Button {
                    id: resetButton
                    width: parent.width
                    anchors.top: distanceSlider.bottom
                    anchors.topMargin: 20
                    text:"Reset view"
                    onClicked: {
                        GLCode.resetView()
                    }
                }
                Button {
                    id: zMaxButton
                    width: parent.width
                    anchors.top: resetButton.bottom
                    anchors.topMargin: 20
                    text:"Max z rotation"
                    onClicked: {
                        GLCode.maxZRotation()
                    }
                }
                Button {
                    id: circleButton
                    width: parent.width
                    anchors.topMargin: 20
                    anchors.top: zMaxButton.bottom
                    text:"Circle "
                    onClicked: {
                        GLCode.toggleShowCircle()
                    }
                }
                Button {
                    id: parabolaButton
                    width: parent.width
                    anchors.top: circleButton.bottom
                    anchors.topMargin: 20
                    text:"Parabola"
                    onClicked: {
                        GLCode.toggleShowParabola()
                    }
                }
                Button {
                    id: ellipsisButton
                    width: parent.width
                    anchors.topMargin: 20
                    anchors.top: parabolaButton.bottom
                    text:"Ellipse"
                    onClicked: {
                        GLCode.toggleShowEllipse()
                    }
                }
                Button {
                    id: hyperbolaButton
                    width: parent.width
                    anchors.top: ellipsisButton.bottom
                    anchors.topMargin: 20
                    text:"Hyperbola"
                    onClicked: {
                        GLCode.toggleShowHyperbola()
                    }
                }
                Button {
                    id: planeButton
                    width: parent.width
                    anchors.top: hyperbolaButton.bottom
                    anchors.topMargin: 20
                    text:"Show plane"
                    onClicked: {
                        GLCode.toggleShowPlane()
                    }
                }
                Button {
                    id: infoButton
                    width: parent.width
                    anchors.top: planeButton.bottom
                    anchors.topMargin: 20
                    text: "Info"
                    onClicked: {
                        if (infoItem.width == 0)
                            infoItem.width = userInfoWidth
                        else
                        {
                            userInfoWidth = infoItem.width
                            infoItem.width = 0
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
            id : infoItem
            width: 0
            Flickable {
                anchors.fill: parent
                contentHeight: contentItem.childrenRect.height
                flickableDirection: Flickable.VerticalFlick
                clip: true
                Text {
                    color: "#ffffff"
                    width: parent.width
                    text: "Drag the cone to rotate it.
Press the buttons to a plane that produces the corresponding conic section.
Press again to remove the plane.
Press the \"Show plane\" button to show a rotating plane.
Press again to hide it.
Rotate z axis to the maximum to view the cone from above.
This will give a nice view of the conic section and its evolution from circle to hyperbola."
                    font.pointSize: 14
                    verticalAlignment: Text.AlignVCenter
                    horizontalAlignment: Text.AlignJustify
                    textFormat: Text.RichText
                    wrapMode: Text.WrapAtWordBoundaryOrAnywhere
                }
            }
        }
    }
    Component.onCompleted: {
        GLCode.thetaSender.thetaChanged.connect(thetaSlider.setTheta);
        GLCode.draggingSender.draggingSignal.connect(mainview.setDragging);
        GLCode.phiSender.phiChanged.connect(phiSlider.setPhi);

        //We set here the flickable content height property
        //because of a binding property issue
        flickable.contentHeight = flickable.contentItem.childrenRect.height;
    }
}

