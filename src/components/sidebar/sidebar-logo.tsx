'use client';

import { SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar';
import { Wallet2 } from 'lucide-react';

export function SidebarLogo() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center gap-4">
          <div className="flex aspect-square size-8 items-center justify-center bg-primary text-primary-foreground rounded-full">
            <Wallet2 size="16" />
          </div>
          <div className="truncate text-center text-xl leading-tight font-mono">
            MyFinances
          </div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
