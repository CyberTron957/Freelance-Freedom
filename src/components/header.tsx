"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { shortenAddress } from "@/lib/utils";
import { useEffect, useState } from "react";
import { connectWallet, getWalletConnection, getUserRole } from "@/services/blockchain";

export function Header() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Check for stored wallet connection and user role
  useEffect(() => {
    const { address, connected } = getWalletConnection();
    if (connected && address) {
      setWalletConnected(true);
      setWalletAddress(address);
    }
    
    const role = getUserRole();
    if (role) {
      setUserRole(role);
    }
  }, []);
  
  // Connect wallet
  const handleConnectWallet = async () => {
    try {
      const account = await connectWallet();
      if (account) {
        setWalletAddress(account);
        setWalletConnected(true);
      }
    } catch (err) {
      console.error("Failed to connect wallet:", err);
      setError("Failed to connect wallet. Make sure MetaMask is installed and unlocked.");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">FreelanceFreedom</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          {!walletConnected ? (
            <Button
              onClick={handleConnectWallet}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Connect Wallet
            </Button>
          ) : (
            <div className="flex items-center gap-4">
              <span className="text-sm hidden sm:inline-block">
                {shortenAddress(walletAddress)}
              </span>
              <div className="size-3 bg-green-500 rounded-full"></div>
              {userRole === 'client' && (
                <Link href="/jobs/create">
                  <Button>Post a Job</Button>
                </Link>
              )}
              {userRole === 'freelancer' && (
                <Link href="/jobs/browse">
                  <Button variant="outline">Browse Jobs</Button>
                </Link>
              )}
            </div>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
} 