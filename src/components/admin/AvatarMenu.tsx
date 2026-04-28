import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { api } from "@/lib/api/client";
import { useI18n } from "@/lib/i18n";
import { LogOut, User, Settings as SettingsIcon, Users } from "lucide-react";
import { toast } from "sonner";

function initials(name?: string) {
  if (!name) return "··";
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

export function AvatarMenu() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { data: me } = useQuery({ queryKey: ["me"], queryFn: () => api.me() });

  async function signOut() {
    await api.logout();
    toast.success("Signed out");
    navigate({ to: "/login" });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Account menu">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs bg-[color:var(--primary-soft)] text-primary">{initials(me?.name)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="text-sm font-medium leading-tight">{me?.name ?? "—"}</div>
          <div className="text-xs text-muted-foreground font-normal">{me?.email ?? ""}</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile" className="cursor-pointer">
            <User className="h-4 w-4 mr-2" /> {t("nav.profile")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/accounts" className="cursor-pointer">
            <Users className="h-4 w-4 mr-2" /> {t("nav.accounts")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings" className="cursor-pointer">
            <SettingsIcon className="h-4 w-4 mr-2" /> {t("nav.settings")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut} className="cursor-pointer text-destructive focus:text-destructive">
          <LogOut className="h-4 w-4 mr-2" /> {t("nav.signOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
