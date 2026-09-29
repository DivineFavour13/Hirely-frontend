import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AuthBrandPanel } from "@/components/shared/AuthBrandPanel";
import type { Role } from "@/types/auth";

const roleOptions: { value: Role; label: string; hint: string }[] = [
  { value: "APPLICANT", label: "Applicant", hint: "Browse jobs and track your applications" },
  { value: "COMPANY_REP", label: "Company rep", hint: "Post jobs and manage candidates" },
];

export function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("APPLICANT");
  const [companyId, setCompanyId] = useState("");
  const [applicantId, setApplicantId] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await register({
        email,
        password,
        role,
        companyId: role === "COMPANY_REP" && companyId ? Number(companyId) : undefined,
        applicantId: role === "APPLICANT" && applicantId ? Number(applicantId) : undefined,
      });
      navigate("/dashboard");
    } catch {
      setError("Something went wrong. That email may already be registered.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <AuthBrandPanel
        headline="Built for how hiring actually works."
        subtext="Whether you're posting roles or applying to them, everything lives in one place, with a clear view of where things stand."
      />

      <div className="flex items-center justify-center bg-white px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-[22px] font-semibold tracking-tight text-slate-900">
              Create your account
            </h2>
            <p className="mt-1.5 text-sm text-slate-500">
              Choose how you'll be using Hirely.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-[13px] font-medium text-slate-700">
                I am a
              </label>
              <div className="grid gap-2">
                {roleOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setRole(opt.value)}
                    className={`flex flex-col rounded-lg border px-3.5 py-2.5 text-left transition-colors ${
                      role === opt.value
                        ? "border-indigo-400 bg-indigo-50/60 ring-4 ring-indigo-500/10"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <span className="text-[14px] font-medium text-slate-900">
                      {opt.label}
                    </span>
                    <span className="text-[12.5px] text-slate-500">{opt.hint}</span>
                  </button>
                ))}
              </div>
            </div>

            {role === "COMPANY_REP" && (
              <div>
                <label
                  htmlFor="companyId"
                  className="mb-1.5 block text-[13px] font-medium text-slate-700"
                >
                  Company ID
                </label>
                <input
                  id="companyId"
                  type="number"
                  value={companyId}
                  onChange={(e) => setCompanyId(e.target.value)}
                  placeholder="Provided by your admin"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-[14px] text-slate-900 placeholder:text-slate-400 transition-colors focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>
            )}

            {role === "APPLICANT" && (
              <div>
                <label
                  htmlFor="applicantId"
                  className="mb-1.5 block text-[13px] font-medium text-slate-700"
                >
                  Applicant ID <span className="font-normal text-slate-400">(optional)</span>
                </label>
                <input
                  id="applicantId"
                  type="number"
                  value={applicantId}
                  onChange={(e) => setApplicantId(e.target.value)}
                  placeholder="Leave blank if you don't have one yet"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-[14px] text-slate-900 placeholder:text-slate-400 transition-colors focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-[13px] font-medium text-slate-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@company.com"
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-[14px] text-slate-900 placeholder:text-slate-400 transition-colors focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-[13px] font-medium text-slate-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="At least 6 characters"
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-[14px] text-slate-900 placeholder:text-slate-400 transition-colors focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-rose-100 bg-rose-50 px-3.5 py-2.5 text-[13px] text-rose-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="group flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-slate-800 disabled:opacity-50"
            >
              {isSubmitting ? "Creating account…" : "Create account"}
              {!isSubmitting && (
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              )}
            </button>
          </form>

          <p className="mt-7 text-center text-[13px] text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-slate-900 hover:text-indigo-600">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}