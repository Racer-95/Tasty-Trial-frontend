import Link from "next/link";

export default function Home() {

  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center font-sans text-zinc-900 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/food_bg.png')" }}
    >
      {/* Faded overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* CONTENT BOX */}
      <div className="relative z-10 bg-black/50 rounded-2xl shadow-xl px-10 py-12 max-w-xl w-[90%] backdrop-blur-[2px] border border-white/40 text-center">
        
        {/* Title Section */}
        <h1 className="text-5xl font-bold mb-3 text-orange-500 drop-shadow-lg">
          Welcome to Tasty Trail
        </h1>

        <p className="text-orange-200 mb-10 max-w-md mx-auto text-lg font-medium drop-shadow-sm">
          Your journey to discovering delicious flavors begins here 
        </p>
        <p className="text-orange-200 mb-10 max-w-md mx-auto text-lg font-medium drop-shadow-sm">
          Log in or create an account to get started!
        </p>

        {/* Buttons Section */}
        <div className="flex justify-center gap-4">
          <Link
            href="/login"
            className="rounded-xl bg-gradient-to-r from-orange-600 to-red-500 px-8 py-3 text-white font-semibold text-sm shadow-lg transition hover:opacity-90 active:scale-95"
          >
            Log in
          </Link>

          <Link
            href="/signup"
            className="rounded-xl border border-orange-700 px-8 py-3 text-sm font-semibold text-orange-800 bg-white/70 shadow-md transition hover:bg-orange-800 hover:text-white active:scale-95"
          >
            Sign up
          </Link>
        </div>

      </div>
    </main>

  );
  // return (
  //   <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans text-zinc-900">
  //     {/* Title Section */}
  //     <h1 className="text-4xl font-semibold mb-2">Welcome to Tasty Trail 🍴</h1>
  //     <p className="text-zinc-600 mb-8 text-center max-w-md">
  //       Your journey to discovering delicious flavors begins here.  
  //       Log in or create an account to get started!
  //     </p>

  //     {/* Buttons Section */}
  //     <div className="flex gap-4">
  //       <Link
  //         href="/login"
  //         className="rounded-md bg-zinc-900 px-6 py-2 text-white font-medium text-sm transition hover:bg-zinc-800"
  //       >
  //         Log in
  //       </Link>

  //       <Link
  //         href="/signup"
  //         className="rounded-md border border-zinc-900 px-6 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-900 hover:text-white"
  //       >
  //         Sign up
  //       </Link>
  //     </div>
  //   </main>
  // );
}
