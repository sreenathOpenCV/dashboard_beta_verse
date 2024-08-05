import React from 'react';
import styles from './ProfileCard.module.css';
import { SlSocialInstagram } from "react-icons/sl";
import { BsFacebook } from "react-icons/bs";
import { BsTwitterX } from "react-icons/bs";

const ProfileCard = () => {
    return (
        <div className={styles.pageContent}>
            <div className={styles.padding}>
                <div className={styles.row}>
                    <div className={styles.card}>
                        <div className={styles.userProfile}>
                            <div className={styles.cardBlock}>
                                <div className={styles.profileImage}>
                                    <img src="https://img.icons8.com/bubbles/100/000000/user.png" alt="User Profile" />
                                </div>
                                <h6>Test User</h6>
                                <p>Web Designer</p>
                            </div>
                        </div>
                        <div className={styles.cardInfo}>
                            <div className={styles.cardBlock}>
                                <h6>Information</h6>
                                <div className={styles.infoRow}>
                                    <p>Email</p>
                                    <h6>rntng@gmail.com</h6>
                                </div>
                                <div className={styles.infoRow}>
                                    <p>Phone</p>
                                    <h6>98979989898</h6>
                                </div>
                                <h6>Projects</h6>
                                <div className={styles.infoRow}>
                                    <p>Recent</p>
                                    <h6>Sam Disuja</h6>
                                </div>
                                <div className={styles.infoRow}>
                                    <p>Most Viewed</p>
                                    <h6>Dinoter husainm</h6>
                                </div>
                                <ul className={styles.socialLinks}>
                                    <li><a href="#!"><BsTwitterX /></a></li>
                                    <li><a href="#!"><BsFacebook /></a></li>
                                    <li><a href="#!"><SlSocialInstagram /></a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;
