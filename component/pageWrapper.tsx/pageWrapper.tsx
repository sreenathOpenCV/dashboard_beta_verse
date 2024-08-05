"use client";

import styles from './pageWrapper.module.css';
import { ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import RootLayout from '../rootLayout/rootLayout';

interface PageWrapperProps {
    children: ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
    const { data: session, status } = useSession();
    const isLoading = status === "loading";
    const isLoggedIn = !isLoading && session;

    if (isLoggedIn) {
        return (
            <RootLayout children={children} />
        );
    } else {
        return (
            <div className={styles.loggedOutContainer}>
                {children}
            </div>
        );
    }
};

export default PageWrapper;