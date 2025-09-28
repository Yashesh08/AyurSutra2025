import React from 'react';
import { TherapySession } from '../types';
import { useTranslation } from '../i18n';

interface TherapyDistributionChartProps {
    sessions: TherapySession[];
}

const COLORS = ['#5E8B7E', '#F7C873', '#A9DEF9', '#F7A773'];

export const TherapyDistributionChart: React.FC<TherapyDistributionChartProps> = ({ sessions }) => {
    const { t } = useTranslation();
    // @ts-ignore: Recharts is loaded from a script tag and available on the window object
    const Recharts = window.Recharts;
    
    if (!Recharts) {
        return (
            <div style={{ width: '100%', height: 250 }} className="flex items-center justify-center text-text-soft">
                {t('loading_chart')}
            </div>
        );
    }

    const { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } = Recharts;

    const therapyCounts = sessions.reduce((acc, session) => {
        acc[session.therapyName] = (acc[session.therapyName] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const data = Object.keys(therapyCounts).map(key => ({
        name: key,
        value: therapyCounts[key],
    }));

    if(data.length === 0) {
        return (
             <div style={{ width: '100%', height: 250 }} className="flex items-center justify-center text-text-soft">
                {t('no_therapy_data')}
            </div>
        )
    }

    return (
        <ResponsiveContainer width="100%" height={250}>
            <PieChart>
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#FEFDFB',
                        border: '1px solid #DCD7C9',
                        color: '#4A453B'
                    }}
                />
                <Legend iconType="circle" />
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    );
};
