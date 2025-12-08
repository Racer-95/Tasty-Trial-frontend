"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { API_ENDPOINTS } from "@/config/api";

export default function Dashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // ✅ Protected route check
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!isLoading) {
      const token = localStorage.getItem("token");
      fetch(API_ENDPOINTS.RECIPES, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
        .then((res) => res.json())
        .then((json) => {
          const items = Array.isArray(json?.data) ? json.data : [];
          // Sort by creation date (newest first) and take first 6
          const recentRecipes = items
            .sort((a, b) => {
              const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
              const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
              return dateB - dateA;
            })
            .slice(0, 6)
            .map((r) => ({
              id: r.id,
              title: r.title,
              description: r.description,
              cookTime: r.cookTime,
              image: r.imageUrl || "/food_bg.png",
              category: r.category || "",
              likes: typeof r.likes === "number" ? r.likes : 0,
              createdAt: r.createdAt || null
            }));
          setFeaturedRecipes(recentRecipes);
        })
        .catch(() => setFeaturedRecipes([]));
    }
  }, [isLoading]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const initials = "👤";

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

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-50 to-orange-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to Tasty Trail
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover and share delicious recipes from around the world. Your culinary journey starts here.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Recipes Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Recipes</h2>
            <Link href="/discover" className="text-green-600 hover:text-green-700 font-medium">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRecipes.map((recipe) => (
              <Link
                key={recipe.id}
                href={`/recipe/${recipe.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border border-gray-100"
              >
                <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url('${recipe.image}')` }}>
                  <div className="h-full bg-black/30 flex items-end p-4">
                    <span className="bg-white/90 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
                      {recipe.category}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{recipe.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{recipe.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">⏱ {recipe.cookTime} min</span>
                   
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
