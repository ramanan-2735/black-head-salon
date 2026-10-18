import { NextResponse } from "next/server";
import { getBookingRepository } from "@/lib/booking/repository";
import { availabilityQuerySchema } from "@/lib/booking/schemas";
import { config } from "@/lib/config";

/** Free start times for one service, optionally with one barber, on one salon-local day. */
export async function GET(request: Request) {
  if (!config.isDemo) {
    return NextResponse.json({ error: "BOOKING_NOT_CONFIGURED" }, { status: 503 });
  }

  const parsed = availabilityQuerySchema.safeParse(
    Object.fromEntries(new URL(request.url).searchParams),
  );
  if (!parsed.success) {
    return NextResponse.json({ error: "INVALID_QUERY" }, { status: 422 });
  }

  const result = getBookingRepository().getAvailability(parsed.data);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 404 });
  }
  return NextResponse.json({ slots: result.slots });
}
