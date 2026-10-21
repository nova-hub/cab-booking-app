"use client";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="flex min-h-[80vh] flex-col items-center justify-center text-center px-6">
        <h1 className="text-5xl font-bold">
          Your Ride, Your Way 🚕
        </h1>

        <p className="mt-4 text-gray-400">
          Book a ride quickly, safely, and easily.
        </p>

        <a
  href="/dashboard"
  className="mt-8 inline-block rounded-lg bg-yellow-400 px-6 py-3 font-semibold text-black"
>
  Book a Ride
</a>
      </section>
    </main>
  );
}