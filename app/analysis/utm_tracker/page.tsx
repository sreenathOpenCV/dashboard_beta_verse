"use client";

import React, { useState } from "react";
import styles from './page.module.css';
import FilterUtm from "@/component/filterUtm/filterUtm";
import FilterSearchableDropDown from "@/component/filterSearchableDropDown/filterSearchableDropDown";
import UtmTrackerGraph from "@/component/utmTrackerGraph/utmTrackerGraph";

const Page = () => {
  const [buttonSelectionToggle, setButtonSelectionToggle] = useState<boolean>(true);
  const [counts, setCounts] = useState<any[]>(["all"]);
  const [timeZone, setTimeZone] = useState<any[]>(["pst"]);
  const [isCountsOpen, setIsCountsOpen] = useState(false);
  const [isTimeZoneOpen, setIsTimeZoneOpen] = useState(false);

  const handleButtonToggle = (value: boolean) => {
    setButtonSelectionToggle(value);
  };

  return (
    <div className="dashboard_container">
      <h3 className={styles.title}>Utm tracker</h3>
      <div className={styles.contentContainer}>
        <div className={styles.dropDownContainer}>
          <div className={styles.dropDown}>
            <FilterSearchableDropDown
              options={["unique", "all"]}
              selectedOptions={counts}
              setSelectedOptions={setCounts}
              label="UTM Counts"
              isOpen={isCountsOpen}
              toggleDropdown={() => setIsCountsOpen(!isCountsOpen)}
              singleSelection={true}
            />
          </div>
          <div className={styles.dropDown}>
            <FilterSearchableDropDown
              options={["pst", "utc", "ist"]}
              selectedOptions={timeZone}
              setSelectedOptions={setTimeZone}
              label="UTM TimeZone"
              isOpen={isTimeZoneOpen}
              toggleDropdown={() => setIsTimeZoneOpen(!isTimeZoneOpen)}
              singleSelection={true}
            />
          </div>
        </div>
        <div className={styles.flexContainer}>
          <div className={styles.filterContainer}>
            <FilterUtm buttonSelectionToggle={buttonSelectionToggle} handleButtonToggle={handleButtonToggle} />
          </div>
          <div className={styles.chartContainer}>
            <UtmTrackerGraph />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
