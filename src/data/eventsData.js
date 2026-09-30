export const initialEvents = [
  {
    id: '1',
    name: 'HackSprint 2024',
    category: 'Hackathon',
    date: '2024-10-15',
    time: '09:00',
    venue: 'Main CS Block',
    description: 'A 24-hour coding marathon to solve real-world problems. Come with a team or find one here!',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600',
    featured: true,
    registrations: [
      { id: 'r1', name: 'Alice Smith', email: 'alice@example.com', studentId: 'CS2021001', branch: 'CSE' }
    ]
  },
  {
    id: '2',
    name: 'Cultural Fiesta',
    category: 'Cultural',
    date: '2024-11-05',
    time: '18:00',
    venue: 'Open Air Theatre',
    description: 'Annual cultural night featuring dance, music, and drama performances from various student clubs.',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600',
    featured: true,
    registrations: []
  },
  {
    id: '3',
    name: 'AI & Future',
    category: 'Seminar',
    date: '2024-09-20',
    time: '14:00',
    venue: 'Auditorium 1',
    description: 'Guest lecture by industry experts on the future of Artificial Intelligence and Machine Learning.',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600',
    featured: false,
    registrations: []
  },
  {
    id: '4',
    name: 'Inter-College Basketball',
    category: 'Sports',
    date: '2024-10-01',
    time: '16:00',
    venue: 'Indoor Stadium',
    description: 'Cheer for our college team as they face off against rival colleges in the regional qualifiers.',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600',
    featured: false,
    registrations: []
  },
  {
    id: '5',
    name: 'React.js Workshop',
    category: 'Workshop',
    date: '2024-09-25',
    time: '10:00',
    venue: 'Lab 4, IT Block',
    description: 'Hands-on workshop on building modern web applications using React.js and Vite.',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600',
    featured: true,
    registrations: []
  },
  {
    id: '6',
    name: 'Robotics Expo',
    category: 'Technical',
    date: '2024-11-15',
    time: '11:00',
    venue: 'Exhibition Hall',
    description: 'Showcase of innovative robotics projects built by the college robotics club.',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600', // using a techy image
    featured: false,
    registrations: []
  },
  {
    id: '7',
    name: 'Photography Walk',
    category: 'Workshop',
    date: '2024-09-28',
    time: '07:00',
    venue: 'Campus Gates',
    description: 'A morning photo walk around the campus to learn outdoor photography basics.',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600',
    featured: false,
    registrations: []
  },
  {
    id: '8',
    name: 'Music Jam Session',
    category: 'Cultural',
    date: '2024-10-10',
    time: '19:00',
    venue: 'Student Center',
    description: 'Bring your instruments and join the open mic and jam session. All genres welcome!',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600',
    featured: false,
    registrations: []
  }
];
