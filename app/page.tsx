import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Next.js + Clerk.com Demo
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          A demonstration of authentication and user management using Clerk.com
        </p>

        <div className="mt-10 flex items-center justify-center gap-x-6">
          <SignedIn>
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Go to Dashboard
              </Link>
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>

          <SignedOut>
            <Link
              href="/sign-in"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Sign Up <span aria-hidden="true">→</span>
            </Link>
          </SignedOut>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Features Demo
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="relative bg-white p-6 rounded-lg shadow-sm ring-1 ring-gray-900/5"
              >
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  {feature.description}
                </dd>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

const features = [
  {
    name: "Authentication",
    description:
      "Complete authentication flow with sign-in, sign-up, and social providers.",
  },
  {
    name: "User Management",
    description:
      "Profile management, account settings, and user preferences.",
  },
  {
    name: "Protected Routes",
    description:
      "Secure routes and API endpoints with middleware protection.",
  },
];
