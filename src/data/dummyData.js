// ─── DOCTORS ────────────────────────────────────────────────────────────────
export const doctors = [
  { id: 1, name: 'Dr. Andi Susanto', specialization: 'Cardiology', schedule: 'Mon, Wed: 09:00 – 13:00', photo: null },
  { id: 2, name: 'Dr. Budi Darmawan', specialization: 'Pediatrics', schedule: 'Tue, Thu: 10:00 – 15:00', photo: null },
  { id: 3, name: 'Dr. Citra Lestari', specialization: 'General Practice', schedule: 'Mon–Fri: 08:00 – 16:00', photo: null },
  { id: 4, name: 'Dr. Dewi Rahayu', specialization: 'Dermatology', schedule: 'Mon, Wed, Fri: 13:00 – 17:00', photo: null },
  { id: 5, name: 'Dr. Eko Prasetyo', specialization: 'Orthopedics', schedule: 'Tue, Thu, Sat: 08:00 – 12:00', photo: null },
];

// ─── FACILITIES ──────────────────────────────────────────────────────────────
export const facilities = [
  { id: 'outpatient', name: 'Outpatient Services', description: 'Expert care without overnight stay.', icon: '🏥' },
  { id: 'inpatient', name: 'Inpatient Services', description: 'Comfort and healing, round the clock.', icon: '🛏️' },
  { id: 'ambulance', name: '24-Hour Ambulance', description: 'Rapid response when every second counts.', icon: '🚑' },
  { id: 'ekg', name: 'EKG Services', description: 'Precision diagnostics for your heart.', icon: '💓' },
  { id: 'homecare', name: 'Homecare Services', description: 'Quality healthcare at your doorstep.', icon: '🏠' },
];

// ─── EVENTS ──────────────────────────────────────────────────────────────────
export const events = [
  { id: 1, title: 'Free Blood Pressure Screening', description: 'Community health screening for hypertension awareness.', date: '2026-05-10', location: 'Aula Klinik Mardi Lestari', category: 'Health', image: null },
  { id: 2, title: 'Healthy Cooking Workshop', description: 'Learn to cook nutritious meals for the whole family.', date: '2026-05-17', location: 'Ruang Serbaguna, Lt. 2', category: 'Education', image: null },
  { id: 3, title: 'Blood Donation Drive', description: 'Join us to donate blood and save lives in our community.', date: '2026-05-24', location: 'Halaman Klinik', category: 'Social', image: null },
  { id: 4, title: 'Diabetes Prevention Talk', description: 'Expert lecture on managing and preventing type-2 diabetes.', date: '2026-06-05', location: 'Ruang Konsultasi A', category: 'Education', image: null },
  { id: 5, title: 'Mother & Child Health Day', description: 'Comprehensive check-ups and immunizations for mothers and kids.', date: '2026-06-15', location: 'Poli Anak, Lt. 1', category: 'Health', image: null },
  { id: 6, title: 'Community Clean-Up Drive', description: 'Working together to keep our neighbourhood clean and healthy.', date: '2026-06-22', location: 'Area Sekitar Klinik', category: 'Social', image: null },
];

// ─── VIDEOS ──────────────────────────────────────────────────────────────────
export const videos = [
  { id: 1, title: 'Understanding Hypertension', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '5:23' },
  { id: 2, title: 'Healthy Diet for Diabetics', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '7:11' },
  { id: 3, title: 'Benefits of Regular Exercise', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '4:45' },
  { id: 4, title: 'First Aid Essentials', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '9:02' },
];

// ─── GALLERY ─────────────────────────────────────────────────────────────────
export const galleryItems = [
  { id: 1, title: 'Reception Area', category: 'Facility', color: '#e0f2fe' },
  { id: 2, title: 'Consultation Room', category: 'Facility', color: '#dcfce7' },
  { id: 3, title: 'Blood Donation Drive 2025', category: 'Activity', color: '#fee2e2' },
  { id: 4, title: 'Pediatric Ward', category: 'Facility', color: '#fef3c7' },
  { id: 5, title: 'Community Health Day', category: 'Activity', color: '#ede9fe' },
  { id: 6, title: 'Operating Theatre', category: 'Facility', color: '#e0f2fe' },
  { id: 7, title: 'Cooking Workshop 2025', category: 'Activity', color: '#dcfce7' },
  { id: 8, title: 'Emergency Unit', category: 'Facility', color: '#fee2e2' },
  { id: 9, title: 'Ambulance Fleet', category: 'Facility', color: '#fef3c7' },
  { id: 10, title: 'Outreach Programme', category: 'Activity', color: '#ede9fe' },
  { id: 11, title: 'Lab & Diagnostics', category: 'Facility', color: '#e0f2fe' },
  { id: 12, title: 'Staff Training Day', category: 'Activity', color: '#dcfce7' },
];

// ─── SMART CHECK QUESTIONS ───────────────────────────────────────────────────
export const smartCheckQuestions = {
  obesity: [
    { id: 1, text: 'How often do you exercise per week?', options: ['Never', '1–2 times', '3–4 times', '5+ times'], values: [4, 3, 2, 1] },
    { id: 2, text: 'How often do you consume fast food or sugary drinks?', options: ['Daily', 'Several times a week', 'Occasionally', 'Rarely'], values: [4, 3, 2, 1] },
    { id: 3, text: 'How would you describe your current weight?', options: ['Significantly overweight', 'Slightly overweight', 'Normal weight', 'Underweight'], values: [4, 3, 1, 2] },
    { id: 4, text: 'How many hours of sleep do you get per night?', options: ['Less than 5 hrs', '5–6 hrs', '7–8 hrs', 'More than 9 hrs'], values: [3, 2, 1, 2] },
    { id: 5, text: 'How much water do you drink daily?', options: ['Less than 4 glasses', '4–6 glasses', '7–8 glasses', 'More than 8 glasses'], values: [3, 2, 1, 1] },
  ],
  cholesterol: [
    { id: 1, text: 'Do you have a family history of high cholesterol or heart disease?', options: ['Yes, both parents', 'One parent', 'Not sure', 'No'], values: [4, 3, 2, 1] },
    { id: 2, text: 'How often do you eat fried or greasy foods?', options: ['Daily', 'Several times a week', 'Occasionally', 'Rarely'], values: [4, 3, 2, 1] },
    { id: 3, text: 'Do you smoke or use tobacco products?', options: ['Yes, daily', 'Occasionally', 'I quit', 'Never'], values: [4, 3, 2, 1] },
    { id: 4, text: 'How often do you eat fruits and vegetables?', options: ['Rarely', 'Once a day', '2–3 times a day', 'With every meal'], values: [4, 3, 2, 1] },
    { id: 5, text: 'How is your stress level most days?', options: ['Very high', 'Moderate', 'Low', 'Very low'], values: [4, 3, 2, 1] },
  ],
};

// ─── CLINIC PROFILE ──────────────────────────────────────────────────────────
export const clinicProfile = {
  name: 'Klinik Mardi Lestari',
  motto: 'Kasih Untuk Sembuh',
  tagline: 'Aku Mau Supaya Engkau Sembuh',
  foundation: 'Yayasan Mardi Lestari',
  founded: '1998',
  address: 'Jl. Kesehatan No. 123, Jakarta Timur, 13220',
  phone: '+62 21 1234 5678',
  whatsapp: '628001234567',
  email: 'info@mardilestari.com',
  instagram: '@klinik.mardilestari',
  history: 'Klinik Mardi Lestari was founded in 1998 under the auspices of Yayasan Mardi Lestari with a mission to provide affordable, compassionate, and high-quality healthcare to the surrounding community. Over the past 27 years, we have grown from a small general clinic into a multi-specialty health centre serving thousands of patients annually.',
  vision: 'To become the most trusted community health centre in Jakarta, known for compassionate care, clinical excellence, and innovation.',
  mission: [
    'Provide affordable and accessible healthcare to all members of the community.',
    'Uphold the highest standards of medical ethics and patient safety.',
    'Continuously improve clinical skills and medical knowledge.',
    'Build a culture of caring, respect, and professionalism in every interaction.',
  ],
  stats: [
    { label: 'Years of Service', value: '27+' },
    { label: 'Medical Doctors', value: '12' },
    { label: 'Patients / Day', value: '150+' },
    { label: 'Specializations', value: '8' },
  ],
  staff: [
    { id: 1, name: 'Dr. Andi Susanto', specialization: 'Cardiologist', role: 'Medical Director' },
    { id: 2, name: 'Dr. Budi Darmawan', specialization: 'Pediatrician', role: 'Head of Pediatrics' },
    { id: 3, name: 'Dr. Citra Lestari', specialization: 'General Practitioner', role: 'Senior GP' },
    { id: 4, name: 'Dr. Dewi Rahayu', specialization: 'Dermatologist', role: 'Skin & Aesthetic Specialist' },
    { id: 5, name: 'Dr. Eko Prasetyo', specialization: 'Orthopedic Surgeon', role: 'Bone & Joint Specialist' },
    { id: 6, name: 'Ns. Ratna Sari', specialization: 'Nursing', role: 'Head Nurse' },
  ],
};

// ─── ADMIN DUMMY DATA ────────────────────────────────────────────────────────
export const adminDummyData = {
  doctors: [
    { id: 1, name: 'Dr. Andi Susanto', specialization: 'Cardiology', phone: '08111000001', status: 'Active' },
    { id: 2, name: 'Dr. Budi Darmawan', specialization: 'Pediatrics', phone: '08111000002', status: 'Active' },
    { id: 3, name: 'Dr. Citra Lestari', specialization: 'General Practice', phone: '08111000003', status: 'Active' },
    { id: 4, name: 'Dr. Dewi Rahayu', specialization: 'Dermatology', phone: '08111000004', status: 'On Leave' },
    { id: 5, name: 'Dr. Eko Prasetyo', specialization: 'Orthopedics', phone: '08111000005', status: 'Active' },
  ],
  schedules: [
    { id: 1, doctor: 'Dr. Andi Susanto', day: 'Mon, Wed', time: '09:00–13:00', room: 'Poli Jantung' },
    { id: 2, doctor: 'Dr. Budi Darmawan', day: 'Tue, Thu', time: '10:00–15:00', room: 'Poli Anak' },
    { id: 3, doctor: 'Dr. Citra Lestari', day: 'Mon–Fri', time: '08:00–16:00', room: 'Poli Umum' },
  ],
  events: [
    { id: 1, title: 'Free Blood Pressure Screening', date: '2026-05-10', category: 'Health', status: 'Upcoming' },
    { id: 2, title: 'Healthy Cooking Workshop', date: '2026-05-17', category: 'Education', status: 'Upcoming' },
    { id: 3, title: 'Blood Donation Drive', date: '2026-05-24', category: 'Social', status: 'Upcoming' },
  ],
  videos: [
    { id: 1, title: 'Understanding Hypertension', url: 'https://youtu.be/example1', duration: '5:23' },
    { id: 2, title: 'Healthy Diet for Diabetics', url: 'https://youtu.be/example2', duration: '7:11' },
  ],
  gallery: [
    { id: 1, title: 'Reception Area', category: 'Facility' },
    { id: 2, title: 'Blood Donation Drive 2025', category: 'Activity' },
  ],
};
