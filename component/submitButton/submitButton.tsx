import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styles from './SubmitButton.module.css';
import { useFetchDataMutation } from '@/services/trackerServices';
import { setDeleteBase, setSeriesData } from '@/redux/Slices/bootcampProgramSeries';

interface SelectedParamsData {
  dates: string[]; 
  tables_and_pages: string[];
  utm_sources: string[];
  utm_mediums: string[];
  utm_campaigns: string[];
}

const SubmitButton = ({ selectedParams }: { selectedParams: SelectedParamsData }) => {
  const [fetchSeries, { isLoading }] = useFetchDataMutation();
  const dispatch = useDispatch();
  const [showError, setShowError] = useState(false);

  const getSeriesData = async () => {
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(selectedParams).filter(([key, value]) => Array.isArray(value) && value.length > 0)
      );

      dispatch(setDeleteBase());

      if (selectedParams.dates.length > 0 && Object.keys(filteredParams).length > 0) {
        const response = await fetchSeries(selectedParams).unwrap();
        const formattedData = formatData(response.data);
        dispatch(setSeriesData(formattedData));
        console.log("formattedData", formattedData);
      }
    } catch (error) {
      console.log("Error:", error);
      setShowError(true);
      setTimeout(() => setShowError(false), 3000); // Hide error message after 3 seconds
    }
  };

  interface CourseData {
    name: string[];
    data: { x: string; y: number }[];
  }

  function formatData(inputData: any[]): CourseData[] {
    const formattedData: CourseData[] = [];
  
    inputData.forEach((entry) => {
      const name = [entry.table_names, entry.page_titles, entry.utm_sources, entry.utm_mediums, entry.utm_campaigns].filter(Boolean);
      const date = formatDate(entry.dates); // Format date here
      const value = entry.count;
      const existingCourse = formattedData.find(
        (course) => JSON.stringify(course.name) === JSON.stringify(name)
      );
      if (existingCourse) {
        existingCourse.data.push({ x: date, y: value });
      } else {
        formattedData.push({
          name,
          data: [{ x: date, y: value }],
        });
      }
    });
    return formattedData;
  }
  
  function formatDate(dateString: string): string {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}`;
  }

  useEffect(() => {
    getSeriesData();
  }, []);
  
  const handleClick = () => {
    getSeriesData();
  };

  return (
    <>
      <button
        className={styles.submitButton}
        onClick={handleClick}
        disabled={isLoading}
      >
        {isLoading ? <><div className="loader"></div><span className={styles.submittingText}>Submitting...</span></> : 'Submit'}
      </button>
      {showError && (
        <div className={styles.errorMessage}>
          Error try again
        </div>
      )}
    </>
  );
};

export default SubmitButton;
