"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import Footer from "@/components/Footer";
import { API_ENDPOINTS } from "@/config/api";

export default function PostRecipePage() {
  const router = useRouter();
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
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // imageUrl is captured via text input now

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("Posting your recipe...");

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("You need to be logged in to post a recipe.");
      router.push("/login");
      return;
    }

    try {
      // Use provided image URL string
      const imageUrl = (formData.imageUrl || "").trim();

      // Prepare JSON data for request body
      const storedUserId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
      const authorId = storedUserId ? Number(storedUserId) : null;
      const requestData = {
        title: formData.title,
        description: formData.description,
        ingredients: formData.ingredients,
        steps: formData.steps,
        cookTime: parseInt(formData.cookTime) || 0,
        cusine: formData.cusine,
        category: formData.category,
        imageUrl: imageUrl, // direct URL string
        likes: 0,
        authorId
      };

      await axios.post(
        API_ENDPOINTS.RECIPES,
        requestData,
  );

      setMessage("🎉 Recipe posted successfully!");
      setFormData({
        title: "",
        description: "",
        ingredients: "",
        steps: "",
        cookTime: "",
        cusine: "",
        category: "",
        imageUrl: "",
      });
      // Redirect to dashboard after successful post
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Error posting recipe:", error);
      if (error.response?.data?.message) {
        setMessage(`⚠️ ${error.response.data.message}`);
      } else if (error.response?.data) {
        setMessage(`⚠️ ${JSON.stringify(error.response.data)}`);
      } else if (error.message) {
        setMessage(`⚠️ ${error.message}`);
      } else {
        setMessage("⚠️ Failed to post recipe. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

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
              <Link href="/post-recipe" className="text-green-600 font-medium">
                Post Recipe
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-green-600 transition-colors"
              >
                Logout
              </button>
            </nav>
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/post-recipe")}
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                + Post Recipe
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Share a New Recipe
          </h1>
          <p className="text-gray-600">
            Add your tasty creation so others can try it out.
          </p>
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
              placeholder="List ingredients, one per line.&#10;e.g.&#10;2 cups flour&#10;1 cup milk&#10;3 eggs"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20 min-h-[150px] resize-y font-mono"
              required
            />
            <p className="text-xs text-gray-500">
              Enter each ingredient on a new line
            </p>
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
              placeholder="Explain the cooking steps clearly so anyone can follow along.&#10;e.g.&#10;Step 1: Preheat the oven to 350°F&#10;Step 2: Mix the ingredients..."
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20 min-h-[180px] resize-y"
              required
            />
            <p className="text-xs text-gray-500">
              Enter each step on a new line
            </p>
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
              <p className="text-xs text-gray-500">
                Paste a direct link to your dish photo (required)
              </p>
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-lg ${
              message.includes("🎉") 
                ? "bg-green-50 text-green-800 border border-green-200" 
                : "bg-red-50 text-red-800 border border-red-200"
            }`}>
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
              disabled={submitting}
              className="flex-1 md:flex-auto bg-green-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm shadow-sm transition hover:bg-green-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Posting..." : "Post Recipe"}
            </button>
          </div>
        </form>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}


