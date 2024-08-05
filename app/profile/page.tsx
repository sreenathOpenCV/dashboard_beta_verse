"use client";

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import { FaTimes, FaCamera } from 'react-icons/fa';

const ProgressBar = ({ progress }: { progress: number }) => (
  <div className={styles.progressBar}>
    <div className={styles.progressBarFill} style={{ width: `${progress}%` }} />
  </div>
);

const Page = () => {
  const [profileImg, setProfileImg] = useState<string>(localStorage.getItem('profileImg') || 'default-profile.png');
  const [tasks, setTasks] = useState<string[]>(JSON.parse(localStorage.getItem('tasks') || '[]'));
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleProfileImgChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setProfileImg(result);
        localStorage.setItem('profileImg', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTask = () => {
    if (newTask) {
      setTasks([newTask, ...tasks]);
      setNewTask('');
    }
  };

  const handleDeleteTask = (index: number) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleAddTask();
    }
  };

  return (
    <div className={`${styles.container} dashboard_container`}>
      <div className={styles.header}>
        <div className={styles.profile}>
          <label htmlFor="profileImgUpload">
            <FaCamera className={styles.cameraIcon} fontSize={"2rem"} />
          </label>
          <input
            type='file'
            id="profileImgUpload"
            onChange={handleProfileImgChange}
            accept='image/*'
            style={{ display: 'none' }}
          />
          <img src={profileImg} alt='Profile' />
        </div>
        <h1>Sri Somanath Govindalapudi</h1>
      </div>
      <div className={styles.fullWidth}>
        <div className={styles.section}>
          <h2 className={styles.title}>My tasks</h2>
          <div className={styles.taskInput}>
            <input
              type="text"
              value={newTask}
              onChange={e => setNewTask(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter a new task"
            />
            <button className="btn btn_md" onClick={handleAddTask}>Add Task</button>
          </div>
          {tasks.map((task, index) => (
            <div key={index} className={styles.item}>
              • {task} {/* Add a dot before each task */}
              <FaTimes className={styles.taskDelete} onClick={() => handleDeleteTask(index)} />
            </div>
          ))}
        </div>
      </div>
      <div className={styles.tasks}>
        <div className={styles.section}>
          <h2 className={styles.title}>My recent projects</h2>
          <div className={styles.item}>Cross-functional project plan</div>
        </div>
        <div className={styles.rightPanel}>
          <div className={styles.section}>
            <h2 className={styles.title}>My goals</h2>
            <div className={styles.goalProgress}>
              <ProgressBar progress={85} />
              <span>On track (85%)</span>
            </div>
            <div className={styles.goalProgress}>
              <ProgressBar progress={43} />
              <span>At risk (43%)</span>
            </div>
          </div>
          <div className={styles.section}>
            <h2 className={styles.title}>Frequent collaborators</h2>
            {/* Add collaborators dynamically here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
