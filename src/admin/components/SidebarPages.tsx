import React from 'react';
import { useCurrentAdmin } from 'adminjs';

type SidebarPagesProps = {
  pages?: Array<{ name: string; icon?: string }>;
  OriginalComponent?: React.ComponentType<any>;
};

const SidebarPages: React.FC<SidebarPagesProps> = (props) => {
  const { OriginalComponent } = props;
  const [currentAdmin] = useCurrentAdmin();
  const visiblePages = currentAdmin?.role === 'admin'
    ? props.pages
    : (props.pages || []).filter((page: { name: string }) => page.name !== 'System Settings');

  if (!OriginalComponent) {
    return null;
  }

  return <OriginalComponent {...props} pages={visiblePages} />;
};

export default SidebarPages;