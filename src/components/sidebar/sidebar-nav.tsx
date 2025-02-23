import { LucideIcon } from 'lucide-react';
import { SidebarGroup, SidebarGroupLabel, SidebarMenu } from '../ui/sidebar';
import { CollapsibleNavItem } from './nav/collapsible-nav-item';
import { StandardNavItem } from './nav/standard-nav-item';

type SidebarNavProps = {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
};

export function SidebarNav({ items }: SidebarNavProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Gerenciamento</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item, index) => {
          if (item.items) return <CollapsibleNavItem key={index} item={item} />;
          return <StandardNavItem key={index} item={item} />;
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
