import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username.trim() || !form.password) {
      toast.error("Please fill in both fields");
      return;
    }
    setLoading(true);
    try {
      await login(form.username.trim(), form.password);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await googleLogin(credentialResponse.credential);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Google sign-in failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-dusk-50 via-dusk-100 to-dusk-50 dark:from-dusk-950 dark:via-dusk-900 dark:to-dusk-950">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-teal to-dusk-600 flex items-center justify-center">
            <span className="text-white font-display font-bold text-2xl">D</span>
          </div>
          <h1 className="font-display font-bold text-2xl">Welcome back</h1>
          <p className="text-sm text-dusk-400 mt-1">
            Log in to keep the conversation going.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-dusk-900 rounded-2xl shadow-panel p-6 sm:p-8 space-y-4"
        >
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error("Google sign-in failed")}
              theme="filled_black"
              shape="pill"
              text="continue_with"
              width="280"
            />
          </div>

          <div className="flex items-center gap-3 py-1">
            <span className="h-px flex-1 bg-dusk-200 dark:bg-dusk-800" />
            <span className="text-[11px] uppercase tracking-wide text-dusk-400">
              or
            </span>
            <span className="h-px flex-1 bg-dusk-200 dark:bg-dusk-800" />
          </div>

          <div>
            <label className="block text-xs font-medium text-dusk-400 mb-1.5">
              Username or email
            </label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="jane_doe"
              autoComplete="username"
              className="w-full px-4 py-2.5 rounded-xl bg-dusk-100 dark:bg-dusk-800 text-sm focus-ring"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-dusk-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full px-4 py-2.5 pr-11 rounded-xl bg-dusk-100 dark:bg-dusk-800 text-sm focus-ring"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-dusk-400 text-xs font-medium"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-br from-amber to-amber-dark text-white font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 focus-ring"
          >
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="text-center text-sm text-dusk-400 mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-teal-dark dark:text-teal font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
