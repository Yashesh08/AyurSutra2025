import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Patient } from '../types';
import { useTranslation } from '../i18n';

interface SearchablePatientDropdownProps {
    patients: Patient[];
    selectedPatientId: string;
    onSelect: (patientId: string) => void;
}

export const SearchablePatientDropdown: React.FC<SearchablePatientDropdownProps> = ({ patients, selectedPatientId, onSelect }) => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedPatient = useMemo(() => patients.find(p => p.id === selectedPatientId), [patients, selectedPatientId]);

    const filteredPatients = useMemo(() => {
        if (!searchTerm) {
            return [];
        }
        return patients.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [patients, searchTerm]);

    const handleSelect = (patientId: string) => {
        onSelect(patientId);
        setSearchTerm('');
        setIsOpen(false);
    };
    
    const handleToggle = () => {
        if (isOpen) {
            setSearchTerm('');
        }
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <button
                type="button"
                onClick={handleToggle}
                className="w-full p-2 bg-ivory border border-border-soft rounded-md text-left flex justify-between items-center"
            >
                <span className="text-text-dark">{selectedPatient ? selectedPatient.name : t('select_a_patient')}</span>
                <svg className={`w-4 h-4 text-text-soft transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute z-10 top-full mt-1 w-full bg-ivory border border-border-soft rounded-md shadow-lg max-h-60 overflow-y-auto">
                    <div className="p-2">
                        <input
                            type="text"
                            placeholder={t('search_patients_placeholder')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-2 bg-sand border border-border-soft rounded-md"
                            autoFocus
                        />
                    </div>
                    <ul>
                        {filteredPatients.map(patient => (
                            <li
                                key={patient.id}
                                onClick={() => handleSelect(patient.id)}
                                className={`p-2 cursor-pointer hover:bg-sand ${selectedPatientId === patient.id ? 'bg-saffron/20' : ''}`}
                            >
                                {patient.name}
                            </li>
                        ))}
                        {searchTerm && filteredPatients.length === 0 && (
                             <li className="p-2 text-text-soft text-center">{t('no_patients_found')}</li>
                        )}
                        {!searchTerm && (
                            <li className="p-2 text-text-soft text-center">{t('type_to_search')}</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};
