import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CiCalendarDate } from "react-icons/ci";
import { useSession } from 'next-auth/react';
import styles from './FilterUtm.module.css';
import { RootState } from '@/redux/store';
import { useFetchDataKeysMutation } from '@/services/trackerServices';
import { setSelectedParams } from '@/redux/Slices/bootcampSelectivesSlice';
import FilterSearchableDropDown from '../filterSearchableDropDown/filterSearchableDropDown';
import SubmitButton from '../submitButton/submitButton';
import DateButtons from '../dateButtons/dateButtons';
import Calendar from '../calendar/calendar';

interface SelectedParamsData {
  dates: any[];
  tables_and_pages: { [key: string]: string[] };
  utm_sources: string[];
  utm_mediums: string[];
  utm_campaigns: string[];
}

interface SelectedParams {
  dates: any[];
  tables_and_pages: string[];
  utm_sources: string[];
  utm_mediums: string[];
  utm_campaigns: string[];
}

function FilterUtm({ buttonSelectionToggle, handleButtonToggle }: { buttonSelectionToggle: any, handleButtonToggle: any }) {
  const [selectedTables, setSelectedTables] = React.useState<string[]>([]);
  const [selectedSources, setSelectedSources] = React.useState<string[]>([]);
  const [selectedMediums, setSelectedMediums] = React.useState<string[]>([]);
  const [selectedCampaigns, setSelectedCampaigns] = React.useState<string[]>([]);
  const [paramDates, setParamDates] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [isTablesOpen, setIsTablesOpen] = useState(false);
  const [isSourcesOpen, setIsSourcesOpen] = useState(false);
  const [isMediumsOpen, setIsMediumsOpen] = useState(false);
  const [isCampaignsOpen, setIsCampaignsOpen] = useState(false);
  const [nestedDropdownsOpen, setNestedDropdownsOpen] = useState<{ [key: string]: boolean }>({});
  const [selectedDateRange, setSelectedDate] = useState("monthBtn");
  const [paramsData, setParamsData] = useState<SelectedParamsData>({
    dates: [],
    tables_and_pages: {},
    utm_sources: [],
    utm_mediums: [],
    utm_campaigns: [],
  });
  const dispatch = useDispatch();
  const selected = useSelector((state: RootState) => state.bootcampSource.selected) as SelectedParams;
  const { data: session } = useSession();
  const [fetchDataKeys, { isLoading, isError, data, error }] = useFetchDataKeysMutation();

  const handleUtmKeys = async () => {
    try {
      const response = await fetchDataKeys(["tables_and_pages", "utm_sources", "utm_mediums", "utm_campaigns"]).unwrap();
      setParamsData(response.data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleDateChange = (value: any) => {
    setSelectedDate(value);
  };

  const getDates = (dates: any) => {
    setParamDates(dates);
  };

  const setParams = () => {
    dispatch(setSelectedParams({
      dates: paramDates,
      tables_and_pages: selectedTables,
      utm_sources: selectedSources,
      utm_mediums: selectedMediums,
      utm_campaigns: selectedCampaigns
    }));
  };

  const formatDate = (date: string) => {
    const [year, month, day] = date.split('-');
    return `${day}-${month}`;
  };

  const handleNestedDropdown = (key: string) => {
    setNestedDropdownsOpen(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  useEffect(() => {
    handleUtmKeys();
  }, []);

  useEffect(() => {
    if (selected && Object.keys(selected).length > 0) {
      dates: selected.dates,
      setSelectedTables(selected.tables_and_pages);
      setSelectedSources(selected.utm_sources);
      setSelectedMediums(selected.utm_mediums);
      setSelectedCampaigns(selected.utm_campaigns);
    }
  }, [selected]);

  return (
    <div className={styles.container}>
      <div>
        <Calendar visible={showPicker} onClose={() => setShowPicker(false)} getDates={getDates} selectedDateRange={selectedDateRange} handleButtonToggle={handleButtonToggle} />
        <div onClick={() => setShowPicker(true)} className={styles.calendarButton}>
          <span><CiCalendarDate fontSize="1.5rem" /></span>
          <span className={styles.calendarText}>{paramDates.length > 0 && `Dates: ${formatDate(paramDates[0])}/${formatDate(paramDates[paramDates.length - 1])}`}</span>
        </div>
      </div>
      <div className={styles.filterDropdowns}>
        <FilterSearchableDropDown
          options={Object?.keys(paramsData.tables_and_pages)}
          selectedOptions={selectedTables}
          setSelectedOptions={setSelectedTables}
          label="Tables and pages"
          isOpen={isTablesOpen}
          toggleDropdown={() => setIsTablesOpen(!isTablesOpen)}
          nestedOptions={paramsData.tables_and_pages}
          handleNestedDropdown={handleNestedDropdown}
          nestedDropdownsOpen={nestedDropdownsOpen}
        />
        <FilterSearchableDropDown
          options={paramsData.utm_sources}
          selectedOptions={selectedSources}
          setSelectedOptions={setSelectedSources}
          label="UTM Sources"
          isOpen={isSourcesOpen}
          toggleDropdown={() => setIsSourcesOpen(!isSourcesOpen)}
        />
        <FilterSearchableDropDown
          options={paramsData.utm_mediums}
          selectedOptions={selectedMediums}
          setSelectedOptions={setSelectedMediums}
          label="UTM Mediums"
          isOpen={isMediumsOpen}
          toggleDropdown={() => setIsMediumsOpen(!isMediumsOpen)}
        />
        <FilterSearchableDropDown
          options={paramsData.utm_campaigns}
          selectedOptions={selectedCampaigns}
          setSelectedOptions={setSelectedCampaigns}
          label="UTM Campaigns"
          isOpen={isCampaignsOpen}
          toggleDropdown={() => setIsCampaignsOpen(!isCampaignsOpen)}
        />
      </div>
      <div onClick={() => setParams()} className={styles.submitContainer}>
        <DateButtons onDateChange={handleDateChange} buttonSelectionToggle={buttonSelectionToggle} handleButtonToggle={handleButtonToggle} />
        <SubmitButton
          selectedParams={{
            dates: paramDates,
            tables_and_pages: selectedTables,
            utm_sources: selectedSources,
            utm_mediums: selectedMediums,
            utm_campaigns: selectedCampaigns
          }}
        />
      </div>
    </div>
  );
}

export default FilterUtm;
