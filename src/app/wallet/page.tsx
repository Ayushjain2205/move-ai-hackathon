"use client";

import { AccountInfo } from "@/components/wallet/AccountInfo";
import { Header } from "@/components/wallet/Header";
import { MessageBoard } from "@/components/wallet/MessageBoard";
import { NetworkInfo } from "@/components/wallet/NetworkInfo";

import { TransferAPT } from "@/components/wallet/TransferAPT";
import { WalletDetails } from "@/components/wallet/WalletDetails";
// Internal Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

function App() {
  const { connected } = useWallet();

  return (
    <>
      <Header />
      <div className="flex items-center justify-center flex-col">
        {connected ? (
          <Card>
            <CardContent className="flex flex-col gap-10 pt-6">
              <WalletDetails />
              <NetworkInfo />
              <AccountInfo />
              <TransferAPT />
              <MessageBoard />
            </CardContent>
          </Card>
        ) : (
          <CardHeader>
            <CardTitle>To get started Connect a wallet</CardTitle>
          </CardHeader>
        )}
      </div>
    </>
  );
}

export default App;
