const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('../models/User');
const Career = require('../models/Career');
const Skill = require('../models/Skill');
const Assessment = require('../models/Assessment');
const AssessmentResult = require('../models/AssessmentResult');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Progress = require('../models/Progress');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for Seeding...');
  } catch (err) {
    console.error(`MongoDB Connection Error: ${err.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await User.deleteMany();
    await Career.deleteMany();
    await Skill.deleteMany();
    await Assessment.deleteMany();
    await AssessmentResult.deleteMany();
    await Job.deleteMany();
    await Application.deleteMany();
    await Progress.deleteMany();

    console.log('1. Seeding Skills (35 skills)...');
    const skillsData = [
      { name: 'HTML', category: 'Frontend', difficulty: 'Beginner', description: 'Hypertext Markup Language for creating the semantic skeleton of web applications.' },
      { name: 'CSS', category: 'Frontend', difficulty: 'Beginner', description: 'Cascading Style Sheets for layout, typography, animations, and responsive responsive design.' },
      { name: 'JavaScript', category: 'Frontend', difficulty: 'Intermediate', description: 'Core programming language of the web powering asynchronous operations, DOM, and logic.' },
      { name: 'TypeScript', category: 'Frontend', difficulty: 'Intermediate', description: 'Typed superset of JavaScript enhancing code safety, refactoring, and enterprise scalability.' },
      { name: 'React', category: 'Frontend', difficulty: 'Intermediate', description: 'Declarative component-based UI library for crafting interactive single page applications.' },
      { name: 'Next.js', category: 'Frontend', difficulty: 'Advanced', description: 'Full-stack React framework providing SSR, SSG, server components, and API routing.' },
      { name: 'Redux', category: 'Frontend', difficulty: 'Intermediate', description: 'Predictable state container for JavaScript apps with centralized store and middleware.' },
      { name: 'Tailwind CSS', category: 'Frontend', difficulty: 'Beginner', description: 'Utility-first CSS framework for rapid and consistent user interface composition.' },
      { name: 'Node.js', category: 'Backend', difficulty: 'Intermediate', description: 'High-performance JavaScript runtime built on Chrome V8 engine for asynchronous server apps.' },
      { name: 'Express.js', category: 'Backend', difficulty: 'Intermediate', description: 'Fast, unopinionated, minimalist web framework for building REST APIs with Node.js.' },
      { name: 'Python', category: 'Backend', difficulty: 'Beginner', description: 'Versatile, readable programming language widely used in web backend, AI, and data science.' },
      { name: 'Django', category: 'Backend', difficulty: 'Intermediate', description: 'High-level Python web framework encouraging clean design and rapid development.' },
      { name: 'FastAPI', category: 'Backend', difficulty: 'Intermediate', description: 'Modern, fast web framework for building APIs with Python 3.8+ based on standard type hints.' },
      { name: 'Java', category: 'Backend', difficulty: 'Intermediate', description: 'Object-oriented, robust, cross-platform language powering enterprise distributed architectures.' },
      { name: 'Spring Boot', category: 'Backend', difficulty: 'Advanced', description: 'Enterprise Java framework providing production-ready opinionated scaffolding.' },
      { name: 'MongoDB', category: 'Database', difficulty: 'Intermediate', description: 'Document-oriented NoSQL database providing high flexibility, scalability, and JSON-like BSON.' },
      { name: 'SQL', category: 'Database', difficulty: 'Intermediate', description: 'Structured Query Language for querying and managing relational database management systems.' },
      { name: 'PostgreSQL', category: 'Database', difficulty: 'Intermediate', description: 'Advanced open-source relational database supporting JSONB, concurrency, and reliability.' },
      { name: 'Redis', category: 'Database', difficulty: 'Intermediate', description: 'In-memory data structure store used as a distributed database, cache, and message broker.' },
      { name: 'Git', category: 'Tools & Methodologies', difficulty: 'Beginner', description: 'Distributed version control system for tracking source code changes and collaboration.' },
      { name: 'REST APIs', category: 'Tools & Methodologies', difficulty: 'Intermediate', description: 'Architectural style for designing networked applications over standard HTTP verbs.' },
      { name: 'GraphQL', category: 'Tools & Methodologies', difficulty: 'Advanced', description: 'Query language for APIs giving clients power to request exactly what they need.' },
      { name: 'Docker', category: 'DevOps & Cloud', difficulty: 'Intermediate', description: 'Platform for developing, shipping, and running applications in lightweight containers.' },
      { name: 'Kubernetes', category: 'DevOps & Cloud', difficulty: 'Advanced', description: 'Automated container orchestration platform for deployment, scaling, and operations.' },
      { name: 'AWS', category: 'DevOps & Cloud', difficulty: 'Advanced', description: 'Cloud computing platform offering compute, storage, databases, and managed services.' },
      { name: 'CI/CD', category: 'DevOps & Cloud', difficulty: 'Intermediate', description: 'Continuous Integration & Continuous Delivery automation pipelines for rapid shipping.' },
      { name: 'Linux', category: 'DevOps & Cloud', difficulty: 'Intermediate', description: 'Open-source Unix-like operating system kernel running majority of server infrastructure.' },
      { name: 'Data Structures', category: 'Core Fundamentals', difficulty: 'Intermediate', description: 'Fundamental constructs (Trees, Graphs, Queues, Hash Tables) for organizing data.' },
      { name: 'Algorithms', category: 'Core Fundamentals', difficulty: 'Advanced', description: 'Step-by-step problem-solving techniques: Dynamic Programming, Sorting, Graph traversal.' },
      { name: 'OOP', category: 'Core Fundamentals', difficulty: 'Intermediate', description: 'Object-Oriented Programming paradigms: Encapsulation, Inheritance, Polymorphism.' },
      { name: 'Pandas', category: 'Data Science', difficulty: 'Intermediate', description: 'Python data analysis toolkit providing DataFrames for numerical tables and time series.' },
      { name: 'NumPy', category: 'Data Science', difficulty: 'Intermediate', description: 'Fundamental package for scientific computing with Python supporting multi-dimensional arrays.' },
      { name: 'Machine Learning', category: 'Data Science', difficulty: 'Advanced', description: 'Algorithms that build mathematical models based on sample training data to make predictions.' },
      { name: 'Deep Learning', category: 'Data Science', difficulty: 'Advanced', description: 'Neural network architectures modeled after human brain for computer vision and NLP.' },
      { name: 'Cybersecurity Fundamentals', category: 'Security', difficulty: 'Intermediate', description: 'Network security, authentication protocols, penetration testing, and vulnerability auditing.' },
    ];

    const insertedSkills = await Skill.insertMany(skillsData);
    console.log(`Inserted ${insertedSkills.length} skills`);

    console.log('2. Seeding Careers (11 Careers with full 7-level roadmaps)...');
    const careersData = [
      {
        title: 'MERN Stack Developer',
        category: 'Web Development',
        difficulty: 'Intermediate',
        estimatedDuration: '6 Months',
        averageSalary: '$85,000 - $130,000 / yr',
        jobOutlook: 'High Demand (22% annual growth)',
        icon: 'Layers',
        description: 'Master full-stack JavaScript development utilizing MongoDB, Express.js, React, and Node.js to engineer end-to-end scalable web applications.',
        requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Express.js', 'MongoDB', 'Git'],
        roadmap: [
          {
            level: 1,
            title: 'Fundamentals',
            description: 'Master web markup, styling layouts, and core JavaScript language mechanics.',
            skills: ['HTML', 'CSS', 'JavaScript'],
          },
          {
            level: 2,
            title: 'Frontend Frameworks',
            description: 'Build responsive reactive user interfaces using component architecture.',
            skills: ['React', 'Redux', 'Tailwind CSS'],
          },
          {
            level: 3,
            title: 'Backend Engineering',
            description: 'Implement server runtimes, REST controllers, middleware, and request pipelines.',
            skills: ['Node.js', 'Express.js'],
          },
          {
            level: 4,
            title: 'Database Architecture',
            description: 'Design flexible document schemas, indexing strategies, and aggregation pipelines.',
            skills: ['MongoDB'],
          },
          {
            level: 5,
            title: 'Full Stack Integration',
            description: 'Connect client-server auth via JWT, secure cookies, and cloud hosting.',
            skills: ['REST APIs', 'Git', 'Docker'],
          },
          {
            level: 6,
            title: 'Real-World Production Projects',
            description: 'Ship complete production-grade SaaS applications with automated testing.',
            skills: ['Next.js', 'CI/CD'],
          },
          {
            level: 7,
            title: 'Interview & Algorithms',
            description: 'Excel at technical coding interviews, system design, and computer science fundamentals.',
            skills: ['Data Structures', 'Algorithms', 'OOP'],
          },
        ],
      },
      {
        title: 'Java Developer',
        category: 'Backend Development',
        difficulty: 'Intermediate',
        estimatedDuration: '7 Months',
        averageSalary: '$90,000 - $140,000 / yr',
        jobOutlook: 'Strong & Steady',
        icon: 'Server',
        description: 'Build enterprise-grade distributed backends, microservices, and robust transaction engines using modern Java and Spring Boot ecosystems.',
        requiredSkills: ['Java', 'Spring Boot', 'SQL', 'PostgreSQL', 'Docker', 'Git', 'Data Structures', 'OOP'],
        roadmap: [
          { level: 1, title: 'Java Core', description: 'Language syntax, JVM internals, memory management.', skills: ['Java', 'OOP'] },
          { level: 2, title: 'Data Structures & Collections', description: 'Lists, Maps, Sets, and efficient algorithms.', skills: ['Data Structures', 'Algorithms'] },
          { level: 3, title: 'Relational Persistence', description: 'ACID transactions, indexing, JPA and Hibernate.', skills: ['SQL', 'PostgreSQL'] },
          { level: 4, title: 'Spring Framework', description: 'Spring Core, Dependency Injection, Spring Boot scaffolding.', skills: ['Spring Boot', 'REST APIs'] },
          { level: 5, title: 'Enterprise Microservices', description: 'Service discovery, API gateways, Redis caching.', skills: ['Redis', 'Docker'] },
          { level: 6, title: 'Cloud & Messaging', description: 'CI/CD deployment, Kafka message queues, AWS deployment.', skills: ['CI/CD', 'AWS'] },
          { level: 7, title: 'System Design & Interview', description: 'High-level architecture, scalability, concurrency.', skills: ['Linux'] },
        ],
      },
      {
        title: 'Python Developer',
        category: 'Backend & Automation',
        difficulty: 'Beginner',
        estimatedDuration: '5 Months',
        averageSalary: '$88,000 - $135,000 / yr',
        jobOutlook: 'Extremely High',
        icon: 'Terminal',
        description: 'Develop resilient APIs, automation pipelines, and data-driven systems leveraging Python, Django, FastAPI, and relational databases.',
        requiredSkills: ['Python', 'Django', 'FastAPI', 'SQL', 'PostgreSQL', 'Git', 'Docker'],
        roadmap: [
          { level: 1, title: 'Python Syntax & Idioms', description: 'OOP, generators, decorators, clean PEP 8 code.', skills: ['Python', 'OOP'] },
          { level: 2, title: 'Web Frameworks', description: 'FastAPI async routing, Django ORM and Admin.', skills: ['FastAPI', 'Django'] },
          { level: 3, title: 'Databases & ORM', description: 'SQL querying, schema migrations, connection pooling.', skills: ['SQL', 'PostgreSQL'] },
          { level: 4, title: 'API Security & Auth', description: 'OAuth2, JWT authentication, rate limiting.', skills: ['REST APIs', 'Git'] },
          { level: 5, title: 'Containerization & Caching', description: 'Packaging applications in Docker, Redis caching.', skills: ['Docker', 'Redis'] },
          { level: 6, title: 'DevOps & Cloud', description: 'Deploying to AWS, continuous integration.', skills: ['AWS', 'CI/CD'] },
          { level: 7, title: 'Advanced Performance', description: 'Multiprocessing, asyncio, architectural design.', skills: ['Data Structures', 'Algorithms'] },
        ],
      },
      {
        title: 'Frontend Developer',
        category: 'Web Development',
        difficulty: 'Beginner',
        estimatedDuration: '5 Months',
        averageSalary: '$80,000 - $125,000 / yr',
        jobOutlook: 'Rapid Expansion',
        icon: 'Layout',
        description: 'Design visually stunning, lightning-fast, and accessible web experiences using modern HTML, CSS, JavaScript, React, and Next.js.',
        requiredSkills: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Tailwind CSS', 'Git'],
        roadmap: [
          { level: 1, title: 'Core Web Foundation', description: 'Semantic HTML5, CSS Flexbox/Grid, Responsive Design.', skills: ['HTML', 'CSS'] },
          { level: 2, title: 'Modern JavaScript', description: 'ES6+, DOM Manipulation, Async/Await, Fetch.', skills: ['JavaScript', 'Git'] },
          { level: 3, title: 'Type Safety & Styling', description: 'TypeScript typing, utility-first CSS design systems.', skills: ['TypeScript', 'Tailwind CSS'] },
          { level: 4, title: 'Component Architecture', description: 'React hooks, custom hooks, component lifecycles.', skills: ['React'] },
          { level: 5, title: 'Advanced State Management', description: 'Zustand, Redux Toolkit, Context API, React Query.', skills: ['Redux'] },
          { level: 6, title: 'Modern Server Components', description: 'Next.js App Router, SSR, SEO optimization.', skills: ['Next.js', 'REST APIs'] },
          { level: 7, title: 'Performance & Frontend System Design', description: 'Web Vitals, bundle optimization, UI accessibility.', skills: ['Algorithms'] },
        ],
      },
      {
        title: 'Backend Developer',
        category: 'Backend Development',
        difficulty: 'Intermediate',
        estimatedDuration: '6 Months',
        averageSalary: '$92,000 - $145,000 / yr',
        jobOutlook: 'High Demand',
        icon: 'Database',
        description: 'Engineer high-throughput server backends, database models, caching strategies, and secure authorization layers.',
        requiredSkills: ['Node.js', 'Express.js', 'Python', 'SQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'Git'],
        roadmap: [
          { level: 1, title: 'Server Fundamentals', description: 'HTTP/HTTPS protocols, sockets, async I/O.', skills: ['Node.js', 'Python'] },
          { level: 2, title: 'API Frameworks', description: 'Express and FastAPI microservices.', skills: ['Express.js', 'REST APIs'] },
          { level: 3, title: 'Relational & Document Databases', description: 'Complex joins, indexing, replication.', skills: ['SQL', 'PostgreSQL', 'MongoDB'] },
          { level: 4, title: 'In-Memory Caching & Queues', description: 'Redis key-value patterns, pub/sub messaging.', skills: ['Redis'] },
          { level: 5, title: 'Containerization & Infrastructure', description: 'Dockerizing services, multi-stage builds.', skills: ['Docker', 'Linux'] },
          { level: 6, title: 'Cloud Deployments', description: 'AWS EC2, S3, RDS, load balancing.', skills: ['AWS', 'CI/CD'] },
          { level: 7, title: 'Distributed Systems & Scalability', description: 'CAP theorem, horizontal scaling, rate limiting.', skills: ['Data Structures', 'Algorithms'] },
        ],
      },
      {
        title: 'Full Stack Developer',
        category: 'Web Development',
        difficulty: 'Advanced',
        estimatedDuration: '8 Months',
        averageSalary: '$95,000 - $150,000 / yr',
        jobOutlook: 'Very High Demand',
        icon: 'Layers',
        description: 'Bridge client and server development seamlessly with mastery over frontend frameworks, backend runtimes, databases, and DevOps.',
        requiredSkills: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'Express.js', 'PostgreSQL', 'Docker', 'Git'],
        roadmap: [
          { level: 1, title: 'Web Foundations', description: 'Full frontend semantics and JavaScript engine basics.', skills: ['HTML', 'CSS', 'JavaScript'] },
          { level: 2, title: 'Frontend Mastery', description: 'Component architecture, responsive UI, TypeScript.', skills: ['React', 'TypeScript', 'Tailwind CSS'] },
          { level: 3, title: 'Backend Mastery', description: 'REST APIs, server routing, middleware.', skills: ['Node.js', 'Express.js'] },
          { level: 4, title: 'Database Engineering', description: 'Relational database modeling and queries.', skills: ['SQL', 'PostgreSQL', 'MongoDB'] },
          { level: 5, title: 'DevOps & Containers', description: 'Dockerizing full-stack stacks and orchestrating.', skills: ['Docker', 'Git'] },
          { level: 6, title: 'Cloud Architecture', description: 'Continuous deployment to cloud providers.', skills: ['AWS', 'CI/CD'] },
          { level: 7, title: 'System Architecture', description: 'Scalability, microservices vs monoliths, caching.', skills: ['Redis', 'Data Structures'] },
        ],
      },
      {
        title: 'Data Analyst',
        category: 'Data Science',
        difficulty: 'Beginner',
        estimatedDuration: '4 Months',
        averageSalary: '$72,000 - $110,000 / yr',
        jobOutlook: 'Strong Growth',
        icon: 'BarChart',
        description: 'Transform complex business datasets into actionable strategic intelligence with Python, SQL, statistical modeling, and dashboards.',
        requiredSkills: ['Python', 'SQL', 'Pandas', 'NumPy', 'Git'],
        roadmap: [
          { level: 1, title: 'Spreadsheet & SQL Core', description: 'Relational queries, window functions, aggregates.', skills: ['SQL'] },
          { level: 2, title: 'Python for Analytics', description: 'Scripting, loops, functions, data manipulation.', skills: ['Python'] },
          { level: 3, title: 'Data Cleaning & Manipulation', description: 'Filtering, merging, handling nulls with Pandas.', skills: ['Pandas', 'NumPy'] },
          { level: 4, title: 'Data Visualization & Storytelling', description: 'Plotting distributions, business KPIs, charts.', skills: ['Git'] },
          { level: 5, title: 'Statistical Analysis', description: 'Hypothesis testing, probability, correlation.', skills: ['Algorithms'] },
          { level: 6, title: 'Advanced Business Intelligence', description: 'Dashboards, reporting automation.', skills: ['PostgreSQL'] },
          { level: 7, title: 'Portfolio & Case Studies', description: 'Real-world business case analyses.', skills: ['Linux'] },
        ],
      },
      {
        title: 'Data Scientist',
        category: 'Data Science',
        difficulty: 'Advanced',
        estimatedDuration: '8 Months',
        averageSalary: '$105,000 - $165,000 / yr',
        jobOutlook: 'Exceptional Demand',
        icon: 'Brain',
        description: 'Harness statistics, machine learning models, and deep neural networks to extract predictive insights from big data.',
        requiredSkills: ['Python', 'SQL', 'Pandas', 'NumPy', 'Machine Learning', 'Deep Learning', 'Data Structures'],
        roadmap: [
          { level: 1, title: 'Mathematical & Programming Core', description: 'Linear algebra, calculus, Python data structures.', skills: ['Python', 'NumPy'] },
          { level: 2, title: 'Data Wrangling & Feature Engineering', description: 'Pandas DataFrames, exploratory data analysis.', skills: ['Pandas', 'SQL'] },
          { level: 3, title: 'Supervised & Unsupervised ML', description: 'Regression, classification, clustering, Scikit-Learn.', skills: ['Machine Learning'] },
          { level: 4, title: 'Deep Learning & Neural Networks', description: 'PyTorch, TensorFlow, backpropagation.', skills: ['Deep Learning'] },
          { level: 5, title: 'Model Evaluation & Tuning', description: 'Cross validation, hyperparameter search, metrics.', skills: ['Algorithms'] },
          { level: 6, title: 'MLOps & Deployment', description: 'Containerizing ML models into REST endpoints.', skills: ['Docker', 'FastAPI'] },
          { level: 7, title: 'Research & Industry Specialization', description: 'Computer vision, NLP transformers, large models.', skills: ['AWS'] },
        ],
      },
      {
        title: 'Cloud Engineer',
        category: 'Cloud & Infrastructure',
        difficulty: 'Intermediate',
        estimatedDuration: '6 Months',
        averageSalary: '$98,000 - $155,000 / yr',
        jobOutlook: 'Very High Demand',
        icon: 'Cloud',
        description: 'Design, configure, and maintain highly available, fault-tolerant cloud infrastructures on AWS, container platforms, and Linux.',
        requiredSkills: ['AWS', 'Linux', 'Docker', 'Kubernetes', 'CI/CD', 'Git', 'Python'],
        roadmap: [
          { level: 1, title: 'Operating Systems & Networking', description: 'Linux CLI, bash scripting, DNS, TCP/IP, VPCs.', skills: ['Linux', 'Git'] },
          { level: 2, title: 'Cloud Infrastructure Core', description: 'AWS EC2, S3, IAM policies, security groups.', skills: ['AWS'] },
          { level: 3, title: 'Containers & Microservices', description: 'Building Docker images, container registries.', skills: ['Docker'] },
          { level: 4, title: 'Container Orchestration', description: 'Kubernetes Pods, Services, Deployments, Helm.', skills: ['Kubernetes'] },
          { level: 5, title: 'Infrastructure as Code', description: 'Terraform, CloudFormation, automated provisioning.', skills: ['CI/CD'] },
          { level: 6, title: 'Cloud Automation Scripting', description: 'Python Boto3, Lambda serverless triggers.', skills: ['Python'] },
          { level: 7, title: 'Site Reliability & Disaster Recovery', description: 'Monitoring, high availability, backup plans.', skills: ['REST APIs'] },
        ],
      },
      {
        title: 'DevOps Engineer',
        category: 'Cloud & Infrastructure',
        difficulty: 'Advanced',
        estimatedDuration: '7 Months',
        averageSalary: '$102,000 - $160,000 / yr',
        jobOutlook: 'Rapidly Growing',
        icon: 'Cpu',
        description: 'Automate build, test, and release pipelines while ensuring reliability, observability, and infrastructure scalability.',
        requiredSkills: ['Linux', 'Git', 'Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Python'],
        roadmap: [
          { level: 1, title: 'Linux Administration & Shell', description: 'System administration, SSH, cron jobs, network utilities.', skills: ['Linux', 'Git'] },
          { level: 2, title: 'Container Ecosystem', description: 'Docker container virtualization and networking.', skills: ['Docker'] },
          { level: 3, title: 'CI/CD Pipelines', description: 'GitHub Actions, Jenkins, automated testing pipelines.', skills: ['CI/CD'] },
          { level: 4, title: 'Orchestration at Scale', description: 'Kubernetes clusters, autoscaling, ingress.', skills: ['Kubernetes'] },
          { level: 5, title: 'Cloud Provisioning', description: 'AWS infrastructure, load balancers, RDS.', skills: ['AWS'] },
          { level: 6, title: 'Observability & Monitoring', description: 'Prometheus, Grafana, logging aggregations.', skills: ['Python'] },
          { level: 7, title: 'Security & DevSecOps', description: 'Vulnerability scanners, secret management.', skills: ['Cybersecurity Fundamentals'] },
        ],
      },
      {
        title: 'Cybersecurity Engineer',
        category: 'Security',
        difficulty: 'Advanced',
        estimatedDuration: '8 Months',
        averageSalary: '$100,000 - $160,000 / yr',
        jobOutlook: 'Extreme Demand (35% growth)',
        icon: 'Shield',
        description: 'Safeguard digital assets, networks, cloud environments, and applications against sophisticated threat actors and vulnerabilities.',
        requiredSkills: ['Linux', 'Cybersecurity Fundamentals', 'Python', 'AWS', 'Docker', 'Git'],
        roadmap: [
          { level: 1, title: 'Network Security Fundamentals', description: 'OSI model, packet inspection, firewalls, TLS/SSL.', skills: ['Cybersecurity Fundamentals'] },
          { level: 2, title: 'Systems & OS Hardening', description: 'Linux system internals, privilege escalation prevention.', skills: ['Linux'] },
          { level: 3, title: 'Security Automation & Scripting', description: 'Python scripts for vulnerability scanning.', skills: ['Python', 'Git'] },
          { level: 4, title: 'Application Security (AppSec)', description: 'OWASP Top 10, SQL injection, XSS defense.', skills: ['REST APIs'] },
          { level: 5, title: 'Cloud Security Architecture', description: 'AWS IAM principle of least privilege, audit logs.', skills: ['AWS'] },
          { level: 6, title: 'Incident Response & Threat Hunting', description: 'SIEM tools, log analysis, intrusion detection.', skills: ['Docker'] },
          { level: 7, title: 'Penetration Testing & Auditing', description: 'Ethical hacking methodologies, compliance.', skills: ['Algorithms'] },
        ],
      },
    ];

    const insertedCareers = await Career.insertMany(careersData);
    console.log(`Inserted ${insertedCareers.length} careers`);

    console.log('3. Seeding Assessment Questions (8 Assessments, 57 Questions)...');
    const assessmentsData = [
      {
        title: 'JavaScript Core Proficiency',
        skill: 'JavaScript',
        difficulty: 'Intermediate',
        durationMinutes: 15,
        description: 'Evaluate your understanding of closures, asynchronous events, prototypes, and ES6+ features.',
        questions: [
          {
            questionText: 'What is the output of `typeof NaN` in JavaScript?',
            options: ['"number"', '"nan"', '"undefined"', '"object"'],
            correctAnswer: 0,
            explanation: 'In JavaScript, NaN (Not-a-Number) is technically of type number according to IEEE 754 floating point standard.',
          },
          {
            questionText: 'Which keyword creates a block-scoped variable that cannot be reassigned?',
            options: ['var', 'let', 'const', 'static'],
            correctAnswer: 2,
            explanation: 'const creates a block-scoped variable whose identifier cannot be reassigned.',
          },
          {
            questionText: 'What does the Event Loop in JavaScript do?',
            options: [
              'Executes SQL queries concurrently',
              'Monitors Call Stack and Task Queue to schedule async callbacks',
              'Compiles JavaScript code to machine instructions',
              'Allocates heap memory directly to the CPU'
            ],
            correctAnswer: 1,
            explanation: 'The event loop continuously checks if the call stack is empty and pushes callbacks from the callback/microtask queue onto it.',
          },
          {
            questionText: 'What will `[1, 2, 3] + [4, 5, 6]` evaluate to in JavaScript?',
            options: ['[1, 2, 3, 4, 5, 6]', '"1,2,34,5,6"', 'NaN', 'TypeError'],
            correctAnswer: 1,
            explanation: 'When using the + operator with arrays, JavaScript converts both arrays to strings and concatenates them: "1,2,3" + "4,5,6" = "1,2,34,5,6".',
          },
          {
            questionText: 'What does the Promise.all() method return if one of the promises rejects?',
            options: [
              'An array of results ignoring the rejected promise',
              'Immediately rejects with the reason of the first rejected promise',
              'Waits for all other promises to resolve first',
              'Returns undefined'
            ],
            correctAnswer: 1,
            explanation: 'Promise.all rejects immediately upon any input promise rejecting (fail-fast behavior).',
          },
          {
            questionText: 'Which function creates a new function with a permanently bound `this` value?',
            options: ['call()', 'apply()', 'bind()', 'attach()'],
            correctAnswer: 2,
            explanation: 'The bind() method returns a new copy of the function with its `this` keyword permanently bound.',
          },
          {
            questionText: 'What is a Closure in JavaScript?',
            options: [
              'A syntax for immediately terminating a loop',
              'A function bundled together with references to its lexical environment',
              'A method to close an open WebSocket connection',
              'A tool for minifying code'
            ],
            correctAnswer: 1,
            explanation: 'A closure is the combination of a function bundled together with references to its surrounding state (lexical environment).',
          },
        ],
      },
      {
        title: 'React Fundamentals & Hooks',
        skill: 'React',
        difficulty: 'Intermediate',
        durationMinutes: 15,
        description: 'Test your grasp of virtual DOM, useEffect dependencies, custom hooks, and state management.',
        questions: [
          {
            questionText: 'What is the primary benefit of the React Virtual DOM?',
            options: [
              'Directly accelerates GPU rendering in the browser',
              'Minimizes costly real DOM manipulations via efficient reconciliation/diffing',
              'Replaces HTML with proprietary bytecode',
              'Enables multithreaded JavaScript in workers'
            ],
            correctAnswer: 1,
            explanation: 'Virtual DOM computes the minimal set of real DOM mutations necessary using reconciliation algorithms.',
          },
          {
            questionText: 'What occurs if `useEffect` is passed an empty dependency array `[]`?',
            options: [
              'It runs on every single render cycle',
              'It runs only once after the initial component mount',
              'It causes an infinite loop',
              'It never runs'
            ],
            correctAnswer: 1,
            explanation: 'An empty dependency array indicates the effect does not depend on any props or state, running only on mount and unmount.',
          },
          {
            questionText: 'Why should you provide a unique `key` prop when rendering lists in React?',
            options: [
              'Required by CSS for selector identification',
              'Helps React identify which items have changed, been added, or removed',
              'Encrypts item data inside the browser memory',
              'Automatically sorts items alphabetically'
            ],
            correctAnswer: 1,
            explanation: 'Keys give elements a stable identity across renders so React can reorder or update without re-rendering the entire list.',
          },
          {
            questionText: 'What is the purpose of the `useCallback` hook in React?',
            options: [
              'Caches the result of a computationally heavy calculation',
              'Returns a memoized version of a callback function that only changes when dependencies change',
              'Executes an asynchronous HTTP request',
              'Creates an unmanaged ref to a DOM node'
            ],
            correctAnswer: 1,
            explanation: 'useCallback memoizes function references to prevent unnecessary child re-renders.',
          },
          {
            questionText: 'What happens when state is updated using `setState` or `useState` setter?',
            options: [
              'Page reloads immediately',
              'Component schedules a re-render with the new state value',
              'DOM is frozen until garbage collection completes',
              'Existing variables in the parent component are erased'
            ],
            correctAnswer: 1,
            explanation: 'React schedules a re-render of the component and its children with the updated state.',
          },
          {
            questionText: 'What rule must you follow when using React Hooks?',
            options: [
              'Hooks must only be called at the top level, never inside loops, conditions, or nested functions',
              'Hooks must be declared in external XML files',
              'Hooks can only be used in class components',
              'Hooks must take at least three arguments'
            ],
            correctAnswer: 0,
            explanation: 'Hooks must be called at top-level to guarantee that hooks are called in the exact same order on every render.',
          },
          {
            questionText: 'What is the purpose of `React.memo`?',
            options: [
              'Monitors memory leaks in React native',
              'Higher-order component that skips rendering a component if its props have not changed',
              'Connects a component to Redux store',
              'Automatically fetches data on route change'
            ],
            correctAnswer: 1,
            explanation: 'React.memo is a higher order component that performs a shallow comparison of props to skip re-rendering.',
          },
        ],
      },
      {
        title: 'Node.js & Express Architecture',
        skill: 'Node.js',
        difficulty: 'Intermediate',
        durationMinutes: 15,
        description: 'Verify your proficiency in the Node runtime, non-blocking I/O, event emitters, and middleware.',
        questions: [
          {
            questionText: 'What library underpins Node.js event-driven, non-blocking asynchronous I/O?',
            options: ['libuv', 'V8', 'Babel', 'Webpack'],
            correctAnswer: 0,
            explanation: 'libuv is the multi-platform C library that handles the event loop, thread pool, and asynchronous I/O in Node.js.',
          },
          {
            questionText: 'In Express, what is the role of `next()` in a middleware function?',
            options: [
              'Sends the final HTTP response to the client',
              'Passes control to the next middleware or route handler in the stack',
              'Restarts the Express application server',
              'Rolls back active database transactions'
            ],
            correctAnswer: 1,
            explanation: 'Calling next() hands execution over to the subsequent middleware function in the pipeline.',
          },
          {
            questionText: 'Which HTTP status code should be returned when a resource is successfully created?',
            options: ['200 OK', '201 Created', '204 No Content', '302 Found'],
            correctAnswer: 1,
            explanation: 'HTTP 201 Created indicates that the request has succeeded and led to the creation of a new resource.',
          },
          {
            questionText: 'How does Node.js handle CPU-heavy operations without blocking the event loop?',
            options: [
              'Runs everything on the main thread automatically',
              'Using Worker Threads or delegating to child processes',
              'Allocating more virtual RAM',
              'Compressing files with Gzip'
            ],
            correctAnswer: 1,
            explanation: 'CPU-intensive operations can be offloaded to Worker Threads or separate child processes to keep the event loop responsive.',
          },
          {
            questionText: 'Which module in Node.js core handles file system read and write operations?',
            options: ['http', 'fs', 'path', 'os'],
            correctAnswer: 1,
            explanation: 'The `fs` (File System) module allows interacting with the file system asynchronously and synchronously.',
          },
          {
            questionText: 'What is CORS in web servers?',
            options: [
              'A mechanism that uses additional HTTP headers to tell browsers to give a web app access to resources from a different origin',
              'A database indexing algorithm',
              'A compression format for JSON responses',
              'A CPU caching protocol'
            ],
            correctAnswer: 0,
            explanation: 'CORS (Cross-Origin Resource Sharing) controls whether browsers allow scripts to access resources across different origins.',
          },
          {
            questionText: 'How do you securely store passwords in a database with Node.js?',
            options: [
              'Base64 encode the password string',
              'Hash with a cryptographic salting algorithm like bcrypt or argon2',
              'Store as AES encrypted text with the key in source code',
              'Store as plain text with SSL connection'
            ],
            correctAnswer: 1,
            explanation: 'bcrypt with salted hashes protects against rainbow tables and brute force attacks.',
          },
        ],
      },
      {
        title: 'MongoDB & NoSQL Data Modeling',
        skill: 'MongoDB',
        difficulty: 'Intermediate',
        durationMinutes: 15,
        description: 'Assess schema design, embedded vs referenced models, Mongoose hooks, and aggregation.',
        questions: [
          {
            questionText: 'In MongoDB, what format is used to physically store documents on disk?',
            options: ['JSON', 'BSON (Binary JSON)', 'XML', 'CSV'],
            correctAnswer: 1,
            explanation: 'MongoDB stores documents in BSON, a binary serialization format that supports additional data types like Date and raw binary.',
          },
          {
            questionText: 'Which MongoDB aggregation stage is used to filter documents in a pipeline?',
            options: ['$project', '$match', '$group', '$filter'],
            correctAnswer: 1,
            explanation: '$match filters the documents to pass only those matching specified conditions into the next pipeline stage.',
          },
          {
            questionText: 'What is the purpose of an index in MongoDB?',
            options: [
              'To reduce memory usage on disk',
              'To dramatically improve query performance by avoiding full collection scans',
              'To validate required fields in schemas',
              'To encrypt document data'
            ],
            correctAnswer: 1,
            explanation: 'Indexes store a small portion of the collection data set in an easy to traverse form, speeding up query execution.',
          },
          {
            questionText: 'In Mongoose, which method finds a document by its ID and updates it in one step?',
            options: ['findByIdAndUpdate()', 'modifyById()', 'updateById()', 'saveById()'],
            correctAnswer: 0,
            explanation: 'findByIdAndUpdate() locates a document by _id and issues a MongoDB update command.',
          },
          {
            questionText: 'When is referencing preferred over embedding in MongoDB schema design?',
            options: [
              'When child data is small and rarely accessed independently',
              'When the relationship is one-to-many with unbounded growth (e.g. thousands of comments/logs)',
              'Always in every single situation',
              'Never, referencing is not supported'
            ],
            correctAnswer: 1,
            explanation: 'Referencing prevents exceeding the 16MB document size limit when relationships grow unbounded.',
          },
          {
            questionText: 'What is the default unique identifier field generated automatically for each MongoDB document?',
            options: ['id', '_id (ObjectId)', 'uuid', 'primaryKey'],
            correctAnswer: 1,
            explanation: '_id is the default 12-byte BSON ObjectId generated for every document.',
          },
          {
            questionText: 'What does the `$lookup` stage in MongoDB aggregation do?',
            options: [
              'Performs a left outer join to an unsharded collection in the same database',
              'Searches for words in a text index',
              'Deletes matching documents',
              'Paginates output'
            ],
            correctAnswer: 0,
            explanation: '$lookup performs a left outer join to combine documents from another collection.',
          },
        ],
      },
      {
        title: 'SQL & Relational Database Design',
        skill: 'SQL',
        difficulty: 'Intermediate',
        durationMinutes: 15,
        description: 'Test your understanding of joins, normalization, transactions, and group by aggregations.',
        questions: [
          {
            questionText: 'Which JOIN returns all rows from the left table and matched rows from the right table?',
            options: ['INNER JOIN', 'LEFT JOIN (LEFT OUTER JOIN)', 'RIGHT JOIN', 'CROSS JOIN'],
            correctAnswer: 1,
            explanation: 'LEFT JOIN returns all records from the left table, and matching records from the right table (or NULLs if no match).',
          },
          {
            questionText: 'What is the purpose of the HAVING clause in SQL?',
            options: [
              'Filters rows before grouping takes place',
              'Filters grouped rows produced by a GROUP BY clause based on aggregate conditions',
              'Sorts the result set ascending or descending',
              'Limits the maximum number of rows returned'
            ],
            correctAnswer: 1,
            explanation: 'HAVING specifies filter conditions for groups of rows, typically used with aggregate functions like COUNT or AVG.',
          },
          {
            questionText: 'What does the "A" in ACID database transactions stand for?',
            options: ['Accuracy', 'Atomicity', 'Availability', 'Authentication'],
            correctAnswer: 1,
            explanation: 'Atomicity ensures that all statements in a transaction either complete entirely or roll back completely.',
          },
          {
            questionText: 'Which SQL command is used to add a new column to an existing table?',
            options: ['MODIFY TABLE ... ADD', 'ALTER TABLE ... ADD COLUMN', 'UPDATE TABLE ... INSERT', 'CHANGE TABLE ... NEW'],
            correctAnswer: 1,
            explanation: 'ALTER TABLE table_name ADD COLUMN column_name datatype is standard SQL syntax.',
          },
          {
            questionText: 'What is a Foreign Key in relational databases?',
            options: [
              'A key imported from an external server',
              'A field that uniquely identifies records in another table to enforce referential integrity',
              'An encrypted password column',
              'A composite primary key'
            ],
            correctAnswer: 1,
            explanation: 'A Foreign Key points to a Primary Key in another table to maintain referential integrity.',
          },
          {
            questionText: 'Which aggregate function calculates the total number of rows satisfying a condition?',
            options: ['SUM()', 'TOTAL()', 'COUNT()', 'MAX()'],
            correctAnswer: 2,
            explanation: 'COUNT() returns the number of rows that match specified criteria.',
          },
          {
            questionText: 'What is Database Normalization primarily intended to eliminate?',
            options: ['SQL injection vulnerabilities', 'Data redundancy and undesirable update anomalies', 'Indexes', 'Foreign keys'],
            correctAnswer: 1,
            explanation: 'Normalization organizes columns and tables to reduce data duplication and prevent anomalies.',
          },
        ],
      },
      {
        title: 'Python Programming Essentials',
        skill: 'Python',
        difficulty: 'Beginner',
        durationMinutes: 15,
        description: 'Evaluate your knowledge of Python types, list comprehensions, decorators, and memory model.',
        questions: [
          {
            questionText: 'Which of the following data structures in Python is immutable?',
            options: ['List', 'Dictionary', 'Tuple', 'Set'],
            correctAnswer: 2,
            explanation: 'Tuples are immutable sequences in Python; their elements cannot be modified once created.',
          },
          {
            questionText: 'What does a List Comprehension `[x**2 for x in range(5) if x % 2 == 0]` output?',
            options: ['[0, 4, 16]', '[1, 9]', '[0, 1, 4, 9, 16]', '[4, 16]'],
            correctAnswer: 0,
            explanation: 'range(5) produces 0, 1, 2, 3, 4. Even numbers are 0, 2, 4. Squared: 0, 4, 16.',
          },
          {
            questionText: 'What is the purpose of `*args` and `**kwargs` in a Python function definition?',
            options: [
              'To declare pointers to C libraries',
              'To allow a function to accept arbitrary positional and keyword arguments respectively',
              'To define global constants',
              'To import external dependencies'
            ],
            correctAnswer: 1,
            explanation: '*args receives variable positional arguments as a tuple; **kwargs receives variable keyword arguments as a dict.',
          },
          {
            questionText: 'What is the `@decorator` syntax in Python used for?',
            options: [
              'To style console output with colors',
              'To modify or extend the behavior of a function or class without permanently modifying its code',
              'To import standard library modules',
              'To mark variables as private'
            ],
            correctAnswer: 1,
            explanation: 'A decorator is a callable that takes another function as an argument, extending its behavior cleanly.',
          },
          {
            questionText: 'How is memory managed in Python?',
            options: [
              'Manual malloc() and free() calls',
              'Reference counting combined with a generational garbage collector',
              'Direct hardware memory registers',
              'No memory management is performed'
            ],
            correctAnswer: 1,
            explanation: 'Python uses automatic reference counting augmented by cyclic garbage collection.',
          },
          {
            questionText: 'What does the `yield` statement do in a Python function?',
            options: [
              'Pauses function execution and returns a generator iterator',
              'Throws an uncaught exception',
              'Immediately ends the entire Python process',
              'Returns None and breaks out of loops'
            ],
            correctAnswer: 0,
            explanation: 'yield turns a function into a generator that lazily produces values one by one on demand.',
          },
          {
            questionText: 'What is the difference between `==` and `is` in Python?',
            options: [
              'They are completely identical',
              '`==` checks for equality of value, while `is` checks for object identity in memory',
              '`is` is for numbers only',
              '`==` only works on strings'
            ],
            correctAnswer: 1,
            explanation: '== compares values for equality, whereas `is` checks whether two variables refer to the exact same object in memory.',
          },
        ],
      },
      {
        title: 'Java & Object-Oriented Principles',
        skill: 'Java',
        difficulty: 'Intermediate',
        durationMinutes: 15,
        description: 'Verify your proficiency in Java memory, inheritance, polymorphism, interfaces, and collections.',
        questions: [
          {
            questionText: 'Which pillar of OOP is demonstrated when a subclass provides a specific implementation of a method declared in its parent class?',
            options: ['Encapsulation', 'Polymorphism (Method Overriding)', 'Abstraction', 'Composition'],
            correctAnswer: 1,
            explanation: 'Method overriding is a classic form of runtime polymorphism in object-oriented programming.',
          },
          {
            questionText: 'What is the primary difference between `String`, `StringBuilder`, and `StringBuffer` in Java?',
            options: [
              'String is mutable; others are immutable',
              'String is immutable; StringBuilder is mutable (non-thread-safe); StringBuffer is mutable and thread-safe (synchronized)',
              'StringBuilder is an abstract class',
              'There is no performance difference'
            ],
            correctAnswer: 1,
            explanation: 'String is immutable, StringBuilder offers fast unsynchronized mutation, and StringBuffer provides synchronized thread safety.',
          },
          {
            questionText: 'Where are objects allocated in Java memory?',
            options: ['Stack', 'Heap', 'CPU Registers', 'Static segment only'],
            correctAnswer: 1,
            explanation: 'In Java, all objects and array instances are dynamically allocated on the Heap.',
          },
          {
            questionText: 'Can an interface in Java 8+ have concrete method implementations?',
            options: [
              'No, interfaces can never have code',
              'Yes, using default and static methods',
              'Only if declared private',
              'Only in abstract classes'
            ],
            correctAnswer: 1,
            explanation: 'Java 8 introduced `default` and `static` methods inside interfaces to allow backward-compatible API evolution.',
          },
          {
            questionText: 'Which collection class in Java allows key-value pairs and does NOT maintain insertion order?',
            options: ['ArrayList', 'HashMap', 'TreeMap', 'LinkedHashMap'],
            correctAnswer: 1,
            explanation: 'HashMap stores key-value pairs using hash buckets without guaranteeing any specific iteration order.',
          },
          {
            questionText: 'What is the effect of the `final` keyword when applied to a class in Java?',
            options: [
              'The class cannot be instantiated',
              'The class cannot be subclassed (inherited from)',
              'All methods are automatically private',
              'The class runs in single-threaded mode'
            ],
            correctAnswer: 1,
            explanation: 'A final class cannot be extended by any other class (e.g. java.lang.String is final).',
          },
          {
            questionText: 'What exception is thrown when an application attempts to use `null` in an object reference?',
            options: ['IllegalArgumentException', 'NullPointerException', 'ClassCastException', 'IndexOutOfBoundsException'],
            correctAnswer: 1,
            explanation: 'NullPointerException is thrown when attempting to invoke a method or access a field on a null reference.',
          },
        ],
      },
      {
        title: 'HTML5 & Modern CSS Layouts',
        skill: 'HTML',
        difficulty: 'Beginner',
        durationMinutes: 15,
        description: 'Assess modern semantic tags, CSS Flexbox, Grid, box-sizing, and responsive media queries.',
        questions: [
          {
            questionText: 'What does CSS `box-sizing: border-box` do?',
            options: [
              'Adds a visible border around all HTML elements',
              'Includes padding and border within the specified element total width and height',
              'Ignores margins completely',
              'Forces elements into table layout'
            ],
            correctAnswer: 1,
            explanation: 'border-box makes width and height calculations predictable by incorporating padding and border into the element dimensions.',
          },
          {
            questionText: 'Which CSS Flexbox property controls alignment along the main axis?',
            options: ['align-items', 'justify-content', 'align-content', 'flex-direction'],
            correctAnswer: 1,
            explanation: 'justify-content aligns flex items along the main axis (horizontal by default in row layout).',
          },
          {
            questionText: 'Which HTML5 semantic element is most appropriate for independent, self-contained syndicatable content?',
            options: ['<section>', '<article>', '<aside>', '<div>'],
            correctAnswer: 1,
            explanation: '<article> represents an independent piece of content, such as a blog post or news item.',
          },
          {
            questionText: 'What CSS rule applies styles when the browser viewport width is 768px or less?',
            options: [
              '@media (max-width: 768px) { ... }',
              '@screen (width <= 768px) { ... }',
              '@viewport: 768px { ... }',
              '@media screen-small { ... }'
            ],
            correctAnswer: 0,
            explanation: '@media (max-width: 768px) is the standard CSS media query syntax for responsive breakpoints.',
          },
          {
            questionText: 'What is the purpose of the HTML `<meta name="viewport" content="width=device-width, initial-scale=1.0">` tag?',
            options: [
              'Sets the background image size',
              'Ensures proper viewport scaling and responsive rendering on mobile devices',
              'Forces 4K resolution on desktop',
              'Disables pinch-to-zoom'
            ],
            correctAnswer: 1,
            explanation: 'The viewport meta tag tells mobile browsers how to control the pages dimensions and scaling.',
          },
          {
            questionText: 'In CSS Grid, what does `grid-template-columns: repeat(3, 1fr)` specify?',
            options: [
              '3 columns each taking 100px',
              '3 equal columns each occupying 1 fraction of the available free space',
              '3 rows of variable height',
              'A fixed 300px table'
            ],
            correctAnswer: 1,
            explanation: 'repeat(3, 1fr) creates three equal columns that flexibly share available grid container space.',
          },
          {
            questionText: 'Which CSS position value removes an element from normal document flow and positions it relative to its closest positioned ancestor?',
            options: ['relative', 'absolute', 'fixed', 'static'],
            correctAnswer: 1,
            explanation: 'position: absolute removes the element from flow and offsets it relative to its nearest non-static ancestor.',
          },
        ],
      },
    ];

    const insertedAssessments = await Assessment.insertMany(assessmentsData);
    console.log(`Inserted ${insertedAssessments.length} assessments with comprehensive questions`);

    console.log('4. Seeding Jobs (22 realistic industry jobs)...');
    const jobsData = [
      {
        title: 'Full Stack MERN Developer',
        company: 'Veloce Labs',
        location: 'Remote',
        jobType: 'Full-Time',
        salary: '$95,000 - $130,000',
        experience: '1-3 Years',
        description: 'Join our agile core engineering team building scalable SaaS dashboards using React, Node.js, Express, and MongoDB.',
        requiredSkills: ['React', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript', 'Git'],
        applicationUrl: 'https://veloce.careers/jobs/mern-dev',
      },
      {
        title: 'Junior React Frontend Engineer',
        company: 'PixelCraft Digital',
        location: 'Bangalore, India (Hybrid)',
        jobType: 'Full-Time',
        salary: '₹8,00,000 - ₹14,00,000',
        experience: '0-2 Years',
        description: 'Looking for a passionate React enthusiast to create delightful user interfaces, dynamic micro-interactions, and performant web apps.',
        requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'Tailwind CSS', 'Git'],
        applicationUrl: 'https://pixelcraft.io/careers/junior-frontend',
      },
      {
        title: 'Backend Node.js Engineer',
        company: 'Apex Cloud Solutions',
        location: 'San Francisco, CA (Hybrid)',
        jobType: 'Full-Time',
        salary: '$110,000 - $145,000',
        experience: '2-4 Years',
        description: 'Build high-throughput REST APIs, manage MongoDB clusters, implement Redis caching, and maintain containerized microservices.',
        requiredSkills: ['Node.js', 'Express.js', 'MongoDB', 'Redis', 'Docker', 'REST APIs'],
        applicationUrl: 'https://apexcloud.com/jobs/backend-node',
      },
      {
        title: 'Python Backend Developer',
        company: 'NovaTech FinTech',
        location: 'New York, NY (Remote)',
        jobType: 'Full-Time',
        salary: '$115,000 - $155,000',
        experience: '2-5 Years',
        description: 'Architect secure financial transaction pipelines using FastAPI, PostgreSQL, Redis, and Docker on AWS cloud infrastructure.',
        requiredSkills: ['Python', 'FastAPI', 'SQL', 'PostgreSQL', 'Docker', 'AWS'],
        applicationUrl: 'https://novatech.io/careers',
      },
      {
        title: 'Java Spring Boot Enterprise Developer',
        company: 'Cognitive Financial Systems',
        location: 'Chicago, IL (Hybrid)',
        jobType: 'Full-Time',
        salary: '$105,000 - $140,000',
        experience: '2-4 Years',
        description: 'Develop enterprise-grade transaction systems using Spring Boot, Hibernate, PostgreSQL, and Kafka messaging architectures.',
        requiredSkills: ['Java', 'Spring Boot', 'SQL', 'PostgreSQL', 'Docker', 'OOP'],
        applicationUrl: 'https://cogfin.com/jobs/java-engineer',
      },
      {
        title: 'Data Analyst — Product Analytics',
        company: 'Streamify Media',
        location: 'Remote',
        jobType: 'Full-Time',
        salary: '$80,000 - $115,000',
        experience: '1-3 Years',
        description: 'Derive key engagement metrics and retention insights using SQL window functions, Python Pandas dataframes, and executive reporting.',
        requiredSkills: ['SQL', 'Python', 'Pandas', 'NumPy', 'Git'],
        applicationUrl: 'https://streamify.com/careers/data-analyst',
      },
      {
        title: 'Junior Data Scientist',
        company: 'NeuralPulse AI',
        location: 'Austin, TX (Remote)',
        jobType: 'Full-Time',
        salary: '$100,000 - $135,000',
        experience: '0-2 Years',
        description: 'Collaborate with senior researchers to train, validate, and deploy predictive Machine Learning and deep neural models for healthcare diagnostics.',
        requiredSkills: ['Python', 'Machine Learning', 'Pandas', 'NumPy', 'Data Structures', 'SQL'],
        applicationUrl: 'https://neuralpulse.ai/jobs/ds',
      },
      {
        title: 'Cloud DevOps Specialist',
        company: 'Skyline Cloud Systems',
        location: 'Seattle, WA (Remote)',
        jobType: 'Full-Time',
        salary: '$120,000 - $160,000',
        experience: '3-5 Years',
        description: 'Automate zero-downtime CI/CD deployment pipelines, manage multi-region AWS infrastructure, and maintain Kubernetes clusters.',
        requiredSkills: ['AWS', 'Kubernetes', 'Docker', 'CI/CD', 'Linux', 'Git'],
        applicationUrl: 'https://skylinecloud.com/careers',
      },
      {
        title: 'Associate Cybersecurity Analyst',
        company: 'ShieldArmor Security',
        location: 'Washington, DC (Hybrid)',
        jobType: 'Full-Time',
        salary: '$85,000 - $115,000',
        experience: '0-2 Years',
        description: 'Monitor enterprise network traffic, perform vulnerability scans, analyze suspicious threat activity, and maintain compliance standards.',
        requiredSkills: ['Cybersecurity Fundamentals', 'Linux', 'Python', 'Git'],
        applicationUrl: 'https://shieldarmor.com/jobs/cyber-analyst',
      },
      {
        title: 'Frontend UI/UX Engineer',
        company: 'Aura Interactive',
        location: 'Remote',
        jobType: 'Contract',
        salary: '$50 - $75 / hr',
        experience: '1-3 Years',
        description: 'Craft responsive landing pages, accessible design systems, and animated user interfaces with React, Next.js, and modern CSS.',
        requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'Tailwind CSS', 'TypeScript'],
        applicationUrl: 'https://aurainteractive.io/apply',
      },
      {
        title: 'Full Stack JavaScript Engineer',
        company: 'HyperScale Systems',
        location: 'Boston, MA (Hybrid)',
        jobType: 'Full-Time',
        salary: '$105,000 - $145,000',
        experience: '2-4 Years',
        description: 'Build real-time collaborative workspace software leveraging React, TypeScript, Node.js, WebSockets, and PostgreSQL.',
        requiredSkills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'REST APIs', 'Git'],
        applicationUrl: 'https://hyperscale.io/careers',
      },
      {
        title: 'Software Development Engineer Intern',
        company: 'CloudMatrix Technologies',
        location: 'Hyderabad, India (On-Site)',
        jobType: 'Internship',
        salary: '₹35,000 / month',
        experience: '0-1 Years',
        description: 'Hands-on 6-month internship working on real-world web features, writing automated tests, and collaborating with senior mentors.',
        requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'Git'],
        applicationUrl: 'https://cloudmatrix.in/internships',
      },
      {
        title: 'DevOps & Site Reliability Intern',
        company: 'Orbit Infrastructure',
        location: 'Remote',
        jobType: 'Internship',
        salary: '$30 / hr',
        experience: '0-1 Years',
        description: 'Learn modern SRE practices, containerization, cloud monitoring with Prometheus/Grafana, and automated GitHub Actions workflows.',
        requiredSkills: ['Linux', 'Docker', 'Git', 'Python'],
        applicationUrl: 'https://orbitinfra.io/jobs/intern',
      },
      {
        title: 'Staff Python/Django Engineer',
        company: 'BrightWave Logistics',
        location: 'Denver, CO (Remote)',
        jobType: 'Full-Time',
        salary: '$135,000 - $175,000',
        experience: '4-7 Years',
        description: 'Lead backend architecture for nationwide freight tracking platform using Django, PostgreSQL, Celery, and AWS.',
        requiredSkills: ['Python', 'Django', 'SQL', 'PostgreSQL', 'AWS', 'Docker'],
        applicationUrl: 'https://brightwave.com/careers',
      },
      {
        title: 'Junior Mobile & Web React Developer',
        company: 'Pulse Innovations',
        location: 'London, UK (Hybrid)',
        jobType: 'Full-Time',
        salary: '£45,000 - £65,000',
        experience: '1-2 Years',
        description: 'Develop cross-platform customer portals using React, modern CSS, REST APIs, and state management libraries.',
        requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React', 'Redux', 'Git'],
        applicationUrl: 'https://pulseinno.co.uk/careers',
      },
      {
        title: 'Database Administrator & Data Engineer',
        company: 'OmniData Global',
        location: 'Atlanta, GA (Hybrid)',
        jobType: 'Full-Time',
        salary: '$100,000 - $140,000',
        experience: '3-5 Years',
        description: 'Optimize high-volume SQL and NoSQL databases, structure index partitions, and design ETL extraction pipelines.',
        requiredSkills: ['SQL', 'PostgreSQL', 'MongoDB', 'Python', 'Linux'],
        applicationUrl: 'https://omnidata.com/jobs/dba',
      },
      {
        title: 'Senior MERN Architect',
        company: 'Zenith SaaS Studio',
        location: 'Remote',
        jobType: 'Full-Time',
        salary: '$130,000 - $170,000',
        experience: '5+ Years',
        description: 'Lead architecture for multi-tenant enterprise applications using React, Node.js, Express, MongoDB, and Redis caching.',
        requiredSkills: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Redis', 'Docker', 'AWS'],
        applicationUrl: 'https://zenithsaas.io/jobs/mern-lead',
      },
      {
        title: 'Machine Learning Research Engineer',
        company: 'Aether Minds Lab',
        location: 'San Jose, CA (Hybrid)',
        jobType: 'Full-Time',
        salary: '$140,000 - $190,000',
        experience: '3-6 Years',
        description: 'Design cutting-edge deep learning neural architectures, train LLMs, and optimize inference latency for edge devices.',
        requiredSkills: ['Python', 'Machine Learning', 'Deep Learning', 'NumPy', 'Data Structures'],
        applicationUrl: 'https://aetherminds.ai/careers',
      },
      {
        title: 'Cloud Infrastructure Administrator',
        company: 'Titan Cloud Hosting',
        location: 'Dallas, TX (On-Site)',
        jobType: 'Full-Time',
        salary: '$90,000 - $125,000',
        experience: '2-4 Years',
        description: 'Maintain high availability virtual servers, configure firewalls, manage backups, and respond to platform alerts.',
        requiredSkills: ['Linux', 'AWS', 'Docker', 'Git'],
        applicationUrl: 'https://titancloud.com/jobs',
      },
      {
        title: 'API & Microservices Engineer',
        company: 'Nexis Systems',
        location: 'Remote',
        jobType: 'Contract',
        salary: '$60 - $85 / hr',
        experience: '2-5 Years',
        description: 'Develop resilient RESTful and GraphQL API services for third-party developer integrations.',
        requiredSkills: ['Node.js', 'Express.js', 'REST APIs', 'PostgreSQL', 'Git'],
        applicationUrl: 'https://nexis.io/contractors',
      },
      {
        title: 'Enterprise Java Integration Specialist',
        company: 'Vanguard Tech Solutions',
        location: 'Charlotte, NC (Hybrid)',
        jobType: 'Full-Time',
        salary: '$110,000 - $145,000',
        experience: '3-5 Years',
        description: 'Integrate legacy core banking platforms with modern Spring Boot microservices and secure message queues.',
        requiredSkills: ['Java', 'Spring Boot', 'SQL', 'OOP', 'Docker'],
        applicationUrl: 'https://vanguardtech.com/careers',
      },
      {
        title: 'Graduate Software Engineer',
        company: 'Apex Digital Campus',
        location: 'Pune, India (Hybrid)',
        jobType: 'Full-Time',
        salary: '₹6,50,000 - ₹10,00,000',
        experience: '0-1 Years',
        description: 'Exciting fast-track graduate training program for motivated computer science grads across frontend, backend, and cloud.',
        requiredSkills: ['HTML', 'CSS', 'JavaScript', 'Data Structures', 'OOP', 'Git'],
        applicationUrl: 'https://apexcampus.in/jobs/grad-2026',
      },
    ];

    const insertedJobs = await Job.insertMany(jobsData);
    console.log(`Inserted ${insertedJobs.length} realistic jobs`);

    console.log('5. Seeding Admin & Demo Student Accounts...');
    // Create Admin User
    const adminUser = await User.create({
      name: 'CareerPath Admin',
      email: 'admin@careerpath.com',
      password: 'Admin@123456',
      role: 'admin',
      education: 'Master of Science in Computer Science',
      college: 'Stanford University',
      graduationYear: 2022,
      phone: '+1 (555) 019-2834',
      bio: 'Platform administrator and lead curriculum architect at CareerPath.',
      skills: ['JavaScript', 'React', 'Node.js', 'Express.js', 'MongoDB', 'AWS', 'Docker', 'Python', 'SQL'],
      interests: ['System Architecture', 'Mentorship', 'Cloud Computing', 'AI'],
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
    });

    // Create Demo Student User
    const mernCareer = insertedCareers.find((c) => c.title === 'MERN Stack Developer');

    const demoStudent = await User.create({
      name: 'Alex Rivera',
      email: 'student@careerpath.com',
      password: 'Student@123456',
      role: 'student',
      education: 'Bachelor of Technology in Computer Science',
      college: 'Global Institute of Technology',
      graduationYear: 2026,
      phone: '+1 (555) 392-8172',
      bio: 'Aspiring Full Stack Engineer passionate about building scalable, responsive web applications with the MERN stack.',
      skills: ['HTML', 'CSS', 'JavaScript', 'Git', 'React'], // Has 5 skills, missing Node, Express, MongoDB
      interests: ['Web Development', 'UI/UX Design', 'Open Source', 'SaaS Products'],
      targetCareer: mernCareer ? mernCareer._id : null,
      github: 'https://github.com/alexrivera-dev',
      linkedin: 'https://linkedin.com/in/alexrivera-dev',
      resume: 'https://careerpath.com/resumes/alex-rivera-cv.pdf',
    });

    console.log('6. Seeding Student Progress & Assessment Results...');
    // Seed Progress for demo student
    const progressSeed = [
      { user: demoStudent._id, skill: 'HTML', status: 'Completed', progress: 100, completedAt: new Date(Date.now() - 30 * 86400000), notes: 'Mastered semantic HTML5 tags and forms.' },
      { user: demoStudent._id, skill: 'CSS', status: 'Completed', progress: 100, completedAt: new Date(Date.now() - 25 * 86400000), notes: 'Completed Flexbox, Grid, and responsive layout projects.' },
      { user: demoStudent._id, skill: 'JavaScript', status: 'Completed', progress: 100, completedAt: new Date(Date.now() - 15 * 86400000), notes: 'Scored 86% on assessment! Solid grasp of async, closures, and DOM.' },
      { user: demoStudent._id, skill: 'Git', status: 'Completed', progress: 100, completedAt: new Date(Date.now() - 10 * 86400000), notes: 'Comfortable with branching, pull requests, and merge conflicts.' },
      { user: demoStudent._id, skill: 'React', status: 'In Progress', progress: 65, completedAt: null, notes: 'Currently building interactive dashboards and practicing custom hooks.' },
      { user: demoStudent._id, skill: 'Node.js', status: 'In Progress', progress: 30, completedAt: null, notes: 'Studying event loop and HTTP server routing.' },
      { user: demoStudent._id, skill: 'Express.js', status: 'Not Started', progress: 0, completedAt: null, notes: 'Queued next after Node.js fundamentals.' },
      { user: demoStudent._id, skill: 'MongoDB', status: 'Not Started', progress: 0, completedAt: null, notes: 'Planned for next month.' },
    ];
    await Progress.insertMany(progressSeed);

    // Seed Assessment Results for demo student
    const jsAssessment = insertedAssessments.find((a) => a.skill === 'JavaScript');
    const htmlAssessment = insertedAssessments.find((a) => a.skill === 'HTML');

    if (jsAssessment) {
      await AssessmentResult.create({
        user: demoStudent._id,
        assessment: jsAssessment._id,
        skill: 'JavaScript',
        score: 6,
        totalQuestions: 7,
        percentage: 86,
        level: 'Advanced',
        answers: jsAssessment.questions.map((q, idx) => ({
          questionIndex: idx,
          questionText: q.questionText,
          options: q.options,
          selectedOption: idx === 3 ? 0 : q.correctAnswer,
          correctAnswer: q.correctAnswer,
          isCorrect: idx !== 3,
          explanation: q.explanation,
        })),
        completedAt: new Date(Date.now() - 12 * 86400000),
      });
    }

    if (htmlAssessment) {
      await AssessmentResult.create({
        user: demoStudent._id,
        assessment: htmlAssessment._id,
        skill: 'HTML',
        score: 7,
        totalQuestions: 7,
        percentage: 100,
        level: 'Advanced',
        answers: htmlAssessment.questions.map((q, idx) => ({
          questionIndex: idx,
          questionText: q.questionText,
          options: q.options,
          selectedOption: q.correctAnswer,
          correctAnswer: q.correctAnswer,
          isCorrect: true,
          explanation: q.explanation,
        })),
        completedAt: new Date(Date.now() - 20 * 86400000),
      });
    }

    // Seed Sample Job Applications for demo student
    const job1 = insertedJobs[0]; // Veloce Labs
    const job2 = insertedJobs[1]; // PixelCraft
    const job3 = insertedJobs[11]; // CloudMatrix Intern

    await Application.create({
      student: demoStudent._id,
      job: job1._id,
      status: 'Under Review',
      appliedDate: new Date(Date.now() - 5 * 86400000),
      notes: 'Applied through CareerPath portal. Submitted updated GitHub portfolio.',
    });

    await Application.create({
      student: demoStudent._id,
      job: job2._id,
      status: 'Interview',
      appliedDate: new Date(Date.now() - 10 * 86400000),
      notes: 'Passed screening phone round! Technical live coding scheduled for this Friday.',
    });

    await Application.create({
      student: demoStudent._id,
      job: job3._id,
      status: 'Applied',
      appliedDate: new Date(Date.now() - 2 * 86400000),
      notes: 'Applied for summer software development internship.',
    });

    console.log('--------------------------------------------------');
    console.log('DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('--------------------------------------------------');
    console.log('Seeded Accounts:');
    console.log('  Admin User:');
    console.log('    Email:    admin@careerpath.com');
    console.log('    Password: Admin@123456');
    console.log('  Demo Student User:');
    console.log('    Email:    student@careerpath.com');
    console.log('    Password: Student@123456');
    console.log('--------------------------------------------------');

    process.exit(0);
  } catch (err) {
    console.error(`Error during database seeding: ${err.message}`);
    console.error(err.stack);
    process.exit(1);
  }
};

seedData();
