"use client";

import { useState } from "react";
import { ConnectKitButton } from "connectkit";
import { useAccount } from "wagmi";

export default function Home() {
	const [hash, setHash] = useState<string>("");
	const { isConnected } = useAccount();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
	};

	return (
		<div className="flex items-center justify-center min-h-screen p-8 pb-20 sm:p-20">
			<main className="flex flex-col gap-4 items-center sm:items-start">
				{isConnected ? (
					<form onSubmit={handleSubmit}>
						<input
							className="block w-full"
							name="hash"
							value={hash}
							onChange={(e) => setHash(e.currentTarget.value)}
							placeholder="Enter hash here"
						/>

						<button className="w-full" type="submit">
							Approve
						</button>
					</form>
				) : (
					<ConnectKitButton />
				)}
			</main>
		</div>
	);
}
