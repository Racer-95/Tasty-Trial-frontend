"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { API_ENDPOINTS } from "@/config/api";

export default function MyRecipesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);

  async function handleDelete(id) {
    const token = localStorage.getItem("token");
    if (!confirm("Delete this recipe? This cannot be undone.")) return;
    try {
      await fetch(API_ENDPOINTS.RECIPE_BY_ID(id), {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setRecipes((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      // no-op; could show toast
    }

  }

  function handleEdit(id) {
    router.push(`/recipe/${id}/edit`);
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = Number(localStorage.getItem("userId"));
    if (!token) {
      router.push("/login");
      return;
    }
    if (!userId) {
      router.push("/dashboard");
      return;
    }

    setIsLoading(false);

    fetch(API_ENDPOINTS.RECIPES)
      .then((res) => res.json())
      .then((json) => {
        const items = Array.isArray(json?.data) ? json.data : [];
        const mine = items.filter((r) => r.authorId === userId);
        const mapped = mine.map((r) => ({
          id: r.id,
          title: r.title,
          cookTime: r.cookTime,
          image: r.imageUrl || "/food_bg.png",
          category: r.category || "",
        }));
        setRecipes(mapped);
      })
      .catch(() => setRecipes([]));
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Recipes</h1>
          <Link href="/post-recipe" className="text-green-600 hover:text-green-700 font-medium">
            + New Recipe
          </Link>
        </div>

        {recipes.length === 0 ? (
          <div className="text-center text-gray-600">No recipes yet. Start by posting one!</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.map((recipe) => (
              <Link
                key={recipe.id}
                href={`/recipe/${recipe.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border border-gray-100"
              >
                <div className="relative aspect-square bg-cover bg-center" style={{ backgroundImage: `url('${recipe.image}')` }}>
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(recipe.id); }}
                    className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleEdit(recipe.id); }}
                    className="absolute top-2 left-2 bg-white text-gray-800 text-xs px-2 py-1 rounded border border-gray-200 hover:bg-gray-50"
                  >
                    Edit
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm">{recipe.title}</h3>
                  {recipe.category && (
                    <span className="inline-block text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded mb-2">
                      {recipe.category}
                    </span>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1 text-gray-500 text-xs">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {recipe.cookTime} min
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
