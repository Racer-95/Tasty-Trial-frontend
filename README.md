TastyTrail – Recipe Sharing Platform

TastyTrail is a community-driven recipe sharing platform where users can explore, create, and interact with food recipes from around the world.

🚩 Problem Statement

Most recipe platforms focus on professional chefs, leaving home cooks without a community-focused space. TastyTrail solves this by enabling users to easily share recipes, discover new dishes, and interact with other cooking enthusiasts.

🏗 Tech Stack & Architecture

Architecture: Frontend → Backend (API) → Database
Frontend: Next.js, TailwindCSS, Axios
Backend: Node.js, Express.js, Prisma ORM
Database: MySQL
Auth: JWT, bcrypt.js
Hosting: Frontend (Vercel), Backend (Render/Railway), Database (MySQL Cloud)
Version Control: Git & GitHub

⭐ Key Features

Authentication: Signup, login, logout, JWT-secured routes

CRUD Recipes: Create, view, edit, delete recipes

Interactions: Like recipes (comments coming soon)

Frontend Pages: Home, Login, Signup, Dashboard, Recipe Details

Search & Filters: Search by title, sort by likes or recency, filter by cuisine/category/calories

Pagination: Smooth browsing for large recipe lists

📡 API Endpoints
Endpoint	Method	Description	Access
/api/signup	POST	Register user	Public
/api/login	POST	Login & return JWT	Public
/api/recipes	GET	Get all recipes (with search/sort/filter)	Auth
/api/recipes/:id	GET	Get single recipe	Auth
/api/recipes	POST	Create recipe	Auth
/api/recipes/:id/like	POST	Like recipe	Auth
/api/dashboard	GET	View user recipes & liked posts	Auth
/api/recipes/:id/comment	POST	Add comment (future)	Auth
🎯 Conclusion

TastyTrail bridges the gap between home cooks and food lovers by providing an engaging platform to share and discover creative recipes. It promotes community-driven cooking with a modern and intuitive interface.
