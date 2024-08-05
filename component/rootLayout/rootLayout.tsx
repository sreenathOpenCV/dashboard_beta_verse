import { useSideBarToggle } from '@/hooks/use-sidebar-toggle';
import { ReactNode } from 'react';
import styles from './rootLayout.module.css';
import SideBar from '../sideBar/sideBar';
import NavBar from '../navBar/navBar';

interface PageWrapperProps {
    children: ReactNode;
}

const RootLayout: React.FC<PageWrapperProps> = ({ children }) => {
    const { toggleCollapse } = useSideBarToggle();

    const bodyStyle = toggleCollapse ? styles.bodyCollapsed : styles.bodyExpanded;
  return (
    <div className={styles.loggedInContainer}>
            <NavBar />
            <div className="main_content">
              <SideBar />
              {children}
            </div>
    </div>
  )
}

export default RootLayout