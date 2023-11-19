import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

const names = ["ben", "vlad", "simon", "muneer", "bobur", "ur mam"];

export function HotTraders() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <div className="flex flex-row space-x-24">
          <p className="font-medium">Hot Traders</p>
          <div className="flex flex-col">
            <p className="font-medium">Name</p>
            <p className="font-medium">Wallet Address</p>
          </div>
          <p className="font-medium">Total Profit</p>
          <p className="font-medium">Tokens</p>
          <p className="font-medium">Correlation Score</p>
        </div>
      </div>
      {names.map((_, index) => (
        <div key={index} className="flex items-center">
          <Avatar className="h-16 w-16 mr-2">
            <AvatarImage
              src={`https://noun.pics/90${index}.svg`}
              alt="Avatar"
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
          <div className="flex flex-row space-x-24">
            <div className="flex flex-col space-x-2">
              <p className="font-medium">CryptoDude</p>
              <p className="font-medium">0x342E8bf072327708009FAa2...</p>
            </div>
            <p className="font-medium">$834</p>
            <p className="font-medium">ETH, BASE, CHAIN</p>
            <p className="font-medium">0.2</p>
          </div>
        </div>
      ))}
    </div>
  );
}
