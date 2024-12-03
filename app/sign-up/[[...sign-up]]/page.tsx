import { SignUp } from "@clerk/nextjs";
 
export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
            footerActionLink: "text-primary hover:text-primary/90",
            card: "shadow-none bg-background",
          },
        }}
        redirectUrl="/dashboard"
        signInUrl="/sign-in"
      />
    </div>
  );
}
