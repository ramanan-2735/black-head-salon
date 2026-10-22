"use client";

import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Clock } from "@phosphor-icons/react";
import { BarberBadge } from "@/components/site/barber-badge";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { SlotChip } from "@/components/ui/slot-chip";
import { Stepper } from "@/components/ui/stepper";
import { cn } from "@/lib/cn";
import { formatDuration, formatPrice } from "@/lib/format";
import { addDays, localToInstant, todayLocal } from "@/lib/booking/time";
import type { BookingMode } from "@/lib/config";

export interface BookableService {
  id: string;
  slug: string;
  name: string;
  priceInPaise: number | null;
  isFromPrice: boolean;
  durationMin: number;
}

export interface PublicBarber {
  id: string;
  name: string;
  serviceIds: string[];
}

interface Slot {
  startsAt: string;
  label: string;
}

interface ConfirmedBooking {
  id: string;
  serviceName: string;
  barberName: string;
  startsAt: string;
  status: "PENDING" | "CONFIRMED";
}

/** Three stages: service and barber, then date and time, then details and confirm. */
const STAGE = { service: 0, time: 1, details: 2 } as const;
const STEPS = ["Service & barber", "Date & time", "Your details"];
const ANY_BARBER = "any";
const DATE_OPTIONS = 14;

const salonDate = new Intl.DateTimeFormat("en-IN", {
  weekday: "short",
  day: "numeric",
  month: "short",
  timeZone: "Asia/Kolkata",
});

const salonDateTime = new Intl.DateTimeFormat("en-IN", {
  weekday: "long",
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Asia/Kolkata",
});

/** Turns a salon-local date into a label like "Mon, 19 Oct". Noon avoids any date edge. */
function dateLabel(date: string): string {
  return salonDate.format(localToInstant(date, 720));
}

export function BookingFlow({
  services,
  barbers,
  mode,
  isDemo,
}: {
  services: BookableService[];
  barbers: PublicBarber[];
  mode: BookingMode;
  isDemo: boolean;
}) {
  const params = useSearchParams();
  const requestedSlug = params.get("service");

  const [step, setStep] = useState<number>(STAGE.service);
  const [serviceId, setServiceId] = useState<string | null>(
    () => services.find((service) => service.slug === requestedSlug)?.id ?? null,
  );
  const [staffId, setStaffId] = useState<string>(ANY_BARBER);
  const [date, setDate] = useState<string | null>(null);
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [startsAt, setStartsAt] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [consent, setConsent] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<ConfirmedBooking | null>(null);
  // One key per attempt. A retry of the same submit replays instead of double-booking.
  const idempotencyKey = useRef<string>(crypto.randomUUID());
  const latestSlotRequest = useRef(0);

  const today = todayLocal(new Date());
  const dates = Array.from({ length: DATE_OPTIONS }, (_, index) => addDays(today, index));
  const service = services.find((item) => item.id === serviceId) ?? null;
  const eligibleBarbers = barbers.filter(
    (barber) => service?.id && barber.serviceIds.includes(service.id),
  );
  const barber = eligibleBarbers.find((item) => item.id === staffId) ?? null;
  const barberLabel = staffId === ANY_BARBER ? "Any available" : (barber?.name ?? "Not chosen");
  const startLabel =
    startsAt && slots ? (slots.find((slot) => slot.startsAt === startsAt)?.label ?? null) : null;
  const when = date ? `${dateLabel(date)}${startLabel ? `, ${startLabel}` : ""}` : null;

  async function loadSlots(nextDate: string, nextStaff: string) {
    if (!serviceId) return;
    const request = ++latestSlotRequest.current;
    setSlots(null);
    setSlotsError(null);
    const query = new URLSearchParams({ serviceId, staffId: nextStaff, date: nextDate });
    try {
      const response = await fetch(`/api/availability?${query}`);
      const data = await response.json();
      if (request !== latestSlotRequest.current) return;
      if (!response.ok) {
        setSlotsError("Couldn't load times. Please try again.");
        return;
      }
      setSlots(data.slots);
    } catch {
      if (request === latestSlotRequest.current)
        setSlotsError("Couldn't load times. Check your connection.");
    }
  }

  function chooseDate(nextDate: string) {
    setDate(nextDate);
    setStartsAt(null);
    loadSlots(nextDate, staffId);
  }

  async function submit() {
    if (!service || !startsAt) return;
    setSubmitting(true);
    setFormError(null);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          serviceId: service.id,
          staffId,
          startsAt,
          name,
          phone,
          email: email || undefined,
          notes: notes || undefined,
          consent: true,
          idempotencyKey: idempotencyKey.current,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        setConfirmed(data.appointment);
        return;
      }
      if (response.status === 409) {
        setFormError(
          data.error === "DUPLICATE_BOOKING"
            ? "This phone number already has a booking at that time."
            : "That time was just taken. Please choose another.",
        );
        setStartsAt(null);
        setStep(STAGE.time);
        if (date) loadSlots(date, staffId);
        return;
      }
      if (response.status === 422 && data.fieldErrors) {
        const first = Object.values(data.fieldErrors).flat()[0];
        setFormError(typeof first === "string" ? first : "Please check your details.");
        return;
      }
      setFormError("Something went wrong. Nothing was booked. Please try again.");
    } catch {
      setFormError("Couldn't reach the booking service. Nothing was booked.");
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmed) {
    const confirmedWhen = salonDateTime.format(new Date(confirmed.startsAt));
    const isPending = confirmed.status === "PENDING";
    return (
      <div role="status" className="flex max-w-2xl flex-col gap-6">
        {isDemo && (
          <p className="border-l border-brass-600 pl-3 text-sm text-brass-300">
            Demo booking. It is stored only in this demo server&apos;s memory. No real appointment
            was made and no message was sent.
          </p>
        )}
        <h2 className="font-display text-5xl font-light">
          {isPending ? "Request received" : "You're booked"}
        </h2>
        <p className="text-bone-300">
          {isPending
            ? "The salon will confirm your request shortly. Your slot is held in the meantime."
            : "Your appointment is confirmed."}
        </p>
        <dl className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-3 border-y border-line py-6 text-sm">
          <dt className="text-bone-500">Service</dt>
          <dd>{confirmed.serviceName}</dd>
          <dt className="text-bone-500">Barber</dt>
          <dd>{confirmed.barberName}</dd>
          <dt className="text-bone-500">When</dt>
          <dd>{confirmedWhen}</dd>
          <dt className="text-bone-500">Status</dt>
          <dd>{isPending ? "Pending confirmation" : "Confirmed"}</dd>
        </dl>
      </div>
    );
  }

  const detailsValid = name.trim().length >= 2 && phone.replace(/\D/g, "").length >= 10 && consent;
  const canContinue =
    (step === STAGE.service && serviceId !== null) || (step === STAGE.time && startsAt !== null);

  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="flex min-w-0 flex-col gap-10">
        <Stepper steps={STEPS} current={step} />

        {formError && (
          <p role="alert" className="border-l-2 border-err pl-4 text-sm text-err">
            {formError}
          </p>
        )}

        {step === STAGE.service && (
          <div className="flex flex-col gap-10">
            <fieldset className="flex flex-col gap-3">
              <legend className="mb-4 font-display text-3xl font-light">Choose a service</legend>
              {services.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={serviceId === item.id}
                  onClick={() => {
                    setServiceId(item.id);
                    setStaffId(ANY_BARBER);
                  }}
                  className={cn(
                    "flex min-h-14 items-center justify-between gap-4 rounded-[2px] border px-5 py-4 text-left",
                    serviceId === item.id
                      ? "border-brass-400 bg-ink-800"
                      : "border-line hover:border-brass-600",
                  )}
                >
                  <span>
                    <span className="block font-display text-xl">{item.name}</span>
                    <span className="text-xs text-bone-300">
                      {formatDuration(item.durationMin)}
                    </span>
                  </span>
                  <span className="text-sm text-brass-300">
                    {formatPrice(item.priceInPaise, item.isFromPrice)}
                  </span>
                </button>
              ))}
            </fieldset>

            {service && (
              <fieldset className="flex flex-col gap-4">
                <legend className="mb-2 font-display text-3xl font-light">Choose a barber</legend>
                <div className="flex flex-wrap gap-3">
                  {[{ id: ANY_BARBER, name: "Any available" }, ...eligibleBarbers].map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={staffId === option.id}
                      onClick={() => setStaffId(option.id)}
                      className={cn(
                        "min-h-12 rounded-full border px-5 text-sm transition-colors",
                        staffId === option.id
                          ? "border-brass-400 bg-brass-400 text-ink-950"
                          : "border-line text-bone-100 hover:border-brass-600",
                      )}
                    >
                      {option.name}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}
          </div>
        )}

        {step === STAGE.time && (
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h2 className="font-display text-3xl font-light">Choose a date</h2>
              <div
                role="group"
                aria-label="Dates"
                className="flex snap-x gap-2 overflow-x-auto pb-2"
              >
                {dates.map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={date === option}
                    onClick={() => chooseDate(option)}
                    className={cn(
                      "min-h-14 min-w-20 shrink-0 snap-start rounded-[2px] border px-3 text-sm",
                      date === option
                        ? "border-brass-400 bg-brass-400 text-ink-950"
                        : "border-line hover:border-brass-600",
                    )}
                  >
                    {dateLabel(option)}
                  </button>
                ))}
              </div>
            </div>

            {date && (
              <div className="flex flex-col gap-4" aria-live="polite">
                <h2 className="font-display text-3xl font-light">Choose a time</h2>
                {slotsError && <p className="text-sm text-err">{slotsError}</p>}
                {!slotsError && slots === null && (
                  <p className="text-sm text-bone-300">Loading times…</p>
                )}
                {slots && slots.length === 0 && (
                  <p className="text-sm text-bone-300">
                    No times left on {dateLabel(date)}. Try another day.
                  </p>
                )}
                {slots && slots.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {slots.map((slot) => (
                      <SlotChip
                        key={slot.startsAt}
                        time={slot.label}
                        selected={startsAt === slot.startsAt}
                        onSelect={() => setStartsAt(slot.startsAt)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {step === STAGE.details && (
          <div className="flex max-w-lg flex-col gap-6">
            <h2 className="font-display text-3xl font-light">Your details</h2>
            <Field
              id="booking-name"
              label="Full name"
              required
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <Field
              id="booking-phone"
              label="Mobile number"
              required
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              hint="Indian mobile. We use it only for this booking."
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
            <Field
              id="booking-email"
              label="Email (optional)"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <div className="flex flex-col gap-2">
              <label htmlFor="booking-notes" className="text-sm text-bone-100">
                Notes (optional)
              </label>
              <textarea
                id="booking-notes"
                rows={3}
                maxLength={300}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                className="rounded-[2px] border border-line bg-ink-800 p-4 text-bone-100 focus:border-brass-400"
              />
            </div>
            <label className="flex gap-3 text-sm text-bone-300">
              <input
                type="checkbox"
                required
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
                className="mt-1 size-4 accent-brass-400"
              />
              <span>
                I agree that my name and number can be used to manage this booking and for reminders
                about it.
              </span>
            </label>
            <p className="text-sm text-bone-300">
              {mode === "instant"
                ? "Your booking is confirmed as soon as you submit."
                : "Your request goes to the salon for confirmation."}
            </p>
          </div>
        )}

        {/*
         * Sticky on phones so the price, duration, barber and the next action stay in
         * reach while a long form scrolls. On desktop the summary sits in the aside.
         */}
        <div className="sticky bottom-0 z-30 -mx-6 flex flex-col gap-3 border-t border-line bg-ink-950/95 px-6 py-4 backdrop-blur-sm md:-mx-12 md:px-12 lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm lg:hidden">
            {service ? (
              <>
                <span className="font-display text-lg">{service.name}</span>
                <span className="inline-flex items-center gap-1.5 text-bone-300">
                  <Clock size={14} weight="light" aria-hidden="true" />
                  {formatDuration(service.durationMin)}
                </span>
                <span className="text-brass-300">
                  {formatPrice(service.priceInPaise, service.isFromPrice)}
                </span>
                <BarberBadge label={barberLabel} />
              </>
            ) : (
              <span className="text-bone-300">No service chosen yet</span>
            )}
          </div>

          <div className="flex items-center justify-between gap-4">
            <Button
              variant="tertiary"
              onClick={() => setStep((current) => Math.max(STAGE.service, current - 1))}
              disabled={step === STAGE.service}
            >
              Back
            </Button>
            {step < STAGE.details ? (
              <Button onClick={() => setStep((current) => current + 1)} disabled={!canContinue}>
                Continue
              </Button>
            ) : (
              <Button onClick={submit} disabled={submitting || !detailsValid}>
                {submitting ? "Booking…" : mode === "instant" ? "Confirm booking" : "Send request"}
              </Button>
            )}
          </div>
        </div>
      </div>

      <aside
        aria-label="Booking summary"
        className="surface-warm hidden h-fit rounded-[2px] border border-line p-6 lg:sticky lg:top-28 lg:block"
      >
        <p className="text-sm text-bone-300">Your booking</p>
        <div className="mt-5 flex flex-col gap-5 text-sm">
          {service ? (
            <>
              <p className="font-display text-2xl">{service.name}</p>
              <p className="inline-flex items-center gap-2 text-bone-300">
                <Clock size={16} weight="light" aria-hidden="true" />
                {formatDuration(service.durationMin)}
              </p>
              <p className="font-display text-3xl text-brass-300">
                {formatPrice(service.priceInPaise, service.isFromPrice)}
              </p>
              <BarberBadge label={barberLabel} />
            </>
          ) : (
            <p className="text-bone-300">No service chosen yet.</p>
          )}
          <div className="border-t border-line pt-5">
            <p className="text-bone-300">When</p>
            <p>{when ?? "Choose a date and time"}</p>
          </div>
        </div>
        {isDemo && (
          <p className="mt-6 border-t border-line pt-4 text-xs text-brass-300">
            Demo: sample prices and times. Nothing is sent to a real phone or inbox.
          </p>
        )}
      </aside>
    </div>
  );
}
