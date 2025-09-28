import React from 'react';
import { ProgressData } from '../types';
import { useTranslation } from '../i18n';

interface ProgressChartProps {
    data: ProgressData[];
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ data }) => {
    const { t } = useTranslation();
    // @ts-ignore: Recharts is loaded from a script tag and available on the window object
    const Recharts = window.Recharts;

    if (!Recharts) {
        return (
            <div style={{ width: '100%', height: 300 }} className="flex items-center justify-center text-text-soft">
                {t('loading_chart')}
            </div>
        );
    }
    
    const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = Recharts;

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <LineChart
                    data={data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#DCD7C9" />
                    <XAxis dataKey="month" stroke="#A29E94" />
                    <YAxis stroke="#A29E94" />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#FEFDFB',
                            border: '1px solid #DCD7C9',
                            color: '#4A453B'
                        }}
                    />
                    <Legend wrapperStyle={{ color: '#4A453B' }} />
                    <Line type="monotone" dataKey="symptomScore" name={t('symptom_score_chart')} stroke="#F7C873" activeDot={{ r: 8 }} strokeWidth={2} />
                    <Line type="monotone" dataKey="wellbeingScore" name={t('wellbeing_score_chart')} stroke="#5E8B7E" strokeWidth={2}/>
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};
