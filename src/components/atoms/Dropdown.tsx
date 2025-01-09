import { RequestStatus } from "@/lib/types/request";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";

export type DropdownOption = {
    label: string;
    value: string;
    color: string;
    textColor: string;
};

interface DropdownProps {
    options: DropdownOption[];
    onSelect: (value: string) => void;
    initialValue: DropdownOption;
}

const StatusIndicator = ({ option }: { option: DropdownOption }) => (
  <div className={`inline-block px-2 rounded`} 
      style={{backgroundColor: `${option.color}55`,borderRadius: 50}}>
      <span
          className={`inline-block w-2 h-2 rounded-full mr-2`}
          style={{ backgroundColor: option.color }}
      />
      <span className={`text-xs`}
          style={{ color: option.textColor }}>
          {option.label}
      </span>
  </div>
);

export default function Dropdown({
  options,
  onSelect,
  initialValue,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<DropdownOption>(initialValue);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleSelect = (option: DropdownOption) => {
    setSelectedValue(option);
    onSelect(option.value);
    setIsOpen(false);
  };

  return (
    <div className="relative w=full">
      <div
        onClick={toggleDropdown}
        className={`py-2.5 px-2 border rounded-md w-full cursor-pointer ${isOpen ? 'border-blue-500' : ''} hover:bg-[#EFF6FF]`}
      >
        <StatusIndicator option={selectedValue} />

        {isOpen ? <FontAwesomeIcon icon={faChevronUp} className="absolute right-1 top-3.5 transform pointer-events-none" />
                : <FontAwesomeIcon icon={faChevronDown} className="absolute right-1 top-3.5 transform pointer-events-none" />}
      </div>
      {isOpen && (
        <div className="absolute z-10 bg-white border rounded-md shadow-lg mt-1 w-full">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option)}
              className={`flex items-center py-1.5 px-2 cursor-pointer ${
                selectedValue.value === option.value ? "bg-" + option.color + "-light" : "hover:bg-gray-200"
              }`}
            >
                <StatusIndicator option={option} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
