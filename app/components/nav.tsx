'use client'

import React from 'react';
import { Button } from '@/components/ui/button'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount } from 'wagmi'
import { disconnect } from '@wagmi/core'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ModeToggle } from '@/components/dropdown'
import { ChevronRight, Droplets, LogOut } from "lucide-react"
import { initPush } from './usePushApi'
import { useEthersSigner } from './walletClientToSigner'
import { SendNotification } from './SendNotification';

export function Nav() {
  const { open } = useWeb3Modal()
  const { address } = useAccount()
  const pathname = usePathname();
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
    <nav className='
    border-b flex
    flex-col sm:flex-row
    items-start sm:items-center
    sm:pr-10
    '>
      <div
        className='py-3 px-8 flex flex-1 items-center p'
      >
        <Link href="/" className='mr-5 flex items-center'>
          <Droplets className="opacity-85" size={19} />
          <p className={`ml-2 mr-4 text-lg font-semibold`}>lenscn</p>
        </Link>
        <Link href="/" className={`mr-5 text-sm ${pathname !== '/' && 'opacity-50'}`}>
          <p>Home</p>
        </Link>
        <Link href="/search" className={`mr-5 text-sm ${pathname !== '/search' && 'opacity-60'}`}>
          <p>Search</p>
        </Link>
        {
          address && (
            <Link href="/profile" className={`mr-5 text-sm ${pathname !== '/search' && 'opacity-60'}`}>
              <p>Profile</p>
            </Link>
          )
        }
      </div>
      <div className='
        flex
        sm:items-center
        pl-8 pb-3 sm:p-0
      '>
        {
          !address && (
            <Button onClick={() => open()} variant="secondary" className="mr-4">
          Connect Wallet
          <ChevronRight className="h-4 w-4" />
        </Button>
          )
        }
        {
          address && (
            <Button onClick={disconnect} variant="secondary" className="mr-4">
            Disconnect
            <LogOut className="h-4 w-4 ml-3" />
          </Button>
          )
        }
        
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
  )
}