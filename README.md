# Time MCP Server

正確な時刻情報を提供するModel Context Protocol (MCP) サーバーです。Claude Desktopで時刻関連のツールを使用できるようになります。

## 機能

- **現在時刻の取得**: 指定したタイムゾーンの現在時刻を複数の形式で取得
- **時差計算**: 2つのタイムゾーン間の時差を計算

### サポートする時刻形式

- **ISO**: ISO 8601形式 (例: `2024-06-06T04:22:45.715Z`)
- **Unix**: Unixタイムスタンプ (例: `1717644165`)
- **Readable**: 読みやすい形式 (例: `2024/06/06 13:22:45`)

## インストール

### NPMから

```bash
npx @toguchi/time-mcp-server
```

### ソースから

```bash
git clone https://github.com/w-toguchi83/time-mcp-server.git
cd time-mcp-server
npm install
npm start
```

## Claude Desktopでの使用方法

### 1. 設定ファイルの編集

Claude Desktopの設定ファイルを開いてください：

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

**Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

### 2. MCP設定の追加

```json
{
  "mcpServers": {
    "time-server": {
      "command": "npx",
      "args": ["@toguchi/time-mcp-server"]
    }
  }
}
```

**ローカル開発の場合**:
```json
{
  "mcpServers": {
    "time-server": {
      "command": "/usr/local/bin/node",
      "args": ["/path/to/time-mcp-server/index.js"]
    }
  }
}
```

> **注意**: `command`には必ずフルパスを指定してください。`which node`でNode.jsのパスを確認できます。

### 3. Claude Desktopの再起動

設定変更後、Claude Desktopを再起動してください。

## 使用例

Claude Desktopで以下のように話しかけてください：

- "現在の時刻を教えて"
- "東京とニューヨークの時差は？"
- "UTCで現在時刻をunix形式で表示して"
- "ロンドンの現在時刻を読みやすい形式で教えて"

## ツール詳細

### get_current_time

現在の時刻を取得します。

**パラメータ**:
- `timezone` (オプション): タイムゾーン (デフォルト: "Asia/Tokyo")
  - 例: "UTC", "America/New_York", "Europe/London"
- `format` (オプション): 出力形式 (デフォルト: "iso")
  - `"iso"`: ISO 8601形式
  - `"unix"`: Unixタイムスタンプ
  - `"readable"`: 読みやすい形式

### get_time_difference

2つのタイムゾーン間の時差を計算します。

**パラメータ**:
- `timezone1` (必須): 最初のタイムゾーン
- `timezone2` (必須): 2番目のタイムゾーン

## 開発

```bash
# 依存関係のインストール
npm install

# 開発モード（ファイル監視付き）
npm run dev

# テストクライアントの実行
npm test

# パッケージのテスト
npm link
toguchi-time-mcp
```

## ライセンス

MIT

## 作者

[@w-toguchi83](https://github.com/w-toguchi83)