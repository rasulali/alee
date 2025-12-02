import { cn, getCookie, setCookie, parseCookieHeader } from "@/lib/utils";

const clearCookies = () => {
  document.cookie.split(";").forEach((cookie) => {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.slice(0, eqPos) : cookie;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  });
};

describe("lib/utils", () => {
  beforeEach(() => {
    clearCookies();
  });

  it("merges class names with tailwind precedence", () => {
    const result = cn("px-2", ["text-sm", { hidden: false, block: true }], "px-4");
    expect(result.split(" ").sort()).toEqual(["block", "px-4", "text-sm"]);
  });

  it("reads a cookie value by name", () => {
    document.cookie = "test=value";
    expect(getCookie("test")).toBe("value");
  });

  it("returns null for missing cookies", () => {
    document.cookie = "foo=bar";
    expect(getCookie("missing")).toBeNull();
  });

  it("sets a cookie with sane defaults", () => {
    setCookie("session", "abc123", 1);
    expect(document.cookie).toContain("session=abc123");
  });

  it("parses cookie headers into an object map", () => {
    const parsed = parseCookieHeader("a=1; b=two; c=3");
    expect(parsed).toEqual({ a: "1", b: "two", c: "3" });
  });
});
