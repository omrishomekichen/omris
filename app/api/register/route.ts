import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ status: "error", message: "Name, email, and password are required." }, { status: 400 });
    }

    // TODO: replace with real registration logic
    return NextResponse.json({
      status: "success",
      token: "demo-token",
      user: {
        id: "2",
        email,
        name,
      },
    });
  } catch (error) {
    return NextResponse.json({ status: "error", message: "Invalid request payload." }, { status: 400 });
  }
}
