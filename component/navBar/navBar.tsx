'use client';

import { useEffect, useRef, useState } from 'react';
import { RxHamburgerMenu } from "react-icons/rx";
import { BsPersonCircle, BsSearch } from "react-icons/bs";
import { SiMinetest, SiOperagx } from 'react-icons/si';
import { FaUncharted } from 'react-icons/fa';
import { TbSettingsShare } from "react-icons/tb";
import Link from 'next/link';
import styles from './navBar.module.css';
import { signOut } from 'next-auth/react'
import { useSideBarToggle } from '@/hooks/use-sidebar-toggle';
import { useRouter } from 'next/navigation';
import { SlPeople } from 'react-icons/sl';
import { MdOutlineWifiCalling3 } from 'react-icons/md';

interface NavItem {
    icon: JSX.Element;
    label: string;
    links: { label: string; href: string }[];
}

export default function NavBar() {
    const { invokeToggleCollapse } = useSideBarToggle();
    const [showSearchPopup, setShowSearchPopup] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const searchRef = useRef<HTMLDivElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const navItems: NavItem[] = [
        {
            icon: <SiOperagx />,
            label: 'Lead Management',
            links: [
                { label: 'Manage Users', href: '/lead_management/manage_users' },
                { label: 'Manage Sheets', href: '/lead_management/manage_sheets' }
            ]
        },
        {
            icon: <FaUncharted />,
            label: 'Analysis',
            links: [
                { label: 'Utm tracker', href: '/analysis/utm_tracker' },
                { label: 'Source tracker', href: '/analysis/source_tracker' }
            ]
        },
        {
            icon: <SiMinetest />,
            label: 'Messages',
            links: [
                { label: 'Webinar notifications', href: '/messages/webinar_notifications' },
                { label: 'Sales campaign', href: '/messages/sales_campaign' }
            ]
        },
        {
            icon: <SlPeople />,
            label: 'Webinar attendees',
            links: [{ label: 'Webinar attendees', href: '/webinar_attendees' },]
        },
        {
            icon: <MdOutlineWifiCalling3 />,
            label: 'Audit',
            links: [
                { label: 'call audits', href: '/call_audit' }
            ]
        },
        {
            icon: <TbSettingsShare />,
            label: 'Settings',
            links: [
                { label: 'Profile section', href: '/profile' },
            ]
        }
    ];

    const handleSearchClick = () => {
        setShowSearchPopup(!showSearchPopup);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (searchRef.current && !searchRef.current.contains(event.target as Node) &&
            popupRef.current && !popupRef.current.contains(event.target as Node)) {
            setShowSearchPopup(false);
        }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.ctrlKey && event.key === 'k') {
            event.preventDefault();
            setShowSearchPopup(prev => !prev);
            if (!showSearchPopup && inputRef.current) {
                inputRef.current.focus();
            }
        } else if (event.key === 'Enter' && showSearchPopup) {
            event.preventDefault();
            console.log('Search for:', searchInput);
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(event.target.value);
    };

    const handleSignOut = () => {
        signOut({ redirect: false }).then(() => {
            router.push('/');
        });
    };
   

    const filteredItems = navItems.filter(item => 
        item.links.some(link => 
            link.label.toLowerCase().includes(searchInput.toLowerCase())
        )
    );

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [showSearchPopup]);

    return (
        <nav className={styles.navBar}>
            <div className={styles.container}>
                <div className={styles.toggle_container}>
                    <button className={styles.toggle_button} onClick={invokeToggleCollapse}>
                        <RxHamburgerMenu fontSize={"1.5rem"} />
                    </button>
                    <div className={styles.header_logo}>
                        <img src="/logo_opencv.png" alt="logo" className={styles.logo} />
                    </div>
                </div>
                <div ref={searchRef} className={styles.searchContainer}>
                    <div className={styles.searchInputWrapper}>
                        <BsSearch className={styles.searchIcon} />
                        <input 
                            type="text" 
                            className={styles.search} 
                            onClick={handleSearchClick} 
                            onChange={handleInputChange}
                            value={searchInput}
                            ref={inputRef}
                            placeholder="Search..." 
                        />
                        <span className={styles.shortcut}>Ctrl + K</span>
                    </div>
                    {showSearchPopup && (
                        <div ref={popupRef} className={`${styles.popup}`}>
                            <ul>
                                {filteredItems.map(item => (
                                    <li key={item.label}>
                                        {item.icon}
                                        <ul>
                                            {item.links.filter(link =>
                                                link.label.toLowerCase().includes(searchInput.toLowerCase())
                                            ).map(link => (
                                                <li key={link.href}>
                                                    <Link href={link.href}>{link.label}</Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <div className={styles.profileContainer}>
                    <div className={styles.dropdown}>
                        <button className={styles.profileMenu}>
                            <BsPersonCircle fontSize={"1.5rem"} />
                        </button>
                        <div className={styles.dropdownMenu}>
                            <div className={styles.profileInfo}>
                                <div className={styles.avatar}>
                                    <BsPersonCircle fontSize={"1.5rem"} />
                                </div>
                                <div className={styles.profileText}>
                                    <h5 className={styles.profileName}>OpenCV User</h5>
                                    <p className={styles.profileEmail}>user@deepvidya.ai</p>
                                </div>
                            </div>
                            <div className={styles.dropdownDivider}></div>
                            <ul className={styles.dropdownList}>
                                <li><a className={styles.dropdownItem} href="/profile">Profile</a></li>
                                <li><a className={styles.dropdownItem} href="/profile">Calendar and Date Time</a></li>
                                <li><a className={styles.dropdownItem} href="/profile">Activities</a></li>
                                <li><a className={styles.dropdownItem} onClick={handleSignOut}>Sign Out</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
