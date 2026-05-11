import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', short: 'EN' },
  { code: 'fr', name: 'Français', short: 'FR' },
  { code: 'ar', name: 'العربية', short: 'AR' }
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLanguage = languages.find(l => l.code === i18n.language) || languages[0];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors py-2"
        aria-label="Change language"
      >
        <Globe className="w-5 h-5" />
        <span className="font-bold text-sm uppercase">{currentLanguage.short}</span>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-32 bg-white dark:bg-zinc-900 rounded-xl shadow-lg overflow-hidden z-50 border border-gray-100 dark:border-zinc-800 transition-colors">
          <div className="py-1">
            {languages.map((lng) => (
              <button
                key={lng.code}
                onClick={() => changeLanguage(lng.code)}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  i18n.language === lng.code 
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold' 
                    : 'text-gray-700 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white'
                }`}
              >
                {lng.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
