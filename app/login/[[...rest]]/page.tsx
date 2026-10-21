import { SignUp } from "@clerk/nextjs";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center">
      <SignUp />
    </main>
  );
}