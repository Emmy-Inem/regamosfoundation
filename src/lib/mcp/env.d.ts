// Node-style env used inside MCP tool handlers. The MCP bundler emits a Deno
// function where `process.env` is polyfilled by @lovable.dev/mcp-js at runtime.
declare const process: { env: Record<string, string | undefined> };
