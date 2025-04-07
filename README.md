# BriefButlerPrinter - macOS Virtual Printer to API

A virtual printer driver for macOS that:
1. Intercepts print jobs
2. Converts them to PDF
3. Sends them to a web API endpoint

## Features

- Creates a virtual printer in macOS using CUPS
- Automatically converts print jobs to PDF format
- Sends PDFs to a configurable API endpoint
- Includes color, duplex, and other printing options
- Runs as a background service

## Prerequisites

- macOS 10.15 or higher
- Node.js 16+
- CUPS (Common Unix Printing System) - included with macOS
- Administrator access for printer installation

## Installation

1. Clone this repository:
```bash
git clone https://github.com/n301742/BriefButlerPrinter.git
cd BriefButlerPrinter
```

2. Install dependencies:
```bash
npm install
```

3. Configure your environment variables by copying the example file:
```bash
cp .env.example .env
```

4. Edit the `.env` file with your API credentials and preferences:
```
# API Configuration
API_ENDPOINT=http://your-api-endpoint.com/api/letters
API_KEY=your_api_key_here
```

5. Install the printer driver (requires sudo):
```bash
npm run install-driver
```

This will:
- Install the virtual printer
- Create a LaunchDaemon to run the service in the background
- Start the service

## Verifying Installation

After installation, you should see the "BriefButlerPrinter" printer in your system's print dialog.

To test the API connection:
```bash
npm run test-api
```

This will create a sample PDF and send it to the configured API endpoint.

## Usage

1. Print any document from any application
2. Select "BriefButlerPrinter" from the list of available printers
3. Configure any print options (color, duplex, etc.)
4. Click Print
5. The document will be converted to PDF and sent to the configured API endpoint

## Monitoring and Logs

The service logs are stored at:
- `/var/log/bbprinter.log` - Standard output
- `/var/log/bbprinter-error.log` - Error logs

You can view them with:
```bash
tail -f /var/log/bbprinter.log
```

## Uninstallation

To completely remove BriefButlerPrinter:
```bash
npm run uninstall-driver
```

This will:
- Stop the service
- Remove the LaunchDaemon
- Uninstall the printer
- Remove all files

## Development

Start the service in development mode:
```bash
npm run dev
```

Run tests:
```bash
npm test
```

## API Documentation

The API documentation is available in `documentation/letter-api.md`.

## License

MIT