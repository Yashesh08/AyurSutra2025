import React from 'react';
import { FeedbackData } from '../types';
import { useTranslation } from '../i18n';

interface PatientSatisfactionChartProps {
    data: FeedbackData[];
}

export const PatientSatisfactionChart: React.FC<PatientSatisfactionChartProps> = ({ data }) => {
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

    const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } = Recharts;
    
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                layout="vertical"
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#DCD7C9" horizontal={false} />
                <XAxis type="number" stroke="#A29E94" />
                <YAxis type="category" dataKey="name" stroke="#A29E94" width={120}/>
                <Tooltip
                    cursor={{fill: '#F7F3E9'}}
                    contentStyle={{
                        backgroundColor: '#FEFDFB',
                        border: '1px solid #DCD7C9',
                        color: '#4A453B'
                    }}
                />
                <Bar dataKey="count" name="Responses" fill="#5E8B7E" barSize={30} />
            </BarChart>
        </ResponsiveContainer>
    );
};
