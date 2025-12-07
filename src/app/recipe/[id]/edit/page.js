"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import axios from "axios";
import Footer from "@/components/Footer";
import { API_ENDPOINTS } from "@/config/api";

export default function EditRecipePage() {
  const router = useRouter();
  const params = useParams();
  const recipeId = Number(params?.id);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    ingredients: "",
    steps: "",
    cookTime: "",
    cusine: "",
    category: "",
    imageUrl: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    if (!recipeId) return;

    // Fetch existing recipe
    axios
      .get(API_ENDPOINTS.RECIPE_BY_ID(recipeId))
      .then((res) => {
        const r = res.data?.data;
        if (!r) return;
        setFormData({
          title: r.title || "",
          description: r.description || "",
          ingredients: r.ingredients || "",
          steps: r.steps || "",
          cookTime: String(r.cookTime ?? ""),
          cusine: r.cusine || "",
          category: r.category || "",
          imageUrl: r.imageUrl || "",
        });
      })
      .finally(() => setIsLoading(false));
  }, [router, recipeId]);

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
    setSubmitting(true);
    setMessage("Updating recipe...");

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("You need to be logged in.");
      router.push("/login");
      return;
    }

    try {
      const storedUserId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
      const authorId = storedUserId ? Number(storedUserId) : undefined;
      const payload = {
        title: formData.title,
        description: formData.description,
        ingredients: formData.ingredients,
        steps: formData.steps,
        cookTime: parseInt(formData.cookTime) || 0,
        cusine: formData.cusine,
        category: formData.category,
        imageUrl: (formData.imageUrl || "").trim(),
      };
      if (authorId != null) payload.authorId = authorId;

      await axios.put(API_ENDPOINTS.RECIPE_BY_ID(recipeId), payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("✅ Recipe updated successfully!");
      setTimeout(() => router.push("/my-recipes"), 1000);
    } catch (error) {
      if (error.response?.data?.message) {
        setMessage(`⚠️ ${error.response.data.message}`);
      } else {
        setMessage("⚠️ Failed to update recipe.");
      }
    } finally {
      setSubmitting(false);
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
      <Header />

      {/* Main Content */}
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Edit Recipe</h1>
          <p className="text-gray-600">Update your recipe details below.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md border border-gray-200 p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-semibold text-gray-900">
              Recipe title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Creamy Garlic Pasta"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-semibold text-gray-900">
              Short description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="A quick overview of the recipe and what makes it special."
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20 min-h-[100px] resize-y"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="ingredients" className="block text-sm font-semibold text-gray-900">
              Ingredients
            </label>
            <textarea
              id="ingredients"
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              placeholder="List ingredients, one per line."
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20 min-h-[150px] resize-y font-mono"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="steps" className="block text-sm font-semibold text-gray-900">
              Instructions
            </label>
            <textarea
              id="steps"
              name="steps"
              value={formData.steps}
              onChange={handleChange}
              placeholder="Explain the cooking steps clearly so anyone can follow along."
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20 min-h-[180px] resize-y"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="cookTime" className="block text-sm font-semibold text-gray-900">
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
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-semibold text-gray-900">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                required
              >
                <option value="">Select a category</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Desserts">Desserts</option>
                <option value="Snacks">Snacks</option>
                <option value="Beverages">Beverages</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="cusine" className="block text-sm font-semibold text-gray-900">
                Cuisine <span className="text-red-500">*</span>
              </label>
              <select
                id="cusine"
                name="cusine"
                value={formData.cusine}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                required
              >
                <option value="">Select a cuisine</option>
                <option value="Italian">Italian</option>
                <option value="Mexican">Mexican</option>
                <option value="Indian">Indian</option>
                <option value="Asian">Asian</option>
                <option value="Mediterranean">Mediterranean</option>
                <option value="American">American</option>
                <option value="French">French</option>
                <option value="Thai">Thai</option>
                <option value="Chinese">Chinese</option>
                <option value="Japanese">Japanese</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="imageUrl" className="block text-sm font-semibold text-gray-900">
                Image URL <span className="text-red-500">*</span>
              </label>
              <input
                id="imageUrl"
                name="imageUrl"
                type="url"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/your-image.jpg"
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
              />
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-lg ${
              message.startsWith("✅")
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}>
              <p className="text-sm font-medium">{message}</p>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.push("/my-recipes")}
              className="flex-1 md:flex-none px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 md:flex-auto bg-green-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm shadow-sm transition hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Updating..." : "Update Recipe"}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
