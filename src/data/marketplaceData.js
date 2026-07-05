export const trainers = [
  {
    id: 'pt_01',
    name: 'Alex Mercer',
    image_url: 'https://images.unsplash.com/photo-1633180543038-4e0d06c9a9d2?w=400&h=500&fit=crop&crop=faces',
    certifications: ['REPs Level 3', 'NASM Nutrition Coach'],
    specialties: ['Weight Loss', 'Functional Strength', 'HIIT'],
    bio: 'Specializing in body transformations for busy professionals. I bring elite coaching directly to your preferred environment.',
    rating: 4.9,
    review_count: 42,
    available_cities: ['Male', 'Hulhumale'],
    available_locations: ['Gym', 'Home', 'Outdoor'],
    availability_calendar: ['Mon 9AM', 'Mon 2PM', 'Wed 6PM', 'Fri 9AM', 'Fri 5PM'],
  },
  {
    id: 'pt_02',
    name: 'Sarah Jenkins',
    image_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop&crop=faces',
    certifications: ['ACE Personal Trainer', 'Pre/Post Natal Certified'],
    specialties: ['Mobility', 'Strength Training', 'Post-Pregnancy Fitness'],
    bio: 'Helping you build a sustainable lifestyle. Flexible schedules tailored for residential visits and private hotel gym training.',
    rating: 5.0,
    review_count: 28,
    available_cities: ['Male'],
    available_locations: ['Home', 'Hotel', 'Outdoor'],
    availability_calendar: ['Tue 8AM', 'Tue 1PM', 'Thu 9AM', 'Sat 10AM', 'Sat 4PM'],
  },
  {
    id: 'pt_03',
    name: 'Marcus Rodriguez',
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=faces',
    certifications: ['ISSA Certified', 'Strength & Conditioning Specialist'],
    specialties: ['Muscle Gain', 'Athletic Performance', 'Sport-Specific Training'],
    bio: 'Olympic training methodology applied to everyday athletes. Get stronger, faster, better.',
    rating: 4.8,
    review_count: 35,
    available_cities: ['Hulhumale'],
    available_locations: ['Gym', 'Home'],
    availability_calendar: ['Mon 7AM', 'Wed 6PM', 'Thu 7AM', 'Fri 6PM'],
  },
  {
    id: 'pt_04',
    name: 'Jessica Liu',
    image_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop&crop=faces',
    certifications: ['NASM Certified', 'Yoga Instructor Certified'],
    specialties: ['Flexibility', 'Mind-Body Training', 'Wellness'],
    bio: 'Holistic fitness approach combining strength, flexibility, and mental wellness. Transform your lifestyle.',
    rating: 4.9,
    review_count: 31,
    available_cities: ['Male', 'Hulhumale'],
    available_locations: ['Home', 'Outdoor', 'Hotel'],
    availability_calendar: ['Mon 10AM', 'Wed 7AM', 'Thu 5PM', 'Sat 11AM'],
  },
];

export const sessionPackages = [
  {
    id: 'one_day',
    label: 'One Day Session',
    description: 'Single session',
    durationMonths: 1 / 12,
    requiresGymMembership: false,
    discountPercent: 0,
  },
  {
    id: 'weekly',
    label: 'Weekly Sessions',
    description: 'Training for 1 week (3-5 sessions)',
    durationMonths: 1 / 4,
    requiresGymMembership: false,
    discountPercent: 0.1,
  },
  {
    id: 'monthly',
    label: 'Monthly Sessions',
    description: '4 weeks consistent training',
    durationMonths: 1,
    requiresGymMembership: true,
    discountPercent: 0,
  },
  {
    id: 'yearly',
    label: 'Yearly Commitment',
    description: '12 months (2 months free)',
    durationMonths: 10, // 10 months price for 12 months training
    requiresGymMembership: true,
    discountPercent: 0,
  },
];

// Monthly rates in MVR (baseline for 1 month commitment)
export const monthlyRates = {
  Gym: 2500,
  Home: 3000,
  Outdoor: 2000,
  Hotel: 3500,
};

export const gymMembershipFee = 1080; // MVR per month

export const gyms = [
  { id: 'gym_01', name: 'Iron Haven Fitness', city: 'Male', address: 'Male City Center' },
  { id: 'gym_02', name: 'FitZone Premium', city: 'Male', address: 'Male North District' },
  { id: 'gym_03', name: 'PowerPlay Gym', city: 'Hulhumale', address: 'Hulhumale Central' },
  { id: 'gym_04', name: 'Elite Fitness Hub', city: 'Hulhumale', address: 'Hulhumale South' },
];

export const hotels = [
  { id: 'hotel_01', name: 'The Maldivian Resort', city: 'Male', amenities: 'Full Gym, Olympic Pool, Spa' },
  { id: 'hotel_02', name: 'Coral Palace Hotel', city: 'Male', amenities: 'Fitness Center, Facilities' },
  { id: 'hotel_03', name: 'Ocean View Hotel', city: 'Hulhumale', amenities: 'Modern Gym, Beach Access' },
  { id: 'hotel_04', name: 'Lagoon Retreat Hotel', city: 'Hulhumale', amenities: 'Premium Gym, Private Beach' },
];

export const outdoorSpaces = [
  { id: 'outdoor_01', name: 'Male Beach Park', city: 'Male', type: 'Beach Park' },
  { id: 'outdoor_02', name: 'Central Park Male', city: 'Male', type: 'Urban Park' },
  { id: 'outdoor_03', name: 'Hulhumale Beach Front', city: 'Hulhumale', type: 'Beach' },
  { id: 'outdoor_04', name: 'Hulhumale Recreation Park', city: 'Hulhumale', type: 'Park' },
];

export const MVR_PER_USD = 15.42;

export const CITIES = ['Male', 'Hulhumale'];
export const LOCATIONS = ['Gym', 'Home', 'Hotel', 'Outdoor'];
