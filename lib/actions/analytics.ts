'use server';

export async function getAnalytics(): Promise<{
  totalEvents: number;
  totalRegistrations: number;
  totalCheckIns: number;
  attendanceRate: number;
  chartData: { date: string; registrations: number }[];
  eventsPerformance: { id: number; title: string; registrations: number; check_ins: number; attendance_rate: number }[];
  error?: string;
}> {
  console.log('Fetching analytics data...');

  // Simulate fetching data
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    totalEvents: 10,
    totalRegistrations: 1250,
    totalCheckIns: 980,
    attendanceRate: 78.4,
    chartData: [
      { date: '2023-01-01', registrations: 100 },
      { date: '2023-01-02', registrations: 120 },
      { date: '2023-01-03', registrations: 150 },
    ],
    eventsPerformance: [
      { id: 1, title: 'Tech Conference 2023', registrations: 500, check_ins: 450, attendance_rate: 90 },
      { id: 2, title: 'Summer Music Festival', registrations: 750, check_ins: 530, attendance_rate: 70.6 },
    ],
  };
}
