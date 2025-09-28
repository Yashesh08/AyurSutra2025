import React from 'react';
import { useTranslation } from '../i18n';

interface OverallProgressChartProps {
    progress: number;
}

export const OverallProgressChart: React.FC<OverallProgressChartProps> = ({ progress }) => {
    const { t } = useTranslation();
    // @ts-ignore: Recharts is loaded from a script tag and available on the window object
    const Recharts = window.Recharts;

    if (!Recharts) {
         return (
            <div style={{ width: '100%', height: 200 }} className="flex items-center justify-center text-text-soft">
                {t('loading_chart')}
            </div>
        );
    }

    const { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } = Recharts;

    const data = [{ name: 'Progress', value: progress }];
    
    return (
        <div className="relative w-full h-48">
            <ResponsiveContainer>
                <RadialBarChart
                    innerRadius="70%"
                    outerRadius="100%"
                    data={data}
                    startAngle={90}
                    endAngle={-270}
                    style={{ background: '#F7F3E9' }}
                                >
                    <PolarAngleAxis
                        type="number"
                        domain={[0, 100]}
                        angleAxisId={0}
                        tick={false}
                    />
                    <RadialBar
                        dataKey="value"
                        cornerRadius={10}
                        fill="#F7C873"
                        background
                    />
                </RadialBarChart>



                
            </ResponsiveContainer>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="text-4xl font-bold text-saffron">{progress}%</p>
                <p className="text-sm text-text-soft">{t('complete')}</p>
            </div>
        </div>
    );
};
