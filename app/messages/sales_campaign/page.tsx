"use client";

import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaAngleUp, FaAngleDown, FaCalendarAlt, FaClock } from 'react-icons/fa';
import styles from './page.module.css';

const Page: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [view, setView] = useState<'days' | 'months'>('days');
  const [selectedHour, setSelectedHour] = useState<number>(9); // Default hour set to 9
  const [selectedMinute, setSelectedMinute] = useState<number>(30); // Default minute set to 30
  const [file, setFile] = useState<File | null>(null);
  const [salesPitchStartMins, setSalesPitchStartMins] = useState(60);
  const [isCalendarScaled, setIsCalendarScaled] = useState(false);
  const [isTimePickerScaled, setIsTimePickerScaled] = useState(false);
  const [webinarDate, setWebinarDate] = useState<Date | null>(null);
  const [webinarTime, setWebinarTime] = useState<string>('21:30');
  const [webinarLink, setWebinarLink] = useState<string>('https://opencv.org/ai-webinar');
  const [zoomLinkVerified, setZoomLinkVerified] = useState<string>('yes');

  const [tempDate, setTempDate] = useState(new Date());

  const handleDayClick = (day: number) => {
    const newDate = new Date(tempDate);
    newDate.setDate(day);
    setCurrentDate(newDate);

    if (selectedHour === null || selectedMinute === null) {
      setSelectedHour(9);
      setSelectedMinute(30);
    }
  };

  const handleMonthClick = (month: number) => {
    const newDate = new Date(tempDate);
    newDate.setMonth(month);
    setView('days');
    setTempDate(newDate);
  };

  const handleHourChange = (delta: number) => {
    if (selectedHour !== null) {
      const newHour = (selectedHour + delta + 24) % 24;
      setSelectedHour(newHour);
    }
  };

  const handleMinuteChange = (delta: number) => {
    if (selectedMinute !== null) {
      const newMinute = (selectedMinute + delta + 60) % 60;
      setSelectedMinute(newMinute);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleZoomLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZoomLinkVerified(e.target.value.toLowerCase());
  };

  const handleSalesPitchStartMinsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSalesPitchStartMins(Number(event.target.value));
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const timeString = event.target.value;
    const timeParts = timeString.split(':');
  
    if (timeParts.length === 2) {
      const hour = parseInt(timeParts[0], 10);
      const minute = parseInt(timeParts[1], 10);
  
      if (!isNaN(hour) && !isNaN(minute) && hour >= 0 && hour < 24 && minute >= 0 && minute < 60) {
        setSelectedHour(hour);
        setSelectedMinute(minute);
      } else {
        alert('Please enter a valid time (HH:MM)');
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file || !currentDate || selectedHour === null || selectedMinute === null) {
      alert('Please fill out all required fields.');
      return;
    }

    if (zoomLinkVerified !== 'yes' && zoomLinkVerified !== 'no') {
      alert('Zoom link verification must be "yes" or "no".');
      return;
    }

    const timestamp = new Date(currentDate);
    timestamp.setHours(selectedHour);
    timestamp.setMinutes(selectedMinute);

    const formattedTimestamp = `${timestamp.getFullYear()}-${('0' + (timestamp.getMonth() + 1)).slice(-2)}-${('0' + timestamp.getDate()).slice(-2)} ${('0' + timestamp.getHours()).slice(-2)}:${('0' + timestamp.getMinutes()).slice(-2)}:00`;

    const queryParams = {
      timestamp: formattedTimestamp,
      sales_pitch_start_mins: salesPitchStartMins.toString(),
    };

    try {
      // await postAttendees({ file, queryParams }).unwrap();
      alert('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('File upload failed');
    }
  };

  const toggleCalendarScale = () => {
    setIsCalendarScaled(true);
    setTimeout(() => setIsCalendarScaled(false), 300);
  };

  const toggleTimePickerScale = () => {
    setIsTimePickerScaled(true);
    setTimeout(() => setIsTimePickerScaled(false), 300);
  };

  useEffect(() => {
    // Set default webinar date to the next Tuesday
    const nextTuesday = new Date();
    nextTuesday.setDate(nextTuesday.getDate() + ((2 + 7 - nextTuesday.getDay()) % 7));
    nextTuesday.setHours(21, 30, 0, 0);
    setWebinarDate(nextTuesday);
    setWebinarTime('21:30');
  }, []);

  return (
    <div className={styles.mainContainer}>
      <h4 className={styles.title}>Sales Campaign &#40; Under construction...! &#41; </h4>
      <div className={styles.contentContainer}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="file" className={styles.label}>
              Upload valid CSV file:
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className={styles.inputFile}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="sales_pitch_start_mins" className={styles.label}>
              Minutes into the webinar when the sales pitch starts:
            </label>
            <input
              type="number"
              id="sales_pitch_start_mins"
              value={salesPitchStartMins}
              onChange={handleSalesPitchStartMinsChange}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.datePickerContainer}>
            <label htmlFor="date" className={styles.label}>
              Select PST Date:
            </label>
            <div className={styles.relativeContainer}>
              <input
                type="text"
                id="date"
                readOnly
                value={currentDate ? currentDate.toDateString() : ''}
                className={styles.inputDate}
                onClick={toggleCalendarScale}
                required
              />
              <FaCalendarAlt className={styles.icon} onClick={toggleCalendarScale} />
            </div>
          </div>
          <div className={styles.timePickerContainer}>
            <label htmlFor="time" className={styles.label}>
              Select PST Time:
            </label>
            <div className={styles.relativeContainer}>
              <input
                type="text"
                id="time"
                value={selectedHour !== null && selectedMinute !== null ? `${selectedHour}:${selectedMinute < 10 ? `0${selectedMinute}` : selectedMinute}` : ''}
                className={styles.inputTime}
                onChange={handleTimeChange}
                onClick={toggleTimePickerScale}
                required
              />
              <FaClock className={styles.icon} onClick={toggleTimePickerScale} />
            </div>
          </div>
          <div className={styles.timePickerContainer}>
            <label htmlFor="time" className={styles.label}>
              Verified (yes/no):
            </label>
            <div className={styles.relativeContainer}>
              <input
                type="text"
                className={styles.inputVerified}
                value={zoomLinkVerified}
                onChange={handleZoomLinkChange}
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="time" className={styles.label}>
              Webinar Link (PST):
            </label>
            <div className={styles.relativeContainer}>
              <input
                type="text"
                className={styles.inputWebLink}
                value={webinarLink}
                onChange={(e) => setWebinarLink(e.target.value)}
                required
              />
            </div>
          </div>
          <div className={styles.submitButtonContainer}>
            <button type="submit" className="btn btn-md">
              Submit
            </button>
          </div>
        </form>
        <div className={styles.dateAndTimeContainer}>
          <div className={`${styles.calendarPopup} ${isCalendarScaled ? styles.scaled : ''}`}>
            <div className={styles.calendarHeader}>
              <button className={styles.calendarButton} onClick={() => handleMonthClick((tempDate.getMonth() || 0) - 1)}>
                <FaChevronLeft />
              </button>
              <span className={styles.calendarTitle} onClick={() => setView(view === 'days' ? 'months' : 'days')}>
                {tempDate.toLocaleString('default', { month: 'long' })} {tempDate.getFullYear()}
              </span>
              <button className={styles.calendarButton} onClick={() => handleMonthClick((tempDate.getMonth() || 0) + 1)}>
                <FaChevronRight />
              </button>
            </div>
            {view === 'days' ? (
              <div className={styles.daysView}>
                {Array.from({ length: new Date(tempDate.getFullYear(), tempDate.getMonth() + 1, 0).getDate() }, (_, i) => i + 1).map(day => (
                  <button key={day} className={styles.dayButton} onClick={() => handleDayClick(day)}>
                    {day}
                  </button>
                ))}
              </div>
            ) : (
              <div className={styles.monthsView}>
                {Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('default', { month: 'short' })).map((month, index) => (
                  <button key={index} className={styles.monthButton} onClick={() => handleMonthClick(index)}>
                    {month}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className={`${styles.timePickerPopup} ${isTimePickerScaled ? styles.scaled : ''}`}>
            <div className={styles.timePickerHeader}>
              <button className={styles.timeButton} onClick={() => handleHourChange(1)}>
                <FaAngleUp />
              </button>
              <div className={styles.timeDisplay}>
                {selectedHour !== null && selectedHour < 10 ? `0${selectedHour}` : selectedHour}:
                {selectedMinute !== null && selectedMinute < 10 ? `0${selectedMinute}` : selectedMinute}
              </div>
              <button className={styles.timeButton} onClick={() => handleMinuteChange(1)}>
                <FaAngleUp />
              </button>
            </div>
            <div className={styles.timeAdjust}>
              <button className={styles.timeButton} onClick={() => handleHourChange(-1)}>
                <FaAngleDown />
              </button>
              <button className={styles.timeButton} onClick={() => handleMinuteChange(-1)}>
                <FaAngleDown />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
