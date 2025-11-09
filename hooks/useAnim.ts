"use client";

import { useState, useEffect, useCallback } from "react";
import { useDevicePreferences } from "./useDevicePreferences";
import { getCookie, setCookie } from "@/lib/utils";

const COOKIE_NAME = "anim-pref";
const COOKIE_AUTO_VALUE = "anim-auto";

export function useAnim(override?: boolean) {
  const { prefersReducedMotion, lowEndDevice } = useDevicePreferences();
  const [anim, setAnim] = useState(override ?? true);
  const [userPref, setUserPref] = useState<string | null>(null);

  useEffect(() => {
    if (override !== undefined) {
      setAnim(override);
      return;
    }

    const autoValue = !(prefersReducedMotion || lowEndDevice);
    const savedAutoValue = getCookie(COOKIE_AUTO_VALUE);
    const userPreference = getCookie(COOKIE_NAME);

    setUserPref(userPreference);

    if (savedAutoValue === null) {
      setCookie(COOKIE_AUTO_VALUE, autoValue.toString());
    } else if (savedAutoValue !== autoValue.toString()) {
      setCookie(COOKIE_AUTO_VALUE, autoValue.toString());
    }

    if (userPreference === "false") {
      setAnim(false);
    } else {
      setAnim(autoValue);
    }
  }, [prefersReducedMotion, lowEndDevice, override]);

  const toggle = useCallback(() => {
    const currentPref = getCookie(COOKIE_NAME);
    const newValue = currentPref === "false" ? "auto" : "false";
    const autoValue = getCookie(COOKIE_AUTO_VALUE) === "true";

    setCookie(COOKIE_NAME, newValue);
    setUserPref(newValue);
    setAnim(newValue === "false" ? false : autoValue);
  }, []);

  return { anim, toggle, isAuto: userPref !== "false" };
}
