import { NextResponse } from "next/server";
import { z } from "zod";
import { getBookingRepository } from "@/lib/booking/repository";
import { bookingRequestSchema } from "@/lib/booking/schemas";
import { config } from "@/lib/config";

/**
 * Creates a booking. 201 for a new booking, 200 when an idempotency key replays one,
 * 409 when the slot was taken or the phone already has an overlapping booking.
 */
export async function POST(request: Request) {
  if (!config.isDemo) {
    return NextResponse.json({ error: "BOOKING_NOT_CONFIGURED" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 });
  }

  const parsed = bookingRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "VALIDATION_FAILED", fieldErrors: z.flattenError(parsed.error).fieldErrors },
      { status: 422 },
    );
  }

  const result = getBookingRepository().createBooking(parsed.data);
  if (!result.ok) {
    const conflict = result.error === "SLOT_TAKEN" || result.error === "DUPLICATE_BOOKING";
    return NextResponse.json({ error: result.error }, { status: conflict ? 409 : 422 });
  }

  const { appointment, replayed } = result;
  return NextResponse.json(
    {
      appointment: {
        id: appointment.id,
        serviceName: appointment.serviceName,
        barberName: appointment.barberName,
        startsAt: appointment.startsAt,
        endsAt: appointment.endsAt,
        status: appointment.status,
      },
    },
    { status: replayed ? 200 : 201 },
  );
}
