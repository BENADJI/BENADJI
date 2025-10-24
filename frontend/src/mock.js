// Données simulées pour l'Académie Oftalmo

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
    description: "Le campus mexicain de l'Académie Oftalmo, situé dans le quartier de Roma, offre une formation avancée pour les ophtalmologistes, axée sur la chirurgie de la cataracte et d'autres spécialités avec un corps professoral expert et des installations de pointe."
  },
  {
    id: 2,
    name: "Campus Europe",
    location: "Barcelone, Espagne",
    image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80",
    description: "Le campus européen de l'Académie Oftalmo à Barcelone a ouvert ses portes en février 2025 au sein de la prestigieuse installation IMO. Il servira les professionnels d'Europe, d'Afrique du Nord et du Moyen-Orient."
  }
];

export const mockFeatures = [
  {
    title: "Simulation & Patients",
    subtitle: "pratique",
    icon: "Hand"
  },
  {
    title: "Campus en Ligne",
    subtitle: "liberté d'accès",
    icon: "Monitor"
  },
  {
    title: "Technologie de Pointe",
    subtitle: "dernières avancées",
    icon: "Microscope"
  },
  {
    title: "Excellence Prouvée",
    subtitle: "certification",
    icon: "Award"
  },
  {
    title: "Communauté",
    subtitle: "perspectives de collègues",
    icon: "Users"
  },
  {
    title: "Mentorat",
    subtitle: "soutien continu",
    icon: "UserCheck"
  }
];

export const mockCourses = [
  {
    id: 1,
    title: "Programme de Formation en Chirurgie de la Cataracte",
    description: "Formation pratique complète sur les techniques modernes de chirurgie de la cataracte avec mentorat expert.",
    duration: "12 semaines",
    level: "Avancé",
    price: 5999,
    image: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=600&q=80",
    enrolledCount: 245,
    rating: 4.9
  },
  {
    id: 2,
    title: "Masterclass de Formation Phaco",
    description: "Maîtrisez les techniques de phacoémulsification avec formation sur simulateur et observation de chirurgie en direct.",
    duration: "8 semaines",
    level: "Intermédiaire",
    price: 4499,
    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&q=80",
    enrolledCount: 189,
    rating: 4.8
  },
  {
    id: 3,
    title: "Fondamentaux de la Chirurgie Réfractive",
    description: "Apprenez les fondamentaux et les techniques avancées des procédures de chirurgie réfractive.",
    duration: "10 semaines",
    level: "Avancé",
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
