"use client";

import { useState } from "react";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import {
  MdPerson,
  MdEmail,
  MdLock,
  MdArrowForward,
} from "react-icons/md";
import { FaGoogle, FaMicrosoft } from "react-icons/fa";

export interface Auth2Props {
  /** Main heading of the form */
  heading?: string;
  /** Sub-copy below the heading */
  subheading?: string;
  /** Label for the primary submit button */
  submitLabel?: string;
  /** Mode of the auth component */
  mode?: "sign-in" | "sign-up";
}

export function Auth2({
  heading,
  subheading,
  submitLabel,
  mode = "sign-up",
}: Auth2Props) {
  if (mode === "sign-in") {
    return (
      <SignInForm
        heading={heading ?? "Welcome back"}
        subheading={subheading ?? "Sign in to your account to continue."}
        submitLabel={submitLabel ?? "Sign in"}
      />
    );
  }

  return (
    <SignUpForm
      heading={heading ?? "Create your free account"}
      subheading={
        subheading ??
        "Join thousands of teams already building smarter, faster, and together."
      }
      submitLabel={submitLabel ?? "Get started for free"}
    />
  );
}

/* ─────────────────────────── Sign-In Form ─────────────────────────── */

function SignInForm({
  heading,
  subheading,
  submitLabel,
}: {
  heading: string;
  subheading: string;
  submitLabel: string;
}) {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();
  const [globalError, setGlobalError] = useState<string | null>(null);
  const isLoading = fetchStatus === "fetching";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGlobalError(null);
    const formData = new FormData(e.currentTarget);
    const emailAddress = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await signIn.password({ emailAddress, password });
    if (error) return;

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            router.push(`/sign-in/tasks/${session.currentTask.key}`);
            return;
          }
          const url = decorateUrl("/");
          if (url.startsWith("http")) {
            window.location.href = url;
          } else {
            router.push(url);
          }
        },
      });
    }
  };

  const handleSSO = async (strategy: "oauth_google" | "oauth_microsoft") => {
    setGlobalError(null);
    const { error } = await signIn.sso({
      strategy,
      redirectUrl: "/",
      redirectCallbackUrl: "/auth/sso-callback",
    });
    if (error) {
      setGlobalError(error.message ?? "SSO failed. Please try again.");
    }
  };

  return (
    <Shell heading={heading} subheading={subheading} mode="sign-in">
      {/* Social buttons */}
      <SocialButtons
        onGoogle={() => handleSSO("oauth_google")}
        onMicrosoft={() => handleSSO("oauth_microsoft")}
        disabled={isLoading}
      />

      <DividerText text="or sign in with email" />

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="auth2-email" className="text-sm font-medium">
            Email
          </Label>
          <div className="relative">
            <MdEmail className="text-muted-foreground absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
            <Input
              id="auth2-email"
              name="email"
              type="email"
              placeholder="alex@company.io"
              autoComplete="email"
              className="bg-muted focus-visible:ring-primary/20 h-11 border-none pl-10"
              required
            />
          </div>
          {errors?.fields?.identifier && (
            <p className="text-destructive text-xs">
              {errors.fields.identifier.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="auth2-password" className="text-sm font-medium">
            Password
          </Label>
          <div className="relative">
            <MdLock className="text-muted-foreground absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
            <Input
              id="auth2-password"
              name="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              className="bg-muted focus-visible:ring-primary/20 h-11 border-none pl-10"
              required
            />
          </div>
          {errors?.fields?.password && (
            <p className="text-destructive text-xs">
              {errors.fields.password.message}
            </p>
          )}
        </div>

        {globalError && (
          <p className="text-destructive text-xs">{globalError}</p>
        )}
        {errors?.global && errors.global.length > 0 && (
          <p className="text-destructive text-xs">
            {errors.global[0].message}
          </p>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="h-11 w-full gap-2 bg-gradient-to-b from-lime-400 to-lime-500 font-semibold text-black shadow-sm hover:from-lime-300 hover:to-lime-400"
        >
          {isLoading ? "Signing in…" : submitLabel}
          {!isLoading && <MdArrowForward className="h-4 w-4" />}
        </Button>
      </form>

      <p className="text-muted-foreground mt-4 text-center text-sm">
        Don&apos;t have an account?{" "}
        <a href="/auth/sign-up" className="text-primary font-medium hover:underline">
          Sign up
        </a>
      </p>
    </Shell>
  );
}

/* ─────────────────────────── Sign-Up Form ─────────────────────────── */

function SignUpForm({
  heading,
  subheading,
  submitLabel,
}: {
  heading: string;
  subheading: string;
  submitLabel: string;
}) {
  const { signUp, errors, fetchStatus } = useSignUp();
  const router = useRouter();
  const [verifying, setVerifying] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const isLoading = fetchStatus === "fetching";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGlobalError(null);
    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const emailAddress = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await signUp.password({
      emailAddress,
      password,
      firstName,
      lastName,
    });
    if (error) return;

    // If email verification is required
    if (signUp.status === "missing_requirements") {
      await signUp.verifications.sendEmailCode();
      setVerifying(true);
      return;
    }

    // If sign-up is already complete (no verification required)
    if (signUp.status === "complete") {
      await finalizeSignUp();
    }
  };

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGlobalError(null);
    const formData = new FormData(e.currentTarget);
    const code = formData.get("code") as string;

    await signUp.verifications.verifyEmailCode({ code });

    if (signUp.status === "complete") {
      await finalizeSignUp();
    }
  };

  const finalizeSignUp = async () => {
    await signUp.finalize({
      navigate: ({ session, decorateUrl }) => {
        if (session?.currentTask) {
          router.push(`/sign-up/tasks/${session.currentTask.key}`);
          return;
        }
        const url = decorateUrl("/");
        if (url.startsWith("http")) {
          window.location.href = url;
        } else {
          router.push(url);
        }
      },
    });
  };

  const handleSSO = async (strategy: "oauth_google" | "oauth_microsoft") => {
    setGlobalError(null);
    const { error } = await signUp.sso({
      strategy,
      redirectUrl: "/",
      redirectCallbackUrl: "/auth/sso-callback",
    });
    if (error) {
      setGlobalError(error.message ?? "SSO failed. Please try again.");
    }
  };

  /* ── Verification step ── */
  if (verifying) {
    return (
      <Shell
        heading="Verify your email"
        subheading="We sent a verification code to your email. Enter it below."
        mode="sign-up"
      >
        <form onSubmit={handleVerify} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="auth2-code" className="text-sm font-medium">
              Verification code
            </Label>
            <div className="relative">
              <MdLock className="text-muted-foreground absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
              <Input
                id="auth2-code"
                name="code"
                type="text"
                placeholder="Enter 6-digit code"
                autoComplete="one-time-code"
                className="bg-muted focus-visible:ring-primary/20 h-11 border-none pl-10"
                required
              />
            </div>
            {errors?.fields?.code && (
              <p className="text-destructive text-xs">
                {errors.fields.code.message}
              </p>
            )}
          </div>

          {globalError && (
            <p className="text-destructive text-xs">{globalError}</p>
          )}
          {errors?.global && errors.global.length > 0 && (
            <p className="text-destructive text-xs">
              {errors.global[0].message}
            </p>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="h-11 w-full gap-2 bg-gradient-to-b from-lime-400 to-lime-500 font-semibold text-black shadow-sm hover:from-lime-300 hover:to-lime-400"
          >
            {isLoading ? "Verifying…" : "Verify email"}
            {!isLoading && <MdArrowForward className="h-4 w-4" />}
          </Button>
        </form>

        <button
          type="button"
          onClick={() => signUp.verifications.sendEmailCode()}
          className="text-primary mt-3 w-full text-center text-sm font-medium hover:underline"
        >
          Resend code
        </button>

        {/* Required for Clerk bot protection */}
        <div id="clerk-captcha" />
      </Shell>
    );
  }

  /* ── Main sign-up form ── */
  return (
    <Shell heading={heading} subheading={subheading} mode="sign-up">
      <SocialButtons
        onGoogle={() => handleSSO("oauth_google")}
        onMicrosoft={() => handleSSO("oauth_microsoft")}
        disabled={isLoading}
      />

      <DividerText text="or sign up with email" />

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="auth2-firstname" className="text-sm font-medium">
              First name
            </Label>
            <div className="relative">
              <MdPerson className="text-muted-foreground absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
              <Input
                id="auth2-firstname"
                name="firstName"
                type="text"
                placeholder="Alex"
                autoComplete="given-name"
                className="bg-muted focus-visible:ring-primary/20 h-11 border-none pl-10"
                required
              />
            </div>
            {errors?.fields?.firstName && (
              <p className="text-destructive text-xs">
                {errors.fields.firstName.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="auth2-lastname" className="text-sm font-medium">
              Last name
            </Label>
            <div className="relative">
              <MdPerson className="text-muted-foreground absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
              <Input
                id="auth2-lastname"
                name="lastName"
                type="text"
                placeholder="Rivera"
                autoComplete="family-name"
                className="bg-muted focus-visible:ring-primary/20 h-11 border-none pl-10"
                required
              />
            </div>
            {errors?.fields?.lastName && (
              <p className="text-destructive text-xs">
                {errors.fields.lastName.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="auth2-email" className="text-sm font-medium">
            Work email
          </Label>
          <div className="relative">
            <MdEmail className="text-muted-foreground absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
            <Input
              id="auth2-email"
              name="email"
              type="email"
              placeholder="alex@company.io"
              autoComplete="email"
              className="bg-muted focus-visible:ring-primary/20 h-11 border-none pl-10"
              required
            />
          </div>
          {errors?.fields?.emailAddress && (
            <p className="text-destructive text-xs">
              {errors.fields.emailAddress.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="auth2-password" className="text-sm font-medium">
            Password
          </Label>
          <div className="relative">
            <MdLock className="text-muted-foreground absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
            <Input
              id="auth2-password"
              name="password"
              type="password"
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              className="bg-muted focus-visible:ring-primary/20 h-11 border-none pl-10"
              required
              minLength={8}
            />
          </div>
          {errors?.fields?.password && (
            <p className="text-destructive text-xs">
              {errors.fields.password.message}
            </p>
          )}
          <p className="text-muted-foreground text-xs">
            Use at least 8 characters with a mix of letters and numbers.
          </p>
        </div>

        {globalError && (
          <p className="text-destructive text-xs">{globalError}</p>
        )}
        {errors?.global && errors.global.length > 0 && (
          <p className="text-destructive text-xs">
            {errors.global[0].message}
          </p>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="h-11 w-full gap-2 bg-gradient-to-b from-lime-400 to-lime-500 font-semibold text-black shadow-sm hover:from-lime-300 hover:to-lime-400"
        >
          {isLoading ? "Creating account…" : submitLabel}
          {!isLoading && <MdArrowForward className="h-4 w-4" />}
        </Button>
      </form>

      <p className="text-muted-foreground mt-4 text-center text-sm">
        Already have an account?{" "}
        <a href="/auth/sign-in" className="text-primary font-medium hover:underline">
          Sign in
        </a>
      </p>

      {/* Required for Clerk bot protection */}
      <div id="clerk-captcha" />
    </Shell>
  );
}

/* ─────────────────────────── Shared Components ─────────────────────────── */

function Shell({
  heading,
  subheading,
  children,
}: {
  heading: string;
  subheading: string;
  mode: "sign-in" | "sign-up";
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 items-center justify-center px-2">
        <div className="bg-muted w-full max-w-md space-y-3 rounded-4xl p-3 shadow-[inset_0_0_2px_0.5px_rgba(0,0,0,0.05)]">
          <div className="bg-background rounded-3xl p-4 shadow-xs sm:p-8">
            <div className="mb-4 space-y-1">
              <h1 className="text-foreground text-2xl font-extrabold tracking-tight sm:text-3xl">
                {heading}
              </h1>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {subheading}
              </p>
            </div>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

function SocialButtons({
  onGoogle,
  onMicrosoft,
  disabled,
}: {
  onGoogle: () => void;
  onMicrosoft: () => void;
  disabled: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-muted rounded-xl p-1 shadow-[inset_0_0_2px_0.5px_rgba(0,0,0,0.05)]">
        <Button
          variant="outline"
          type="button"
          disabled={disabled}
          onClick={onGoogle}
          className="hover:bg-background/80 dark:bg-background dark:hover:bg-background/80 h-11 w-full gap-2 border-none text-sm font-medium shadow-xs"
        >
          <FaGoogle className="h-4 w-4" />
          Google
        </Button>
      </div>
      <div className="bg-muted rounded-xl p-1 shadow-[inset_0_0_2px_0.5px_rgba(0,0,0,0.05)]">
        <Button
          variant="outline"
          type="button"
          disabled={disabled}
          onClick={onMicrosoft}
          className="hover:bg-background/80 dark:bg-background dark:hover:bg-background/80 h-11 w-full gap-2 border-none text-sm font-medium shadow-xs"
        >
          <FaMicrosoft className="h-4 w-4" />
          Microsoft
        </Button>
      </div>
    </div>
  );
}

function DividerText({ text }: { text: string }) {
  return (
    <div className="my-4 flex items-center gap-3">
      <Separator className="flex-1" />
      <span className="text-muted-foreground shrink-0 text-xs">{text}</span>
      <Separator className="flex-1" />
    </div>
  );
}
