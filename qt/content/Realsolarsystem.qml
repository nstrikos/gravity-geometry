import QtQuick 2.0
import QtCanvas3D 1.0
import QtQuick.Controls 1.3
import QtQuick.Layouts 1.1

import "../realsolarsystem.js" as GLCode

Rectangle {
    id: mainview
    width: 1280
    height: 768
    color: "#000000"
    opacity: 1
    visible: true

    property bool showOrbits : true

    SplitView {
        id: splitView
        anchors.fill: parent
        orientation: Qt.Horizontal

        Item {
            id: controlsItem
            width : mainview.width / 3
            Layout.maximumWidth: 350
            Layout.minimumWidth: 10
            Flickable {
                id: flickable
                anchors.fill: parent
                flickableDirection: Flickable.VerticalFlick
                clip: true
                Button {
                    id: restartButton
                    text: "Restart"
                    anchors.top: parent.top
                    anchors.topMargin: 20
                    width:parent.width
                    onClicked:
                    {
                        GLCode.restart();
                    }
                }
                Button {
                    id: showOrbitsButton
                    text: "Hide orbit"
                    anchors.top: restartButton.bottom
                    anchors.topMargin: 20
                    width:parent.width
                    onClicked:
                    {
                        if (showOrbits)
                        {
                            showOrbits = false;
                            showOrbitsButton.text = "Show orbit";
                        }
                        else
                        {
                            showOrbits = true;
                            showOrbitsButton.text = "Hide orbit";
                        }
                        GLCode.setShowOrbits(showOrbits);
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
    }
    Component.onCompleted: {
        //We set here the flickable content height property
        //because of a binding property issue
        flickable.contentHeight = flickable.contentItem.childrenRect.height;
    }
}

