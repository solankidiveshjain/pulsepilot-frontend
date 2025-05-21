import { NextResponse } from "next/server";

type ApiHandler = (
  req: Request,
  context: { params: Record<string, string> }
) => Promise<NextResponse>;

export function withErrorHandling(handler: ApiHandler): ApiHandler {
  return async (req: Request, context: { params: Record<string, string> }) => {
    try {
      return await handler(req, context);
    } catch (error) {
      console.error("API Error:", error);

      return NextResponse.json(
        {
          error: error instanceof Error ? error.message : "An unexpected error occurred",
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }
  };
}
