export type RoomKind = "room" | "apartment" | "house";
export type Scope = "design" | "interior" | "turnkey";
export type Finish = "linen" | "walnut" | "timber";

export type EstimateInput = {
  room: RoomKind;
  scope: Scope;
  area: number;
  finish: Finish;
};

const SCOPE_RATE: Record<Scope, number> = {
  design: 16,
  interior: 38,
  turnkey: 225,
};

const ROOM_FACTOR: Record<RoomKind, number> = {
  room: 0.92,
  apartment: 1,
  house: 1.08,
};

const FINISH_FACTOR: Record<Finish, number> = {
  linen: 1,
  walnut: 1.14,
  timber: 1.26,
};

export const ROOM_LABEL: Record<RoomKind, string> = {
  room: "A single room",
  apartment: "An apartment",
  house: "A house",
};

export const SCOPE_LABEL: Record<Scope, string> = {
  design: "Design direction",
  interior: "Full interior",
  turnkey: "Turnkey renovation",
};

export const FINISH_LABEL: Record<Finish, string> = {
  linen: "Quiet linen",
  walnut: "Walnut & stone",
  timber: "Dark timber",
};

export function composeEstimate(input: EstimateInput) {
  const finish =
    input.scope === "design"
      ? 1 + (FINISH_FACTOR[input.finish] - 1) * 0.35
      : FINISH_FACTOR[input.finish];
  const base = SCOPE_RATE[input.scope] * input.area * ROOM_FACTOR[input.room] * finish;
  const low = Math.round((base * 0.9) / 500) * 500;
  const high = Math.round((base * 1.12) / 500) * 500;
  const extra = Math.max(0, Math.round((input.area - 900) / 700));
  const start = (input.scope === "design" ? 6 : input.scope === "interior" ? 11 : 18) + extra;
  const span = input.scope === "turnkey" ? 8 : 4;

  return {
    low,
    high,
    weeks: `${start}–${start + span} weeks`,
    includes: INCLUDES[input.scope],
  };
}

const INCLUDES: Record<Scope, string[]> = {
  design: [
    "Measured plan and a room-by-room layout",
    "Material and finish schedule",
    "Lighting plan and a furniture direction",
  ],
  interior: [
    "Everything in design direction",
    "Specification, samples, and procurement guidance",
    "Styling and a punch list before you move in",
  ],
  turnkey: [
    "Design, specification, and the build",
    "Trades, timing, and a single budget",
    "Handover of a room that is ready to live in",
  ],
};

export function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}
