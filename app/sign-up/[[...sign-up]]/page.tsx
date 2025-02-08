import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full">
        <SignUp
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-xl",
            },
          }}
          path="/sign-up"
          routing="path"
          signInUrl="/sign-in"
          redirectUrl="/onboarding"
        />
      </div>
    </div>
  );
} 