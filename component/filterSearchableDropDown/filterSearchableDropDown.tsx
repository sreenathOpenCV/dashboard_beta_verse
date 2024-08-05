import React, { useState, useEffect, useRef } from 'react';
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FaSyncAlt, FaChevronDown, FaChevronUp } from "react-icons/fa";
import styles from './filterSearchableDropDown.module.css';

interface FilterSearchableDropDownProps {
  options: string[];
  selectedOptions: string[];
  setSelectedOptions: (options: string[]) => void;
  label: string;
  isOpen: boolean;
  toggleDropdown: () => void;
  nestedOptions?: { [key: string]: string[] };
  handleNestedDropdown?: (key: string) => void;
  nestedDropdownsOpen?: { [key: string]: boolean };
  singleSelection?: boolean;
}

export default function FilterSearchableDropDown({
  options,
  selectedOptions,
  setSelectedOptions,
  label,
  isOpen,
  toggleDropdown,
  nestedOptions,
  handleNestedDropdown,
  nestedDropdownsOpen,
  singleSelection = false
}: FilterSearchableDropDownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const highlightedRef = useRef<HTMLDivElement>(null);

  const handleDelete = (chipToDelete: string) => (event: React.MouseEvent) => { 
    event.stopPropagation();
    event.preventDefault();
    setSelectedOptions(selectedOptions.filter((chip) => chip !== chipToDelete));
  };

  const handleEscKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      toggleDropdown();
    }
  };

  const handleEnterKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
        const optionToAdd = filteredOptions[highlightedIndex];
        handleOptionSelect(optionToAdd);
        setSearch("");
        setHighlightedIndex(-1);
      }
    } else if (event.key === 'ArrowDown') {
      setHighlightedIndex((prev) => Math.min(prev + 1, filteredOptions.length - 1));
    } else if (event.key === 'ArrowUp') {
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    } else if (event.key === 'Backspace' && search === "" && selectedOptions.length > 0) { 
      setSelectedOptions(selectedOptions.slice(0, -1)); 
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      if (isOpen) {
        toggleDropdown();
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setHighlightedIndex(0);
    if (!isOpen) {
      toggleDropdown();
    }
  };

  const handleRefresh = () => {
    setSelectedOptions([]); 
  };

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(search.toLowerCase())
  );

  const handleOptionSelect = (name: string) => {
    if (singleSelection) {
      setSelectedOptions([name]);
    } else {
      const newSelectedOptions = [...selectedOptions];

      const isNameInOptions = newSelectedOptions.some(option => option.includes(name) || name.includes(option));

      if (isNameInOptions) {
          setSelectedOptions(newSelectedOptions.filter(option => !option.includes(name) && !name.includes(option)));
      } else {
          setSelectedOptions([...newSelectedOptions, name]);
      }
    }
  };

  const handleNestedOptionSelect = (parent: string, option: string) => {
    const combinedOption = `${parent},${option}`;
    const soloParentOption = parent;
    const newSelectedOptions = [...selectedOptions];
  
    const filteredOptions = newSelectedOptions.filter(opt => opt !== soloParentOption);
  
    if (filteredOptions.includes(combinedOption)) {
      setSelectedOptions(filteredOptions.filter(opt => opt !== combinedOption)); 
    } else {
      setSelectedOptions([...filteredOptions, combinedOption]); 
    }
  };
  
  const handleSelectAll = (parent: string) => {
    const parentOptions = nestedOptions![parent];
    const allSelected = parentOptions.every(option => selectedOptions.includes(`${parent},${option}`));
    const parentSelected = selectedOptions.includes(parent);
    
    if (allSelected && parentSelected) {
      setSelectedOptions(selectedOptions.filter(opt => opt !== parent && !parentOptions.includes(opt.split(',')[1])));
    } else {
      const newSelectedOptions = selectedOptions.filter(opt => !parentOptions.includes(opt.split(',')[1]));
      if (!parentSelected) {
        newSelectedOptions.push(parent);
      } else {
        newSelectedOptions.splice(newSelectedOptions.indexOf(parent), 1);
      }
      setSelectedOptions(newSelectedOptions);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('keydown', handleEscKey);
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (highlightedRef.current) {
      highlightedRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [highlightedIndex]);

  useEffect(() => {
    setSearch("");
  }, [selectedOptions]);

  return (
    <div className={styles.relative} ref={dropdownRef}
      onClick={(e) => {
        e.stopPropagation();
        inputRef.current?.focus();
        if (!isOpen) {
          toggleDropdown();
        }
      }}
    >
      <div className={styles.relative}>
        <label
          className={`${styles.label} ${isFocused || search || selectedOptions.length ? styles.labelFocused : styles.labelUnfocused}`}
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.focus();
            if (!isOpen) {
              toggleDropdown();
            }
          }}
        >
          {label}
        </label>
        <div
          onClick={() => inputRef.current?.focus()}
          className={styles.inputContainer}
        >
          <div className={styles.chipContainer}>
            {selectedOptions.map((option) => ( 
              <div
                key={option}
                className={styles.chip}
              >
                <span className={styles.chipText}>{option}</span>
                {!singleSelection && (
                  <button
                    type="button"
                    onClick={handleDelete(option)}
                    className={styles.closeButton}
                  >
                    <IoIosCloseCircleOutline className={styles.closeIcon} />
                  </button>
                )}
              </div>
            ))}
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={handleInputChange}
              className={styles.input}
              onClick={(e) => {
                e.stopPropagation();
                if (!isOpen) {
                  toggleDropdown();
                }
              }}
              onKeyDown={handleEnterKey}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </div>
          {selectedOptions.length > 0 && !singleSelection &&(
            <button
              type="button"
              onClick={handleRefresh}
              className={styles.refreshButton}
            >
              <FaSyncAlt className={styles.refreshIcon} />
            </button>
          )}
        </div>
        {isOpen && (
          <div className={styles.dropdown}>
            {filteredOptions.map((name, index) => (
              <div key={name}>
                <div
                  ref={index === highlightedIndex ? highlightedRef : null}
                  className={`${styles.option} ${index === highlightedIndex ? styles.optionHighlighted : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNestedDropdown && handleNestedDropdown(name);
                  }}
                >
                  {nestedOptions && nestedOptions[name] ? (
                    <>
                      <input
                        type="checkbox"
                        checked={selectedOptions.some(option => option.includes(name))} 
                        onChange={() => handleOptionSelect(name)}
                        className={styles.checkbox}
                      />
                      <span className={styles.optionText} onClick={(e) => {
                        e.stopPropagation();
                        handleNestedDropdown && handleNestedDropdown(name);
                      }}>{name}</span>
                      <button onClick={(e) => {
                        e.stopPropagation();
                        handleNestedDropdown && handleNestedDropdown(name);
                      }} className={styles.toggleButton}>
                        {nestedDropdownsOpen && nestedDropdownsOpen[name] ? <FaChevronUp className={styles.toggleIcon}/> : <FaChevronDown className={styles.toggleIcon}/>}
                      </button>
                    </>
                  ) : (
                    <>
                      <input
                        type="checkbox"
                        checked={selectedOptions.includes(name)} 
                        onChange={() => handleOptionSelect(name)}
                        className={styles.checkbox}
                      />
                      <span className={styles.optionText} onClick={() => handleOptionSelect(name)}>{name}</span>
                    </>
                  )}
                </div>
                {nestedOptions && nestedOptions[name] && nestedDropdownsOpen && nestedDropdownsOpen[name] && (
                  <div className={styles.nestedOptionsContainer}>
                    {nestedOptions[name].length > 2 && (
                      <div
                        className={styles.nestedOption}
                        onClick={() => handleSelectAll(name)}
                      >
                        <input
                          type="checkbox"
                          checked={selectedOptions.includes(name) && !selectedOptions.includes(`${name},`)} 
                          onChange={() => handleSelectAll(name)}
                          className={styles.checkbox}
                        />
                        <span className={styles.optionText}>Merged Response</span>
                      </div>
                    )}
                    {nestedOptions[name].map((option) => (
                      <div
                        key={option}
                        className={styles.nestedOption}
                        onClick={() => handleNestedOptionSelect(name, option)}
                      >
                        <input
                          type="checkbox"
                          checked={selectedOptions.includes(`${name},${option}`)} 
                          onChange={() => handleNestedOptionSelect(name, option)}
                          className={styles.checkbox}
                        />
                        <span className={styles.optionText}>{option}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
