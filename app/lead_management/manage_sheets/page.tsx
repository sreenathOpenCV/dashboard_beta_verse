"use client";

import TableManagement from '@/component/tableManagement/tableManagement';
import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { useRefreshUsersMutation, useGetUsersQuery, useGetSheetNamesQuery, useGetSheetsUsersQuery } from '@/services/users_service';
import { RootState } from '@/redux/store';
import { MdOutlineRefresh } from "react-icons/md";
import SearchableDropdown from '@/component/searchableDropdown/searchableDropdown';

interface UserDetails {
    FirstName: string;
    LastName: string;
    ID: string;
    Role: string;
    MaxTimeInHours?: number;
    MinTimeInHours?: number;
    SlackEmail?: string;
    ACTIVE_STATUS?: boolean;
    email?: string;
}

interface Users {
    [key: string]: UserDetails;
}

const Page = () => {
    const { selectedSheetPath } = useSelector((state: RootState) => state.sheetSelection);
    const [sheetKey, setSheetKey] = useState<string>(selectedSheetPath);
    const { data: manage_sheets, error: fetchError, isFetching } = useGetSheetsUsersQuery(sheetKey);
    const userTypes = manage_sheets ? Object.keys(manage_sheets?.data) : [];
    const [activeTab, setActiveTab] = useState<string | undefined>(undefined);
    const { data: sheetData } = useGetSheetNamesQuery("");
    const [refreshUsers, { data: refreshData, error: refreshError, isLoading: isRefreshLoading }] = useRefreshUsersMutation();
    const [sheetOptions, setSheetOptions] = useState<string[]>([]);
    const { refetch: refetchUsers } = useGetUsersQuery("manage_users");
    const { refetch: refetchSheetNames } = useGetSheetNamesQuery('');
    const { refetch: refetchSheetsUsers } = useGetSheetsUsersQuery('');
    const [isScrolled, setIsScrolled] = useState(false);
    const [changes, setChanges] = useState(false);
    const [pendingSheet, setPendingSheet] = useState<string | null>(null);
    const [pendingTab, setPendingTab] = useState<string | null>(null);
    const dispatch = useDispatch();
    const [popup, setPopup] = useState(false);
    const [tableVisibility, setTableVisibility] = useState({
      active: true,
      inactive: true
  });

    useEffect(() => {
        if (sheetData && sheetData.data) {
            setSheetOptions(sheetData.data);
        }
    }, [sheetData]);

    useEffect(() => {
        if (userTypes.length > 0 && activeTab === undefined) {
            setActiveTab(userTypes[0]);
        }
    }, [userTypes]);

    useEffect(() => {
        const activeTabIndex = userTypes.indexOf(activeTab || "");
        document.documentElement.style.setProperty('--glider-index', activeTabIndex.toString());
        document.documentElement.style.setProperty('--tab-count', userTypes.length.toString());
    }, [activeTab, userTypes]);

    const handleSheetChange = (selectedOption: string) => {
        if (changes) {
            setPendingSheet(selectedOption);
            setPopup(true);
        } else {
            setSheetKey(selectedOption);
        }
    };

    const filterUsersByStatus = (users: Users, isActive: boolean) => {
        return Object.fromEntries(
            Object.entries(users).filter(([_, userDetails]) => {
                const user = userDetails as UserDetails;
                return user.ACTIVE_STATUS === isActive || (user.ACTIVE_STATUS === undefined && !isActive);
            })
        );
    };

    const handleRefresh = async () => {
        try {
            await refreshUsers('').unwrap();
            refetchUsers();
            refetchSheetNames();
            refetchSheetsUsers();
        } catch (error) {
            console.error('Refresh failed:', error);
        }
    };

    const handleTabChange = (newValue: string) => {
        if (changes) {
            setPendingTab(newValue);
            setPopup(true);
        } else {
            setActiveTab(newValue);
        }
    };

    const handleCancel = () => {
        setPopup(false);
        setPendingSheet(null);
        setPendingTab(null);
    };

    const handleConfirm = () => {
        if (pendingTab !== null) {
            setActiveTab(pendingTab);
        }
        if (pendingSheet !== null) {
            setSheetKey(pendingSheet);
        }
        setChanges(false);
        setPopup(false);
    };
  
    const toggleActiveTables = () => {
        setTableVisibility(prev => ({
            ...prev,
            active: !prev.active
        }));
    };

    const toggleInactiveTables = () => {
        setTableVisibility(prev => ({
            ...prev,
            inactive: !prev.inactive
        }));
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            {isFetching ? (
                <div className="dashboard_container">
                    <div className='loader loader_page'></div>
                </div>
            ) : fetchError ? (
                <div className='error dashboard_container'>
                    { 'status' in fetchError ? `Error: ${fetchError.status}` : 'An error occurred' }
                    { 'data' in fetchError ? JSON.stringify(fetchError.data) : 'No additional error details' }
                </div>
            ) : (
                manage_sheets && (
                    <div className={styles.tabs_search_main}>
                        <div className={`${styles.tabs_search_container} ${isScrolled ? styles.blurred : ''}`}>
                            <div className={`${styles.container} dashboard_container`}>
                                <div className={styles.tabs}>
                                    {userTypes.map((userType, index) => (
                                        <React.Fragment key={index}>
                                            <input
                                                type="radio"
                                                id={`radio-${index + 1}`}
                                                name="tabs"
                                                className={styles.radioInput}
                                                checked={activeTab === userType}
                                                onChange={() => handleTabChange(userType)}
                                            />
                                            <label className={styles.tab} htmlFor={`radio-${index + 1}`}>
                                                {userType.replace('_', ' ')}
                                            </label>
                                        </React.Fragment>
                                    ))}
                                    <span className={styles.glider}></span>
                                </div>
                                <div className={styles.dropdownContainer}>
                                    <SearchableDropdown options={sheetOptions} onChange={handleSheetChange} />
                                </div>
                                <div>
                                    <button onClick={handleRefresh} className={styles.refresh_container}>
                                        <MdOutlineRefresh fontSize={"1.5rem"} />
                                        <span>refresh sheets</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className={styles.content}>
                            <div className={`${styles.container_tables} dashboard_container`}>
                                {userTypes.map((userType, index) => (
                                    activeTab === userType && (
                                        <React.Fragment key={userType}>
                                          <TableManagement
                                              key={`${index}-active`}
                                              path={sheetKey}
                                              data={{ [userType]: filterUsersByStatus(manage_sheets.data[userType], true) }}
                                              activeStatus={true}
                                              setChanges={setChanges}
                                              isOpen={tableVisibility.active}
                                              onToggle={toggleActiveTables}
                                          />

                                          <TableManagement
                                              key={`${index}-inactive`}
                                              path={sheetKey}
                                              data={{ [userType]: filterUsersByStatus(manage_sheets.data[userType], false) }}
                                              activeStatus={true}
                                              setChanges={setChanges}
                                              isOpen={tableVisibility.inactive}
                                              onToggle={toggleInactiveTables}
                                          />
                                        </React.Fragment>
                                    )
                                ))}
                            </div>
                        </div>
                    </div>
                )
            )}
            {popup && (
                <div className="popup">
                    <div className="popup-content">
                        <h3>Unsaved Changes</h3>
                        <p>You have unsaved changes. Are you sure you want to proceed?</p>
                        <button className='btn btn_md' onClick={handleConfirm}>Proceed</button>
                        <button className='btn btn_md' onClick={handleCancel}>Stay</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Page;
