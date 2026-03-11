import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    const userData = {
      id: "123",
      fullName: "Test Man",
      email: loginData.email,
      role: "admin",
      isAdmin: true,
      permissions: {
        create: true,
        update: true,
        delete: true,
      },
    };

    login(userData);
    navigate("/community");
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();

    if (signupData.password !== signupData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const userData = {
      id: "124",
      fullName: signupData.fullName,
      email: signupData.email,
      role: "member",
      isAdmin: false,
      permissions: {
        create: false,
        update: false,
        delete: false,
      },
    };

    login(userData);
    navigate("/community");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f7f8] px-4">
      <div className="w-full max-w-md rounded-[28px] border border-[#e7e8ec] bg-white p-8 shadow-[0_20px_50px_rgba(17,24,39,0.08)] transition-all duration-300">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-[-0.03em] text-[#1f1f24]">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="mt-2 text-[15px] text-[#7c7f8a]">
            {isSignup
              ? "Sign up to join the Vimaux community"
              : "Login to access the Vimaux community"}
          </p>
        </div>

        {!isSignup ? (
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#40424a]">
                Email
              </label>
              <div className="flex items-center gap-3 rounded-2xl border border-[#d9dbe3] px-4 py-3 focus-within:border-[#4169E1]">
                <Mail className="h-5 w-5 text-[#8a8d97]" />
                <input
                  type="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  placeholder="Enter your email"
                  className="w-full bg-transparent text-[15px] outline-none placeholder:text-[#a0a3ad]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#40424a]">
                Password
              </label>
              <div className="flex items-center gap-3 rounded-2xl border border-[#d9dbe3] px-4 py-3 focus-within:border-[#4169E1]">
                <Lock className="h-5 w-5 text-[#8a8d97]" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  placeholder="Enter your password"
                  className="w-full bg-transparent text-[15px] outline-none placeholder:text-[#a0a3ad]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-[#8a8d97]"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-[#4169E1] px-5 py-3 font-semibold text-white transition hover:bg-[#3558c9]"
            >
              Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignupSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#40424a]">
                Full Name
              </label>
              <div className="flex items-center gap-3 rounded-2xl border border-[#d9dbe3] px-4 py-3 focus-within:border-[#4169E1]">
                <User className="h-5 w-5 text-[#8a8d97]" />
                <input
                  type="text"
                  name="fullName"
                  value={signupData.fullName}
                  onChange={handleSignupChange}
                  placeholder="Enter your full name"
                  className="w-full bg-transparent text-[15px] outline-none placeholder:text-[#a0a3ad]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#40424a]">
                Email
              </label>
              <div className="flex items-center gap-3 rounded-2xl border border-[#d9dbe3] px-4 py-3 focus-within:border-[#4169E1]">
                <Mail className="h-5 w-5 text-[#8a8d97]" />
                <input
                  type="email"
                  name="email"
                  value={signupData.email}
                  onChange={handleSignupChange}
                  placeholder="Enter your email"
                  className="w-full bg-transparent text-[15px] outline-none placeholder:text-[#a0a3ad]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#40424a]">
                Password
              </label>
              <div className="flex items-center gap-3 rounded-2xl border border-[#d9dbe3] px-4 py-3 focus-within:border-[#4169E1]">
                <Lock className="h-5 w-5 text-[#8a8d97]" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={signupData.password}
                  onChange={handleSignupChange}
                  placeholder="Create a password"
                  className="w-full bg-transparent text-[15px] outline-none placeholder:text-[#a0a3ad]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#40424a]">
                Confirm Password
              </label>
              <div className="flex items-center gap-3 rounded-2xl border border-[#d9dbe3] px-4 py-3 focus-within:border-[#4169E1]">
                <Lock className="h-5 w-5 text-[#8a8d97]" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={signupData.confirmPassword}
                  onChange={handleSignupChange}
                  placeholder="Confirm your password"
                  className="w-full bg-transparent text-[15px] outline-none placeholder:text-[#a0a3ad]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-[#4169E1] px-5 py-3 font-semibold text-white transition hover:bg-[#3558c9]"
            >
              Sign Up
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-[15px] text-[#6f7380]">
          {!isSignup ? (
            <>
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => setIsSignup(true)}
                className="font-semibold text-[#4169E1] hover:underline"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setIsSignup(false)}
                className="font-semibold text-[#4169E1] hover:underline"
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}