import { fireEvent, render, screen } from "@testing-library/react";
import { LocaleLink } from "@/src/components/locale";
import { COOKIE_NAME } from "@/src/config-locale";
import { setCookie } from "@/lib/utils";
import { useLocale } from "next-intl";
import { usePathname, useSearchParams } from "next/navigation";
import {
  AppRouterContext,
  AppRouterInstance,
} from "next/dist/shared/lib/app-router-context.shared-runtime";

jest.mock("next-intl", () => ({
  useLocale: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock("@/lib/utils", () => ({
  ...jest.requireActual("@/lib/utils"),
  setCookie: jest.fn(),
}));

const mockUseLocale = useLocale as jest.MockedFunction<typeof useLocale>;
const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;
const mockUseSearchParams =
  useSearchParams as unknown as jest.MockedFunction<typeof useSearchParams>;

const makeSearchParams = (query: string) =>
  new URLSearchParams(query) as unknown as ReturnType<typeof useSearchParams>;

const mockRouter: AppRouterInstance = {
  back: jest.fn(),
  forward: jest.fn(),
  prefetch: jest.fn().mockResolvedValue(undefined),
  push: jest.fn(),
  replace: jest.fn(),
  refresh: jest.fn(),
};

const renderWithRouter = (ui: React.ReactElement) =>
  render(
    <AppRouterContext.Provider value={mockRouter}>{ui}</AppRouterContext.Provider>,
  );

describe("LocaleLink", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLocale.mockReturnValue("en");
    mockUsePathname.mockReturnValue("/en/work");
    mockUseSearchParams.mockReturnValue(makeSearchParams("foo=bar"));
  });

  it("builds a locale-aware href while preserving search params", () => {
    renderWithRouter(<LocaleLink locale="az">AZ</LocaleLink>);

    const link = screen.getByRole("link", { name: /change to az language/i });
    expect(link).toHaveAttribute("href", "/az/work?foo=bar");
    expect(link).not.toHaveAttribute("aria-current");
  });

  it("sets the locale cookie and marks the active locale on click", () => {
    const handleClick = jest.fn();
    mockUseLocale.mockReturnValue("az");
    mockUsePathname.mockReturnValue("/az");
    mockUseSearchParams.mockReturnValue(makeSearchParams(""));

    renderWithRouter(
      <LocaleLink locale="az" onClick={handleClick}>
        AZ
      </LocaleLink>,
    );

    const link = screen.getByRole("link", { name: /change to az language/i });
    fireEvent.click(link);

    expect(setCookie).toHaveBeenCalledWith(COOKIE_NAME, "az");
    expect(handleClick).toHaveBeenCalled();
    expect(link).toHaveAttribute("aria-current", "true");
  });
});
