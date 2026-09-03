const MIN_TICK = -887272;
const MAX_TICK = 887272;

export function alignTick(tick, tickSpacing, mode = "nearest") {
  if (!Number.isInteger(tick)) throw new TypeError("tick must be an integer");
  if (!Number.isInteger(tickSpacing) || tickSpacing <= 0) throw new TypeError("tickSpacing must be a positive integer");
  const scaled = tick / tickSpacing;
  const aligned = mode === "down" ? Math.floor(scaled) : mode === "up" ? Math.ceil(scaled) : Math.round(scaled);
  return Math.max(MIN_TICK, Math.min(MAX_TICK, aligned * tickSpacing));
}

export function ticksForMultiple(multiple, tickSpacing) {
  if (!Number.isFinite(multiple) || multiple <= 1) throw new TypeError("multiple must exceed 1");
  return Math.ceil(Math.log(multiple) / Math.log(1.0001) / tickSpacing) * tickSpacing;
}

export function rangeFromTarget({ currentTick, targetMultiple, tickSpacing, direction }) {
  if (direction !== "up" && direction !== "down") throw new TypeError("direction must be up or down");
  const width = ticksForMultiple(targetMultiple, tickSpacing);
  const boundary = alignTick(currentTick, tickSpacing, direction === "up" ? "up" : "down");
  const tickLower = direction === "up" ? boundary : boundary - width;
  const tickUpper = direction === "up" ? boundary + width : boundary;
  if (tickLower < MIN_TICK || tickUpper > MAX_TICK) throw new RangeError("target range exceeds V3 tick limits");
  return { tickLower, tickUpper, boundaryTick: boundary, width };
}

export function priceMultipleBetweenTicks(tickA, tickB) {
  return 1.0001 ** (tickB - tickA);
}
