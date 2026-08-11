import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ status: "error", message: "Email and password are required." }, { status: 400 });
    }

    // TODO: replace with real auth logic
    return NextResponse.json({
      status: "success",
      token: "demo-token",
      user: {
        id: "1",
        email,
        name: "Omris User",
      },
    });
  } catch (error) {
    return NextResponse.json({ status: "error", message: "Invalid request payload." }, { status: 400 });
  }
}
