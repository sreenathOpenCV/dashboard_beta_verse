"use client";

import TableManagement from '@/component/tableManagement/tableManagement';
import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import { useRefreshUsersMutation, useGetUsersQuery, useGetSheetNamesQuery, useGetSheetsUsersQuery } from '@/services/users_service';
import { MdOutlineRefresh } from "react-icons/md";
import { useDispatch } from 'react-redux';

const Page = () => {
  const { data: manage_users, error: fetchError, isFetching } = useGetUsersQuery("manage_users");
  const userTypes = manage_users ? Object.keys(manage_users?.data) : [];
  const [activeTab, setActiveTab] = useState(userTypes[0]);
  const [refreshUsers, { data: refreshData, error: refreshError, isLoading: isRefreshLoading }] = useRefreshUsersMutation();
  const [tableVisibility, setTableVisibility] = useState(true);
  const { refetch: refetchUsers } = useGetUsersQuery("manage_users");
  const { refetch: refetchSheetNames } = useGetSheetNamesQuery('');
  const { refetch: refetchSheetsUsers } = useGetSheetsUsersQuery('');
  const [isScrolled, setIsScrolled] = useState(false);

  const [changes, setChanges] = useState(false);
  const [pendingTab, setPendingTab] = useState<any>(0);
  const dispatch = useDispatch();
  const [popup, setPopup] = useState(false);

  const handleRefresh = async () => {
    try {
      await refreshUsers('').unwrap();
      refetchUsers();
      refetchSheetNames();
      refetchSheetsUsers();
    } catch (error) {
      console.error('Refresh failed:', error);
    }
  }

  const toggleTable = () => {
    setTableVisibility(!tableVisibility);
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
  };

  const handleConfirm = () => {
    setActiveTab(pendingTab);
    setChanges(false);
    setPopup(false);
  };

  useEffect(() => {
    if (userTypes.length > 0 && !activeTab) {
      setActiveTab(userTypes[0]);
    }
  }, [userTypes, activeTab]);

  useEffect(() => {
    const activeTabIndex = userTypes.indexOf(activeTab);
    document.documentElement.style.setProperty('--glider-index', activeTabIndex.toString());
    document.documentElement.style.setProperty('--tab-count', userTypes.length.toString());
  }, [activeTab, userTypes]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50); // Adjust the value as needed
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="dashboard_container">
      {isFetching ? (
        <div className='loader'></div>
      ) : fetchError ? (
        <div className='error'>
          {'status' in fetchError ? `Error: ${fetchError.status}` : 'An error occurred'}
          {'data' in fetchError ? JSON.stringify(fetchError.data) : 'No additional error details'}
        </div>
      ) : (
        <>
          <div className={styles.tabs_search_main}>
            <div className={`${styles.tab_and_refresh} ${isScrolled ? styles.blurred : ''}`}>
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
                <div>
                  <button onClick={handleRefresh} className={styles.refresh_container}>
                    <MdOutlineRefresh fontSize={"1.5rem"} />
                    {isRefreshLoading ? (<span>refreshing....!</span>):(<span>refresh users</span>)}
                  </button>
                </div>
              </div>
            </div>
            <div className={styles.content}>
              {userTypes.map((userType, index) => (
                activeTab === userType && <TableManagement key={index} path={"manage_users"} data={{ [userType]: manage_users.data[userType] }} activeStatus={false} setChanges={setChanges} 
                isOpen={tableVisibility}
                onToggle={toggleTable}
                />
              ))}
            </div>
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
          </div>
        </>
      )}
    </div>
  );
};

export default Page;
