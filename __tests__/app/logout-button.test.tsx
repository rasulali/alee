import { act, fireEvent, render, screen } from "@testing-library/react";
import LogoutButton from "@/src/app/[locale]/admin/logout-button";
import { signOutAction } from "@/lib/supabase/actions";
import { useParams } from "next/navigation";

jest.mock("@/lib/supabase/actions", () => ({
  signOutAction: jest.fn(),
}));

jest.mock("react-dom", () => {
  const actual = jest.requireActual<typeof import("react-dom")>("react-dom");
  return { ...actual, useFormStatus: () => ({ pending: false }) };
});

jest.mock("react", () => {
  const actual = jest.requireActual<typeof import("react")>("react");
  return {
    ...actual,
    useActionState: <S, P>(
      action: (prevState: S, payload: P) => S | Promise<S>,
      initialState: S,
    ) => {
      const [state, setState] = actual.useState<S>(initialState);
      const [isPending, setIsPending] = actual.useState(false);

      const wrapped = async (formData: P) => {
        setIsPending(true);
        const result = await action(state, formData);
        setState(result);
        setIsPending(false);
        return result;
      };

      return [state, wrapped, isPending] as const;
    },
  };
});

jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
}));

const mockedUseParams = useParams as jest.MockedFunction<typeof useParams>;
const mockedSignOutAction =
  signOutAction as unknown as jest.MockedFunction<typeof signOutAction>;

describe("LogoutButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseParams.mockReturnValue(
      { locale: "en" } as unknown as ReturnType<typeof useParams>,
    );
    mockedSignOutAction.mockResolvedValue({ status: "idle" });
  });

  it("submits the sign-out action with the locale redirect", async () => {
    render(<LogoutButton />);

    const form = screen.getByRole("button", { name: "Sign out" }).closest("form")!;

    await act(async () => {
      fireEvent.submit(form);
    });

    const formData = mockedSignOutAction.mock.calls[0][1] as FormData;
    expect(formData.get("redirectTo")).toBe("/en/login");
  });

  it("surfaces action errors to the user", async () => {
    mockedSignOutAction.mockResolvedValue({
      status: "error",
      message: "Failed to sign out",
    });

    render(<LogoutButton />);

    const form = screen.getByRole("button", { name: "Sign out" }).closest("form")!;

    await act(async () => {
      fireEvent.submit(form);
    });

    expect(
      await screen.findByText("Failed to sign out"),
    ).toBeInTheDocument();
  });
});
