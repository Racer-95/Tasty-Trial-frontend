"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function PostRecipePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    ingredients: "",
    steps: "",
    cookTime: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    setImageFile(file || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("Posting your recipe...");

    if (!imageFile) {
      setSubmitting(false);
      setMessage("⚠️ Please upload an image of your dish before posting.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("You need to be logged in to post a recipe.");
      router.push("/login");
      return;
    }

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("ingredients", formData.ingredients);
      data.append("steps", formData.steps);
      data.append("cookTime", formData.cookTime);

      if (imageFile) {
        data.append("image", imageFile);
      }

      await axios.post(
        "https://tasty-trail-backend.onrender.com/recipes",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("🎉 Recipe posted successfully!");
      setFormData({
        title: "",
        description: "",
        ingredients: "",
        steps: "",
        cookTime: "",
      });
      setImageFile(null);
    } catch (error) {
      if (error.response?.data?.message) {
        setMessage(`⚠️ ${error.response.data.message}`);
      } else {
        setMessage("⚠️ Failed to post recipe. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="relative flex min-h-screen w-screen items-center justify-center font-sans text-zinc-900 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/food_bg.png')" }}
    >
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      <div className="relative z-10 bg-black/50 rounded-2xl shadow-xl px-8 py-10 max-w-2xl w-[94%] md:w-[80%] backdrop-blur-[2px] border border-white/40 text-left text-orange-50">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-orange-400 drop-shadow-sm">
            Share a new recipe
          </h1>
          <button
            onClick={() => router.push("/dashboard")}
            className="text-xs md:text-sm text-orange-200 hover:text-white underline-offset-4 hover:underline"
          >
            ← Back to dashboard
          </button>
        </div>

        <p className="mb-6 text-sm text-orange-100/90">
          Add your tasty creation so others can try it out.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="title" className="block text-sm font-semibold text-orange-100">
              Recipe title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Creamy Garlic Pasta"
              className="w-full rounded-lg border border-orange-300/70 bg-white/90 px-4 py-2.5 text-sm text-orange-950 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-300/60"
              required
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="description" className="block text-sm font-semibold text-orange-100">
              Short description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="A quick overview of the recipe and what makes it special."
              className="w-full rounded-lg border border-orange-300/70 bg-white/90 px-4 py-2.5 text-sm text-orange-950 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-300/60 min-h-[70px]"
              required
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="ingredients" className="block text-sm font-semibold text-orange-100">
              Ingredients
            </label>
            <textarea
              id="ingredients"
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              placeholder="List ingredients, one per line."
              className="w-full rounded-lg border border-orange-300/70 bg-white/90 px-4 py-2.5 text-sm text-orange-950 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-300/60 min-h-[110px]"
              required
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="steps" className="block text-sm font-semibold text-orange-100">
              Steps
            </label>
            <textarea
              id="steps"
              name="steps"
              value={formData.steps}
              onChange={handleChange}
              placeholder="Explain the cooking steps clearly so anyone can follow along."
              className="w-full rounded-lg border border-orange-300/70 bg-white/90 px-4 py-2.5 text-sm text-orange-950 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-300/60 min-h-[130px]"
              required
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="cookTime" className="block text-sm font-semibold text-orange-100">
              Cook time (minutes)
            </label>
            <input
              id="cookTime"
              name="cookTime"
              type="number"
              min="1"
              value={formData.cookTime}
              onChange={handleChange}
              placeholder="e.g. 30"
              className="w-full max-w-xs rounded-lg border border-orange-300/70 bg-white/90 px-4 py-2.5 text-sm text-orange-950 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-300/60"
              required
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="image" className="block text-sm font-semibold text-orange-100">
              Dish image
            </label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
              className="block w-full text-sm text-orange-100 file:mr-3 file:rounded-lg file:border-0 file:bg-orange-500 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:bg-orange-600 cursor-pointer"
            />
            <p className="text-xs text-orange-200/80">
              Upload a clear, well-lit photo of your dish (required).
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-3 w-full rounded-xl bg-gradient-to-r from-orange-600 to-red-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Posting..." : "Post recipe"}
          </button>
        </form>

        {message && (
          <p className="mt-5 text-center text-sm font-medium text-orange-100 bg-orange-900/30 py-2.5 rounded-lg shadow-sm">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}


