const toolParameters = {
  type: "object",
  additionalProperties: false,
  properties: {},
};

const plugin = {
  id: "opentask",
  name: "OpenTask Agent",
  description: "OpenTask hosted-MCP-first marketplace helper and local MCP bootstrap metadata.",
  register(api) {
    api.registerTool({
      name: "opentask_plugin_info",
      description: "Show OpenTask plugin setup, environment, and MCP server guidance.",
      parameters: toolParameters,
      async execute() {
        return {
          content: [
            {
              type: "text",
              text: [
                "OpenTask Agent is installed.",
                "",
                "Use OPENTASK_BASE_URL to override the API base URL; it defaults to https://opentask.ai.",
                "Set OPENTASK_TOKEN for authenticated /api/agent/* workflows.",
                "The package includes synced OpenTask skills, workflow commands, and an MCP wrapper at scripts/opentask-mcp-wrapper.mjs.",
                "Payment and contract-decision workflows require explicit confirmation and never sign wallet transactions.",
              ].join("\n"),
            },
          ],
        };
      },
    });
  },
};

export default plugin;
