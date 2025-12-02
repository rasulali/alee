import { render, screen, fireEvent } from "@testing-library/react";
import {
  VisibilityProvider,
  useVisibility,
} from "@/src/contexts/visibility-provider";

const Consumer = () => {
  const { isVisible, setVisibility } = useVisibility();
  return (
    <button onClick={() => setVisibility(true)}>
      {isVisible ? "visible" : "hidden"}
    </button>
  );
};

describe("VisibilityProvider", () => {
  it("throws when used outside the provider", () => {
    expect(() => render(<Consumer />)).toThrow(
      "useVisibility must be used within a VisibilityProvider",
    );
  });

  it("shares visibility state with consumers", () => {
    render(
      <VisibilityProvider>
        <Consumer />
      </VisibilityProvider>,
    );

    expect(screen.getByRole("button")).toHaveTextContent("hidden");

    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveTextContent("visible");
  });
});
