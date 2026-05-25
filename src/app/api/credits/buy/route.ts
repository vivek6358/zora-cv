import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import { User } from "@/models/User";
import { CreditLog } from "@/models/CreditLog";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan, credits } = await req.json();

    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const creditAmount = credits || 50;
    user.aiCredits = (user.aiCredits || 0) + creditAmount;
    await user.save();

    await CreditLog.create({
      userId: user._id,
      action: `Upgrade: ${plan || "Professional Plan"}`,
      amount: creditAmount
    });

    return NextResponse.json({ success: true, aiCredits: user.aiCredits });
  } catch (error: any) {
    console.error("POST Buy Credits Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
