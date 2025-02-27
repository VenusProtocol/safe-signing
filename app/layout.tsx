"use client";

import { WagmiProvider, createConfig } from "wagmi";
import { mainnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { WALLET_CONNECT_PROJECT_ID } from "./constants";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const config = createConfig(
	getDefaultConfig({
		// Your dApps chains
		chains: [mainnet],
		// Required API Keys
		walletConnectProjectId: WALLET_CONNECT_PROJECT_ID,
		// Required App Info
		appName: "Venus Protocol",
	}),
);

const queryClient = new QueryClient();

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<WagmiProvider config={config}>
					<QueryClientProvider client={queryClient}>
						<ConnectKitProvider>{children}</ConnectKitProvider>
					</QueryClientProvider>
				</WagmiProvider>
			</body>
		</html>
	);
}
