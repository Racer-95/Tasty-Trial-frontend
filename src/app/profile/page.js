"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import Footer from "@/components/Footer";
import { API_ENDPOINTS } from "@/config/api";

function decodeTokenEmail(token) {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = JSON.parse(typeof window !== "undefined" ? atob(base64) : Buffer.from(base64, "base64").toString("utf-8"));
    return json?.email || "";
  } catch {
    return "";
  }
}

export default function ProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const token = useMemo(() => (typeof window !== "undefined" ? localStorage.getItem("token") : null), []);
  const emailFromToken = useMemo(() => (token ? decodeTokenEmail(token) : ""), [token]);

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }
    // Fetch users and locate current by email to get id and name
    axios
      .get(API_ENDPOINTS.USERS, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        const list = Array.isArray(res.data?.data) ? res.data.data : [];
        const me = list.find((u) => u.email === emailFromToken);
        if (me) {
          setUserId(me.id);
          setFormData({ name: me.name || "", email: me.email || "", password: "" });
        } else {
          // Fallback: prefill email from token
          setFormData((p) => ({ ...p, email: emailFromToken }));
        }
      })
      .catch(() => {
        // Prefill email at least
        setFormData((p) => ({ ...p, email: emailFromToken }));
      })
      .finally(() => setIsLoading(false));
  }, [router, token, emailFromToken]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      setMessage("⚠️ Could not resolve your user. Try re-login.");
      return;
    }
    setMessage("Saving changes...");
    try {
      const payload = { name: formData.name, email: formData.email };
      if (formData.password) payload.password = formData.password;
      await axios.put(`${API_ENDPOINTS.USER_BY_ID(userId)}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("✅ Profile updated successfully!");
    } catch (error) {
      if (error.response?.data?.message) {
        setMessage(`⚠️ ${error.response.data.message}`);
      } else {
        setMessage("⚠️ Failed to update profile.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍴</span>
              <Link href="/dashboard" className="text-xl font-bold text-green-600">
                Tasty Trail
              </Link>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/dashboard" className="text-gray-700 hover:text-green-600 transition-colors">
                Home
              </Link>
              <Link href="/discover" className="text-gray-700 hover:text-green-600 transition-colors">
                Discover
              </Link>
              <Link href="/post-recipe" className="text-gray-700 hover:text-green-600 transition-colors">
                Post Recipe
              </Link>
              <button onClick={handleLogout} className="text-gray-700 hover:text-green-600 transition-colors">
                Logout
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Edit Profile</h1>
          <p className="text-gray-600">Update your account details below.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md border border-gray-200 p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-semibold text-gray-900">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-900">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-900">
              New Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Leave blank to keep current password"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
            />
          </div>

          {message && (
            <div className={`p-4 rounded-lg ${message.startsWith("✅") ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"}`}>
              <p className="text-sm font-medium">{message}</p>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="flex-1 md:flex-none px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 md:flex-auto bg-green-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm shadow-sm transition hover:bg-green-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
