import { fireEvent, render, screen } from "@testing-library/react";
import Nav from "@/src/components/nav";
import { useTheme } from "next-themes";
import useScrollDir from "@/hooks/useScrollDir";
import { useAnim } from "@/hooks/useAnim";
import {
  AppRouterContext,
  AppRouterInstance,
} from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ReactNode } from "react";

jest.mock("motion/react", () => {
  const React = jest.requireActual<typeof import("react")>("react");
  const motion = new Proxy(
    {},
    {
      get: (_target, element: string | symbol) => {
        const tag: string = typeof element === "string" ? element : "div";
        const Component = React.forwardRef<
          HTMLElement,
          React.HTMLAttributes<HTMLElement> & Record<string, unknown>
        >(({ children, ...rest }, ref) => {
          const safeRest = { ...rest } as Record<string, unknown>;
          [
            "initial",
            "animate",
            "exit",
            "variants",
            "transition",
            "onAnimationComplete",
            "layout",
            "layoutScroll",
            "layoutId",
            "whileHover",
            "whileTap",
            "viewport",
          ].forEach((key) => {
            delete safeRest[key];
          });
          return React.createElement(
            tag,
            { ref, ...safeRest },
            children as ReactNode,
          );
        });
        Component.displayName = `motion.${String(tag)}`;
        return Component;
      },
    },
  );
  const AnimatePresence: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => <>{children}</>;
  AnimatePresence.displayName = "MockAnimatePresence";
  return {
    motion,
    AnimatePresence,
  };
});

jest.mock("next-intl", () => ({
  useTranslations: (ns: string) => (key: string) => `${ns}.${key}`,
  useLocale: () => "en",
}));

let mockTheme = "light";
const mockSetTheme = jest.fn();
jest.mock("next-themes", () => ({
  useTheme: () => ({ theme: mockTheme, setTheme: mockSetTheme }),
}));

jest.mock("@/src/contexts/visibility-provider", () => ({
  useVisibility: () => ({ isVisible: true }),
}));

const mockScrollDirReturn = {
  scrollDir: null,
  scrollY: 0,
  velocity: 0,
  isScrolling: false,
};
jest.mock("@/hooks/useScrollDir");

const mockToggleAnimation = jest.fn();
jest.mock("@/hooks/useAnim");

const mockedUseScrollDir = useScrollDir as jest.MockedFunction<
  typeof useScrollDir
>;
const mockedUseAnim = useAnim as jest.MockedFunction<typeof useAnim>;
const mockedUseTheme = useTheme as jest.MockedFunction<typeof useTheme>;

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
    <AppRouterContext.Provider value={mockRouter}>
      {ui}
    </AppRouterContext.Provider>,
  );

describe("Nav", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockTheme = "light";
    mockedUseScrollDir.mockReturnValue(mockScrollDirReturn);
    mockedUseAnim.mockReturnValue({
      anim: false,
      toggle: mockToggleAnimation,
      isAuto: true,
    });
  });

  it("renders navigation links from translations", () => {
    renderWithRouter(<Nav />);

    expect(
      screen.getByLabelText("Navigate to navbar.items.portfolio"),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Navigate to navbar.items.journal"),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Navigate to navbar.items.gallery"),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Navigate to navbar.items.profile"),
    ).toBeInTheDocument();
  });

  it("opens the drawer and updates the toggle label", () => {
    renderWithRouter(<Nav />);

    const toggle = screen.getByRole("button", {
      name: "navbar.buttons.open",
    });
    fireEvent.click(toggle);

    expect(
      screen.getByRole("button", { name: "navbar.buttons.close" }),
    ).toBeInTheDocument();
  });

  it("invokes animation and theme toggles from controls", () => {
    renderWithRouter(<Nav />);

    fireEvent.click(
      screen.getByRole("button", { name: "Toggle animation mode" }),
    );
    expect(mockToggleAnimation).toHaveBeenCalled();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Switch to dark mode",
      }),
    );

    expect(mockSetTheme).toHaveBeenCalledWith("dark");
    expect(mockedUseTheme().theme).toBe("light");
  });
});
