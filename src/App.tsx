import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { TitleBar } from "./components/TitleBar";
import { Sidebar } from "./components/Sidebar";
import { BootOverlay } from "./components/BootOverlay";
import { Home } from "./pages/Home";
import { CodeZipper } from "./pages/CodeZipper";
import type { PageKey } from "./types";
import "./App.css";

export default function App() {
	const [booted, setBooted] = useState(false);
	const [page, setPage] = useState<PageKey>("home");

	return (
		<div className="flex h-screen w-screen overflow-hidden text-md-on-surface">
			{!booted && <BootOverlay onDone={() => setBooted(true)} />}

			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: booted ? 1 : 0 }}
				transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
				className="flex h-full w-full"
			>
				{/* Full-height sidebar */}
				<Sidebar active={page} onChange={setPage} />

				{/* Right column: titlebar + page content */}
				<div className="flex min-w-0 flex-1 flex-col">
					<TitleBar />
					<main className="relative min-h-0 flex-1 overflow-hidden bg-md-surface">
						<AnimatePresence mode="wait">
							<motion.div
								key={page}
								initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
								animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
								exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
								transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
								className="h-full"
							>
								{page === "home" ? (
									<Home onNavigate={setPage} />
								) : (
									<CodeZipper />
								)}
							</motion.div>
						</AnimatePresence>
					</main>
				</div>
			</motion.div>
		</div>
	);
}