"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("../components/map"), {
  ssr: false,
});

type Ride = {
  id: string;
  pickup: string;
  destination: string;
  ride_type: string;
  fare: number;
  status: string;
  created_at: string;
};

export default function DashboardPage() {
  const { isLoaded, isSignedIn } = useUser();

  // 1. All useState hooks at the top level
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [bookingStatus, setBookingStatus] = useState("");
  const [rideType, setRideType] = useState("Mini");
  const [fare, setFare] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

  const [rides, setRides] = useState<Ride[]>([]);
  const [historyError, setHistoryError] = useState("");
  const [loadingHistory, setLoadingHistory] = useState(false);

  // 2. useEffect hook
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      void loadRideHistory();
    }
  }, [isLoaded, isSignedIn]);

  async function loadRideHistory() {
    setLoadingHistory(true);
    setHistoryError("");

    try {
      const response = await fetch("/api/ride-history");
      const result = await response.json();

      if (!response.ok) {
        setHistoryError(
          result.error || "Could not load ride history."
        );
        return;
      }

      setRides(result.rides || []);
    } catch {
      setHistoryError("Could not connect to the server.");
    } finally {
      setLoadingHistory(false);
    }
  }

  async function confirmRide() {
    if (!pickup.trim() || !destination.trim()) {
      setBookingStatus("Please enter pickup and destination.");
      return;
    }

    if (fare === null) {
      setBookingStatus("Please calculate your fare first.");
      return;
    }

    setBookingStatus("Saving your ride...");

    try {
      const response = await fetch("/api/rides", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pickup: pickup.trim(),
          destination: destination.trim(),
          ride_type: rideType,
          fare,
        }),
      });

      const responseText = await response.text();

      let result: {
        error?: string;
        message?: string;
        ride?: Ride;
      } = {};

      try {
        result = JSON.parse(responseText);
      } catch {
        setBookingStatus(
          `Server response error (${response.status}). Check the VS Code terminal.`
        );
        console.error("Unexpected API response:", responseText);
        return;
      }

      if (!response.ok) {
        setBookingStatus(
          result.error || `Request failed (${response.status}).`
        );
        console.error("Ride booking failed:", result);
        return;
      }

      setBookingStatus("Your ride is confirmed and saved! 🚕");
      await loadRideHistory();
    } catch (error) {
      console.error("Confirm ride error:", error);
      setBookingStatus(
        "Could not connect to the API. Check the VS Code terminal."
      );
    }
  }

  function cancelRide() {
    setBookingStatus("This demo has no saved-ride cancellation API yet.");
  }

  // 3. Early return conditions ONLY after all hooks
  if (!isLoaded) {
    return <p className="p-6 text-white">Loading...</p>;
  }

  if (!isSignedIn) {
    return (
      <div className="p-6 text-white">
        <p>Please sign in to book a ride.</p>
        <a href="/login" className="text-yellow-400 underline">
          Go to Login
        </a>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
        <h1 className="text-2xl font-bold">
          Cab<span className="text-yellow-400">Go</span> 🚕
        </h1>
        <UserButton />
      </header>

      <section className="px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold">
            Where do you want to go? 🚕
          </h2>

          <p className="mt-2 text-gray-400">
            Enter your pickup and destination to book a ride.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-zinc-900 p-6">
              <h3 className="text-xl font-semibold">Book a Ride</h3>

              <div className="mt-5">
                <label className="mb-2 block text-sm text-gray-300">
                  Choose Your Ride
                </label>

                <select
                  value={rideType}
                  onChange={(e) => setRideType(e.target.value)}
                  className="w-full rounded-lg bg-zinc-800 px-4 py-3 text-white outline-none"
                >
                  <option value="Mini">Mini 🚕</option>
                  <option value="Sedan">Sedan 🚘</option>
                  <option value="SUV">SUV 🚙</option>
                </select>
              </div>

              <div className="mt-5 space-y-4">
                <input
                  type="text"
                  placeholder="📍 Pickup location"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  className="w-full rounded-lg bg-zinc-800 px-4 py-3 outline-none"
                />

                <input
                  type="text"
                  placeholder="📍 Where to?"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full rounded-lg bg-zinc-800 px-4 py-3 outline-none"
                />

                <button
                  onClick={() => {
                    if (!pickup.trim() || !destination.trim()) {
                      setBookingStatus(
                        "Please enter pickup and destination."
                      );
                      return;
                    }

                    const estimatedDistance = 8;

                    const baseFare =
                      rideType === "Mini"
                        ? 50
                        : rideType === "Sedan"
                        ? 80
                        : 120;

                    const perKmRate =
                      rideType === "Mini"
                        ? 15
                        : rideType === "Sedan"
                        ? 20
                        : 25;

                    const estimatedFare =
                      baseFare + estimatedDistance * perKmRate;

                    setDistance(estimatedDistance);
                    setFare(estimatedFare);
                    setBookingStatus("");
                  }}
                  className="w-full rounded-lg bg-yellow-400 py-3 font-semibold text-black"
                >
                  Find a Ride
                </button>
              </div>
            </div>

            <div className="h-[400px] overflow-hidden rounded-2xl bg-zinc-900">
              <Map />
            </div>

            {fare !== null && distance !== null && (
              <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-6">
                <h3 className="text-xl font-bold text-yellow-400">
                  Ride Fare Estimate 🚕
                </h3>

                {bookingStatus && (
                  <p className="mt-3 rounded-lg bg-zinc-800 p-3 text-yellow-300">
                    {bookingStatus}
                  </p>
                )}

                <p className="mt-3 text-gray-300">
                  Selected Ride: {rideType}
                </p>

                <p className="mt-3 text-gray-300">
                  Estimated Distance: {distance} km
                </p>

                <p className="mt-2 text-2xl font-bold text-white">
                  Estimated Fare: ₹{fare}
                </p>

                <p className="mt-2 text-sm text-gray-400">
                  Demo estimate only; actual route distance is not calculated.
                </p>

                <button
                  onClick={confirmRide}
                  className="mt-5 w-full rounded-lg bg-yellow-400 py-3 font-semibold text-black hover:bg-yellow-300"
                >
                  Confirm Ride
                </button>

                <button
                  onClick={cancelRide}
                  className="mt-3 w-full rounded-lg bg-red-600 py-3 font-semibold text-white hover:bg-red-500"
                >
                  Cancel Ride
                </button>
              </div>
            )}
          </div>

          <section className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-2xl font-bold">Ride History 📋</h3>

              <button
                onClick={() => void loadRideHistory()}
                className="rounded-lg bg-yellow-400 px-4 py-2 font-semibold text-black"
              >
                Refresh History
              </button>
            </div>

            {loadingHistory && (
              <p className="mt-4 text-gray-300">
                Loading your rides...
              </p>
            )}

            {historyError && (
              <p className="mt-4 text-red-400">{historyError}</p>
            )}

            {!loadingHistory &&
              !historyError &&
              rides.length === 0 && (
                <p className="mt-4 text-gray-400">
                  No rides found yet.
                </p>
              )}

            <div className="mt-4 space-y-4">
              {rides.map((ride) => (
                <div
                  key={ride.id}
                  className="rounded-xl border border-zinc-700 p-4"
                >
                  <p>
                    <span className="text-gray-400">From:</span>{" "}
                    {ride.pickup}
                  </p>

                  <p className="mt-1">
                    <span className="text-gray-400">To:</span>{" "}
                    {ride.destination}
                  </p>

                  <p className="mt-1">
                    <span className="text-gray-400">Ride:</span>{" "}
                    {ride.ride_type}
                  </p>

                  <p className="mt-1">
                    <span className="text-gray-400">Fare:</span>{" "}
                    ₹{ride.fare}
                  </p>

                  <p className="mt-1">
                    <span className="text-gray-400">Status:</span>{" "}
                    {ride.status}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {new Date(ride.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}