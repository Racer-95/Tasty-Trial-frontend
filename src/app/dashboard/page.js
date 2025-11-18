"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("Loading users...");

  useEffect(() => {
    const fetchUsers = async () => {
      // ✅ 1️⃣ Check for token first
      const token = localStorage.getItem("token");

      if (!token) {
        // 🔒 No token → redirect to /login
        router.push("/login");
        return;
      }

      try {
        // ✅ 2️⃣ Fetch protected data
        const res = await axios.get("https://tasty-trail-backend.onrender.com/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsers(res.data.data);
        setMessage("");
      } catch (error) {
        // ❌ Invalid/expired token → redirect to /login
        console.error(error);
        localStorage.removeItem("token");
        router.push("/login");
      }
    };

    fetchUsers();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 p-6">
      <div className="flex w-full max-w-2xl justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">🍴 Dashboard</h1>
        <button
          onClick={handleLogout}
          className="rounded-md bg-red-500 text-white px-4 py-2 text-sm hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {message && <p className="text-zinc-700 mb-4">{message}</p>}

      {users.length > 0 && (
        <table className="min-w-[400px] border border-zinc-300 bg-white rounded-md shadow-sm">
          <thead>
            <tr className="bg-zinc-100">
              <th className="px-4 py-2 border-b text-left">ID</th>
              <th className="px-4 py-2 border-b text-left">Name</th>
              <th className="px-4 py-2 border-b text-left">Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-2 border-b">{u.id}</td>
                <td className="px-4 py-2 border-b">{u.name}</td>
                <td className="px-4 py-2 border-b">{u.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
