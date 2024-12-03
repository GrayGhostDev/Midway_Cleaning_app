import { SignIn } from "@clerk/nextjs";

export default function MFAPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <SignIn path="/auth/mfa" routing="path" />
      </div>
    </div>
  );
}
