import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import {
  composeEstimate,
  FINISH_LABEL,
  money,
  ROOM_LABEL,
  SCOPE_LABEL,
  type EstimateInput,
  type Finish,
  type RoomKind,
  type Scope,
} from "@/lib/estimate";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const ROOMS: { id: RoomKind; note: string }[] = [
  { id: "room", note: "One space, composed completely" },
  { id: "apartment", note: "A sequence of rooms in one home" },
  { id: "house", note: "The whole house, held together" },
];

const SCOPES: { id: Scope; note: string }[] = [
  { id: "design", note: "Drawings, materials, a clear direction" },
  { id: "interior", note: "Design, specification, and styling" },
  { id: "turnkey", note: "Design and the build, through handover" },
];

const FINISHES: { id: Finish; image: string; note: string }[] = [
  { id: "linen", image: "/media/window-seat.jpg", note: "Oak, plaster, oatmeal cloth" },
  { id: "walnut", image: "/media/walnut-stone.jpg", note: "Vertical grain and limestone" },
  { id: "timber", image: "/media/evening-room.jpg", note: "Deeper wood, warm light" },
];

export function EstimateDialog({ open, onOpenChange }: Props) {
  const [step, setStep] = useState(0);
  const [room, setRoom] = useState<RoomKind | null>(null);
  const [scope, setScope] = useState<Scope | null>(null);
  const [area, setArea] = useState(1800);
  const [finish, setFinish] = useState<Finish | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function reset() {
    setStep(0);
    setRoom(null);
    setScope(null);
    setArea(1800);
    setFinish(null);
    setName("");
    setEmail("");
    setSent(false);
  }

  function close(next: boolean) {
    onOpenChange(next);
    if (!next) reset();
  }

  const ready = room && scope && finish;
  const result = ready ? composeEstimate({ room, scope, finish, area } satisfies EstimateInput) : null;

  function send(event: React.FormEvent) {
    event.preventDefault();
    if (!ready || !result) return;
    const entry = {
      name,
      email,
      room,
      scope,
      finish,
      area,
      low: result.low,
      high: result.high,
      at: new Date().toISOString(),
    };
    const key = "misahye-enquiries";
    let prev: unknown[] = [];
    try {
      const parsed = JSON.parse(localStorage.getItem(key) || "[]") as unknown;
      if (Array.isArray(parsed)) prev = parsed;
    } catch {
      prev = [];
    }
    localStorage.setItem(key, JSON.stringify([entry, ...prev].slice(0, 20)));
    setSent(true);
  }

  return (
    <Dialog.Root open={open} onOpenChange={close}>
      <Dialog.Portal>
        <Dialog.Content className="fixed inset-0 z-50 overflow-y-auto bg-paper text-ink outline-none">
          <div className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-6 py-6 md:px-10">
            <div className="flex items-center justify-between">
              <p className="eyebrow text-muted">Estimate</p>
              <Dialog.Close className="grid size-11 place-items-center rounded-full border border-line">
                <X className="size-4" aria-hidden />
                <span className="sr-only">Close</span>
              </Dialog.Close>
            </div>

            {sent && result && room && scope && finish ? (
              <div className="flex flex-1 flex-col justify-center py-16">
                <p className="eyebrow text-muted">Received</p>
                <Dialog.Title className="chapter mt-4 max-w-xl">
                  We’ll write within two working days.
                </Dialog.Title>
                <Dialog.Description className="mt-6 max-w-md text-ink-soft">
                  {SCOPE_LABEL[scope]} for {ROOM_LABEL[room].toLowerCase()}, {area.toLocaleString()}{" "}
                  sq ft, {FINISH_LABEL[finish].toLowerCase()}. A composed range of {money(result.low)} –{" "}
                  {money(result.high)}.
                </Dialog.Description>
                <button
                  type="button"
                  onClick={() => close(false)}
                  className="mt-10 inline-flex w-fit items-center gap-3 rounded-full bg-ink py-2 pl-5 pr-2 text-cream"
                >
                  <span className="eyebrow">Back to the studio</span>
                  <span className="grid size-11 place-items-center rounded-full bg-cream text-ink">
                    <ArrowRight className="size-4" aria-hidden />
                  </span>
                </button>
              </div>
            ) : (
              <div className="flex flex-1 flex-col py-12 md:py-16">
                <p className="eyebrow text-muted tabular-nums">0{step + 1} — 04</p>

                {step === 0 && (
                  <Step
                    title="What are we composing?"
                    description="Choose the scale. The range adjusts with it."
                  >
                    {ROOMS.map((item) => (
                      <Choice
                        key={item.id}
                        label={ROOM_LABEL[item.id]}
                        note={item.note}
                        onClick={() => {
                          setRoom(item.id);
                          setStep(1);
                        }}
                      />
                    ))}
                  </Step>
                )}

                {step === 1 && (
                  <Step
                    title="How far should we take it?"
                    description="Design only, the full interior, or the build as well."
                  >
                    {SCOPES.map((item) => (
                      <Choice
                        key={item.id}
                        label={SCOPE_LABEL[item.id]}
                        note={item.note}
                        onClick={() => {
                          setScope(item.id);
                          setStep(2);
                        }}
                      />
                    ))}
                  </Step>
                )}

                {step === 2 && (
                  <Step
                    title="How large is it?"
                    description="A starting measure. We confirm it on site."
                  >
                    <p className="display mt-10 tabular-nums">{area.toLocaleString()}</p>
                    <p className="eyebrow mt-2 text-muted">Square feet</p>
                    <label className="mt-8 block">
                      <span className="sr-only">Area in square feet</span>
                      <input
                        type="range"
                        min={400}
                        max={4800}
                        step={50}
                        value={area}
                        onChange={(event) => setArea(Number(event.target.value))}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="mt-8 inline-flex items-center gap-3 rounded-full bg-ink py-2 pl-5 pr-2 text-cream"
                    >
                      <span className="eyebrow">Continue</span>
                      <span className="grid size-11 place-items-center rounded-full bg-cream text-ink">
                        <ArrowRight className="size-4" aria-hidden />
                      </span>
                    </button>
                  </Step>
                )}

                {step === 3 && !ready && (
                  <Step
                    title="Which material register?"
                    description="The palette changes the range, not the care."
                  >
                    <div className="mt-8 grid gap-4">
                      {FINISHES.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setFinish(item.id)}
                          className="flex items-center gap-4 border-b border-line py-4 text-left"
                        >
                          <img
                            src={item.image}
                            alt=""
                            className="size-16 object-cover md:size-20"
                          />
                          <span>
                            <span className="block text-xl">{FINISH_LABEL[item.id]}</span>
                            <span className="mt-1 block text-sm text-muted">{item.note}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </Step>
                )}

                {step === 3 && ready && result && (
                  <div>
                    <Dialog.Title className="chapter mt-6">A composed range</Dialog.Title>
                    <Dialog.Description className="mt-4 max-w-md text-ink-soft">
                      {SCOPE_LABEL[scope]} · {ROOM_LABEL[room]} · {FINISH_LABEL[finish]} ·{" "}
                      {area.toLocaleString()} sq ft
                    </Dialog.Description>
                    <p className="display mt-8 tabular-nums">
                      {money(result.low)}
                      <span className="text-muted"> – </span>
                      {money(result.high)}
                    </p>
                    <p className="mt-3 text-ink-soft">{result.weeks} from a signed start.</p>
                    <ul className="mt-8 space-y-2 text-ink-soft">
                      {result.includes.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    <p className="mt-6 max-w-md text-sm text-muted">
                      A starting composition, not a contract. Site, structure, and what we find in
                      the walls still move the figure.
                    </p>
                    <form onSubmit={send} className="mt-10 grid max-w-md gap-2">
                      <label>
                        <span className="sr-only">Name</span>
                        <input
                          required
                          value={name}
                          onChange={(event) => setName(event.target.value)}
                          placeholder="Your name"
                          className="field-ink"
                          autoComplete="name"
                        />
                      </label>
                      <label>
                        <span className="sr-only">Email</span>
                        <input
                          required
                          type="email"
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          placeholder="Email"
                          className="field-ink"
                          autoComplete="email"
                        />
                      </label>
                      <button
                        type="submit"
                        className="mt-6 inline-flex w-fit items-center gap-3 rounded-full bg-ink py-2 pl-5 pr-2 text-cream"
                      >
                        <span className="eyebrow">Send to the studio</span>
                        <span className="grid size-11 place-items-center rounded-full bg-cream text-ink">
                          <ArrowRight className="size-4" aria-hidden />
                        </span>
                      </button>
                    </form>
                  </div>
                )}

                {step > 0 && !sent && (
                  <button
                    type="button"
                    onClick={() => {
                      if (step === 3 && finish) {
                        setFinish(null);
                        return;
                      }
                      setStep((value) => value - 1);
                    }}
                    className="mt-auto inline-flex items-center gap-2 pt-12 text-sm text-ink-soft"
                  >
                    <ArrowLeft className="size-4" aria-hidden />
                    Back
                  </button>
                )}
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Step({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Dialog.Title className="chapter mt-6 max-w-xl">{title}</Dialog.Title>
      <Dialog.Description className="mt-4 text-ink-soft">{description}</Dialog.Description>
      <div className="mt-8">{children}</div>
    </div>
  );
}

function Choice({ label, note, onClick }: { label: string; note: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between gap-4 border-b border-line py-5 text-left"
    >
      <span>
        <span className="block text-2xl tracking-tight">{label}</span>
        <span className="mt-1 block text-sm text-muted">{note}</span>
      </span>
      <span className="grid size-11 shrink-0 place-items-center rounded-full border border-line">
        <ArrowRight className="size-4" aria-hidden />
      </span>
    </button>
  );
}
