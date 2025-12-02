import { act, fireEvent, render, screen } from "@testing-library/react";
import LoginPage from "@/src/app/[locale]/login/page";
import { useParams, useSearchParams } from "next/navigation";

const mockSignInWithOtp = jest.fn();

jest.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      signInWithOtp: mockSignInWithOtp,
    },
  }),
}));

jest.mock("@/hooks/useAnim", () => ({
  useAnim: () => ({ anim: false, toggle: jest.fn(), isAuto: true }),
}));

jest.mock("motion/react", () => {
  const React = jest.requireActual<typeof import("react")>("react");

  const motion = new Proxy(
    {},
    {
      get: (_target, element: string | symbol) => {
        const tag: string =
          typeof element === "string" ? element : "div";

        const Component = React.forwardRef<
          HTMLElement,
          React.HTMLAttributes<HTMLElement>
        >(({ children, ...rest }, ref) =>
          React.createElement(tag, { ref, ...rest }, children),
        );
        Component.displayName = `motion.${String(tag)}`;
        return Component;
      },
    },
  );

  return { motion };
});

jest.mock("react-dom", () => {
  const actual = jest.requireActual("react-dom");
  return {
    ...actual,
    useFormStatus: () => ({ pending: false }),
  };
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
  useSearchParams: jest.fn(),
}));

const mockedUseParams = useParams as jest.MockedFunction<typeof useParams>;
const mockedUseSearchParams =
  useSearchParams as unknown as jest.MockedFunction<typeof useSearchParams>;

const makeSearchParams = (query: string) =>
  new URLSearchParams(query) as unknown as ReturnType<typeof useSearchParams>;

describe("LoginPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseParams.mockReturnValue(
      { locale: "en" } as unknown as ReturnType<typeof useParams>,
    );
    mockedUseSearchParams.mockReturnValue(makeSearchParams(""));
    mockSignInWithOtp.mockResolvedValue({ error: null });
  });

  it("shows a validation error when email is missing", async () => {
    render(<LoginPage />);

    const form = screen.getByRole("form", {
      name: "Request a magic link to sign in",
    });

    await act(async () => {
      fireEvent.submit(form);
    });

    expect(
      await screen.findByText("Please enter a valid email address."),
    ).toBeInTheDocument();
    expect(mockSignInWithOtp).not.toHaveBeenCalled();
  });

  it("sends a magic link request with the redirect target", async () => {
    mockedUseSearchParams.mockReturnValue(
      makeSearchParams("redirectTo=/en/admin"),
    );
    render(<LoginPage />);

    const emailInput = screen.getByLabelText("Email address") as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: "user@example.com" } });

    await act(async () => {
      fireEvent.submit(
        screen.getByRole("form", {
          name: "Request a magic link to sign in",
        }),
      );
    });

    expect(mockSignInWithOtp).toHaveBeenCalledWith({
      email: "user@example.com",
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?redirectTo=%2Fen%2Fadmin`,
      },
    });

    expect(await screen.findByText(/Check your email/i)).toBeInTheDocument();
  });
});
