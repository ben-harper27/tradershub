import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

export function RecentSales() {
  return (
    <div className="space-y-8">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex items-center">
          <Avatar className="h-9 w-9 mr-2">
            <AvatarImage src="/avatars/01.png" alt="Avatar" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex flex-row space-x-24">
            <p className="font-medium">Uniswap</p>
            <p className="font-medium">$834</p>
            <p className="font-medium">$834</p>
            <p className="font-medium">0.2</p>
            <p className="font-medium">0.2</p>
            <p className="font-medium">18.11.23 3:23pm</p>
            <div className="ml-auto font-medium">+$1,999.00</div>
          </div>
        </div>
      ))}
    </div>
  )
}