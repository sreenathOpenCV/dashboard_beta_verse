"use client";

import { useEffect, useState } from 'react';
import styles from './tableManagement.module.css';
import { BsSearch } from 'react-icons/bs';
import { usePostSheetsUserMutation, usePostUserMutation } from '@/services/users_service';
import { FaRegEdit } from 'react-icons/fa';
import { IoIosArrowDown } from "react-icons/io";
import { setUnsavedChanges } from '@/redux/Slices/unsavedPopupSlice';
import { useDispatch } from 'react-redux';

const options = [
    { value: "IND", label: "IND" },
    { value: "USA", label: "USA" },
    { value: "REST", label: "REST" },
    { value: "ALL_TIME", label: "ALL_TIME" },
    { value: "DISABLED", label: "DISABLED" }
];

interface UserData {
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

interface TableManagementProps {
    path: string;
    data: Record<string, any>;
    activeStatus: boolean;
    setChanges: any;
    isOpen: boolean;
    onToggle: () => void;
}

const TableManagement = ({ path, data, activeStatus, setChanges, isOpen, onToggle }: TableManagementProps) => {
    const [search, setSearch] = useState('');
    const [updateData, setUpdateData] = useState<Record<string, any>>({});
    const [userTimeZones, setUserTimeZones] = useState<Record<string, string>>({});
    const [postUser, { isLoading: isLoadingPostUser, data: postData }] = usePostUserMutation();
    const [editingKey, setEditingKey] = useState<number | null>(null);
    const [postSheetsUser, { isLoading: isLoadingPostSheetsUser, data: postSheetsData }] = usePostSheetsUserMutation();
    const [paramsData, setParamsData] = useState<Record<string, UserData>>({});
    const [showSuccessBox, setShowSuccessBox] = useState(false);
    const [showErrorBox, setShowErrorBox] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if (data) {
            setParamsData(transformData(data));
        }
    }, [data]);

    const transformData = (data: Record<string, any>) => {
        const transformedData: Record<string, UserData> = {};
        Object.keys(data).forEach((topKey) => {
            Object.keys(data[topKey]).forEach((email) => {
                transformedData[email] = data[topKey][email];
            });
        });
        return transformedData;
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value.toLowerCase());
    };

    const getTimeZoneLimits = (timeZone: string) => {
        switch (timeZone) {
            case "ALL_TIME":
                return { MaxTimeInHours: 12.5, MinTimeInHours: -16.0 };
            case "DISABLED":
                return { MaxTimeInHours: 1.02, MinTimeInHours: 1.01 };
            case "REST":
                return { MaxTimeInHours: -3, MinTimeInHours: -6.5 };
            case "IND":
                return { MaxTimeInHours: 12.5, MinTimeInHours: -2.5 };
            case "USA":
                return { MaxTimeInHours: -7.0, MinTimeInHours: -16.0 };
            default:
                return { MaxTimeInHours: null, MinTimeInHours: null };
        }
    };

    const determineTimeZone = (user: UserData) => {
        if (!user) {
            return "DISABLED";
        }
        if (user.MaxTimeInHours === 12.5 && user.MinTimeInHours === -16.0) {
            return "ALL_TIME";
        } else if (user.MaxTimeInHours === 1.02 && user.MinTimeInHours === 1.01) {
            return "DISABLED";
        } else if (user.MaxTimeInHours === -3 && user.MinTimeInHours === -6.5) {
            return "REST";
        } else if (user.MaxTimeInHours === 12.5 && user.MinTimeInHours === -2.5) {
            return "IND";
        } else if (user.MaxTimeInHours === -7.0 && user.MinTimeInHours === -16.0) {
            return "USA";
        } else {
            return "DISABLED";
        }
    };

    const handleTimeZoneChange = (event: React.ChangeEvent<HTMLSelectElement>, email: string) => {
        setChanges(true);
        dispatch(setUnsavedChanges(true));
        setUserTimeZones({
            ...userTimeZones,
            [email]: event.target.value
        });
        const newTimeZone = event.target.value;
        const { MaxTimeInHours, MinTimeInHours } = getTimeZoneLimits(newTimeZone);
        setUpdateData(prev => ({
            ...prev,
            [email]: { ...prev[email], MaxTimeInHours, MinTimeInHours }
        }));
    };

    const handleSlackEmailChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
        setChanges(true);
        dispatch(setUnsavedChanges(true));
        const newEmail = e.target.value;
        setUpdateData(prev => ({
            ...prev,
            [key]: { ...prev[key], SlackEmail: newEmail }
        }));
    };

    const handleActiveStatusChange = (e: React.ChangeEvent<HTMLInputElement>, email: string) => {
        const isChecked = e.target.checked;
        setChanges(true);
        dispatch(setUnsavedChanges(true));
        setParamsData(prevParamsData => ({
            ...prevParamsData,
            [email]: { ...prevParamsData[email], ACTIVE_STATUS: isChecked }
        }));

        setUpdateData(prevUpdateData => ({
            ...prevUpdateData,
            [email]: { ...prevUpdateData[email], ACTIVE_STATUS: isChecked }
        }));
    };

    const handleAddUser = async () => {
        try {
            if (Object.keys(updateData).length !== 0) {
                if (activeStatus) {
                    await postSheetsUser({ path, userData: updateData }).unwrap();
                } else {
                    await postUser({ path, userData: updateData }).unwrap();
                }
                setShowSuccessBox(true);
                setChanges(false);
                dispatch(setUnsavedChanges(false));
            }
        } catch (err) {
            setShowErrorBox(true);
            console.error("Error posting user:", err);
        }
    };

    const filteredData = Object.keys(paramsData).filter((key) => {
        const item = paramsData[key];
        return (
            item.FirstName.toLowerCase().includes(search) ||
            item.LastName.toLowerCase().includes(search) ||
            item.ID.toLowerCase().includes(search) ||
            item.Role.toLowerCase().includes(search) ||
            item.SlackEmail?.toLowerCase().includes(search) ||
            key.toLowerCase().includes(search)
        );
    }).map((key) => ({ ...paramsData[key], email: key }));

    useEffect(() => {
        console.log("Updated data:", updateData);
    }, [updateData]);

    return (
        <>
            <main className={`${styles.tableContainer} ${isOpen ? '' : styles.collapsed}`} id="customers_table">
                <section className={`${styles.tableHeader} ${isOpen ? '' : styles.tableHeader_collapsed}`}>
                    <h3>{activeStatus ? "Active Users" : "All Users"}</h3>
                    <div className={styles.inputGroup}>
                        <input type="search" placeholder="Search Data..." onChange={handleSearch} />
                        <BsSearch fontSize={"1.5rem"} />
                    </div>
                    <div className={styles.togglebtn} onClick={onToggle}>
                        <IoIosArrowDown fontSize={"1.5rem"} style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(180deg)' }} />
                    </div>
                </section>
                <section id="table_container" className={`${styles.tableBody} ${isOpen ? styles.show : styles.hide}`}>
                    <table className={styles.table}>
                        <thead className={styles.theader}>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                {!activeStatus && (
                                    <>
                                        <th>Time Zone</th>
                                        <th>Slack Email</th>
                                    </>
                                )}
                                {activeStatus && (
                                    <th>Status</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((item, index) => (
                                <tr key={item.ID} className={index % 2 === 0 ? '' : styles.alternateRow}>
                                    <td>{item.FirstName} {item.LastName}</td>
                                    <td>{item.email}</td>
                                    {!activeStatus && (
                                        <>
                                            <td>
                                                <select
                                                    className={styles.selectOptions}
                                                    value={determineTimeZone(updateData[item.email] || item)}
                                                    onChange={(e) => handleTimeZoneChange(e, item.email)}
                                                >
                                                    {options.map((option) => (
                                                        <option key={option.value} value={option.value}>{option.label}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td>
                                                <div className={styles.slackemailBox}>
                                                    <input
                                                        type="text"
                                                        readOnly={editingKey !== index}
                                                        defaultValue={item.SlackEmail}
                                                        onChange={(e) => handleSlackEmailChange(e, item.email)}
                                                    />
                                                    <FaRegEdit
                                                        onClick={() => setEditingKey(index)}
                                                        style={{ cursor: 'pointer' }}
                                                    />
                                                </div>
                                            </td>
                                        </>
                                    )}
                                    {activeStatus && (
                                        <td>
                                            <label className={styles.switch}>
                                                <input
                                                    id={`check-${index}`}
                                                    type="checkbox"
                                                    checked={item.ACTIVE_STATUS !== undefined ? item.ACTIVE_STATUS : false}
                                                    onChange={(e) => handleActiveStatusChange(e, item.email)}
                                                />
                                                <div className={styles.slider}>
                                                    <div className={styles.circle}>
                                                        <svg className={styles.cross} viewBox="0 0 365.696 365.696" width="6" height="6">
                                                            <g>
                                                                <path fill="currentColor" d="M243.188 182.86L356.32 69.726c12.5-12.5 12.5-32.766 0-45.247L341.238 9.398c-12.504-12.503-32.77-12.503-45.25 0L182.86 122.528 69.727 9.374c-12.5-12.5-32.766-12.5-45.247 0L9.375 24.457c-12.5 12.504-12.5 32.77 0 45.25l113.152 113.152L9.398 295.99c-12.503 12.503-12.503 32.769 0 45.25L24.48 356.32c12.5 12.5 32.766 12.5 45.247 0l113.132-113.132L295.99 356.32c12.503 12.5 32.769 12.5 45.25 0l15.081-15.082c12.5-12.504 12.5-32.77 0-45.25zm0 0"></path>
                                                            </g>
                                                        </svg>
                                                        <svg className={styles.checkmark} viewBox="0 0 24 24" width="10" height="10">
                                                            <g>
                                                                <path fill="currentColor" d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"></path>
                                                            </g>
                                                        </svg>
                                                    </div>
                                                </div>
                                            </label>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
                <section className={styles.submit_btn}>
                    <button className="btn tb_btn" onClick={handleAddUser}>Save Changes</button>
                </section>
            </main>
            {showSuccessBox && (
                <div id="success-box" className="successBox">
                    <div className="dot"></div>
                    <div className="dot two"></div>
                    <div className="face">
                        <div className="eye"></div>
                        <div className="eye right"></div>
                        <div className="mouth happy"></div>
                    </div>
                    <div className="shadow scale"></div>
                    <div className="message">
                        <h1 className="alert">Success!</h1>
                    </div>
                    <button className="button-box" onClick={() => setShowSuccessBox(false)}>OK</button>
                </div>
            )}

            {showErrorBox && (
                <div id="error-box" className="errorBox">
                    <div className="dot"></div>
                    <div className="dot two"></div>
                    <div className="face2">
                        <div className="eye"></div>
                        <div className="eye right"></div>
                        <div className="mouth sad"></div>
                    </div>
                    <div className="shadow move"></div>
                    <div className="message">
                        <h1 className="alert">Error!</h1>
                    </div>
                    <button className="button-box" onClick={() => setShowErrorBox(false)}>Ok</button>
                </div>
            )}
        </>
    );
};

export default TableManagement;
