import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const CustomDropdown = ({
  options = [],
  placeholder = "Select an option",
  onChange,
  className = "w-64",
  value // Optional prop for controlled behavior
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalSelected, setInternalSelected] = useState(null);
  const dropdownRef = useRef(null);

  // Determine which option is selected (controlled vs uncontrolled)
  const effectiveValue = value !== undefined ? value : internalSelected;
  const selectedOption = options.find(opt => opt.value === effectiveValue) || null;

  const handleSelect = (option) => {
    setIsOpen(false);
    if (value === undefined) {
      setInternalSelected(option.value);
    }
    onChange && onChange(option);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={`relative ${className} font-sans`}>
      
      {/* Selected box */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-black border border-white/30 text-white px-4 py-2 rounded-full flex justify-between items-center cursor-pointer hover:border-blue-500 transition-all  active:scale-95 ${className}`}
      >
        <span className="truncate text-sm font-medium pr-2">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          size={16} 
          className={`text-blue-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </div>

      {/* Dropdown List */}
      {isOpen && (
        <div className="absolute mt-2 w-full bg-[#18181B] border  rounded-xl overflow-hidden shadow-2xl z-[100] transition-all duration-200">
          <div className="py-1 max-h-60 overflow-y-auto scrollbar-hide">
            {options.map((option, index) => (
              <div
                key={index}
                onClick={() => handleSelect(option)}
                className={`px-4 py-2 text-sm cursor-pointer transition-colors ${
                  effectiveValue === option.value 
                  ? "bg-blue-600/20 text-blue-400 font-bold" 
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;