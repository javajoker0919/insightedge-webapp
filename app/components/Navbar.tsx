import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4">
      <Link href="/">
        <span className="text-white">Home</span>
      </Link>
      <Link href="/auth/sign-in">
        <span className="text-white ml-4">Sign In</span>
      </Link>
    </nav>
  );
}
