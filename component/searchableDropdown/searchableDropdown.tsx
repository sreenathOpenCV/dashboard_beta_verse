import React, { useState } from 'react';
import styles from './searchableDropdown.module.css';

const SearchableDropdown = ({ options, onChange }:{ options:any, onChange:any }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = options.filter((option:any) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOptionClick = (option:any) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className={styles.dropdown}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onClick={() => setIsOpen(!isOpen)}
        placeholder="Select a sheet"
        className={styles.input}
      />
      {isOpen && (
        <ul className={styles.options}>
          {filteredOptions.map((option:any, index:any) => (
            <li key={index} onClick={() => handleOptionClick(option)} className={styles.option}>
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchableDropdown;
