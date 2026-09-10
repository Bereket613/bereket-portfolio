import React from 'react';

// Lightweight dependency-free SVG charts for the admin dashboard.

export const BarChart = ({ data, color = '#4f46e5', label }) => {
    const max = Math.max(...data.map(d => d.value), 1);
    const W = 480;
    const H = 160;
    const pad = 24;
    const barGap = 8;
    const barWidth = (W - pad * 2 - barGap * (data.length - 1)) / data.length;

    return (
        <div>
            {label && <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{label}</p>}
            <svg viewBox={`0 0 ${W} ${H + pad}`} className="w-full" role="img" aria-label={label || 'Bar chart'}>
                {data.map((d, i) => {
                    const h = (d.value / max) * (H - 20);
                    const x = pad + i * (barWidth + barGap);
                    const y = H - h;
                    return (
                        <g key={d.label || i}>
                            <rect
                                x={x} y={y} width={barWidth} height={Math.max(h, 2)} rx="4"
                                fill={color} opacity={0.85}
                                className="hover:opacity-100 transition-opacity"
                            >
                                <title>{`${d.label}: ${d.value}`}</title>
                            </rect>
                            <text x={x + barWidth / 2} y={H + 14} textAnchor="middle" className="fill-gray-400" fontSize="10">
                                {d.label}
                            </text>
                            {d.value > 0 && (
                                <text x={x + barWidth / 2} y={y - 4} textAnchor="middle" className="fill-gray-500 dark:fill-gray-400" fontSize="10" fontWeight="600">
                                    {d.value}
                                </text>
                            )}
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

export const DonutChart = ({ data, label }) => {
    const palette = ['#4f46e5', '#7c3aed', '#2563eb', '#0ea5e9', '#8b5cf6', '#ec4899'];
    const total = data.reduce((sum, d) => sum + d.value, 0);

    if (total === 0) {
        return <p className="text-sm text-gray-400 text-center py-8">No data yet</p>;
    }

    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    let offset = 0;

    return (
        <div className="flex items-center gap-6 flex-wrap">
            <svg viewBox="0 0 160 160" className="w-36 h-36 flex-shrink-0 -rotate-90" role="img" aria-label={label || 'Donut chart'}>
                <circle cx="80" cy="80" r={radius} fill="none" stroke="currentColor" className="text-gray-100 dark:text-gray-700" strokeWidth="20" />
                {data.map((d, i) => {
                    const fraction = d.value / total;
                    const dash = fraction * circumference;
                    const el = (
                        <circle
                            key={d.label || i}
                            cx="80" cy="80" r={radius} fill="none"
                            stroke={palette[i % palette.length]}
                            strokeWidth="20"
                            strokeDasharray={`${dash} ${circumference - dash}`}
                            strokeDashoffset={-offset}
                        >
                            <title>{`${d.label}: ${d.value}`}</title>
                        </circle>
                    );
                    offset += dash;
                    return el;
                })}
            </svg>
            <ul className="space-y-2 text-sm">
                {data.map((d, i) => (
                    <li key={d.label || i} className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: palette[i % palette.length] }}></span>
                        <span className="font-medium">{d.label}</span>
                        <span className="text-gray-400">({d.value})</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};
