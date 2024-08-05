import React from 'react'

const calendarTasks = () => {
  return (
    <div>calendarTasks</div>
  )
}

export default calendarTasks

// import React, { useState } from 'react';
// import styles from './CalendarTasks.module.css';

// const CalendarTasks = ({ onDateSelect, tasks }) => {
//     const [currentMonth, setCurrentMonth] = useState(new Date());
  
//     const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
//     const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
//     const handleDayClick = day => {
//       const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
//       onDateSelect(selectedDate);
//     };
  
//     const renderDay = day => {
//       const dateStr = `${currentMonth.getFullYear()}-${currentMonth.getMonth() + 1}-${day}`;
//       const dayTasks = tasks ? tasks.filter(task => task.date === dateStr) : [];
//       return (
//         <button key={day} className={styles.day} onClick={() => handleDayClick(day)}>
//           {day}
//           {dayTasks.map((task, idx) => (
//             <div key={idx}>{task.task}</div>
//           ))}
//         </button>
//       );
//     };
  
//     return (
//       <div className={styles.calendar}>
//         {days.map(renderDay)}
//       </div>
//     );
//   };
  