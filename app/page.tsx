"use client";

import { useState } from "react";
import { ConnectKitButton } from "connectkit";
import { useAccount, useWriteContract } from "wagmi";
import { abi } from "./safeWalletAbi";
import { SAFE_WALLET_CONTRACT_ADDRESS } from "./constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  const [hash, setHash] = useState<string>("");
  const [transactionSentHash, setTransactionSentHash] = useState<string>("");
  const { isConnected } = useAccount();
  const { writeContractAsync, isPending } = useWriteContract();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const transactionHash = await writeContractAsync({
        address: SAFE_WALLET_CONTRACT_ADDRESS,
        abi,
        functionName: "approveHash",
        args: [hash as `0x${string}`],
      });

      setTransactionSentHash(transactionHash);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-8 pb-20 sm:p-20">
      <main className="flex flex-col gap-3 items-center sm:items-start w-full max-w-[500px]">
        <ConnectKitButton />

        {isConnected && (
          <>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3 w-full"
            >
              <Input
                className="block w-full"
                name="hash"
                value={hash}
                onChange={(e) => setHash(e.currentTarget.value)}
                placeholder="Enter hash here"
              />

              <Button className="w-full" type="submit" disabled={isPending}>
                {isPending ? "Sending..." : "Approve"}
              </Button>
            </form>

            {!!transactionSentHash && (
              <p className="text-green-500 bold text-center">
                Transaction sent: {transactionSentHash}
              </p>
            )}
          </>
        )}
      </main>
    </div>
  );
}
