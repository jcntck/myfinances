import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

export type StandardNavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
};

export function StandardNavItem({ item }: { item: StandardNavItem }) {
  return (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton asChild tooltip={item.title}>
        <Link href={item.url}>
          {item.icon && <item.icon />}
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
