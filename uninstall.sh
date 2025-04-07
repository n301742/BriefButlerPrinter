#!/bin/bash

# BriefButlerPrinter Uninstallation Script for macOS
# This script uninstalls the BriefButlerPrinter virtual printer driver

# Make sure we're running as root
if [ "$EUID" -ne 0 ]; then
  echo "Please run as root (sudo)"
  exit 1
fi

# Define variables
SERVICE_NAME="com.briefbutler.printer"
SERVICE_PLIST="/Library/LaunchDaemons/${SERVICE_NAME}.plist"
APP_DIR="/usr/local/briefbutler"

echo "=== BriefButlerPrinter Virtual Printer Uninstallation ==="
echo "This will uninstall the BriefButlerPrinter virtual printer driver."

# Stop and unload the service
echo "Stopping the service..."
if [ -f "${SERVICE_PLIST}" ]; then
  launchctl unload "${SERVICE_PLIST}"
  rm "${SERVICE_PLIST}"
  echo "LaunchDaemon removed."
else
  echo "LaunchDaemon not found."
fi

# Uninstall the printer
if [ -d "${APP_DIR}" ]; then
  echo "Uninstalling the printer..."
  if [ -f "${APP_DIR}/src/index.js" ]; then
    node "${APP_DIR}/src/index.js" uninstall || true
  fi
fi

# Remove application files
echo "Removing application files..."
if [ -d "${APP_DIR}" ]; then
  rm -rf "${APP_DIR}"
  echo "Application files removed."
else
  echo "Application directory not found."
fi

# Check for log files
echo "Removing log files..."
if [ -f "/var/log/briefbutler.log" ]; then
  rm "/var/log/briefbutler.log"
fi
if [ -f "/var/log/briefbutler-error.log" ]; then
  rm "/var/log/briefbutler-error.log"
fi

echo "=== Uninstallation complete! ==="
echo "The BriefButlerPrinter virtual printer has been removed from your system."