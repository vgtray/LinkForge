import { GradientBlur } from "@/components/shared/GradientBlur";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[var(--lf-bg-primary)]">
      <GradientBlur variant="hero" />
      <div className="w-full max-w-md px-4">{children}</div>
    </div>
  );
}
