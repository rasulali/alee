import { render, screen, act } from "@testing-library/react";
import Footer from "@/src/components/footer";
import {
  VisibilityProvider,
  useVisibility,
} from "@/src/contexts/visibility-provider";

describe("Footer visibility tracking", () => {
  let triggerIntersection:
    | ((entries: IntersectionObserverEntry[]) => void)
    | undefined;

  beforeEach(() => {
    const MockObserver = jest.fn(
      (callback: (entries: IntersectionObserverEntry[]) => void) => {
        triggerIntersection = callback;
        return {
          observe: jest.fn(),
          disconnect: jest.fn(),
        };
      },
    );

    Object.defineProperty(globalThis, "IntersectionObserver", {
      writable: true,
      value: MockObserver,
    });
  });

  const VisibilityConsumer = () => {
    const { isVisible } = useVisibility();
    return (
      <div data-testid="footer-visibility">
        {isVisible ? "visible" : "hidden"}
      </div>
    );
  };

  it("flags the footer as visible once intersecting the viewport", () => {
    render(
      <VisibilityProvider>
        <Footer />
        <VisibilityConsumer />
      </VisibilityProvider>,
    );

    expect(screen.getByTestId("footer-visibility")).toHaveTextContent(
      "hidden",
    );

    act(() => {
      triggerIntersection?.([
        { intersectionRatio: 0.6 } as IntersectionObserverEntry,
      ]);
    });

    expect(screen.getByTestId("footer-visibility")).toHaveTextContent(
      "visible",
    );
  });
});
