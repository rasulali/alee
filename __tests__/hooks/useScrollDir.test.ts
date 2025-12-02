import { renderHook, act } from "@testing-library/react";
import useScrollDir from "@/hooks/useScrollDir";

describe("useScrollDir", () => {
  let now = 0;
  let dateSpy: jest.SpyInstance<number, []>;
  let rafSpy: jest.SpyInstance<number, [FrameRequestCallback]>;

  const setScrollPosition = (value: number) => {
    Object.defineProperty(window, "pageYOffset", {
      value,
      configurable: true,
      writable: true,
    });
    Object.defineProperty(document.documentElement, "scrollTop", {
      value,
      configurable: true,
      writable: true,
    });
  };

  beforeEach(() => {
    jest.useFakeTimers();
    now = 50;
    dateSpy = jest.spyOn(Date, "now").mockImplementation(() => now);
    rafSpy = jest
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((cb: FrameRequestCallback) => {
        cb(now);
        return 0 as unknown as number;
      });
  });

  afterEach(() => {
    dateSpy.mockRestore();
    rafSpy.mockRestore();
    jest.useRealTimers();
  });

  it("tracks scroll direction, velocity, and idle reset", () => {
    const { result } = renderHook(() =>
      useScrollDir(undefined, { threshold: 5, velocitySamples: 3 }),
    );
    setScrollPosition(0);

    act(() => {
      now = 150;
      setScrollPosition(120);
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current.scrollDir).toBe("down");
    expect(result.current.scrollY).toBe(120);
    expect(result.current.isScrolling).toBe(true);
    expect(result.current.velocity).toBeGreaterThan(0);

    act(() => {
      now = 400;
      jest.advanceTimersByTime(200);
    });

    expect(result.current.isScrolling).toBe(false);
    expect(result.current.velocity).toBe(0);
  });

  it("ignores small scroll deltas under the threshold", () => {
    setScrollPosition(0);
    const { result } = renderHook(() =>
      useScrollDir(undefined, { threshold: 20 }),
    );

    act(() => {
      now = 200;
      setScrollPosition(5);
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current.scrollDir).toBeNull();
    expect(result.current.scrollY).toBe(5);
  });
});
