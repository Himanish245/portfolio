export interface Project {
  title: string;
  description: string;
  category: string;
  technologies: string[];
  status: 'completed' | 'prototype' | 'in-progress' | 'concept';
  link?: string;
  github?: string;
}

export interface SkillCategory {
  name: string;
  skills: string[];
}

export interface LabExperiment {
  title: string;
  description: string;
  label: string;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  subtitle: string;
  description: string;
  email: string;
  social: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
  projects: Project[];
  skills: SkillCategory[];
  experiments: LabExperiment[];
}

const siteConfig: SiteConfig = {
  name: 'HIMANISH',
  tagline: 'Engineering systems. Designing experiences.',
  subtitle: 'I build across software, AI, cybersecurity, and interactive digital experiences.',
  description: 'Multidisciplinary developer and creative technologist building at the intersection of engineering, AI, cybersecurity, and interactive design.',
  email: 'hello@himanish.dev', // Replace with your actual email
  social: {
    github: 'https://github.com/himanish', // Replace with your actual GitHub
    linkedin: 'https://linkedin.com/in/himanish', // Replace with your actual LinkedIn
    // twitter: 'https://twitter.com/himanish', // Uncomment and replace if needed
  },

  projects: [
    {
      title: 'NEXUS',
      description: 'Network detection and response platform — real-time threat monitoring, packet telemetry analysis, and automated incident response architecture.',
      category: 'Cybersecurity',
      technologies: ['Python', 'Network Analysis', 'Threat Detection', 'WebSocket'],
      status: 'concept',
    },
    {
      title: 'AI Research Tool',
      description: 'AI-powered competitor analysis and automated intelligence gathering — structured web scraping, LLM-driven synthesis, and market reports.',
      category: 'Artificial Intelligence',
      technologies: ['Python', 'LangChain', 'OpenAI', 'Next.js'],
      status: 'prototype',
    },
    {
      title: 'Immersive 3D Portfolio',
      description: 'Cinematic WebGL personal space inspired by AVARA — custom physical materials, real-time lighting, and GSAP scroll storytelling.',
      category: 'Creative Technology',
      technologies: ['Next.js', 'Three.js', 'React Three Fiber', 'GSAP'],
      status: 'completed',
    },
    {
      title: 'ATL Lab & Hackathons',
      description: 'Technical activity coordination, robotics mentorship, rapid hardware-software prototyping, and hackathon project development.',
      category: 'Physical Computing',
      technologies: ['IoT', 'Microcontrollers', 'Rapid Prototyping', 'Robotics'],
      status: 'in-progress',
    },
  ],

  skills: [
    {
      name: 'Engineering',
      skills: [
        'TypeScript',
        'React / Next.js',
        'Node.js',
        'Python',
        'PostgreSQL',
        'Docker',
        'REST / GraphQL',
        'Git & CI/CD',
      ],
    },
    {
      name: 'AI & ML',
      skills: [
        'TensorFlow',
        'PyTorch',
        'LangChain',
        'OpenAI API',
        'RAG Pipelines',
        'Vector Databases',
        'NLP & Embeddings',
        'Computer Vision',
      ],
    },
    {
      name: 'Cybersecurity',
      skills: [
        'Network Security',
        'Penetration Testing',
        'SIEM Architecture',
        'Threat Detection',
        'Cryptography',
        'Incident Response',
        'OSINT Analysis',
        'Secure Coding',
      ],
    },
    {
      name: 'Creative Technology',
      skills: [
        'Three.js / WebGL',
        'Blender 3D',
        'GSAP / Motion',
        'GLSL Shaders',
        'UI/UX Prototyping',
        'After Effects',
        'Creative Coding',
        'Interactive Systems',
      ],
    },
  ],

  experiments: [
    {
      title: 'GLSL Shader Playground',
      description: 'Raymarching, procedural signed distance fields (SDFs), and real-time GPU noise generation experiments.',
      label: 'Experiment',
    },
    {
      title: 'Generative Topology',
      description: 'Algorithmic point clouds, particle physics, and vector field morphing in WebGL.',
      label: 'Study',
    },
    {
      title: 'Neural Vision Pipeline',
      description: 'Webcam-based real-time object tracking and interactive visual feedback using lightweight ML models.',
      label: 'Prototype',
    },
  ],
};

export default siteConfig;
