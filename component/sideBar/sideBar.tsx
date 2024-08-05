"use client";

import { useState } from 'react';
import Link from 'next/link';
import { SiOperagx, SiMinetest, SiPolywork } from "react-icons/si";
import { BsPersonUp } from "react-icons/bs";
import { PiChartDonutThin, PiCalendarCheckLight } from "react-icons/pi";
import { useSideBarToggle } from '@/hooks/use-sidebar-toggle';
import { SlPeople } from "react-icons/sl";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineWifiCalling3 } from "react-icons/md";
import './sideBar.css';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { setUnsavedChanges } from '@/redux/Slices/unsavedPopupSlice';

const SideBar = () => {
  const { toggleCollapse, invokeToggleCollapse } = useSideBarToggle();
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const router = useRouter();
  const unsaved = useSelector((state: RootState) => state.unsavedPopup.unsaved);
  const dispatch = useDispatch();
  const [popup, setPopup] = useState(false);
  const [pendingLink, setPendingLink] = useState<string | null>(null);
  
  const menuItems = [
    { header: 'DASHBOARD', items: [{ title: 'Home', icon: <IoHomeOutline />, link: '/' }] },
    { header: 'MANAGE', items: [
      { title: 'Lead management', icon: <SiOperagx />, subItems: [
        { title: 'Manage Users', link: '/lead_management/manage_users' },
        { title: 'Manage Sheets', link: '/lead_management/manage_sheets' },
      ]},
    ]},
    { header: 'ANALYSIS', items: [
      { title: 'Trackers', icon: <PiChartDonutThin fontSize={"1.5rem"} />, subItems: [
        { title: 'Utm Tracker', link: '/analysis/utm_tracker' },
        { title: 'Source Trackers', link: '/analysis/source_tracker' },
      ]},
    ]},
    { header: 'OPERATIONS', items: [
      { title: 'Messages', icon: <SiMinetest fontSize={"1.5rem"} />, subItems: [
        { title: 'Webinar notifications', link: '/messages/webinar_notifications' },
        { title: 'Sales Campaign', link: '/messages/sales_campaign' },
      ]},
      { title: 'Webinar Attendees', icon: <SlPeople />, link: '/webinar_attendees' },
    ]},
    { header: 'AUDIT', items: [{ title: 'Call audit', icon: <MdOutlineWifiCalling3 />, link: '/call_audit' }] },
    { header: 'SETTINGS', items: [
      { title: 'Profile', icon: <BsPersonUp />, link: '/profile' },
      { title: 'Calendar & Tasks', icon: <PiCalendarCheckLight fontSize={"1.2rem"} />, link: '/profile#calendar-and-tasks' },
      { title: 'Activities', icon: <SiPolywork />, link: '/profile#activities' },
    ]},
  ];

  const handleSubMenuClick = (e: any) => {
    e.preventDefault();
    const target = e.currentTarget;
    const subMenu = target.nextElementSibling;
    subMenu.style.display = subMenu.style.display === 'none' ? 'block' : 'none';
  };

  const handleCancel = () => {
    setPopup(false);
    setPendingLink(null);
  }

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, link: string) => {
    if (unsaved) {
      e.preventDefault();
      setPopup(true);
      setPendingLink(link);
  }
  };

  const handleConfirm = () => {
    dispatch(setUnsavedChanges(false));
    if (pendingLink) {
        setPopup(false);
        router.push(pendingLink);
        setPendingLink(null);
    }
  };

  return (
    <div className={`layout ${toggleCollapse ? 'toggled' : ''}`}>
      <aside id="sidebar" className={`sidebar ${toggleCollapse ? 'collapsed' : ''}`}>
        <div className="image-wrapper">
          <img src="/logo_opencv.png" alt="sidebar background" />
        </div>
        <div className="sidebar-layout">
          <div className="sidebar-header"></div>
          <div className="sidebar-content">
            <nav className="menu open-current-submenu">
              <ul>
                {menuItems.map((menu, index) => (
                  <div key={index}>
                    <li className="menu-header" style={{ paddingTop: 20 }}><span>{menu.header}</span></li>
                    {menu.items.map((item, idx) => (
                      <li key={idx} className={`menu-item ${item.subItems ? 'sub-menu' : ''}`}>
                        {item.subItems ? (
                          <div onClick={handleSubMenuClick}>
                            <span className="menu-icon">{item.icon}</span>
                            <span className="menu-title">{item.title}</span>
                          </div>
                        ) : (
                          <Link href={item.link} onClick={(e) => handleNavigation(e, item.link)}>
                            <div>
                              <span className="menu-icon">{item.icon}</span>
                              <span className="menu-title">{item.title}</span>
                            </div>
                          </Link>
                        )}
                        {item.subItems && (
                          <div className="sub-menu-list" style={{ display: 'none' }}>
                            <ul>
                              {item.subItems.map((subItem, subIdx) => (
                                <li key={subIdx} className="menu-item">
                                  <Link href={subItem.link} onClick={(e) => handleNavigation(e, subItem.link)}>
                                    <div>
                                      <span className="menu-title">{subItem.title}</span>
                                    </div>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </li>
                    ))}
                  </div>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </aside>
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
  );
};

export default SideBar;