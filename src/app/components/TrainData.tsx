export interface Train {
  id: string;
  route: string;
  speed: number;
  status: 'On Time' | 'Delayed' | 'Critical';
  delay: number;
  position: { x: number; y: number };
}

export interface AIRecommendation {
  id: string;
  issue: string;
  risk: 'Low' | 'Medium' | 'High';
  action: string;
  impact: string;
  approved: boolean;
  detailedImpact: string;
  timeToImplement: string;
  confidence: number;
  priority: 'Low' | 'Medium' | 'High';
  reasoning: string[];
  affectedTrains: string[];
}

export const mockTrains: Train[] = [
  { id: 'TRN-1024', route: 'Mumbai → Delhi', speed: 85, status: 'On Time', delay: 0, position: { x: 20, y: 30 } },
  { id: 'TRN-2156', route: 'Delhi → Kolkata', speed: 72, status: 'Delayed', delay: 12, position: { x: 45, y: 25 } },
  { id: 'TRN-3842', route: 'Chennai → Bangalore', speed: 95, status: 'On Time', delay: 0, position: { x: 65, y: 70 } },
  { id: 'TRN-4512', route: 'Bangalore → Hyderabad', speed: 45, status: 'Critical', delay: 28, position: { x: 55, y: 60 } },
  { id: 'TRN-5678', route: 'Hyderabad → Mumbai', speed: 88, status: 'On Time', delay: 0, position: { x: 35, y: 50 } },
  { id: 'TRN-6234', route: 'Kolkata → Chennai', speed: 65, status: 'Delayed', delay: 8, position: { x: 70, y: 45 } },
  { id: 'TRN-7891', route: 'Pune → Ahmedabad', speed: 92, status: 'On Time', delay: 0, position: { x: 25, y: 45 } },
  { id: 'TRN-8145', route: 'Ahmedabad → Jaipur', speed: 78, status: 'Delayed', delay: 5, position: { x: 30, y: 35 } },
];

export const mockRecommendations: AIRecommendation[] = [
  {
    id: 'REC-001',
    issue: 'Potential track conflict detected',
    risk: 'High',
    action: 'Reroute TRN-4512 via alternate track B-7',
    impact: 'Prevents 15 min delay cascade affecting 3 trains',
    approved: false,
    detailedImpact: 'Reduce delay by 15-20 minutes',
    timeToImplement: '3-5 minutes',
    confidence: 94,
    priority: 'High',
    reasoning: [
      'TRN-4512 approaching congested track at 45 km/h',
      'Track B-7 has clear path for next 60 minutes',
      'Rerouting prevents collision risk with freight trains',
      'Minimal speed reduction required for track switch',
    ],
    affectedTrains: ['TRN-4512', 'TRN-6234', 'TRN-2156'],
  },
  {
    id: 'REC-002',
    issue: 'Congestion risk at Delhi Junction',
    risk: 'Medium',
    action: 'Delay TRN-2156 departure by 5 minutes',
    impact: 'Reduces junction wait time by 40%',
    approved: false,
    detailedImpact: 'Reduce delay by 8-12 minutes',
    timeToImplement: '2-3 minutes',
    confidence: 87,
    priority: 'Medium',
    reasoning: [
      'Delhi Junction currently handling 4 simultaneous arrivals',
      'Platform 3 will be available in 5 minutes',
      'Historical data shows 40% efficiency improvement with staggered departures',
      'Minimal passenger impact with pre-notification',
    ],
    affectedTrains: ['TRN-2156', 'TRN-1024'],
  },
  {
    id: 'REC-003',
    issue: 'Delay ripple effect predicted',
    risk: 'Medium',
    action: 'Increase speed limit for TRN-5678 to 95 km/h',
    impact: 'Maintains schedule for 2 connecting trains',
    approved: false,
    detailedImpact: 'Reduce delay by 10-15 minutes',
    timeToImplement: '1-2 minutes',
    confidence: 91,
    priority: 'High',
    reasoning: [
      'TRN-5678 running 5 minutes behind schedule',
      'Clear track ahead for next 80 km stretch',
      'Speed increase recovers lost time without safety compromise',
      'Prevents cascade delay to connecting services',
    ],
    affectedTrains: ['TRN-5678', 'TRN-7891'],
  },
  {
    id: 'REC-004',
    issue: 'Weather delay expected on route',
    risk: 'Low',
    action: 'Pre-notify passengers on TRN-7891',
    impact: 'Improves customer satisfaction',
    approved: false,
    detailedImpact: 'Reduce delay by 5-8 minutes',
    timeToImplement: '1 minute',
    confidence: 78,
    priority: 'Low',
    reasoning: [
      'Weather forecast shows light rain in next 30 minutes',
      'Proactive communication improves passenger experience',
      'Minimal operational impact expected',
      'Allows passengers to adjust connections',
    ],
    affectedTrains: ['TRN-7891'],
  },
];

export const delayTrendData = [
  { time: '6 AM', delay: 4.2 },
  { time: '9 AM', delay: 8.5 },
  { time: '12 PM', delay: 6.8 },
  { time: '3 PM', delay: 12.3 },
  { time: '6 PM', delay: 15.7 },
  { time: '9 PM', delay: 9.4 },
  { time: '12 AM', delay: 5.1 },
];

export const punctualityData = [
  { category: 'On Time', value: 72 },
  { category: 'Minor Delay', value: 18 },
  { category: 'Major Delay', value: 10 },
];

export const delayCausesData = [
  { name: 'Track Maintenance', value: 30 },
  { name: 'Weather', value: 25 },
  { name: 'Congestion', value: 20 },
  { name: 'Technical Issues', value: 15 },
  { name: 'Other', value: 10 },
];
