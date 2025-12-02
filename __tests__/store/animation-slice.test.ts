import reducer, {
  initializeAnimation,
  setAnim,
  setUserPref,
  toggleAnimation,
} from "@/store/slices/animation-slice";
import { getCookie, setCookie } from "@/lib/utils";

jest.mock("@/lib/utils", () => ({
  getCookie: jest.fn(),
  setCookie: jest.fn(),
}));

const mockedGetCookie = getCookie as jest.MockedFunction<typeof getCookie>;
const mockedSetCookie = setCookie as jest.MockedFunction<typeof setCookie>;

const baseState = {
  anim: false,
  userPref: null as string | null,
  isAuto: true,
};

describe("animation slice", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("initializes animation based on device signals and cookies", () => {
    mockedGetCookie.mockReturnValueOnce(null).mockReturnValueOnce(null);

    const state = reducer(
      baseState,
      initializeAnimation({
        prefersReducedMotion: false,
        lowEndDevice: false,
      }),
    );

    expect(mockedSetCookie).toHaveBeenCalledWith("anim-auto", "true");
    expect(state.anim).toBe(true);
    expect(state.userPref).toBeNull();
    expect(state.isAuto).toBe(true);
  });

  it("disables animation when the user preference cookie is set to false", () => {
    mockedGetCookie.mockReturnValueOnce("true").mockReturnValueOnce("false");

    const state = reducer(
      baseState,
      initializeAnimation({
        prefersReducedMotion: true,
        lowEndDevice: false,
      }),
    );

    expect(mockedSetCookie).toHaveBeenCalledWith("anim-auto", "false");
    expect(state.anim).toBe(false);
    expect(state.userPref).toBe("false");
    expect(state.isAuto).toBe(false);
  });

  it("toggles animation preference off when no cookie is present", () => {
    mockedGetCookie.mockReturnValueOnce(null).mockReturnValueOnce("true");

    const state = reducer(baseState, toggleAnimation());

    expect(mockedSetCookie).toHaveBeenCalledWith("anim-pref", "false");
    expect(state.anim).toBe(false);
    expect(state.userPref).toBe("false");
    expect(state.isAuto).toBe(false);
  });

  it("restores auto preference when animation was previously disabled", () => {
    mockedGetCookie.mockReturnValueOnce("false").mockReturnValueOnce("false");

    const state = reducer(baseState, toggleAnimation());

    expect(mockedSetCookie).toHaveBeenCalledWith("anim-pref", "auto");
    expect(state.anim).toBe(false);
    expect(state.userPref).toBe("auto");
    expect(state.isAuto).toBe(true);
  });

  it("updates animation flag and user preference directly", () => {
    const stateWithPref = reducer(baseState, setUserPref("false"));
    expect(stateWithPref.userPref).toBe("false");
    expect(stateWithPref.isAuto).toBe(false);

    const stateWithAnim = reducer(baseState, setAnim(true));
    expect(stateWithAnim.anim).toBe(true);
  });
});
