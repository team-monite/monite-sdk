import { Link, useLocation } from 'react-router-dom';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

import {
  UserIcon,
  Building2Icon,
  CheckCircleIcon,
  FileIcon,
  PackageIcon,
  ReceiptIcon,
  TagIcon,
  ZapIcon,
} from 'lucide-react';

const menuItems = [
  {
    title: 'Bill Pay',
    icon: ReceiptIcon,
    url: '/bill-pay',
  },
  {
    title: 'Invoicing',
    icon: FileIcon,
    url: '/invoicing',
  },
  {
    title: 'Approval Requests',
    icon: CheckCircleIcon,
    url: '/approval-requests',
  },
  {
    title: 'Counterparts',
    icon: Building2Icon,
    url: '/counterparts',
  },
  {
    title: 'Products',
    icon: PackageIcon,
    url: '/products',
  },
  {
    title: 'Roles and Approvals',
    icon: UserIcon,
    url: '/roles-and-approvals',
  },
  {
    title: 'Tags',
    icon: TagIcon,
    url: '/tags',
  },
  {
    title: 'Onboarding',
    icon: UserIcon,
    url: '/onboarding',
  },
  {
    title: 'Integrations',
    icon: ZapIcon,
    url: '/integrations',
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="p-4">
          <h2 className="text-lg font-semibold">SDK Playground</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Components</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4 text-sm text-gray-500">v1.0.0</div>
      </SidebarFooter>
    </Sidebar>
  );
}
