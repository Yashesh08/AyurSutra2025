import { User, DoctorReview } from '../types';
import { PATIENTS } from '../constants';

const doc1Reviews: DoctorReview[] = [
    { patientName: 'Amit Singh', rating: 5, comment: 'Dr. Sharma is incredibly knowledgeable and compassionate. The treatment plan has worked wonders.', date: '2024-07-20' },
    { patientName: 'Sunita Joshi', rating: 4, comment: 'A very positive experience. I feel much more balanced and energetic.', date: '2024-07-15' },
];

const doc2Reviews: DoctorReview[] = [
     { patientName: 'Raj Patel', rating: 5, comment: 'Dr. Verma explains everything clearly and makes you feel comfortable. Highly recommend.', date: '2024-07-22' },
     { patientName: 'Priya Sharma', rating: 4, comment: 'The sessions have been very effective for my stress levels.', date: '2024-07-18' },
];

export const USERS: User[] = [
  {
    id: 'admin0',
    name: 'Admin',
    email: 'admin@ayursetu.io',
    password: 'password123',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?u=admin0',
  },
  {
    id: 'practitioner1',
    name: 'Dr. Anya Sharma',
    email: 'practitioner@ayursetu.io',
    password: 'password123',
    role: 'practitioner',
    avatar: 'https://i.pravatar.cc/150?u=drAnya',
    specialty: 'Lead Ayurvedic Practitioner',
    bio: 'Dedicated to blending ancient Ayurvedic wisdom with modern wellness practices to provide holistic and personalized care.',
    reviews: doc1Reviews,
    yearsOfExperience: 12,
  },
  {
    id: 'doc2',
    name: 'Dr. Vivek Verma',
    email: 'vivek.verma@ayursetu.io',
    password: 'password123',
    role: 'practitioner',
    avatar: 'https://i.pravatar.cc/150?u=drVivek',
    specialty: 'Shirodhara & Abhyanga Specialist',
    bio: 'Expert in detoxification and rejuvenation therapies, focusing on mental clarity and physical wellbeing.',
    reviews: doc2Reviews,
    yearsOfExperience: 8,
  },
  {
    id: 'p1',
    name: 'Raj Patel',
    email: 'raj.patel@email.com',
    password: 'password123',
    role: 'user',
    avatar: 'https://i.pravatar.cc/150?u=p1',
    preferredTimeSlot: 'morning',
    patientData: PATIENTS.find(p => p.id === 'p1'),
  },
   {
    id: 'p2',
    name: 'Priya Sharma',
    email: 'priya.sharma@email.com',
    password: 'password123',
    role: 'user',
    avatar: 'https://i.pravatar.cc/150?u=p2',
    patientData: PATIENTS.find(p => p.id === 'p2'),
  },
];