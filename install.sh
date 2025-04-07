#!/bin/bash

# BriefButlerPrinter Installation Script for macOS
# This script installs the BriefButlerPrinter virtual printer driver

# Make sure we're running as root
if [ "$EUID" -ne 0 ]; then
  echo "Please run as root (sudo)"
  exit 1
fi

# Define variables
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SERVICE_NAME="com.briefbutler.printer"
SERVICE_PLIST="/Library/LaunchDaemons/${SERVICE_NAME}.plist"
APP_DIR="/usr/local/briefbutler"

echo "=== BriefButlerPrinter Virtual Printer Installation ==="
echo "This will install the BriefButlerPrinter virtual printer driver."

# Check for Node.js
if ! command -v node &> /dev/null; then
  echo "Error: Node.js is required but not installed."
  echo "Please install Node.js before continuing."
  exit 1
fi

# Check for CUPS
if ! lpstat -v &> /dev/null; then
  echo "Error: CUPS printing system is not available."
  exit 1
fi

# Create application directory
echo "Creating application directory..."
mkdir -p "${APP_DIR}"

# Copy files
echo "Copying application files..."
cp -R "${SCRIPT_DIR}/src" "${APP_DIR}/"
cp "${SCRIPT_DIR}/package.json" "${APP_DIR}/"
cp "${SCRIPT_DIR}/.env" "${APP_DIR}/"

# Install dependencies
echo "Installing dependencies..."
cd "${APP_DIR}" && npm install --production

# Make scripts executable
chmod +x "${APP_DIR}/src/index.js"

# Create LaunchDaemon plist
echo "Creating LaunchDaemon..."
cat > "${SERVICE_PLIST}" << EOL
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>${SERVICE_NAME}</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/node</string>
        <string>${APP_DIR}/src/index.js</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardErrorPath</key>
    <string>/var/log/briefbutler-error.log</string>
    <key>StandardOutPath</key>
    <string>/var/log/briefbutler.log</string>
    <key>WorkingDirectory</key>
    <string>${APP_DIR}</string>
</dict>
</plist>
EOL

# Set appropriate permissions
chmod 644 "${SERVICE_PLIST}"

# Install the printer
echo "Installing the printer..."
node "${APP_DIR}/src/index.js" install

# Load and start the service
echo "Starting the service..."
launchctl load "${SERVICE_PLIST}"

echo "=== Installation complete! ==="
echo "The BriefButlerPrinter virtual printer is now installed and running."
echo "You can print to it from any application by selecting 'BriefButlerPrinter'."
echo "Log files are located at /var/log/briefbutler.log"