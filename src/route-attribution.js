function normalize(address) {
  const value = String(address || "").toLowerCase();
  if (!/^0x[0-9a-f]{40}$/.test(value)) throw new TypeError(`Invalid EVM address: ${address}`);
  return value;
}

export function summarizePoolTouches(legs, pools) {
  const catalog = new Map(pools.map((pool) => [normalize(pool.address), { ...pool, address: normalize(pool.address) }]));
  const touched = new Map();
  for (const [index, leg] of legs.entries()) {
    const pool = catalog.get(normalize(leg.pool));
    if (!pool) continue;
    const current = touched.get(pool.address) || { pool, touches: 0, legs: [] };
    current.touches += 1;
    current.legs.push({
      index,
      tokenIn: normalize(leg.tokenIn),
      tokenOut: normalize(leg.tokenOut),
      amountIn: String(leg.amountIn),
      amountOut: String(leg.amountOut)
    });
    touched.set(pool.address, current);
  }
  return [...touched.values()];
}
