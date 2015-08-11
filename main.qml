import QtQuick 2.0
import QtCanvas3D 1.0
import QtQuick.Controls 1.3
import QtQuick.Layouts 1.1

import "content"

ApplicationWindow {
    id: mainview
    title: qsTr("Gravity and geometry")
    width: 1280
    height: 768
    color: "#000000"
    opacity: 1
    visible: true

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
                    onClicked: stackView.pop()
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
                page: "content/conicsInfo.qml"
            }
            ListElement {
                title: "Conic sections in 3D"
                page: "content/conics.qml"
            }
            ListElement {
                title: "Two body problem"
                page: "content/twobody.qml"
            }
            ListElement {
                title: "Static solar system"
                page: "content/solarsystem.qml"
            }
            ListElement {
                title: "Slow solar system"
                page: "content/slowsolarsystem.qml"
            }
            ListElement {
                title: "Real solar system"
                page: "content/realsolarsystem.qml"
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

