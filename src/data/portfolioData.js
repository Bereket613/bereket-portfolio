// Static fallback data used when the backend API is unreachable or empty.
// The admin dashboard (PostgreSQL-backed) is the primary source of content.

export const projectsData = [
  // NLP / LLM
  {
    title: 'Coffee RAG Chatbot',
    description: 'Retrieval-augmented chatbot that answers questions about coffee using a knowledge base and a language model.',
    category: 'NLP / LLM',
    technologies: ['NLP', 'RAG', 'LLM'],
  },
  {
    title: 'FITAI Multilingual RAG Chatbot',
    description: 'Multilingual retrieval-augmented chatbot that answers questions across languages.',
    category: 'NLP / LLM',
    technologies: ['NLP', 'RAG', 'Multilingual'],
  },
  {
    title: 'Smart Addis Chatbot',
    description: 'Conversational AI assistant built for the Smart Addis context.',
    category: 'NLP / LLM',
    technologies: ['NLP', 'LLM'],
  },
  {
    title: 'Encrypted Amharic Sentiment Analysis',
    description: 'Sentiment analysis for Amharic text working with encrypted data as part of privacy-preserving machine learning.',
    category: 'NLP / LLM',
    technologies: ['NLP', 'Amharic', 'Privacy-preserving ML'],
  },
  {
    title: 'Amharic Fake News Detection',
    description: 'Detection of fake news articles written in Amharic.',
    category: 'NLP / LLM',
    technologies: ['NLP', 'Amharic', 'Classification'],
  },

  // Computer Vision
  {
    title: 'Amharic Sign Language Detection',
    description: 'Computer vision system that recognizes Amharic sign language gestures.',
    category: 'Computer Vision',
    technologies: ['Computer Vision', 'Deep Learning'],
  },
  {
    title: 'Road Crack Detection',
    description: 'Detects and flags cracks in road surfaces from images.',
    category: 'Computer Vision',
    technologies: ['Computer Vision', 'Image Classification'],
  },
  {
    title: 'Height Measurement',
    description: 'Estimates height from images using computer vision techniques.',
    category: 'Computer Vision',
    technologies: ['Computer Vision', 'Image Processing'],
  },
  {
    title: 'Coffee Leaf Detection',
    description: 'Detects coffee leaf conditions from images to support crop health monitoring.',
    category: 'Computer Vision',
    technologies: ['Computer Vision', 'Object Detection'],
  },
  {
    title: 'Morning Fit',
    description: 'Computer vision based fitness application.',
    category: 'Computer Vision',
    technologies: ['Computer Vision', 'Pose Estimation'],
  },

  // Machine Learning / Data
  {
    title: 'AI Data Analyser',
    description: 'Data analysis and machine learning platform for exploring datasets and generating insights.',
    category: 'Machine Learning / Data',
    technologies: ['Machine Learning', 'Data Analysis'],
  },
  {
    title: 'Credit Card Fraud Detection',
    description: 'Fraud detection on credit card transactions using machine learning.',
    category: 'Machine Learning / Data',
    technologies: ['Machine Learning', 'Classification'],
  },
  {
    title: 'KYC Risk Classification',
    description: 'Classifies KYC cases by risk level using machine learning.',
    category: 'Machine Learning / Data',
    technologies: ['Machine Learning', 'Classification'],
  },
];

export const projectCategories = ['All', 'NLP / LLM', 'Computer Vision', 'Machine Learning / Data'];

export const experienceData = [
  {
    organization: 'Information Network Security Agency (INSA)',
    role: 'Intern',
    duration: '2026',
    description: 'Completed a 3-month internship at INSA. My work and interests during this time covered AI and machine learning, with a focus on privacy-preserving machine learning and related research and engineering work.',
    key_achievements: [],
    tech_stack: ['Machine Learning', 'Privacy-preserving ML'],
  },
  {
    organization: 'DataParse Club — Debre Berhan University',
    role: 'Co-Founder',
    duration: '',
    description: 'One of the founders of DataParse Club, a data and AI community at Debre Berhan University. Helped establish the club and build a space for students to learn and work on data projects together.',
    key_achievements: [],
    tech_stack: [],
  },
  {
    organization: 'INSA 5th Round Summer Camp',
    role: 'Member',
    duration: '',
    description: 'Participated in the INSA 5th Round Summer Camp as part of my technical development.',
    key_achievements: [],
    tech_stack: [],
  },
];

// Used to seed the backend skills table on first run and as frontend fallback.
export const defaultSkills = [
  {
    category: 'Machine Learning',
    description: 'Core machine learning methods, from classic supervised models to evaluation practice.',
    skills: ['Machine Learning', 'Supervised Learning', 'Unsupervised Learning', 'Classification', 'Regression', 'Anomaly Detection', 'Model Evaluation'],
  },
  {
    category: 'Deep Learning',
    description: 'Neural network modeling and training for vision and representation learning.',
    skills: ['Deep Learning', 'Neural Networks', 'PyTorch', 'TensorFlow', 'Computer Vision', 'Representation Learning'],
  },
  {
    category: 'NLP',
    description: 'Language technology, with a focus on Amharic and other low-resource languages.',
    skills: ['Natural Language Processing', 'Transformers', 'Large Language Models', 'RAG', 'Multilingual NLP', 'Amharic NLP'],
  },
  {
    category: 'Computer Vision',
    description: 'Image understanding tasks from classification to pose estimation.',
    skills: ['Computer Vision', 'Image Classification', 'Object Detection', 'Pose Estimation', 'Image Processing'],
  },
  {
    category: 'Big Data',
    description: 'Large-scale data processing and pipeline work.',
    skills: ['Big Data', 'Apache Spark', 'PySpark', 'Data Processing', 'Streaming / Data Pipelines'],
  },
  {
    category: 'Programming & Tools',
    description: 'Languages and tooling used day to day.',
    skills: ['Python', 'R', 'SQL', 'PySpark', 'PyTorch', 'TensorFlow', 'Git', 'GitHub'],
  },
];

export const contactConfig = {
  serviceId: process.env.REACT_APP_EMAILJS_SERVICE_ID,
  templateId: process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
  publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY
};
