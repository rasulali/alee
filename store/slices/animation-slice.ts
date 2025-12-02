import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getCookie, setCookie } from "@/lib/utils";

const COOKIE_NAME = "anim-pref";
const COOKIE_AUTO_VALUE = "anim-auto";
const PREF_AUTO = "auto";
const PREF_DISABLED = "false";

interface AnimationState {
  anim: boolean;
  userPref: string | null;
  isAuto: boolean;
}

const initialState: AnimationState = {
  anim: false,
  userPref: null,
  isAuto: true,
};

const animationSlice = createSlice({
  name: "animation",
  initialState,
  reducers: {
    setAnim: (state, action: PayloadAction<boolean>) => {
      state.anim = action.payload;
    },
    setUserPref: (state, action: PayloadAction<string | null>) => {
      state.userPref = action.payload;
      state.isAuto = action.payload !== PREF_DISABLED;
    },
    initializeAnimation: (
      state,
      action: PayloadAction<{
        prefersReducedMotion: boolean;
        lowEndDevice: boolean;
      }>,
    ) => {
      const { prefersReducedMotion, lowEndDevice } = action.payload;
      const autoValue = !(prefersReducedMotion || lowEndDevice);
      const savedAutoValue = getCookie(COOKIE_AUTO_VALUE);
      const userPreference = getCookie(COOKIE_NAME);

      if (savedAutoValue === null) {
        setCookie(COOKIE_AUTO_VALUE, autoValue.toString());
      } else if (savedAutoValue !== autoValue.toString()) {
        setCookie(COOKIE_AUTO_VALUE, autoValue.toString());
      }

      state.userPref = userPreference;
      state.isAuto = userPreference !== PREF_DISABLED;

      if (userPreference === PREF_DISABLED) {
        state.anim = false;
      } else {
        state.anim = autoValue;
      }
    },
    toggleAnimation: (state) => {
      const currentPref = getCookie(COOKIE_NAME);
      const newValue =
        currentPref === PREF_DISABLED ? PREF_AUTO : PREF_DISABLED;
      const autoValue = getCookie(COOKIE_AUTO_VALUE) === "true";

      setCookie(COOKIE_NAME, newValue);
      state.userPref = newValue;
      state.isAuto = newValue !== PREF_DISABLED;
      state.anim = newValue === PREF_DISABLED ? false : autoValue;
    },
  },
});

export const { setAnim, setUserPref, initializeAnimation, toggleAnimation } =
  animationSlice.actions;
export default animationSlice.reducer;
