import assert from "node:assert/strict";
import { compareDecimals, decimalToString, isMoneyString } from "../../src/lib/decimal";

export async function run() {
  assert.equal(isMoneyString("100.00"), true);
  assert.equal(isMoneyString("100.0"), true);
  assert.equal(isMoneyString("100.000"), false);
  assert.equal(compareDecimals("10.00", "2.00") > 0, true);
  assert.equal(decimalToString(5), "5.00");
}
