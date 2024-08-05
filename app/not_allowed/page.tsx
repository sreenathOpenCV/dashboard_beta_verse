"use client";

import React from 'react';
import styles from './Page.module.css';

const Page: React.FC = () => {
  return (
    <div className={styles.not_allowed_container} style={{margin: "0 auto"}}>
      <h1>403 Forbidden</h1>
      <p>You do not have permission to access this page.</p>
    </div>
  );
};

export default Page;
