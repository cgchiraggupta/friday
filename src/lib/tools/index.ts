// Re-export all tools for easy importing

export * from "./wallet";
export * from "./soroswap";
export * from "./blend";
export * from "./x402";
export * from "./definitions";

type ToolArgs = Record<string, string | number | boolean | undefined>;

function requireStringArg(
  args: ToolArgs,
  key: string,
): string {
  const value = args[key];
  if (typeof value !== "string") {
    throw new Error(`Missing or invalid tool argument: ${key}`);
  }
  return value;
}

// Helper function to execute any tool by name
export async function execute_tool(
  name: string,
  args: ToolArgs,
): Promise<unknown> {
  // Dynamic imports to avoid circular dependencies
  switch (name) {
    case "get_wallet_balances":
      const { get_wallet_balances } = await import("./wallet");
      return await get_wallet_balances(requireStringArg(args, "wallet_address"));

    case "get_soroswap_quote":
      const { get_soroswap_quote } = await import("./soroswap");
      return await get_soroswap_quote(
        requireStringArg(args, "from_token"),
        requireStringArg(args, "to_token"),
        requireStringArg(args, "amount"),
      );

    case "build_swap_tx":
      const { build_swap_tx } = await import("./soroswap");
      return await build_swap_tx(
        requireStringArg(args, "from_token"),
        requireStringArg(args, "to_token"),
        requireStringArg(args, "amount"),
        requireStringArg(args, "slippage"),
        requireStringArg(args, "wallet_address"),
      );

    case "get_blend_pools":
      const { get_blend_pools } = await import("./blend");
      return await get_blend_pools();

    case "build_deposit_tx":
      const { build_deposit_tx } = await import("./blend");
      return await build_deposit_tx(
        requireStringArg(args, "pool_id"),
        requireStringArg(args, "amount"),
        requireStringArg(args, "wallet_address"),
      );

    case "build_withdraw_tx":
      const { build_withdraw_tx } = await import("./blend");
      return await build_withdraw_tx(
        requireStringArg(args, "pool_id"),
        requireStringArg(args, "amount"),
        requireStringArg(args, "wallet_address"),
      );

    case "get_x402_feeds":
      const { get_x402_feeds } = await import("./x402");
      return await get_x402_feeds();

    case "pay_for_data":
      const { pay_for_data } = await import("./x402");
      return await pay_for_data(
        requireStringArg(args, "query"),
        requireStringArg(args, "amount"),
        requireStringArg(args, "wallet_address"),
      );

    case "subscribe_to_feed":
      const { subscribe_to_feed } = await import("./x402");
      return await subscribe_to_feed(
        requireStringArg(args, "feed_id"),
        requireStringArg(args, "duration"),
        requireStringArg(args, "wallet_address"),
      );

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

/**
 * Get tool descriptions for system prompt
 */
export function get_tool_descriptions(): string {
  const descriptions = [
    "get_wallet_balances: Check wallet token balances",
    "get_soroswap_quote: Get swap quotes from Soroswap",
    "build_swap_tx: Build a swap transaction",
    "get_blend_pools: See lending pools and APRs on Blend",
    "build_deposit_tx: Build a lending deposit transaction",
    "build_withdraw_tx: Build a lending withdrawal transaction",
    "get_x402_feeds: See available premium data feeds (cost in USDC)",
    "pay_for_data: Pay for premium data using x402 protocol (AI autonomously pays)",
    "subscribe_to_feed: Subscribe to recurring data feed",
  ];

  return descriptions.join("\n");
}
