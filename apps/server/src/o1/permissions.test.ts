import { test, expect } from "node:test";
import { evaluatePermissionMode } from "./permissions.ts";

test("ask o1 is read-only", () => {
  expect(evaluatePermissionMode("ask_o1", "read").decision).toBe("allow");
  expect(evaluatePermissionMode("ask_o1", "write").decision).toBe("ask");
});

test("ask for approval allows explicit human approval", () => {
  expect(evaluatePermissionMode("ask_approval", "external", true).decision).toBe("allow");
});

test("full access still requires per-action approval for external effects", () => {
  expect(evaluatePermissionMode("approve_for_me", "destructive").decision).toBe("ask");
  expect(evaluatePermissionMode("approve_for_me", "destructive", true).decision).toBe("allow");
});
