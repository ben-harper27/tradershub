"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ModeToggle } from "@/components/dropdown";
import { ChevronRight, LogIn, LogOut } from "lucide-react";
import {
  useLogin,
  useLogout,
  useProfiles,
  useSession,
} from "@lens-protocol/react-web";
import { useEffect, useState } from "react";
import { InjectedConnector } from "wagmi/connectors/injected";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image";
import { initPush } from './usePushApi'
import { useEthersSigner } from './walletClientToSigner'
import { SendNotification } from './SendNotification';

export function Nav() {
  const { execute: logoutLens } = useLogout();
  const { address, isConnected } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const { open, close } = useWeb3Modal();
  const [isClient, setIsClient] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { connectAsync } = useConnect({
    connector: new InjectedConnector(),
  });

  async function connectWallet() {
    try {
      open();
    } catch (error) {
      console.log("error:", error);
      close();
    }
  }

  async function logout() {
    try {
      await logoutLens();
      await disconnectAsync();
      router.push("/");
    } catch (error) {
      console.log("error:", error);
    }
  }

  function LoginButton({
    address,
    isConnected,
    disconnectAsync,
    connectAsync,
  }) {
    const { execute: login } = useLogin();
    const { data: profiles } = useProfiles({
      where: {
        ownedBy: [address],
      },
    });
    let profile = profiles?.length ? profiles[profiles?.length - 1] : null;

    const onLoginClick = async () => {
      if (!profile) return;
      if (isConnected) {
        await disconnectAsync();
      }

      const { connector } = await connectAsync();
      if (connector instanceof InjectedConnector) {
        const walletClient = await connector.getWalletClient();
        await login({
          address: walletClient.account.address,
          profileId: profile.id,
        });
      }
    };
    return (
      <Button variant="outline" className="mr-3" onClick={onLoginClick}>
        Sign in with Lens
        <LogIn className="mr-2" />
      </Button>
    );
  }
  const signer = useEthersSigner();

  const [pushApi, setPushApi] = React.useState<any>();

  const setPush = async (signer) => {
    if (signer) {
      const api = await initPush(signer);
      setPushApi(api);
    }
  }

  // React.useEffect(() => {
  //   setPush(signer);
  // }, [signer]);

  return (
    <nav
      className="
    border-b flex
    flex-col sm:flex-row
    items-start sm:items-center
    sm:pr-10
    "
    >
      <div className="py-3 px-8 flex flex-1 items-center p">
        <Link href="/" className="mr-5 flex items-center">
          <Image
            className="opacity-85"
            src="/images/logos/logo.png"
            width={19}
            height={19}
            alt="coinloop"
          />
          <p className={`ml-2 mr-4 text-lg text-custom-green font-semibold`}>coinloop</p>
        </Link>
        <Link
          href="/"
          className={`mr-5 text-sm ${pathname !== "/" && "opacity-50"}`}
        >
          <p>Home</p>
        </Link>
      </div>
      <div
        className="
        flex
        sm:items-center
        pl-8 pb-3 sm:p-0
      "
      >
        {isClient && !address && (
          <Button onClick={connectWallet} variant="secondary" className="mr-4">
            Connect Wallet
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
        {isClient && session && session.type !== "WITH_PROFILE" && address && (
          <LoginButton
            address={address}
            isConnected={isConnected}
            disconnectAsync={disconnectAsync}
            connectAsync={connectAsync}
          />
        )}
        {isClient && session && session.type === "WITH_PROFILE" && isConnected && (
          <>
            <Button onClick={logout} variant="secondary" className="mr-4">
              Sign Out
              <LogOut className="h-4 w-4 ml-3" />
            </Button>
            <Link
              href="/profile"
            >
              <Avatar className="mr-4">
                <AvatarImage src={session.profile.metadata?.picture?.['optimized']?.uri || "/images/icons/default-user.svg"} />
                <AvatarFallback>
                  <Image
                    className="rounded-full"
                    src="/images/icons/default-user.svg"
                    width={35}
                    height={35}
                    alt="user-image"
                  />
                </AvatarFallback>
              </Avatar>
            </Link>
          </>
        )}

        { !pushApi && (
            <Button onClick={() => {
                setPush(signer);
              }}>
              Subscribe to Notifications
            </Button>
          ) 
        }
        {
          pushApi && (
            <Button onClick={() => {
              SendNotification(pushApi);
            }}>
              Send Notification
            </Button>
          )
        }
        <ModeToggle />
      </div>
    </nav>
  );
}
