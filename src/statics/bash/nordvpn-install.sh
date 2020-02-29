#!/bin/bash

echo "Installing NordVPN..."

echo $1
echo $2

sudo cp src/assets/nordvpn-linux.desktop /usr/share/applications/nordvpn-linux.desktop
sudo cp src/assets/app-icon.png /usr/share/icons/nordvpn-linux.png
