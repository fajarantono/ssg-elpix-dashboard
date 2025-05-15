'use client';
import React from 'react';

import { ApexOptions } from 'apexcharts';

import dynamic from 'next/dynamic';
// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

export const BarChart: React.FC<{
  categories: string[],
  height: number,
  series: {
    name: string;
    data: number[];
    color: string;
  }[];
}> = ({ categories, height, series }) => {
  const options: ApexOptions = {
    chart: {
      fontFamily: 'Outfit, sans-serif',
      type: 'bar',
      height: height,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '39%',
        borderRadius: 5,
        borderRadiusApplication: 'end',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ['transparent'],
    },
    xaxis: {
      categories: categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'left',
      fontFamily: 'Outfit',
    },
    yaxis: {
      title: {
        text: undefined,
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },

    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: (val: number) => `${val}`,
      },
    },
  };
  return (
    <div className="max-w-full overflow-x-auto custom-scrollbar">
      <div id="chart" className="min-w-[1000px]">
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={height}
        />
      </div>
    </div>
  );
};
