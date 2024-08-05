import React, { useState } from 'react';
import styles from './dateButtons.module.css';

interface DateButtonsProps {
  onDateChange: (btnId: string) => void;
  buttonSelectionToggle: boolean;
  handleButtonToggle: (toggle: boolean) => void;
}

const DateButtons: React.FC<DateButtonsProps> = ({ onDateChange, buttonSelectionToggle, handleButtonToggle }) => {
  const [selectedButton, setSelectedButton] = useState<string>('monthBtn');

  const toggleButton = (btnId: string) => {
    setSelectedButton(btnId);
    handleButtonToggle(true);
    onDateChange(btnId);
  };

  return (
    <div className={styles.container}>
      <button
        onClick={() => toggleButton('monthBtn')}
        className={`${styles.button} ${selectedButton === 'monthBtn' ? styles.selected : styles.unselected}`}
      >
        Month
      </button>
      <button
        onClick={() => toggleButton('threeMonthsBtn')}
        className={`${styles.button} ${selectedButton === 'threeMonthsBtn' ? styles.selected : styles.unselected}`}
      >
        3 Months
      </button>
      <button
        onClick={() => toggleButton('sixMonthsBtn')}
        className={`${styles.button} ${selectedButton === 'sixMonthsBtn' ? styles.selected : styles.unselected}`}
      >
        6 Months
      </button>
      <button
        onClick={() => toggleButton('yearBtn')}
        className={`${styles.button} ${selectedButton === 'yearBtn' ? styles.selected : styles.unselected}`}
      >
        Year
      </button>
    </div>
  );
};

export default DateButtons;
