import { describe, expect, it } from "vitest";
import { csvCell, toCsv } from "@/lib/csv";

describe("security-sensitive output", () => {
  it("escapes quotes and preserves CSV cell boundaries", () => {
    expect(csvCell('Acme, "quoted"')).toBe('"Acme, ""quoted"""');
    expect(toCsv(["name"], [['=SUM(A1)', "ignored"]])).toBe('"name"\r\n"\'=SUM(A1)","ignored"\r\n');
  });
});
