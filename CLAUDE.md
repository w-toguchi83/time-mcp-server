# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Model Context Protocol (MCP) server that provides accurate time information tools. The server is built using the MCP SDK and provides two main tools for time-related operations.

## Architecture

**Single-file MCP Server (`index.js`)**
- Uses `@modelcontextprotocol/sdk` for MCP protocol implementation
- Implements `StdioServerTransport` for communication with MCP clients
- Provides two tools: `get_current_time` and `get_time_difference`
- Handles timezone conversions and multiple time formats (ISO, Unix, readable)

**Key Components:**
- Server initialization with capabilities declaration
- Tool registration via `ListToolsRequestSchema` handler
- Tool execution via `CallToolRequestSchema` handler
- Error handling for malformed requests and timezone issues

## Development Commands

```bash
# Start the MCP server (for Claude Desktop integration)
npm start

# Development mode with file watching
npm dev

# Run test client to verify server functionality
npm test

# Install dependencies
npm install

# Create global executable link for testing
npm link

# Publish to npm (requires npm account and login)
npm publish --access public
```

## MCP Integration

**Claude Desktop Configuration:**
The server is designed to be integrated with Claude Desktop via the configuration file:
```json
{
  "mcpServers": {
    "time-server": {
      "command": "/full/path/to/node",
      "args": ["/full/path/to/index.js"]
    }
  }
}
```

**Important:** Always use full paths in Claude Desktop configuration as it doesn't inherit shell PATH environment variables.

## Tool Capabilities

1. **get_current_time**: Returns current time with timezone and format options
2. **get_time_difference**: Calculates time difference between two timezones

Both tools handle timezone conversion using JavaScript's native `Intl` and `Date` APIs.