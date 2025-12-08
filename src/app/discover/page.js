"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { API_ENDPOINTS } from "@/config/api";

export default function DiscoverPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Recent");
  const [showFilters, setShowFilters] = useState(true);

  // Filter states
  const [categoryFilters, setCategoryFilters] = useState({
    Breakfast: true,
    Lunch: true,
    Dinner: true,
    Desserts: true,
    Snacks: true,
    Beverages: true,
  });

  // Dietary and Main Ingredient filters removed

  // Recipes state (fetched from backend)
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    // ✅ Protected route check
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  // Fetch recipes from backend once authenticated
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
            cookTime: r.cookTime,
            reviews: 0,
            category: r.category || "",
            image: r.imageUrl || "/food_bg.png",
            likes: typeof r.likes === "number" ? r.likes : 0,
            createdAt: r.createdAt || null,
          }));
          setRecipes(mapped);
        })
        .catch(() => setRecipes([]));
    }
  }, [isLoading]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const toggleCuisine = (cuisine) => {
    setCuisineFilters((prev) => ({ ...prev, [cuisine]: !prev[cuisine] }));
  };

  const toggleCategory = (category) => {
    setCategoryFilters((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  // Removed dietary and ingredient toggles

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
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Left Sidebar - Filters */}
          <aside className="w-80 flex-shrink-0 hidden lg:block">
            <div className="sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Discover New Recipes</h2>

              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search recipes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <svg
                    className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Sort By */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Sort By</h3>
                <div className="space-y-2">
                  {["Recent", "Prep Time"].map((option) => (
                    <button
                      key={option}
                      onClick={() => setSortBy(option)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                        sortBy === option
                          ? "bg-green-50 text-green-600 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filters */}
              <div className="border-t border-gray-200 pt-6">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full flex items-center justify-between text-lg font-semibold text-gray-900 mb-4"
                >
                  Filters
                  <svg
                    className={`w-5 h-5 transition-transform ${showFilters ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showFilters && (
                  <div className="space-y-4">

                    {/* Category */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Category</h4>
                      <div className="space-y-2 ml-2">
                        {Object.keys(categoryFilters).map((cat) => (
                          <label key={cat} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={categoryFilters[cat]}
                              onChange={() => toggleCategory(cat)}
                              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                            />
                            <span className="text-sm text-gray-700">{cat}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Right Section - Recipe Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...recipes]
                .filter((r) => {
                  if (searchQuery.trim() && !r.title.toLowerCase().includes(searchQuery.trim().toLowerCase())) {
                    return false;
                  }
                  return true;
                })
                .filter((r) => {
                  const v = categoryFilters[r.category];
                  return v === undefined ? true : !!v;
                })
                .sort((a, b) => {
                  if (sortBy === "Recent") {
                    const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    return db - da;
                  }
                  if (sortBy === "Prep Time") {
                    return (a.cookTime || 0) - (b.cookTime || 0);
                  }
                  return 0;
                })
                .map((recipe) => (
                <Link
                  key={recipe.id}
                  href={`/recipe/${recipe.id}`}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 transform hover:-translate-y-1 flex flex-col h-full"
                >
                  <div className="h-56 bg-cover bg-center flex-shrink-0" style={{ backgroundImage: `url('${recipe.image}')` }}></div>
                  <div className="p-5 flex flex-col h-48">
                    <h3 className="font-semibold text-gray-900 text-base mb-3 line-clamp-2 min-h-[3rem]">{recipe.title}</h3>
                    <div className="mt-auto">
                      {recipe.category && (
                        <span className="inline-block text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg mb-3 font-medium">
                          {recipe.category}
                        </span>
                      )}
                      <div className="flex items-center justify-start mt-auto">
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-medium">{recipe.cookTime} min</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

