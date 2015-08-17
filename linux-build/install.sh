#!/bin/bash

mkdir -p /usr/bin

cp ./gravity-geometry /usr/bin/gravity-geometry
cp ./Gravity-Geometry /usr/bin/Gravity-Geometry
cp ./gravity-geometry-uninstall.sh /usr/bin/gravity-geometry-uninstall.sh


mkdir -p /usr/share/applications

cp ./data/gravity-geometry.desktop /usr/share/applications/gravity-geometry.desktop

mkdir -p /usr/share/pixmaps

cp ./data/gravity-geometry.png /usr/share/pixmaps/gravity-geometry.png

mkdir -p /usr/share/gravity-geometry/qml
cp -r ./qml/* /usr/share/gravity-geometry/qml

mkdir -p /usr/share/gravity-geometry/fonts
cp -r ./fonts/* /usr/share/gravity-geometry/fonts

echo "Gravity-Geometry installed successfully"
echo "run /usr/bin/gravity-gravity"
echo "run sudo /usr/bin/gravity-geometry-uninstall.sh to uninstall"

