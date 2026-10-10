import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import logoUrl from "../assets/logo.png";

const STEP_COUNT = 5;
const RING_R = 42;
const RING_C = 2 * Math.PI * RING_R;

export function BootOverlay({ onDone }: { onDone: () => void }) {
    const [visible, setVisible] = useState(true);
    const [step, setStep] = useState(0);
    const [done, setDone] = useState(false);

    useEffect(() => {
        let cancelled = false;
        const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

        const run = async () => {
            for (let i = 0; i < STEP_COUNT; i++) {
                if (cancelled) return;
                await sleep(280 + Math.random() * 180);
                setStep(i + 1);
            }
            await sleep(300);
            if (cancelled) return;
            setDone(true);
            await sleep(650);
            if (cancelled) return;
            setVisible(false);
            setTimeout(onDone, 500);
        };

        run();
        return () => {
            cancelled = true;
        };
    }, [onDone]);

    const progress = step / STEP_COUNT;

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    key="boot"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
                    className="absolute inset-0 z-50 flex items-center justify-center"
                    style={{ background: "var(--md-surface, #141218)" }}
                >
                    <div className="flex flex-col items-center gap-10">
                        {/* ---------- Logo + progress ring ---------- */}
                        <div className="relative grid h-36 w-36 place-items-center">
                            {/* Soft ambient glow — gentle breathing */}
                            <motion.div
                                aria-hidden
                                className="pointer-events-none absolute inset-0 rounded-full"
                                style={{
                                    background:
                                        "radial-gradient(circle, var(--md-primary) 0%, transparent 68%)",
                                }}
                                animate={{ scale: [1, 1.18, 1], opacity: [0.16, 0.3, 0.16] }}
                                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                            />

                            {/* Completion ripple burst */}
                            <AnimatePresence>
                                {done && (
                                    <motion.span
                                        key="ripple"
                                        aria-hidden
                                        className="pointer-events-none absolute inset-0 rounded-full border-2"
                                        style={{ borderColor: "var(--md-primary)" }}
                                        initial={{ scale: 1, opacity: 0.55 }}
                                        animate={{ scale: 2.4, opacity: 0 }}
                                        transition={{ duration: 0.9, ease: [0.2, 0, 0, 1] }}
                                    />
                                )}
                            </AnimatePresence>

                            {/* Progress ring track + fill */}
                            <svg
                                viewBox="0 0 100 100"
                                className="absolute inset-0 -rotate-90"
                                aria-hidden
                            >
                                <circle
                                    cx="50"
                                    cy="50"
                                    r={RING_R}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    className="text-md-primary/15"
                                />
                                <motion.circle
                                    cx="50"
                                    cy="50"
                                    r={RING_R}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    className="text-md-primary"
                                    strokeDasharray={RING_C}
                                    animate={{ strokeDashoffset: RING_C * (1 - progress) }}
                                    transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
                                />
                            </svg>

                            {/* Leading dot that travels the ring */}
                            <motion.div
                                aria-hidden
                                className="pointer-events-none absolute inset-0"
                                animate={{ rotate: progress * 360 }}
                                transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
                            >
                                <motion.span
                                    className="absolute left-1/2 top-2 h-2 w-2 -translate-x-1/2 rounded-full bg-md-primary shadow-[0_0_10px_var(--md-primary)]"
                                    animate={{ opacity: done ? 0 : 1, scale: done ? 0.4 : 1 }}
                                    transition={{ duration: 0.3 }}
                                />
                            </motion.div>

                            {/* Inner logo — "D" morphs to a checkmark on completion */}
                            <motion.div
                                className="relative grid h-24 w-24 place-items-center rounded-md-xl bg-md-primary-container text-md-on-primary-container shadow-lg"
                                animate={
                                    done
                                        ? { scale: [1, 1.12, 1], rotate: [0, 4, 0] }
                                        : { scale: [1, 1.03, 1] }
                                }
                                transition={
                                    done
                                        ? { duration: 0.55, ease: [0.2, 0, 0, 1] }
                                        : { duration: 2.6, repeat: Infinity, ease: "easeInOut" }
                                }
                            >
                                <AnimatePresence mode="wait" initial={false}>
                                    {done ? (
                                        <motion.svg
                                            key="check"
                                            viewBox="0 0 24 24"
                                            className="h-11 w-11"
                                            fill="none"
                                            initial={{ opacity: 0, scale: 0.7 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.7 }}
                                            transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
                                        >
                                            <motion.path
                                                d="M5 13l4 4L19 7"
                                                stroke="currentColor"
                                                strokeWidth="2.8"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: 1 }}
                                                transition={{ duration: 0.4, delay: 0.05, ease: "easeOut" }}
                                            />
                                        </motion.svg>
                                    ) : (
                                        <motion.img
                                            key="logo"
                                            src={logoUrl}
                                            alt=""
                                            draggable={false}
                                            className="h-14 w-14 select-none object-contain"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
                                        />
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </div>

                        {/* ---------- Step dots (visual boot log) ---------- */}
                        <div className="flex items-center gap-3">
                            {Array.from({ length: STEP_COUNT }).map((_, i) => {
                                const active = i < step;
                                return (
                                    <motion.span
                                        key={i}
                                        aria-hidden
                                        className="rounded-full"
                                        initial={false}
                                        animate={{
                                            width: active ? 10 : 8,
                                            height: active ? 10 : 8,
                                            scale: active ? 1 : 0.7,
                                            opacity: active ? 1 : 0.35,
                                            backgroundColor: active
                                                ? "var(--md-primary)"
                                                : "var(--md-outline-variant)",
                                            boxShadow: done && active
                                                ? "0 0 10px var(--md-primary)"
                                                : "0 0 0 transparent",
                                        }}
                                        transition={{
                                            duration: 0.35,
                                            delay: done ? i * 0.04 : 0,
                                            ease: [0.2, 0, 0, 1],
                                        }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}