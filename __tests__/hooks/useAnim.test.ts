import { renderHook, act, waitFor } from "@testing-library/react";
import { useAnim } from "@/hooks/useAnim";
import {
  initializeAnimation,
  toggleAnimation,
} from "@/store/slices/animation-slice";
import { useReducedMotion } from "motion/react";

jest.mock("motion/react", () => ({
  useReducedMotion: jest.fn(),
}));

const mockDispatch = jest.fn();
let animationState = { anim: true, isAuto: true };

jest.mock("@/store/hooks", () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (
    selector: (state: { animation: typeof animationState }) => unknown,
  ) => selector({ animation: animationState }),
}));

describe("useAnim", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    animationState = { anim: true, isAuto: true };
  });

  it("returns the override value without dispatching actions", () => {
    const { result } = renderHook(() => useAnim(false));

    expect(result.current.anim).toBe(false);
    expect(result.current.isAuto).toBe(false);

    act(() => {
      result.current.toggle();
    });

    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it("dispatches initialization when no override is provided", async () => {
    (useReducedMotion as jest.Mock).mockReturnValue(false);
    localStorage.setItem("device-capabilities", "high-end");
    mockDispatch.mockClear();

    renderHook(() => useAnim());

    await waitFor(() => expect(mockDispatch).toHaveBeenCalled());

    const action = mockDispatch.mock.calls[0][0];
    expect(action.type).toBe(initializeAnimation.type);
    expect(action.payload).toEqual({
      prefersReducedMotion: false,
      lowEndDevice: false,
    });
  });

  it("dispatches toggleAnimation when toggle is invoked", async () => {
    (useReducedMotion as jest.Mock).mockReturnValue(false);
    localStorage.setItem("device-capabilities", "high-end");

    const { result } = renderHook(() => useAnim());

    await waitFor(() => expect(mockDispatch).toHaveBeenCalled());
    mockDispatch.mockClear();

    act(() => {
      result.current.toggle();
    });

    expect(mockDispatch).toHaveBeenCalledWith(toggleAnimation());
  });
});
