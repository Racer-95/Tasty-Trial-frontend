"use client";
import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { API_ENDPOINTS } from "@/config/api";

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Authenticating...");

    try {
      // 🔹 Send credentials to backend
      const res = await axios.post(API_ENDPOINTS.LOGIN, formData);

      if (res.status === 200) {
        // ✅ Save JWT token in localStorage
        localStorage.setItem("token", res.data.token);
        if (res.data?.email) {
          localStorage.setItem("email", res.data.email);
        }

        // 🔹 Option B: Resolve and store userId for future requests (e.g., authorId on recipe)
        try {
          const token = res.data.token;
          const email = res.data?.email;
          if (token && email) {
            const usersRes = await axios.get(API_ENDPOINTS.USERS, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const list = Array.isArray(usersRes.data?.data) ? usersRes.data.data : [];
            const me = list.find((u) => u.email === email);
            if (me?.id != null) {
              localStorage.setItem("userId", String(me.id));
              if (me.name) localStorage.setItem("name", me.name);
            }
          }
        } catch (_) {
          // Non-blocking: proceed even if userId fetch fails
        }

        // ✅ Optionally show success message
        setMessage("✅ Login successful! Redirecting to dashboard...");

        // ✅ Redirect to /dashboard after a short delay
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 800);

        // Reset form
        setFormData({ email: "", password: "" });
      }
    } catch (error) {
      if (error.response) {
        setMessage(`⚠️ ${error.response.data.message}`);
      } else {
        setMessage("⚠️ Something went wrong!");
      }
    }
  };
  return (
    <main
      className="relative flex h-screen w-screen items-center justify-center font-sans text-zinc-900 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/food_bg.png')" }}
    >
      {/* Faded overlay (same as welcome) */}
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      {/* LOGIN CARD - matches welcome page styling */}
      <div className="relative z-10 bg-black/50 rounded-2xl shadow-xl px-10 py-12 max-w-md w-[90%] backdrop-blur-[2px] border border-white/40 text-center">
        <h1 className="mb-1 text-2xl font-bold text-orange-500 drop-shadow-sm">
          Welcome back on Tasty Trail
        </h1>
        <p className="mb-6 text-sm text-orange-200">
          Login to continue your culinary journey.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5 text-left">
            <label htmlFor="email" className="block text-sm font-semibold text-orange-200">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-orange-300 bg-white/90 px-4 py-2.5 text-sm text-orange-900 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-300/60"
              autoComplete="email"
            />
          </div>

          <div className="space-y-1.5 text-left">
            <label htmlFor="password" className="block text-sm font-semibold text-orange-200">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full rounded-lg border border-orange-300 bg-white/90 px-4 py-2.5 text-sm text-orange-900 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-300/60"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-xl bg-gradient-to-r from-orange-600 to-red-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:opacity-90 active:scale-[0.98]"
          >
            Log in
          </button>
        </form>

        {message && (
          <p className="mt-5 text-center text-sm font-medium text-orange-200 bg-orange-900/20 py-2 rounded-lg shadow-sm">
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-sm text-orange-200">
          New here?{" "}
          <Link href="/signup" className="font-semibold text-red-400 underline-offset-4 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );


  // return (
  //   <div className="mx-auto w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
  //     <h1 className="mb-1 text-2xl font-semibold text-zinc-900">Welcome back</h1>
  //     <p className="mb-6 text-sm text-zinc-500">
  //       Login to continue your journey.
  //     </p>

  //     <form onSubmit={handleSubmit} className="space-y-4">
  //       <div className="space-y-1.5">
  //         <label
  //           htmlFor="email"
  //           className="block text-sm font-medium text-zinc-800"
  //         >
  //           Email
  //         </label>
  //         <input
  //           id="email"
  //           name="email"
  //           type="email"
  //           value={formData.email}
  //           onChange={handleChange}
  //           placeholder="you@example.com"
  //           className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-400"
  //           autoComplete="email"
  //         />
  //       </div>

  //       <div className="space-y-1.5">
  //         <label
  //           htmlFor="password"
  //           className="block text-sm font-medium text-zinc-800"
  //         >
  //           Password
  //         </label>
  //         <input
  //           id="password"
  //           name="password"
  //           type="password"
  //           value={formData.password}
  //           onChange={handleChange}
  //           placeholder="••••••••"
  //           className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-400"
  //           autoComplete="current-password"
  //         />
  //       </div>

  //       <button
  //         type="submit"
  //         className="mt-2 w-full rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
  //       >
  //         Log in
  //       </button>
  //     </form>

  //     {message && (
  //       <p className="mt-4 text-center text-sm text-zinc-700">{message}</p>
  //     )}

  //     <p className="mt-4 text-center text-sm text-zinc-600">
  //       New here?{" "}
  //       <Link
  //         href="/signup"
  //         className="font-medium text-zinc-900 underline-offset-4 hover:underline"
  //       >
  //         Create an account
  //       </Link>
  //     </p>
  //   </div>
  // );
}
