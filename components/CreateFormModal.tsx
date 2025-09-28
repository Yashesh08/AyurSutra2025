import React, { useState } from 'react';
import { FormTemplate, FormQuestion } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { useTranslation } from '../i18n';

interface CreateFormModalProps {
    onClose: () => void;
    onSave: (templateData: Omit<FormTemplate, 'id'>) => void;
}

type QuestionData = Omit<FormQuestion, 'id'> & { optionsString?: string };

export const CreateFormModal: React.FC<CreateFormModalProps> = ({ onClose, onSave }) => {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState<QuestionData[]>([
        { questionText: '', type: 'text', options: [] }
    ]);

    const handleQuestionChange = (index: number, field: keyof QuestionData, value: string) => {
        const newQuestions = [...questions];
        (newQuestions[index] as any)[field] = value;
        setQuestions(newQuestions);
    };

    const addQuestion = () => {
        setQuestions([...questions, { questionText: '', type: 'text', options: [] }]);
    };
    
    const removeQuestion = (index: number) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalQuestions: FormQuestion[] = questions.map((q, i) => ({
            id: `q${Date.now()}-${i}`,
            questionText: q.questionText,
            type: q.type,
            options: q.type === 'multiple-choice' ? q.optionsString?.split(',').map(opt => opt.trim()).filter(Boolean) : undefined,
        }));

        if(finalQuestions.some(q => !q.questionText)) {
            alert(t('fill_all_questions_alert'));
            return;
        }

        onSave({ name, description, questions: finalQuestions });
    };

    return (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-sand rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-fade-in-up"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 border-b border-border-soft">
                    <h2 className="text-2xl font-bold text-text-dark font-display">{t('create_new_form_template')}</h2>
                </div>
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-text-dark mb-1">{t('form_name')}</label>
                            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="w-full p-2 bg-ivory border border-border-soft rounded-md" />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-text-dark mb-1">{t('description')}</label>
                            <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={2} className="w-full p-2 bg-ivory border border-border-soft rounded-md resize-y"></textarea>
                        </div>
                        
                        <div className="border-t border-border-soft pt-4">
                            <h3 className="text-lg font-semibold text-text-dark mb-2">{t('questions')}</h3>
                            <div className="space-y-4">
                                {questions.map((q, index) => (
                                    <div key={index} className="p-4 bg-ivory border border-border-soft rounded-lg space-y-3">
                                        <div className="flex justify-between items-center">
                                            <p className="font-semibold text-text-dark">{t('question_number', { index: index + 1 })}</p>
                                            {questions.length > 1 && <button type="button" onClick={() => removeQuestion(index)} className="p-1 text-text-soft hover:text-red-500"><TrashIcon className="w-4 h-4" /></button>}
                                        </div>
                                        <input 
                                            type="text" 
                                            placeholder={t('enter_question_text')}
                                            value={q.questionText}
                                            onChange={(e) => handleQuestionChange(index, 'questionText', e.target.value)}
                                            required
                                            className="w-full p-2 bg-sand border border-border-soft rounded-md"
                                        />
                                        <div className="flex gap-4">
                                            <select 
                                                value={q.type} 
                                                onChange={(e) => handleQuestionChange(index, 'type', e.target.value)}
                                                className="p-2 bg-sand border border-border-soft rounded-md"
                                            >
                                                <option value="text">{t('text_answer')}</option>
                                                <option value="scale">{t('scale_1_10')}</option>
                                                <option value="multiple-choice">{t('multiple_choice')}</option>
                                            </select>
                                            {q.type === 'multiple-choice' && (
                                                <input
                                                    type="text"
                                                    placeholder={t('options_comma_separated')}
                                                    value={q.optionsString || ''}
                                                    onChange={(e) => handleQuestionChange(index, 'optionsString', e.target.value)}
                                                    className="flex-grow p-2 bg-sand border border-border-soft rounded-md"
                                                />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button type="button" onClick={addQuestion} className="mt-4 flex items-center text-sm font-semibold text-saffron hover:underline">
                                <PlusIcon className="w-4 h-4 mr-1"/> {t('add_another_question')}
                            </button>
                        </div>
                    </div>
                    <div className="p-6 bg-ivory/80 rounded-b-2xl flex justify-end items-center gap-4 border-t border-border-soft">
                        <button type="button" onClick={onClose} className="bg-sand px-4 py-2 rounded-md text-text-dark font-semibold hover:bg-border-soft transition-colors">
                            {t('cancel')}
                        </button>
                        <button type="submit" className="bg-gradient-to-r from-saffron to-yellow-500 text-text-dark font-bold py-2 px-6 rounded-lg hover:scale-105 transition-transform shadow-sm hover:shadow-md">
                            {t('save_template')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
