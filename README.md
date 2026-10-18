# Resume Creator Project

A programmatic resume generation engine built with TypeScript and Node.js. It renders a clean, professional, two-column resume PDF matching the design of `CodyResume.pdf` pixel-for-pixel, with complete separation between content and presentation.

All resume content—work experience, skills, personal projects, volunteer experience, education, contact details, and the profile photo—is cleanly organized in a typed data configuration file, allowing you to update your resume in seconds without touching layout logic.

---

## 🛠 Tech Stack

- **[TypeScript](https://www.typescriptlang.org/)** – Strict typing for structured resume data models and layout configurations.
- **[Node.js](https://nodejs.org/) & [tsx](https://github.com/privatenumber/tsx)** – High-performance TypeScript execution without a separate build step.
- **[pdf-lib](https://pdf-lib.js.org/)** – Low-level PDF creation, drawing vector primitives, precise text placement, and coordinate transformations.
- **[@pdf-lib/fontkit](https://github.com/Hopding/fontkit)** – Custom TrueType font embedding for custom typography.
- **[sharp](https://sharp.pixelplumbing.com/)** – High-speed image processing for automatic circular cropping and masking of the profile photo.
- **Ubuntu Font Family** – Embedded TrueType fonts (`Ubuntu-Regular`, `Ubuntu-Bold`, `Ubuntu-Italic`) matching original typography.

---

## 📁 Project Structure

```text
Resume_Creator_Project/
├── resumeData.ts             # 📝 All resume content & types (Edit this file!)
├── resumeBuilder.ts          # ⚙️ PDF layout & rendering engine
├── profile_photo.png         # 🖼️ Profile picture (square image recommended)
├── fonts/                    # 🔤 Embedded TrueType fonts
│   ├── Ubuntu-Regular.ttf
│   ├── Ubuntu-Bold.ttf
│   └── Ubuntu-Italic.ttf
├── Cody_Nicholson_Resume.pdf # 📄 Default generated output PDF
├── CodyResume.pdf            # 🎯 Reference original PDF
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or newer recommended)
- **npm** (comes with Node.js)

### Installation

Clone the repository and install dependencies:

```bash
npm install
```

### Generating Your Resume

To build the resume using the default output path (`Cody_Nicholson_Resume.pdf`):

```bash
npm start
```

Or run `resumeBuilder.ts` directly via `tsx`:

```bash
npx tsx resumeBuilder.ts
```

### Custom Output File Name

You can specify a custom output filename as a command-line argument:

```bash
npx tsx resumeBuilder.ts My_Custom_Resume.pdf
```

---

## ✏️ Customizing Your Resume

To modify content, open [`resumeData.ts`](file:///Users/codynicholson/workspace/Resume_Creator_Project/resumeData.ts). All sections are strongly typed with TypeScript interfaces.

### 1. Contact Information & Photo

```typescript
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
  profilePhotoPath: './profile_photo.png', // Point to any PNG or JPG
}
```

> **Tip:** You can replace `profile_photo.png` or set `profilePhotoPath` to any local image. The builder automatically crops and masks the image into a circle with an accent ring.

### 2. Work Experience

```typescript
workExperiences: [
  {
    jobTitle: 'Lead Software Engineer',
    company: 'Ahold Delhaize USA',
    dateRange: '11/2024 - Present',
    location: 'Chicago', // Optional location (leave empty string if none)
    bullets: [
      'Spearheaded core software modernization by decoupling legacy systems...',
      'Drove technical strategy, evaluating next-generation AI architectures...',
    ],
  },
  // Add additional roles here
]
```

Text automatically wraps within the column width, bullet points are drawn with custom teal dots, and side-accent tabs dynamically accompany each role.

### 3. Skills

Skills are rendered as modern dark navy badge pills that automatically wrap into rows:

```typescript
skills: [
  { name: 'Java' },
  { name: 'Spring Boot' },
  { name: 'Kafka' },
  { name: 'TypeScript' },
  { name: 'ReactJs' },
  { name: 'Docker' },
]
```

### 4. Personal Projects

```typescript
personalProjects: [
  {
    title: 'ISS Tracking Application',
    bullets: [
      'Created an ETL app collecting space station and weather data...',
      'Designed and developed front-end app to visualize data...',
      'Deployed application and Postgres database to Heroku',
    ],
  },
]
```

### 5. Volunteer Experience

```typescript
volunteerExperiences: [
  {
    role: 'Engineering Lead',
    organization: 'Chicago Artist Guide',
    dateRange: '12/2020 - 06/2021',
    location: 'Chicago',
    bullets: [
      'Led the development team in creating a centralized website...',
      'Designed the database and microservice architecture...',
    ],
  },
]
```

### 6. Education & Honors

```typescript
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
]
```

---

## 🎨 Design & Style Specifications

- **Page Dimensions**: Standard US Letter (612 × 792 pt).
- **Brand Colors**:
  - `Dark Navy` (`#313C4E` / `rgb(0.192, 0.235, 0.306)`) – Name, header accents, skill badge pills.
  - `Teal` (`#449399` / `rgb(0.267, 0.576, 0.600)`) – Title, date ranges, bullet markers, photo border ring, sidebar tabs.
  - `Black` (`rgb(0, 0, 0)`) – Body text & headers.
- **Typography**: Ubuntu font family with proportional text wrapping calculations.
