'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';

export type DropdownOption = {
    value: string;
    label: string;
};

type DropdownProps = {
    id: string;
    name?: string;
    value: string;
    options: readonly DropdownOption[];
    onChange: (value: string) => void;
    className?: string;
};

export default function Dropdown({
    id,
    name,
    value,
    options,
    onChange,
    className = ''
}: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const selectedIndex = options.findIndex((option) => option.value === value);
    const [activeIndex, setActiveIndex] = useState(Math.max(selectedIndex, 0));
    const containerRef = useRef<HTMLDivElement>(null);
    const listboxId = `${id}-listbox`;
    const selectedOption = options[selectedIndex];

    useEffect(() => {
        const handlePointerDown = (event: PointerEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) 
                setIsOpen(false);
            
        };

        document.addEventListener('pointerdown', handlePointerDown);
        return () => document.removeEventListener('pointerdown', handlePointerDown);
    }, []);

    const selectOption = (index: number) => {
        const option = options[index];
        if (!option) return;

        onChange(option.value);
        setActiveIndex(index);
        setIsOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
        if (!options.length) return;

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                setIsOpen(true);
                setActiveIndex((index) =>
                    isOpen
                        ? (index + 1) % options.length
                        : Math.max(selectedIndex, 0)
                );
                break;
            case 'ArrowUp':
                event.preventDefault();
                setIsOpen(true);
                setActiveIndex((index) =>
                    isOpen
                        ? (index - 1 + options.length) % options.length
                        : Math.max(selectedIndex, 0)
                );
                break;
            case 'Home':
                event.preventDefault();
                setIsOpen(true);
                setActiveIndex(0);
                break;
            case 'End':
                event.preventDefault();
                setIsOpen(true);
                setActiveIndex(options.length - 1);
                break;
            case 'Enter':
            case ' ':
                event.preventDefault();
                if (isOpen) {
                    selectOption(activeIndex);
                } else {
                    setActiveIndex(Math.max(selectedIndex, 0));
                    setIsOpen(true);
                }
                break;
            case 'Escape':
                if (isOpen) {
                    event.preventDefault();
                    setIsOpen(false);
                }
                break;
            case 'Tab':
                setIsOpen(false);
                break;
        }
    };

    return (
        <div className="pww-dropdown" ref={containerRef}>
            {name && <input type="hidden" name={name} value={value} />}
            <button
                type="button"
                id={id}
                role="combobox"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-controls={listboxId}
                aria-activedescendant={isOpen ? `${listboxId}-option-${activeIndex}` : undefined}
                className={`pww-dropdown-trigger ${className}`.trim()}
                onClick={() => {
                    setActiveIndex(Math.max(selectedIndex, 0));
                    setIsOpen((open) => !open);
                }}
                onKeyDown={handleKeyDown}
            >
                <span>{selectedOption?.label ?? 'Select an option'}</span>
                <span className="pww-dropdown-chevron" aria-hidden="true" />
            </button>
            <ul
                id={listboxId}
                role="listbox"
                className="pww-dropdown-list"
                hidden={!isOpen}
            >
                {options.map((option, index) => (
                    <li
                        key={option.value}
                        id={`${listboxId}-option-${index}`}
                        role="option"
                        aria-selected={option.value === value}
                        data-active={index === activeIndex}
                        className="pww-dropdown-option"
                        onMouseEnter={() => setActiveIndex(index)}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => selectOption(index)}
                    >
                        {option.label}
                    </li>
                ))}
            </ul>
        </div>
    );
}