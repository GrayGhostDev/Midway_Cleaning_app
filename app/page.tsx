import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function Home() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold">Welcome to Midway Cleaning Co.</h1>
      <p>Get started by navigating to your dashboard.</p>
    </div>
  );
}