// Internal components
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import {
  APTOS_CONNECT_ACCOUNT_URL,
  AboutAptosConnect,
  type AboutAptosConnectEducationScreen,
  AdapterWallet,
  AdapterNotDetectedWallet,
  AptosPrivacyPolicy,
  WalletItem,
  groupAndSortWallets,
  isAptosConnectWallet,
  isInstallRequired,
  truncateAddress,
  useWallet,
} from "@aptos-labs/wallet-adapter-react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Copy,
  LogOut,
  User,
  Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

interface WalletSelectorProps {
  className?: string;
  buttonText?: string;
}

export function WalletSelector({
  className,
  buttonText = "Connect a Wallet",
}: WalletSelectorProps = {}) {
  const { account, connected, disconnect, wallet } = useWallet();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const closeDialog = useCallback(() => setIsDialogOpen(false), []);

  const gotoWallet = useCallback(() => {
    router.push("/wallet");
  }, []);

  const copyAddress = useCallback(async () => {
    if (!account?.address.toStringLong()) return;
    try {
      await navigator.clipboard.writeText(account.address.toStringLong());
      toast({
        title: "Success",
        description: "Copied wallet address to clipboard.",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy wallet address.",
      });
    }
  }, [account?.address, toast]);

  const StyledButton = ({ children }: { children: React.ReactNode }) => (
    <div className="group relative">
      {/* Button shadow/border effect */}
      <div
        className="absolute inset-0 rounded-xl translate-y-2 bg-black/20 transition-transform
                     group-hover:translate-y-1.5 group-active:translate-y-0.5"
      />

      {/* Main button */}
      <div
        className="relative transform transition-all duration-200
                     group-active:translate-y-1"
      >
        <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 p-0.5 rounded-xl">
          <div
            className="bg-gradient-to-b from-white/20 to-transparent backdrop-blur-sm rounded-lg
                         border-2 border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.3)]
                         px-8 py-3 font-title"
          >
            {children}
          </div>
        </div>
      </div>

      {/* Shine effect */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div
          className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%]
                       bg-gradient-to-r from-transparent via-white/10 to-transparent
                      transition-transform duration-1000"
        />
      </div>
    </div>
  );

  const StyledMenuItem = ({
    icon: Icon,
    children,
    onClick,
  }: {
    icon: any;
    children: React.ReactNode;
    onClick?: () => void;
  }) => (
    <DropdownMenuItem
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-3 hover:bg-white/10 transition-colors rounded-lg text-white/90 hover:text-white
                 font-title text-lg drop-shadow-glow"
    >
      <Icon className="h-5 w-5" />
      {children}
    </DropdownMenuItem>
  );

  return connected ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="transform hover:-translate-y-1 transition-transform duration-200">
          <StyledButton>
            <span className={className}>
              {account?.ansName ||
                truncateAddress(account?.address.toStringLong()) ||
                "Unknown"}
            </span>
          </StyledButton>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="p-2 bg-gradient-to-b from-pink-500/80 to-rose-500/80 backdrop-blur-md border-2 border-white/30 
                   shadow-[0_0_20px_rgba(255,255,255,0.2)] rounded-xl min-w-[200px]"
      >
        <StyledMenuItem icon={Copy} onClick={copyAddress}>
          Copy address
        </StyledMenuItem>
        {wallet && isAptosConnectWallet(wallet) && (
          <StyledMenuItem icon={User}>
            <a
              href={APTOS_CONNECT_ACCOUNT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-2 w-full"
            >
              Account
            </a>
          </StyledMenuItem>
        )}
        <StyledMenuItem icon={LogOut} onClick={disconnect}>
          Disconnect
        </StyledMenuItem>
        <StyledMenuItem icon={Wallet} onClick={gotoWallet}>
          Wallet
        </StyledMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <div className="transform hover:-translate-y-1 transition-transform duration-200">
          <StyledButton>
            <span className={className}>{buttonText}</span>
          </StyledButton>
        </div>
      </DialogTrigger>
      <ConnectWalletDialog close={closeDialog} />
    </Dialog>
  );
}

interface ConnectWalletDialogProps {
  close: () => void;
}

function ConnectWalletDialog({ close }: ConnectWalletDialogProps) {
  const { wallets = [] } = useWallet();
  const { aptosConnectWallets, availableWallets, installableWallets } =
    groupAndSortWallets(wallets);

  const hasAptosConnectWallets = !!aptosConnectWallets.length;

  return (
    <DialogContent className="max-h-screen overflow-auto">
      <AboutAptosConnect renderEducationScreen={renderEducationScreen}>
        <DialogHeader>
          <DialogTitle className="flex flex-col text-center leading-snug">
            {hasAptosConnectWallets ? (
              <>
                <span>Log in or sign up</span>
                <span>with Social + Aptos Connect</span>
              </>
            ) : (
              "Connect Wallet"
            )}
          </DialogTitle>
        </DialogHeader>

        {hasAptosConnectWallets && (
          <div className="flex flex-col gap-2 pt-3">
            {aptosConnectWallets.map((wallet) => (
              <AptosConnectWalletRow
                key={wallet.name}
                wallet={wallet}
                onConnect={close}
              />
            ))}
            <p className="flex gap-1 justify-center items-center text-muted-foreground text-sm">
              Learn more about{" "}
              <AboutAptosConnect.Trigger className="flex gap-1 py-3 items-center text-foreground">
                Aptos Connect <ArrowRight size={16} />
              </AboutAptosConnect.Trigger>
            </p>
            <AptosPrivacyPolicy className="flex flex-col items-center py-1">
              <p className="text-xs leading-5">
                <AptosPrivacyPolicy.Disclaimer />{" "}
                <AptosPrivacyPolicy.Link className="text-muted-foreground underline underline-offset-4" />
                <span className="text-muted-foreground">.</span>
              </p>
              <AptosPrivacyPolicy.PoweredBy className="flex gap-1.5 items-center text-xs leading-5 text-muted-foreground" />
            </AptosPrivacyPolicy>
            <div className="flex items-center gap-3 pt-4 text-muted-foreground">
              <div className="h-px w-full bg-secondary" />
              Or
              <div className="h-px w-full bg-secondary" />
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 pt-3">
          {availableWallets.map((wallet) => (
            <WalletRow key={wallet.name} wallet={wallet} onConnect={close} />
          ))}
          {!!installableWallets.length && (
            <Collapsible className="flex flex-col gap-3">
              <CollapsibleTrigger asChild>
                <Button size="sm" variant="ghost" className="gap-2">
                  More wallets <ChevronDown />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="flex flex-col gap-3">
                {installableWallets.map((wallet) => (
                  <WalletRow
                    key={wallet.name}
                    wallet={wallet}
                    onConnect={close}
                  />
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </AboutAptosConnect>
    </DialogContent>
  );
}

interface WalletRowProps {
  wallet: AdapterWallet | AdapterNotDetectedWallet;
  onConnect?: () => void;
}

function WalletRow({ wallet, onConnect }: WalletRowProps) {
  return (
    <WalletItem
      wallet={wallet}
      onConnect={onConnect}
      className="flex items-center justify-between px-4 py-3 gap-4 border rounded-md"
    >
      <div className="flex items-center gap-4">
        <WalletItem.Icon className="h-6 w-6" />
        <WalletItem.Name className="text-base font-normal" />
      </div>
      {isInstallRequired(wallet) ? (
        <Button size="sm" variant="ghost" asChild>
          <WalletItem.InstallLink />
        </Button>
      ) : (
        <WalletItem.ConnectButton asChild>
          <Button size="sm">Connect</Button>
        </WalletItem.ConnectButton>
      )}
    </WalletItem>
  );
}

function AptosConnectWalletRow({ wallet, onConnect }: WalletRowProps) {
  return (
    <WalletItem wallet={wallet} onConnect={onConnect}>
      <WalletItem.ConnectButton asChild>
        <Button size="lg" variant="outline" className="w-full gap-4">
          <WalletItem.Icon className="h-5 w-5" />
          <WalletItem.Name className="text-base font-normal" />
        </Button>
      </WalletItem.ConnectButton>
    </WalletItem>
  );
}

function renderEducationScreen(screen: AboutAptosConnectEducationScreen) {
  return (
    <>
      <DialogHeader className="grid grid-cols-[1fr_4fr_1fr] items-center space-y-0">
        <Button variant="ghost" size="icon" onClick={screen.cancel}>
          <ArrowLeft />
        </Button>
        <DialogTitle className="leading-snug text-base text-center">
          About Aptos Connect
        </DialogTitle>
      </DialogHeader>

      <div className="flex h-[162px] pb-3 items-end justify-center">
        <screen.Graphic />
      </div>
      <div className="flex flex-col gap-2 text-center pb-4">
        <screen.Title className="text-xl" />
        <screen.Description className="text-sm text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a]:text-foreground" />
      </div>

      <div className="grid grid-cols-3 items-center">
        <Button
          size="sm"
          variant="ghost"
          onClick={screen.back}
          className="justify-self-start"
        >
          Back
        </Button>
        <div className="flex items-center gap-2 place-self-center">
          {screen.screenIndicators.map((ScreenIndicator, i) => (
            <ScreenIndicator key={i} className="py-4">
              <div className="h-0.5 w-6 transition-colors bg-muted [[data-active]>&]:bg-foreground" />
            </ScreenIndicator>
          ))}
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={screen.next}
          className="gap-2 justify-self-end"
        >
          {screen.screenIndex === screen.totalScreens - 1 ? "Finish" : "Next"}
          <ArrowRight size={16} />
        </Button>
      </div>
    </>
  );
}
