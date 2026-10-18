"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { SlotChip } from "@/components/ui/slot-chip";

const slots = ["10:00", "10:30", "11:00", "11:30", "12:00"];
const unavailable = new Set(["11:00"]);

export function InteractiveDemo() {
  const [selected, setSelected] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const nameError =
    name.length > 0 && name.trim().length < 2 ? "Enter at least 2 characters." : undefined;

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-4">
        <h3 className="text-sm text-bone-300">Time slots (one unavailable)</h3>
        <div className="flex flex-wrap gap-3">
          {slots.map((time) => (
            <SlotChip
              key={time}
              time={time}
              selected={selected === time}
              disabled={unavailable.has(time)}
              onSelect={() => setSelected(time)}
            />
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Field
          id="demo-name"
          label="Full name"
          required
          hint="Used for your booking only."
          error={nameError}
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoComplete="name"
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <Button onClick={() => setDialogOpen(true)}>Open dialog</Button>
        <Button variant="secondary">Secondary action</Button>
        <Button variant="tertiary">Tertiary link</Button>
      </div>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title="Confirm your slot">
        <p className="text-bone-300">
          Demo only. No appointment is created and no message is sent.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
          <Button variant="tertiary" onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
