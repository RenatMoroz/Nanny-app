'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import css from './FiltersForm.module.css';

const PRESET_OPTIONS = [
  { value: 'a-z', label: 'A to Z' },
  { value: 'z-a', label: 'Z to A' },
  { value: 'less-than-10', label: 'Less than 10$' },
  { value: 'greater-than-10', label: 'Greater than 10$' },
  { value: 'popular', label: 'Popular' },
  { value: 'not-popular', label: 'Not popular' },
  { value: 'show-all', label: 'Show all' },
] as const;

type PresetValue = (typeof PRESET_OPTIONS)[number]['value'];

const isPresetValue = (value: string | null): value is PresetValue =>
  PRESET_OPTIONS.some((option) => option.value === value);

const FiltersForm = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const selectedPreset = useMemo<PresetValue>(() => {
    const preset = searchParams.get('preset');
    return isPresetValue(preset) ? preset : 'a-z';
  }, [searchParams]);

  const selectedOption = useMemo(
    () =>
      PRESET_OPTIONS.find((option) => option.value === selectedPreset) ??
      PRESET_OPTIONS[0],
    [selectedPreset]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!rootRef.current) {
        return;
      }

      if (!rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  useEffect(() => {
    if (!searchParams.get('preset')) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('preset', 'a-z');
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [pathname, router, searchParams]);

  const handleSelect = (value: PresetValue) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('preset', value);

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    setIsOpen(false);
  };

  return (
    <div className={css['filtersForm']} ref={rootRef}>
      <p className={css['filtersLabel']}>Filters</p>

      <button
        type="button"
        className={css['selectButton']}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>{selectedOption.label}</span>
        <svg
          className={`${css['arrow']} ${isOpen ? css['arrowOpen'] : ''}`}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <ul className={css['optionsList']} role="listbox" aria-label="Filter presets">
          {PRESET_OPTIONS.map((option) => {
            const isActive = option.value === selectedPreset;

            return (
              <li key={option.value}>
                <button
                  type="button"
                  className={`${css['optionButton']} ${isActive ? css['activeOption'] : ''}`}
                  onClick={() => handleSelect(option.value)}
                  role="option"
                  aria-selected={isActive}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default FiltersForm;
