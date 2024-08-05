"use client";

import React, { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import styles from './page.module.css';

const themes = [
    {
        background: "#1A1A2E",
        color: "#FFFFFF",
        primaryColor: "#0F3460"
    },
    {
        background: "#461220",
        color: "#FFFFFF",
        primaryColor: "#E94560"
    },
    {
        background: "#192A51",
        color: "#FFFFFF",
        primaryColor: "#967AA1"
    },
    {
        background: "#F7B267",
        color: "#000000",
        primaryColor: "#F4845F"
    },
    {
        background: "#F25F5C",
        color: "#000000",
        primaryColor: "#642B36"
    },
    {
        background: "#231F20",
        color: "#FFF",
        primaryColor: "#BB4430"
    }
];

const setTheme = (theme: { background: string, color: string, primaryColor: string }) => {
    const root = document.querySelector(":root") as HTMLElement;
    root.style.setProperty("--background", theme.background);
    root.style.setProperty("--color", theme.color);
    root.style.setProperty("--primary-color", theme.primaryColor);
};

const Page = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        const btnContainer = document.querySelector(`.${styles.themeBtnContainer}`) as HTMLElement;
        themes.forEach((theme) => {
            const div = document.createElement("div");
            div.className = styles.themeBtn;
            div.style.cssText = `background: ${theme.background}; width: 25px; height: 25px`;
            btnContainer.appendChild(div);
            div.addEventListener("click", () => setTheme(theme));
        });
    }, []);

    const handleSubmit = async (event:any) => {
        event.preventDefault();
        if (rememberMe) {
            localStorage.setItem('rememberedUsername', username);
        } else {
            localStorage.removeItem('rememberedUsername');
        }
        await signIn('credentials', {
            redirect: true,
            username,
            password,
            callbackUrl: '/lead_management/manage_users'
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.loginContainer}>
                <div className={`${styles.circle} ${styles.circleOne}`}></div>
                <div className={styles.formContainer}>
                    <img src="/illustration.png" alt="illustration" className={styles.illustration} />
                    <img src="/logo.png" alt="opencv university" className={styles.opencv_university} />
                    <h1 className={styles.opacity}>LOGIN</h1>
                    <form onSubmit={handleSubmit}>
                        <input type="text" placeholder="USERNAME" value={username} onChange={e => setUsername(e.target.value)} />
                        <input type="password" placeholder="PASSWORD" value={password} onChange={e => setPassword(e.target.value)} />
                        <label className={styles.rememberMe}>
                            <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} className={styles.checkboxRememberMe}/>
                            Remember Me
                        </label>
                        <button className={styles.opacity} type="submit">SUBMIT</button>
                    </form>
                </div>
                <div className={`${styles.circle} ${styles.circleTwo}`}></div>
            </div>
            <div className={styles.themeBtnContainer}></div>
        </div>
    );
};

export default Page;
