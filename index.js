#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const server = new Server(
  {
    name: "time-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_current_time",
        description: "現在の正確な時刻を取得します",
        inputSchema: {
          type: "object",
          properties: {
            timezone: {
              type: "string",
              description: "タイムゾーン (例: Asia/Tokyo, UTC, America/New_York)",
              default: "Asia/Tokyo"
            },
            format: {
              type: "string",
              description: "時刻フォーマット (iso, unix, readable)",
              enum: ["iso", "unix", "readable"],
              default: "iso"
            }
          }
        }
      },
      {
        name: "get_time_difference",
        description: "2つのタイムゾーン間の時差を計算します",
        inputSchema: {
          type: "object",
          properties: {
            timezone1: {
              type: "string",
              description: "最初のタイムゾーン",
              default: "Asia/Tokyo"
            },
            timezone2: {
              type: "string",
              description: "2番目のタイムゾーン",
              default: "UTC"
            }
          },
          required: ["timezone1", "timezone2"]
        }
      }
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "get_current_time": {
        const timezone = args?.timezone || "Asia/Tokyo";
        const format = args?.format || "iso";
        
        const now = new Date();
        let result;

        switch (format) {
          case "unix":
            result = Math.floor(now.getTime() / 1000).toString();
            break;
          case "readable":
            result = now.toLocaleString("ja-JP", { 
              timeZone: timezone,
              year: "numeric",
              month: "2-digit", 
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit"
            });
            break;
          case "iso":
          default:
            result = now.toISOString();
            if (timezone !== "UTC") {
              const localTime = new Date(now.toLocaleString("en-US", { timeZone: timezone }));
              result = localTime.toISOString();
            }
            break;
        }

        return {
          content: [
            {
              type: "text",
              text: `現在時刻 (${timezone}): ${result}`
            }
          ]
        };
      }

      case "get_time_difference": {
        const timezone1 = args?.timezone1 || "Asia/Tokyo";
        const timezone2 = args?.timezone2 || "UTC";
        
        const now = new Date();
        const time1 = new Date(now.toLocaleString("en-US", { timeZone: timezone1 }));
        const time2 = new Date(now.toLocaleString("en-US", { timeZone: timezone2 }));
        
        const diffMs = time1.getTime() - time2.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);
        
        return {
          content: [
            {
              type: "text",
              text: `${timezone1} と ${timezone2} の時差: ${diffHours >= 0 ? '+' : ''}${diffHours}時間`
            }
          ]
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `エラー: ${error.message}`
        }
      ],
      isError: true
    };
  }
});

async function main() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    
    console.error("Time MCP Server が開始されました");
  } catch (error) {
    console.error("サーバー接続エラー:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("サーバー開始エラー:", error);
  process.exit(1);
});