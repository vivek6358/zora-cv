import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getUserCreditStatus } from "@/lib/credits";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await getUserCreditStatus(session.user.email);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("GET Credits Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
