import { useSession, signOut } from "@/lib/auth-client"
import {
      DropdownMenu,
      DropdownMenuContent,
      DropdownMenuItem,
      DropdownMenuLabel,
      DropdownMenuSeparator,
      DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Loader2, LogOut } from "lucide-react"

export default function UserButton() {
      const { data: session, isPending } = useSession()


      if (isPending) return <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />

      if (!session) {
            return (
                  <Button onClick={() => window.location.href = "/auth"}>
                        Sign In
                  </Button>
            )
      }


      return (
            <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                              <Avatar className="h-10 w-10 border border-zinc-800">
                                    
                                    <AvatarImage src={session.user.image || ""} alt={session.user.name} />
                                    <AvatarFallback className="bg-indigo-600 text-white font-bold">
                                          {session.user.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                              </Avatar>
                        </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                              <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{session.user.name}</p>
                                    <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
                              </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={async () => {
                              await signOut()
                              window.location.reload()
                        }} className="text-red-500 focus:text-red-500 cursor-pointer">
                              <LogOut className="mr-2 h-4 w-4" />
                              <span>Log out</span>
                        </DropdownMenuItem>
                  </DropdownMenuContent>
            </DropdownMenu>
      )
}