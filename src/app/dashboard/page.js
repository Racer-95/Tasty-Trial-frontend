"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer";
import { API_ENDPOINTS } from "@/config/api";

export default function Dashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const categories = [
    { name: "Breakfast", count: 12 },
    { name: "Lunch", count: 18 },
    { name: "Dinner", count: 24 },
    { name: "Desserts", count: 15 }
  ];

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
          const mapped = items.map((r) => ({
            id: r.id,
            title: r.title,
            description: r.description,
            cookTime: r.cookTime,
            image: r.imageUrl || "/food_bg.png",
            category: r.category || ""
          }));
          setFeaturedRecipes(mapped);
        })
        .catch(() => setFeaturedRecipes([]));
    }
  }, [isLoading]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const initials = "U";

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
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-green-600 transition-colors"
              >
                Logout
              </button>
            </nav>
            <div className="flex items-center gap-4 relative">
              <button
                onClick={() => router.push("/post-recipe")}
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                + Post Recipe
              </button>
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="w-9 h-9 rounded-full bg-green-100 text-green-700 font-semibold flex items-center justify-center border border-green-200 hover:bg-green-200"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                {initials}
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-12 w-44 bg-white border border-gray-200 rounded-lg shadow-md z-50">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setMenuOpen(false)}
                  >
                    Edit Profile
                  </Link>
                  <button
                    onClick={() => { setMenuOpen(false); handleLogout(); }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

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
            <Link href="/post-recipe" className="text-green-600 hover:text-green-700 font-medium">
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
                    <span className="text-green-600 hover:text-green-700 font-medium text-sm">
                      View Recipe →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Categories Section */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div
                key={category.name}
                className="bg-gradient-to-br from-green-50 to-orange-50 rounded-lg p-6 text-center hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-gray-600 text-sm">{category.count} recipes</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
