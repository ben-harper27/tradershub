"use client";

import { useAccount } from "wagmi";
import { useProfiles } from "@lens-protocol/react-web";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentSales } from "@/components/recent-sales";

export default function ProfileWrapper() {
  const { address } = useAccount();
  if (!address) return null;

  return <Profile address={address} />;
}

function Profile({ address }) {
  const { data } = useProfiles({
    where: {
      ownedBy: [address],
    },
  });

  if (!data || !data.length) return null;
  const profile = data[data.length - 1];
  if (!profile) return null;

  return (
    <main className="px-10 py-14">
      <div>
        <a
          rel="no-opener"
          target="_blank"
          href={`https://share.lens.xyz/u/${profile.handle?.localName}.${profile.handle?.namespace}`}
        >
          <div className="border rounded-lg p-10">
            <div>
              {
                <Avatar className="mr-4">
                  <AvatarImage
                    className="rounded-full"
                    src={profile?.metadata?.picture?.optimized?.uri}
                  />
                  <AvatarFallback>
                    <Image
                      className="rounded-full"
                      src="/images/icons/default-user.svg"
                      width={200}
                      height={200}
                      alt="user-image"
                    />
                  </AvatarFallback>
                </Avatar>
              }
            </div>
            <div className="mt-4">
              <p className="text-lg">{profile?.metadata?.displayName}</p>
              <p className="text-muted-foreground font-medium">
                {profile?.handle?.localName}.{profile?.handle?.namespace}
              </p>
            </div>
            <div className="mt-4">
              <p className="text-lg">{profile?.metadata?.bio}</p>
            </div>
            <div className="mt-4">
              <p className="text-lg">Followers: 1337 | Following: 0</p>
            </div>
            <div className="mt-4">
              <p className="text-lg">Wallet address: {address}</p>
            </div>
            <RecentSales />
            <div className="flex flex-row mt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    30d Profit (USD)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$4,231.89</div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Credit Trust Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Image
                    src={`/images/credit_score.png`}
                    width={200}
                    height={200}
                    alt="credit-score"
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Unique Token Holdings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">29</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Correlation Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">89%</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </a>
      </div>
    </main>
  );
}
