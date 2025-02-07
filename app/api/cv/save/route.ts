import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { CVData } from "@/types/cv";

export async function POST(request: Request) {
  const { userId } = await auth();
  
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    if (typeof userId !== 'string') {
      throw new Error('Invalid userId');
    }

    const cvData = await request.json() as CVData;
    
    const response = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        private_metadata: {
          cvData
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to update user data');
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving CV data for userId:", userId, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}