import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { CVData } from "@/types/cv";

export async function GET() {
  const { userId } = await auth();
  
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    if (typeof userId !== 'string') {
      throw new Error('Invalid userId');
    }

    const response = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }

    const user = await response.json();
    const cvData = user.private_metadata.cvData as CVData;
    
    return NextResponse.json(cvData || {
      personalInfo: { firstName: user.first_name || "", lastName: user.last_name || "", email: user.email_addresses[0].email_address },
      education: [],
      experience: [],
      skills: [],
      languages: []
    });
  } catch (error) {
    console.error("Error loading CV data for userId:", userId, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}