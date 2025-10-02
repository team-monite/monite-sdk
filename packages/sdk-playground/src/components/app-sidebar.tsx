import { LoginForm } from './login/login-form';
import { Button } from './ui/button';
import { Dialog } from './ui/dialog';
import { DialogContent } from './ui/dialog';
import { DialogHeader } from './ui/dialog';
import { DialogTitle } from './ui/dialog';
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
import { SignedIn, UserButton } from '@clerk/react-router';
import {
  UserIcon,
  Building2Icon,
  CheckCircleIcon,
  FileIcon,
  PackageIcon,
  ReceiptIcon,
  TagIcon,
  ZapIcon,
  Settings2Icon,
  DollarSignIcon,
  StoreIcon,
} from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

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
    title: 'Transactions',
    icon: StoreIcon,
    url: '/transactions',
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
    title: 'Financing',
    icon: DollarSignIcon,
    url: '/financing',
  },
  {
    title: 'Template Settings',
    icon: Settings2Icon,
    url: '/template-settings',
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

const dropinMenuItems = [
  {
    title: 'Bill Pay',
    icon: ReceiptIcon,
    url: '/dropin/bill-pay',
  },
  {
    title: 'Invoicing',
    icon: FileIcon,
    url: '/dropin/invoicing',
  },
];

export function AppSidebar() {
  const location = useLocation();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="p-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <SignedIn>
              <UserButton />
            </SignedIn>{' '}
            SDK Playground
          </h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>React Components</SidebarGroupLabel>

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
        <SidebarGroup>
          <SidebarGroupLabel>Drop-in Components</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {dropinMenuItems.map((item) => (
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
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => setIsLoginOpen(true)}
        >
          Use a different account
        </Button>
        <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Login</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <LoginForm
                onSubmit={() => {
                  setIsLoginOpen(false);
                  window.location.reload();
                }}
                onCancel={() => setIsLoginOpen(false)}
              />
            </div>
          </DialogContent>
        </Dialog>
      </SidebarFooter>
    </Sidebar>
  );
}
