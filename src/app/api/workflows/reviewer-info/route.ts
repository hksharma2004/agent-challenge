import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { reviewerId } = await request.json();

    if (!reviewerId) {
      return NextResponse.json(
        { error: "Reviewer ID is required" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Reviewer info workflow has been removed." },
      { status: 404 }
    );
  } catch (error) {
    console.error("Error running workflow:", error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}
