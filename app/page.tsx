"use client";

import { useState } from "react";
import { ConnectKitButton } from "connectkit";
import { useAccount, useWriteContract, useSendTransaction } from "wagmi";
import { abi } from "./safeWalletAbi";
import { SAFE_WALLET_CONTRACT_ADDRESS } from "./constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
	const [approveFormValues, setApproveFormValues] = useState<{
		hash: string;
	}>({
		hash: "",
	});

	const [executeFormValues, setExecuteFormValues] = useState<{
		hash: string;
	}>({
		hash: "",
	});

	const [transactionSentHash, setTransactionSentHash] = useState<string>("");
	const { isConnected } = useAccount();

	const { writeContractAsync, isPending: isWriteContractPending } =
		useWriteContract();
	const { sendTransactionAsync, isPending: isSendTransactionPending } =
		useSendTransaction();

	const isPending = isWriteContractPending || isSendTransactionPending;

	const handleApprove = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const transactionHash = await writeContractAsync({
				address: SAFE_WALLET_CONTRACT_ADDRESS,
				abi,
				functionName: "approveHash",
				args: [approveFormValues.hash as `0x${string}`],
			});

			setTransactionSentHash(transactionHash);
		} catch (error) {
			alert(error);
		}
	};

	const handleExecute = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const transactionHash = await sendTransactionAsync({
				to: SAFE_WALLET_CONTRACT_ADDRESS,
				data: executeFormValues.hash as `0x${string}`,
			});

			setTransactionSentHash(transactionHash);
		} catch (error) {
			alert(error);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen p-8 pb-20 sm:p-20">
			<main className="flex flex-col gap-6 items-center sm:items-start w-full max-w-[500px]">
				<ConnectKitButton />

				{isConnected && (
					<div className="flex flex-col gap-4 w-full">
						<Tabs defaultValue="approve">
							<TabsList>
								<TabsTrigger value="approve" disabled={isPending}>
									Approve
								</TabsTrigger>
								<TabsTrigger value="execute" disabled={isPending}>
									Execute
								</TabsTrigger>
							</TabsList>

							<TabsContent value="approve">
								<form onSubmit={handleApprove} className="flex flex-col gap-3">
									<Input
										name="hash"
										value={approveFormValues.hash}
										onChange={(e) =>
											setApproveFormValues((existingValues) => ({
												...existingValues,
												hash: e.currentTarget.value,
											}))
										}
										placeholder="Enter approve hash here"
									/>

									<Button type="submit" disabled={isPending}>
										{isPending ? "Sending..." : "Approve"}
									</Button>
								</form>
							</TabsContent>

							<TabsContent value="execute">
								<form onSubmit={handleExecute} className="flex flex-col gap-3">
									<Input
										name="hash"
										value={executeFormValues.hash}
										onChange={(e) =>
											setExecuteFormValues({
												hash: e.currentTarget.value,
											})
										}
										placeholder="Enter execute hash here"
									/>

									<Button type="submit" disabled={isPending}>
										{isPending ? "Sending..." : "Execute"}
									</Button>
								</form>
							</TabsContent>
						</Tabs>

						{!!transactionSentHash && (
							<p className="text-green-500 bold text-center">
								Last transaction sent: {transactionSentHash}
							</p>
						)}
					</div>
				)}
			</main>
		</div>
	);
}
