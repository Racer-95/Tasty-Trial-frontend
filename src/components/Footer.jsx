"use client";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-orange-900/90 to-red-900/90 border-t border-orange-500/30 text-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-orange-400">🍴 Tasty Trail</h3>
            <p className="text-sm text-orange-200/80">
              Discover and share delicious recipes from around the world. Your culinary journey starts here.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-orange-300">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  href="/dashboard" 
                  className="text-orange-200/80 hover:text-orange-400 transition-colors underline-offset-4 hover:underline"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  href="/post-recipe" 
                  className="text-orange-200/80 hover:text-orange-400 transition-colors underline-offset-4 hover:underline"
                >
                  Post Recipe
                </Link>
              </li>
              <li>
                <Link 
                  href="/login" 
                  className="text-orange-200/80 hover:text-orange-400 transition-colors underline-offset-4 hover:underline"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link 
                  href="/signup" 
                  className="text-orange-200/80 hover:text-orange-400 transition-colors underline-offset-4 hover:underline"
                >
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact/Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-orange-300">About</h4>
            <ul className="space-y-2 text-sm text-orange-200/80">
              <li>Share your favorite recipes</li>
              <li>Discover new cuisines</li>
              <li>Connect with food lovers</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-orange-500/30 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-orange-200/70">
            © {currentYear} Tasty Trail. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-orange-200/70">
            <Link 
              href="#" 
              className="hover:text-orange-400 transition-colors underline-offset-4 hover:underline"
            >
              Privacy Policy
            </Link>
            <Link 
              href="#" 
              className="hover:text-orange-400 transition-colors underline-offset-4 hover:underline"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

