import type { UserData } from '../context/AuthContext';

// Mock users data
const mockUsers: UserData[] = [
  {
    id: 'USP-10293',
    name: 'Ahmed Hassan',
    email: 'ahmed.hassan@example.com',
    phone: '01012345678',
    role: 'client',
    nationalId: '29001011234567',
    governorate: 'Cairo',
    city: 'Nasr City'
  },
  {
    id: 'USP-88492',
    name: 'Sara Mahmoud',
    email: 'sara.m@example.com',
    phone: '01198765432',
    role: 'client',
    nationalId: '29505051234567',
    governorate: 'Alexandria',
    city: 'Smouha'
  },
  {
    id: 'USP-33921',
    name: 'Mohamed Ali',
    email: 'm.ali.dev@example.com',
    phone: '01234567890',
    role: 'client',
    nationalId: '28812121234567',
    governorate: 'Giza',
    city: 'Sheikh Zayed City'
  }
];

export const fetchUsers = async (): Promise<UserData[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockUsers.filter(u => u.role === 'client'));
    }, 600);
  });
};

export const fetchUserById = async (id: string): Promise<UserData | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = mockUsers.find(u => u.id === id);
      resolve(user || null);
    }, 400);
  });
};
