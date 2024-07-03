import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="p-4 bg-gray-100 md:px-16 w-full flex justify-between items-center">
      <Link href="/">
        <span className="text-black">Home</span>
      </Link>
      <div className="flex items-center gap-4">
        <Link href="/auth/sign-in">
          <button className="px-4 py-2 flex items-center justify-center text-black hover:bg-gray-200 transition-all rounded-lg w-full">
            Sign In
          </button>
        </Link>
        <Link href="/auth/sign-up">
          <button className="px-4 py-2 flex items-center justify-center text-white bg-indigo-600 hover:bg-indigo-700 transition-all rounded-lg w-full">
            Sign Up
          </button>
        </Link>
      </div>
    </nav>
  );
}
