"use client";

import React, { useState, useEffect, useRef } from 'react';
import { DateRangePicker, Range } from 'react-date-range';
import { addDays, subDays, format, eachDayOfInterval } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { MdOutlineCancel } from "react-icons/md";
import styles from './Calendar.module.css';

type Props = {
  visible: boolean;
  onClose: () => void;
  getDates: (dates: string[]) => void;
  selectedDateRange: string;
  handleButtonToggle: (dates: boolean) => void;
};

const Calendar: React.FC<Props> = ({ visible, onClose, getDates, selectedDateRange, handleButtonToggle }) => {
  const calendarRef = useRef<HTMLDivElement>(null);
  
  const getInitialDateRange = () => {
    const today = new Date();
    switch (selectedDateRange) {
      case 'monthBtn':
        return { startDate: subDays(today, 29), endDate: today };
      case 'threeMonthsBtn':
        return { startDate: subDays(today, 89), endDate: today };
      case 'sixMonthsBtn':
        return { startDate: subDays(today, 179), endDate: today };
      case 'yearBtn':
        return { startDate: subDays(today, 364), endDate: today };
      default:
        return { startDate: today, endDate: addDays(today, 6) };
    }
  };

  const [dateRange, setDateRange] = useState(getInitialDateRange());

  useEffect(() => {
    setDateRange(getInitialDateRange());
  }, [selectedDateRange]);

  useEffect(() => {
    const { startDate, endDate } = dateRange;
    const range = eachDayOfInterval({ start: startDate, end: endDate });
    const formattedDates = range.map(date => format(date, 'yyyy-MM-dd'));
    getDates(formattedDates);
  }, [dateRange]);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  const handleSelect = (ranges: any) => {
    const { selection } = ranges;
    setDateRange({ startDate: selection.startDate, endDate: selection.endDate });
    handleButtonToggle(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (visible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [visible]);

  return (
    <div>
      {visible && (
        <div ref={calendarRef} className={styles.calendarContainer}>
          <DateRangePicker
            editableDateInputs={true}
            onChange={handleSelect}
            moveRangeOnFirstSelection={false}
            ranges={[{ ...dateRange, key: 'selection' }]}
            className=""
          />
          <button onClick={onClose} className={styles.closeButton}><MdOutlineCancel /></button>
        </div>
      )}
    </div>
  );
};

export default Calendar;
