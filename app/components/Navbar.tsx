export default function Navbar() {
  return (
    <nav className="w-full bg-black text-white px-6 py-4 flex items-center justify-between">
      <h1 className="text-2xl font-bold">
        Cab<span className="text-yellow-400">Go</span> 🚕
      </h1>

      <div className="flex gap-6 text-sm">
        <a href="/">Home</a>
        <a href="/login">Login</a>
        <a href="/register">Register</a>
      </div>
    </nav>
  );
}