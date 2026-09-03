export function classifyPosition({ currentTick, tickLower, tickUpper, liquidity }) {
  if (![currentTick, tickLower, tickUpper].every(Number.isInteger)) throw new TypeError("ticks must be integers");
  if (tickLower >= tickUpper) throw new RangeError("tickLower must be below tickUpper");
  if (typeof liquidity !== "bigint" || liquidity < 0n) throw new TypeError("liquidity must be a non-negative bigint");
  if (liquidity === 0n) return "closed";
  if (currentTick < tickLower) return "below-range";
  if (currentTick >= tickUpper) return "above-range";
  return "in-range";
}

export function automationEligibility({ status, approved, activeRule, expired, confirmationMet }) {
  if (!approved) return { eligible: false, reason: "approval-missing" };
  if (!activeRule) return { eligible: false, reason: "rule-inactive" };
  if (expired) return { eligible: false, reason: "rule-expired" };
  if (status !== "above-range" && status !== "below-range") return { eligible: false, reason: "range-not-crossed" };
  if (!confirmationMet) return { eligible: false, reason: "confirmation-pending" };
  return { eligible: true, reason: "conditions-met" };
}
