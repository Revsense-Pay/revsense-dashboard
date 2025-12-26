export const dashboardData = {
  summary: {
  grossRevenue: 245000,
  feesCollected: 3125,
  activeClients: 14,
  totalCharges: 128,
},

  chart: [
    { day: 'Mon', amount: 32000 },
    { day: 'Tue', amount: 41000 },
    { day: 'Wed', amount: 38000 },
    { day: 'Thu', amount: 52000 },
    { day: 'Fri', amount: 47000 },
    { day: 'Sat', amount: 21000 },
    { day: 'Sun', amount: 14000 },
  ],

  charges: [
    {
      id: 1,
      customer: 'John Smith',
      amount: 1200,
      status: 'success',
      method: 'Card',
      time: '2 min ago',
    },
    {
      id: 2,
      customer: 'Acme Holdings',
      amount: 9800,
      status: 'success',
      method: 'Card',
      time: '1 hour ago',
    },
    {
      id: 3,
      customer: 'Sarah Williams',
      amount: 450,
      status: 'pending',
      method: 'Debit',
      time: 'Today',
    },
    {
      id: 4,
      customer: 'Blue Ocean Ltd',
      amount: 2300,
      status: 'failed',
      method: 'Card',
      time: 'Yesterday',
    },
  ],
};