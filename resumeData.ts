/**
 * =============================================================================
 *  RESUME DATA — Edit this file to customize your resume content.
 *  The PDF layout and styling are handled by resumeBuilder.ts
 * =============================================================================
 */

export interface ContactInfo {
  name: string;
  title: string;
  tagline: string[];         // Each string is one line of the tagline
  email: string;
  linkedin: string;          // Display text (e.g. "linkedin.com/in/codynicholson")
  github: string;            // Display text (e.g. "github.com/CodyNicholson")
  profilePhotoPath: string;  // Path to a square PNG/JPG image
}

export interface WorkExperience {
  jobTitle: string;
  company: string;
  dateRange: string;         // e.g. "11/2024 - Present"
  location: string;          // e.g. "Chicago"
  bullets: string[];         // Each bullet is the full text (will be word-wrapped)
}

export interface Skill {
  name: string;
}

export interface PersonalProject {
  title: string;
  bullets: string[];
}

export interface VolunteerExperience {
  role: string;
  organization: string;
  dateRange: string;
  location: string;
  bullets: string[];
}

export interface Education {
  institution: string;
  degree: string;
  activities: string[];      // Clubs, societies, honors
}

export interface ResumeData {
  contact: ContactInfo;
  workExperiences: WorkExperience[];
  skills: Skill[];
  personalProjects: PersonalProject[];
  volunteerExperiences: VolunteerExperience[];
  education: Education[];
}

// ─────────────────────────────────────────────────────────────────────────────
//  YOUR RESUME DATA — Edit the values below
// ─────────────────────────────────────────────────────────────────────────────

const resumeData: ResumeData = {
  contact: {
    name: 'Cody Nicholson',
    title: 'Software Engineer',
    tagline: [
      'Bridging the gap between cutting-edge AI and',
      'practical, enterprise-grade engineering',
    ],
    email: 'codynicholson96@gmail.com',
    linkedin: 'linkedin.com/in/codynicholson',
    github: 'github.com/CodyNicholson',
    profilePhotoPath: './profile_photo.png',
  },

  workExperiences: [
    {
      jobTitle: 'Lead Software Engineer',
      company: 'Ahold Delhaize USA',
      dateRange: '11/2024 - Present',
      location: '',
      bullets: [
        'Spearheaded core software modernization by decoupling legacy systems, redesigning software architecture, and eliminating technical debt to accelerate development velocity.',
        'Drove technical strategy, evaluating next-generation AI and traditional architectures while mentoring engineers and executing seamless capability handoffs.',
      ],
    },
    {
      jobTitle: 'Senior Software Engineer',
      company: 'Peapod Digital Labs',
      dateRange: '08/2020 - 11/2024',
      location: 'Chicago',
      bullets: [
        'Designed & Implemented an ecommerce order processing ETL pipeline fulfilling over three million orders annually across twenty-five different facilities using Java, Kafka, Docker, Azure, Postgres, and Redis, among other tools',
        'Engineered self-service support tooling for on-call operations, cutting incident volume by 73% and significantly reducing Mean Time to Resolution (MTTR).',
      ],
    },
    {
      jobTitle: 'Lead Software Development Instructor',
      company: 'ThriveDX',
      dateRange: '12/2020 - Present',
      location: 'Chicago',
      bullets: [
        'Facilitated the career development of students I had the privilege of instructing in the areas of web design, web development, software engineering, and AI',
        'Published supplemental articles on Medium.com',
      ],
    },
    {
      jobTitle: 'Data Engineer',
      company: 'Arity',
      dateRange: '02/2019 - 08/2020',
      location: 'Chicago',
      bullets: [
        'Implemented a microservice architecture to enroll users in products Arity provides using Java, Micro-services, Kafka, and Postgres',
        'Led Training Committee to better provide engineers with the resources they need to do their best work',
      ],
    },
    {
      jobTitle: 'Data Science Instructor',
      company: 'Northwestern University',
      dateRange: '04/2018 - 12/2020',
      location: 'Chicago',
      bullets: [
        'Led the class in learning tools including: VBA, Python, SQL, JS, ETL, Machine Learning and more',
      ],
    },
  ],

  skills: [
    { name: 'Java' },
    { name: 'Spring Boot' },
    { name: 'Kafka' },
    { name: 'Claude' },
    { name: 'Copilot' },
    { name: 'Git' },
    { name: 'SQL' },
    { name: 'JavaScript' },
    { name: 'TypeScript' },
    { name: 'ReactJs' },
    { name: 'VueJS' },
    { name: 'Kotlin' },
    { name: 'Python' },
    { name: 'Redis' },
    { name: 'Docker' },
    { name: 'Azure' },
    { name: 'AWS' },
    { name: 'DataDog' },
  ],

  personalProjects: [
    {
      title: 'ISS Tracking Application',
      bullets: [
        'Created an ETL app that collects and combines data from the international space station API, weather API, and countries API',
        'Designed and developed front-end app to visualize data on a world map using Python, Postgres, JavaScript, HTML, and CSS',
        'Deployed application and Postgres database to Heroku',
      ],
    },
  ],

  volunteerExperiences: [
    {
      role: 'Engineering Lead',
      organization: 'Chicago Artist Guide',
      dateRange: '12/2020 - 06/2021',
      location: 'Chicago',
      bullets: [
        'Led the development team in creating a centralized website for the Chicago theatre community',
        'Designed the database and microservice architecture for app',
        'Interviewed and hired new developers to join our dev team',
      ],
    },
  ],

  education: [
    {
      institution: 'DePaul University',
      degree: 'Bachelor of Science - Computer Science',
      activities: [
        'The National Society of Leadership & Success',
        'The National Society of Collegiate Scholars',
        'Computer Science Society',
        'Virtual Reality Club',
      ],
    },
  ],
};

export default resumeData;

