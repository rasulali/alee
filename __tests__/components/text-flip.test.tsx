import { fireEvent, render } from "@testing-library/react";
import TextFlip from "@/src/components/text-flip";

const getVisibleText = (element: Element | null) =>
  element?.textContent?.replace(/\u200A/g, "") ?? "";

describe("TextFlip", () => {
  it("shows the active label and flips on hover when animations are disabled", () => {
    const { container } = render(
      <TextFlip
        labels={["Hello", "World"]}
        activeIndex={0}
        shouldAnimate={false}
        hoverFlip
      />,
    );

    const wrapper = container.querySelector("div");
    const visible = container.querySelector("span.absolute");

    expect(getVisibleText(visible)).toBe("Hello");

    fireEvent.pointerEnter(wrapper!);
    expect(getVisibleText(visible)).toBe("World");

    fireEvent.pointerLeave(wrapper!);
    expect(getVisibleText(visible)).toBe("Hello");
  });

  it("clamps the active index when only one label is provided", () => {
    const { container } = render(
      <TextFlip labels={["Only"]} activeIndex={5} shouldAnimate={false} />,
    );

    const visible = container.querySelector("span.absolute");
    expect(getVisibleText(visible)).toBe("Only");
  });
});
