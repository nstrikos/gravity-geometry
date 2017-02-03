import QtQuick 2.0
import QtQuick.Controls 1.3


Rectangle {
    id: mainRectangle
    width: 100
    height: 62

    Flickable {
        id: flickable
        anchors.fill: parent
        contentHeight: contentItem.childrenRect.height
        flickableDirection: Flickable.VerticalFlick
        clip: true
        Button {
            id :increaseButton
            anchors.top : parent.top
            text: "Increase font size"
            width: parent.width / 2
            onClicked: {
                text0.font.pointSize +=1;
                text1.font.pointSize +=1;
                text2.font.pointSize +=1;
                text3.font.pointSize +=1;
                text4.font.pointSize +=1;
                text5.font.pointSize +=1;
            }
        }
        Button {
            id :decreaseButton
            anchors.top : parent.top
            text: "Decrease font size"
            width: parent.width / 2
            anchors.right: parent.right
            onClicked: {
                text0.font.pointSize -=1;
                text1.font.pointSize -=1;
                text2.font.pointSize -=1;
                text3.font.pointSize -=1;
                text4.font.pointSize -=1;
                text5.font.pointSize -=1;
            }
        }

        Text {
            id:text0
            color: "#000000"
            width: parent.width
            anchors.left: parent.left
            anchors.leftMargin: 20
            anchors.right: parent.right
            anchors.rightMargin: 20
            anchors.top : increaseButton.bottom
            text : "The conic sections play a fundamental role in space science.
Any body under the influence of an inverse square law force
(i.e., where force is inversely proportional to the square of distance)
must have a trajectory that is one of the conic sections.
In celestial mechanics the forces are gravitational;
however, it is also of interest that the forces of attraction or repulsion
between electrically charged particles obey an inverse square law,
and such particles also have paths that are conic sections.
No important scientific applications were found for conic sections until the 17th century,
when Kepler discovered that planets move in ellipses
and Galileo proved that projectiles travel in parabolas."
            font.pointSize: 14
            verticalAlignment: Text.AlignVCenter
            horizontalAlignment: Text.AlignJustify
            textFormat: Text.RichText
            wrapMode: Text.WrapAtWordBoundaryOrAnywhere
        }


        Text {
            id: text1
            anchors.top: text0.bottom
            anchors.topMargin: 20
            anchors.left: parent.left
            anchors.leftMargin: 20
            anchors.right: parent.right
            anchors.rightMargin: 20
            color: "#000000"
            width: parent.width
            text: "In mathematics, a conic section is a curve obtained as the intersection of a cone with a plane.
Traditionally, the three types of conic section are the hyperbola, the parabola, and the ellipse.
The circle is a special case of the ellipse, and is of sufficient interest in its own right that it is sometimes called the fourth type of conic section."
            font.pointSize: 14
            verticalAlignment: Text.AlignVCenter
            horizontalAlignment: Text.AlignJustify
            textFormat: Text.RichText
            wrapMode: Text.WrapAtWordBoundaryOrAnywhere
        }

        Text {
            id: text2
            anchors.top: text1.bottom
            anchors.topMargin: 20
            anchors.left: parent.left
            anchors.leftMargin: 20
            anchors.right: parent.right
            anchors.rightMargin: 20
            color: "#000000"
            width: parent.width
            text: "Features"
            font.pointSize: 18
        }

        Text {
            id:text3
            anchors.top: text2.bottom
            anchors.topMargin: 20
            anchors.left: parent.left
            anchors.leftMargin: 20
            anchors.right: parent.right
            anchors.rightMargin: 20
            width: parent.width
            color: "#000000"
            text: "Conics are of three types: parabolas, ellipses, including circles, and hyperbolas.
The three types of conics are the ellipse, parabola, and hyperbola.
The circle can be considered as a fourth type (as it was by Apollonius) or as a kind of ellipse.
The circle and the ellipse arise when the intersection of cone and plane is a closed curve.
The circle is obtained when the cutting plane is parallel to the plane of the generating circle of the cone
If the cutting plane is parallel to exactly one generating line of the cone,
then the conic is unbounded and is called a parabola.
In the remaining case, the figure is a hyperbola."
            font.pointSize: 14
            verticalAlignment: Text.AlignVCenter
            horizontalAlignment: Text.AlignJustify
            textFormat: Text.RichText
            wrapMode: Text.WrapAtWordBoundaryOrAnywhere
        }

        Text {
            id: text4
            anchors.top: text3.bottom
            anchors.topMargin: 20
            anchors.left: parent.left
            anchors.leftMargin: 20
            anchors.right: parent.right
            anchors.rightMargin: 20
            color: "#000000"
            width: parent.width
            text: "History"
            font.pointSize: 18
        }

        Text {
            id: text5
            anchors.top: text4.bottom
            anchors.topMargin: 20
            anchors.left: parent.left
            anchors.leftMargin: 20
            anchors.right: parent.right
            anchors.rightMargin: 20
            color: "#000000"
            width: parent.width
            text: "The conic sections were named and studied at least since 200 BC, when Apollonius of Perga undertook a systematic study of their properties.
It is believed that the first definition of a conic section is due to Menaechmus.
His work did not survive and is only known through secondary accounts.
Euclid is said to have written four books on conics but these were lost as well.
Archimedes is known to have studied conics, having determined the area bounded by a parabola and an ellipse.
The only part of this work to survive is a book on the solids of revolution of conics.
The greatest progress in the study of conics by the ancient Greeks is due to Apollonius of Perga
whose eight-volume Conic Sections or Conics summarized and greatly extended existing knowledge.
Apollonius's major innovation was to characterize a conic using properties within the plane and intrinsic to the curve; this greatly simplified analysis.
With this tool, it was now possible to show that any plane cutting the cone,
regardless of its angle, will produce a conic according to the earlier definition, leading to the definition commonly used today.
Pappus of Alexandria is credited with discovering the importance of the concept of a conic's focus,
and with the discovery of the related concept of a directrix.
Apollonius's work was translated into Arabic (the technical language of the time)
and much of his work only survives through the Arabic version.
Persians found applications to the theory; the most notable of these was the Persian mathematician and poet Omar Khayyám
who used conic sections to solve algebraic equations.
Johannes Kepler extended the theory of conics through the \"principle of continuity\", a precursor to the concept of limits.
Girard Desargues and Blaise Pascal developed a theory of conics using an early form of projective geometry
and this helped to provide impetus for the study of this new field.
Meanwhile, René Descartes applied his newly discovered Analytic geometry to the study of conics. This had the effect of reducing the geometrical problems
of conics to problems in algebra."
            font.pointSize: 14
            verticalAlignment: Text.AlignVCenter
            horizontalAlignment: Text.AlignJustify
            textFormat: Text.RichText
            wrapMode: Text.WrapAtWordBoundaryOrAnywhere
        }        
    }
    Component.onCompleted: {
        //We set here the flickable content height property
        //because of a binding property issue
        increaseButton.height = 40;
        decreaseButton.height = 40;
    }
}
