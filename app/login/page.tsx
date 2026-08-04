import { AuthForm } from "@/components/AuthForm";
import { ThemeSelector } from "@/components/ThemeSelector";

export default function LoginPage() {
  return (
    <div className="login-hero min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 sm:py-10">
        <div className="flex justify-end">
          <ThemeSelector />
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-8 py-8 sm:py-12">
          <div className="text-center space-y-3 max-w-2xl">
            <p className="text-sm uppercase tracking-[0.2em] opacity-70">Your shows · Your spend · Your fun</p>
            <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-primary drop-shadow-sm">
              Concert Cost Tracker
            </h1>
            <p className="text-base sm:text-lg opacity-80 max-w-lg mx-auto">
              Log every show, add up the real costs, and find out which concerts
              gave you the most fun for your money.
            </p>
          </div>

          <AuthForm />
        </div>
      </div>
    </div>
  );
}
