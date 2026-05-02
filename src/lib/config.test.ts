import { describe, it, expect, vi, beforeEach } from "vitest";

describe("config", () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.YAHOO_EMAIL = "test@yahoo.com";
    process.env.YAHOO_APP_PASSWORD = "1234567890123456";
    process.env.LOG_LEVEL = "info";
  });

  it("should validate correct environment variables", async () => {
    const { config } = await import("./config.js");
    expect(config.YAHOO_EMAIL).toBe("test@yahoo.com");
    expect(config.YAHOO_APP_PASSWORD).toBe("1234567890123456");
  });

  it("should fail on invalid email", async () => {
    process.env.YAHOO_EMAIL = "invalid-email";
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => undefined as never);
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await import("./config.js");

    expect(exitSpy).toHaveBeenCalledWith(1);
    exitSpy.mockRestore();
    consoleSpy.mockRestore();
  });
});
