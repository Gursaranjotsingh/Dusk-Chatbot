import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../hooks/useAuth";

const Register = () => {
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await googleLogin(credentialResponse.credential);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Google sign-in failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username.trim() || !form.email.trim() || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }
    if (form.username.trim().length < 3) {
      toast.error("Username must be at least 3 characters");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await register(form.username.trim(), form.email.trim(), form.password);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-dusk-50 via-dusk-100 to-dusk-50 dark:from-dusk-950 dark:via-dusk-900 dark:to-dusk-950">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber to-amber-dark flex items-center justify-center">
            <span className="text-white font-display font-bold text-2xl">D</span>
          </div>
          <h1 className="font-display font-bold text-2xl">Create your account</h1>
          <p className="text-sm text-dusk-400 mt-1">
            Join Dusk and start chatting in real time.
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
              text="signup_with"
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
              Username
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
              Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="jane@example.com"
              autoComplete="email"
              className="w-full px-4 py-2.5 rounded-xl bg-dusk-100 dark:bg-dusk-800 text-sm focus-ring"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-dusk-400 mb-1.5">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              autoComplete="new-password"
              className="w-full px-4 py-2.5 rounded-xl bg-dusk-100 dark:bg-dusk-800 text-sm focus-ring"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-br from-teal to-dusk-600 text-white font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 focus-ring"
          >
            {loading ? "Creating account…" : "Sign up"}
          </button>
        </form>

        <p className="text-center text-sm text-dusk-400 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-teal-dark dark:text-teal font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
