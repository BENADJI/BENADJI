// Mock data for Oftalmo University Academy

export const mockStats = {
  webinarListeners: 2500,
  virtualClasses: 150,
  keyOpinionLeaders: 45,
  subscribers: 8000
};

export const mockCampuses = [
  {
    id: 1,
    name: "Campus México",
    location: "Mexico City, Roma",
    image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&q=80",
    description: "Oftalmo University's Mexico campus, located in the Roma neighborhood, offers advanced training for ophthalmologists, focusing on cataract surgery and other specialties with expert faculty and state-of-the-art facilities."
  },
  {
    id: 2,
    name: "Campus Europe",
    location: "Barcelona, Spain",
    image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80",
    description: "Oftalmo University's European campus in Barcelona opened in February 2025 inside the prestigious IMO facility. It will serve professionals from Europe, North Africa, and the Middle East."
  }
];

export const mockFeatures = [
  {
    title: "Simulation & Patients",
    subtitle: "hands on",
    icon: "Hand"
  },
  {
    title: "Online Campus",
    subtitle: "access freedom",
    icon: "Monitor"
  },
  {
    title: "State of the art tech",
    subtitle: "latest advances",
    icon: "Microscope"
  },
  {
    title: "Probed Excellence",
    subtitle: "certification",
    icon: "Award"
  },
  {
    title: "Community",
    subtitle: "colleagues' insights",
    icon: "Users"
  },
  {
    title: "Mentorship",
    subtitle: "continuous support",
    icon: "UserCheck"
  }
];

export const mockCourses = [
  {
    id: 1,
    title: "Cataract Surgery Training Program",
    description: "Comprehensive hands-on training in modern cataract surgery techniques with expert mentorship.",
    duration: "12 weeks",
    level: "Advanced",
    price: 5999,
    image: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=600&q=80",
    enrolledCount: 245,
    rating: 4.9
  },
  {
    id: 2,
    title: "Phaco Training Masterclass",
    description: "Master phacoemulsification techniques with simulation training and live surgery observation.",
    duration: "8 weeks",
    level: "Intermediate",
    price: 4499,
    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&q=80",
    enrolledCount: 189,
    rating: 4.8
  },
  {
    id: 3,
    title: "Refractive Surgery Essentials",
    description: "Learn the fundamentals and advanced techniques in refractive surgery procedures.",
    duration: "10 weeks",
    level: "Advanced",
    price: 5499,
    image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&q=80",
    enrolledCount: 156,
    rating: 4.7
  }
];

export const mockUser = {
  id: 1,
  name: "Dr. Sarah Johnson",
  email: "sarah.johnson@example.com",
  role: "student",
  enrolledCourses: [1, 2],
  completedCourses: [],
  progress: {
    1: 65,
    2: 30
  }
};

export const mockAdminUser = {
  id: 2,
  name: "Dr. Admin User",
  email: "admin@academy.oms-dz.com",
  role: "admin"
};
