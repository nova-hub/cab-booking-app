import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
try {
const { userId } = await auth();

if (!userId) {
  return NextResponse.json(
    { error: "Please log in first." },
    { status: 401 }
  );
}

const {
  pickup,
  destination,
  ride_type,
  fare,
} = await request.json();

if (
  typeof pickup !== "string" ||
  !pickup.trim() ||
  typeof destination !== "string" ||
  !destination.trim() ||
  !["Mini", "Sedan", "SUV"].includes(ride_type) ||
  typeof fare !== "number" ||
  !Number.isFinite(fare) ||
  fare < 0
) {
  return NextResponse.json(
    { error: "Invalid ride details." },
    { status: 400 }
  );
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseSecretKey) {
  return NextResponse.json(
    { error: "Server database configuration is missing." },
    { status: 500 }
  );
}

const supabase = createClient(
  supabaseUrl,
  supabaseSecretKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

const { data, error } = await supabase
  .from("rides")
  .insert({
    pickup: pickup.trim(),
    destination: destination.trim(),
    ride_type,
    fare,
    status: "pending",
    user_id: userId,
  })
  .select()
  .single();

if (error) {
  console.error("Ride save failed:", error.message);
 return NextResponse.json(
  { error: error.message },
  { status: 500 }
);
}

return NextResponse.json({ message: "Ride saved!", ride: data });

} catch {
return NextResponse.json(
{ error: "Something went wrong." },
{ status: 500 }
);
}
}