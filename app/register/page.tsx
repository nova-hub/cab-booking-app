export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl bg-zinc-900 p-8">
        <h1 className="text-3xl font-bold text-center">
          Create Account 🚕
        </h1>

        <p className="mt-2 text-center text-gray-400">
          Create your account and start riding
        </p>

        <form className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full rounded-lg bg-zinc-800 px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-lg bg-zinc-800 px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="Enter your phone number"
              className="w-full rounded-lg bg-zinc-800 px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm">
              Password
            </label>
            <input
              type="password"
              placeholder="Create a password"
              className="w-full rounded-lg bg-zinc-800 px-4 py-3 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-yellow-400 py-3 font-semibold text-black"
          >
            Create Account
          </button>
        </form>
      </div>
    </main>
  );
}