"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer";
import { API_ENDPOINTS } from "@/config/api";

export default function RecipeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const recipeId = params.id;
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedRecipes, setRelatedRecipes] = useState([]);

  useEffect(() => {
    // ✅ Protected route check
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Fetch recipe details
    const fetchRecipe = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(API_ENDPOINTS.RECIPE_BY_ID(recipeId), {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) {
          const data = await res.json();
          setRecipe(data.data || data);
        } else {
          // If recipe not found, redirect or show error
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error fetching recipe:", error);
        router.push("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch related recipes
    const fetchRelatedRecipes = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(API_ENDPOINTS.RECIPES, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) {
          const json = await res.json();
          const items = Array.isArray(json?.data) ? json.data : [];
          // Get 4 random recipes excluding current one
          const filtered = items.filter((r) => r.id !== parseInt(recipeId));
          const shuffled = filtered.sort(() => 0.5 - Math.random());
          const mapped = shuffled.slice(0, 4).map((r) => ({
            id: r.id,
            title: r.title,
            cookTime: r.cookTime,
            reviews: 0,
            image: r.imageUrl || "/food_bg.png",
          }));
          setRelatedRecipes(mapped);
        }
      } catch (error) {
        console.error("Error fetching related recipes:", error);
      }
    };

    if (recipeId) {
      fetchRecipe();
      fetchRelatedRecipes();
    }
  }, [recipeId, router]);

  const renderStars = () => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading recipe...</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Recipe not found</p>
      </div>
    );
  }

  // Parse ingredients and steps from strings
  const ingredients = recipe.ingredients
    ? recipe.ingredients.split("\n").filter((item) => item.trim())
    : [];
  const steps = recipe.steps
    ? recipe.steps.split("\n").filter((step) => step.trim())
    : [];

  // Calculate total time (assuming prep time is 10 minutes if not provided)
  const prepTime = 15; // Default prep time
  const cookTime = parseInt(recipe.cookTime) || 25;
  const totalTime = prepTime + cookTime;

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
              <Link href="/discover" className="text-green-600 font-medium">
                Browse Recipes
              </Link>
              <button className="text-gray-700 hover:text-green-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
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
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Recipe Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {recipe.title}
        </h1>

        {/* Description */}
        <p className="text-lg text-gray-600 mb-6 max-w-3xl">
          {recipe.description || "A delightful and healthy dish that's perfect for any occasion."}
        </p>

        {/* Recipe Metadata */}
        <div className="flex flex-wrap gap-6 mb-6 text-gray-700">
          <div>
            <span className="font-semibold">Prep Time: </span>
            <span>{prepTime} minutes</span>
          </div>
          <div>
            <span className="font-semibold">Cook Time: </span>
            <span>{cookTime} minutes</span>
          </div>
          <div>
            <span className="font-semibold">Total Time: </span>
            <span>{totalTime} minutes</span>
          </div>
          <div>
            <span className="font-semibold">Servings: </span>
            <span>4</span>
          </div>
        </div>

        {/* Author Info */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-orange-400 flex items-center justify-center text-white font-semibold">
            {recipe.authorName?.[0] || "C"}
          </div>
          <div>
            <p className="text-sm text-gray-500">Recipe by</p>
            <p className="font-semibold text-gray-900">
              {recipe.authorName || "Chef Isabella Rodriguez"}
            </p>
          </div>
        </div>

        {/* Main Dish Image */}
        <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
          <img
            src={recipe.imageUrl || recipe.image || "/food_bg.png"}
            alt={recipe.title}
            className="w-full h-[500px] object-cover"
          />
        </div>

        {/* Two-Column Layout: Ingredients and Instructions */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Left Column - Ingredients */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ingredients</h2>
            <ul className="space-y-3">
              {ingredients.length > 0 ? (
                ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      className="mt-1 w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="text-gray-700">{ingredient.trim()}</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-500">No ingredients listed</li>
              )}
            </ul>
          </div>

          {/* Right Column - Instructions */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Instructions</h2>
            <ol className="space-y-4">
              {steps.length > 0 ? (
                steps.map((step, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="text-green-600 font-semibold min-w-[60px]">
                      Step {index + 1}:
                    </span>
                    <span className="text-gray-700 flex-1">{step.trim()}</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-500">No instructions provided</li>
              )}
            </ol>
          </div>
        </div>

        {/* You Might Also Like Section */}
        {relatedRecipes.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedRecipes.map((relatedRecipe) => (
                <Link
                  key={relatedRecipe.id}
                  href={`/recipe/${relatedRecipe.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border border-gray-100"
                >
                  <div className="aspect-square bg-cover bg-center" style={{ backgroundImage: `url('${relatedRecipe.image}')` }}></div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm line-clamp-2">
                      {relatedRecipe.title}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-gray-500 text-xs">{relatedRecipe.cookTime} min prep</span>
                      <div className="flex items-center gap-1">
                        {renderStars()}
                        <span className="text-xs text-gray-500">({relatedRecipe.reviews})</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

