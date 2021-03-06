import QtQuick 2.0
import QtCanvas3D 1.1
import QtQuick.Controls 1.3
import QtQuick.Layouts 1.1
import QtQuick.Window 2.0

import "content"

ApplicationWindow {
    id: mainview
    visible: true
    visibility: Window.Maximized
    FontLoader { id: myCustomFont; source: "qrc:/fonts/LiberationSans-Regular.ttf" }


    title: qsTr("Gravity and geometry")
    width: 1280
    height: 800
    color: "#000000"
    opacity: 1

    property bool dragging
    property int userInfoWidth
    userInfoWidth: 250

    function setDragging(value) {
        mainview.dragging = value;
    }

    Rectangle {
        color: "#212126"
        anchors.fill: parent
    }

    toolBar: BorderImage {
        border.bottom: 8
        source: "images/toolbar.png"
        width: parent.width
        height: 100

        Rectangle {
            id: backButton
            width: opacity ? 60 : 0
            anchors.left: parent.left
            anchors.leftMargin: 20
            opacity: stackView.depth > 1 ? 1 : 0
            anchors.verticalCenter: parent.verticalCenter
            antialiasing: true
            height: 60
            radius: 4
            color: backmouse.pressed ? "#222" : "transparent"
            Behavior on opacity { NumberAnimation{} }
            Image {
                anchors.verticalCenter: parent.verticalCenter
                source: "images/navigation_previous_item.png"
            }
            MouseArea {
                id: backmouse
                anchors.fill: parent
                anchors.margins: -10
                onClicked: {
                    stackView.pop()
                    gc()
                }
            }
        }

        Text {
            font.pixelSize: 36
            Behavior on x { NumberAnimation{ easing.type: Easing.OutCubic} }
            x: backButton.x + backButton.width + 20
            anchors.verticalCenter: parent.verticalCenter
            color: "white"
            text: "Gravity & Geometry"
        }
    }

    ListModel {
        id: pageModel
        ListElement {
            title: "Conic sections info"
            page: "content/ConicsInfo.qml"
        }
        ListElement {
            title: "Conic sections in 3D"
            page: "content/Conics.qml"
        }
        ListElement {
            title: "Gravity on the surface of the earth"
            page: "content/Surface.qml"
        }
        ListElement {
            title: "Two body problem"
            page: "content/Twobody.qml"
        }
        ListElement {
            title: "Static solar system"
            page: "content/Solarsystem.qml"
        }
        ListElement {
            title: "Slow solar system"
            page: "content/Slowsolarsystem.qml"
        }
        ListElement {
            title: "Real solar system"
            page: "content/Realsolarsystem.qml"
        }
        ListElement {
            title: "Curved space"
            page: "content/Curved-space.qml"
        }
    }

    StackView {
        id: stackView
        anchors.fill: parent
         // Implements back key navigation
        focus: true
        Keys.onReleased: if (event.key === Qt.Key_Back && stackView.depth > 1) {
                             stackView.pop();
                             event.accepted = true;
                         }

        initialItem: Item {
            width: parent.width
            height: parent.height
            ListView {
                model: pageModel
                anchors.fill: parent
                delegate: AndroidDelegate {
                    text: title
                    onClicked: stackView.push(Qt.resolvedUrl(page))
                }
            }
        }
    }
}

