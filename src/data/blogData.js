const blogData = [
  {
    id: '1',
    title: 'Getting Started with React.js in 2026',
    excerpt: 'Learn the fundamentals of React.js and start building modern web applications with hooks, context, and more.',
    content: `React.js continues to be one of the most popular JavaScript libraries for building user interfaces. In this comprehensive guide, we'll walk through everything you need to know to get started with React in 2026.\n\n## Why React?\n\nReact offers a component-based architecture that makes it easy to build reusable UI components. With its virtual DOM, React efficiently updates only the parts of the page that need to change, resulting in better performance.\n\n## Setting Up Your Environment\n\nTo get started with React, you'll need Node.js installed on your machine. Once you have Node.js, you can create a new React project using Create React App or Vite.\n\n\`\`\`bash\nnpx create-react-app my-app\ncd my-app\nnpm start\n\`\`\`\n\n## Understanding Components\n\nComponents are the building blocks of any React application. There are two types of components: functional components and class components. In modern React, functional components with hooks are the recommended approach.\n\n\`\`\`jsx\nfunction Welcome({ name }) {\n  return <h1>Hello, {name}!</h1>;\n}\n\`\`\`\n\n## State Management with Hooks\n\nReact hooks like useState and useEffect allow you to add state and side effects to functional components.\n\n\`\`\`jsx\nconst [count, setCount] = useState(0);\n\`\`\`\n\n## Conclusion\n\nReact.js is a powerful library that makes building interactive UIs a breeze. Start with the basics, practice building small projects, and gradually take on more complex applications.`,
    author: 'Yash Wankhede',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=yash',
    category: 'Technology',
    tags: ['React', 'JavaScript', 'Frontend', 'Web Development'],
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
    date: '2026-10-01',
    readTime: '8 min read',
    likes: 42,
    bookmarked: false,
    comments: [
      { id: 'c1', author: 'Rahul Sharma', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rahul', text: 'Great article! Very helpful for beginners.', date: '2026-10-02' },
      { id: 'c2', author: 'Priya Patel', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya', text: 'Loved the code examples. Keep it up!', date: '2026-10-03' }
    ]
  },
  {
    id: '2',
    title: 'Mastering CSS Grid and Flexbox',
    excerpt: 'A deep dive into CSS Grid and Flexbox layouts to create responsive and beautiful web designs.',
    content: `CSS Grid and Flexbox are two powerful layout systems that every frontend developer should master. They make it incredibly easy to create complex, responsive layouts.\n\n## Flexbox Basics\n\nFlexbox is designed for one-dimensional layouts — either a row or a column. It's perfect for aligning items within a container.\n\n\`\`\`css\n.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  gap: 1rem;\n}\n\`\`\`\n\n## CSS Grid Fundamentals\n\nCSS Grid is designed for two-dimensional layouts. It allows you to create complex grid structures with rows and columns.\n\n\`\`\`css\n.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 2rem;\n}\n\`\`\`\n\n## When to Use Which?\n\n- Use **Flexbox** for simple, one-dimensional layouts (navbars, card rows)\n- Use **Grid** for complex, two-dimensional layouts (page layouts, dashboards)\n\n## Responsive Design\n\nBoth Grid and Flexbox make responsive design straightforward. Use media queries along with flexible units to create layouts that adapt to any screen size.\n\n\`\`\`css\n@media (max-width: 768px) {\n  .grid {\n    grid-template-columns: 1fr;\n  }\n}\n\`\`\`\n\n## Conclusion\n\nMastering CSS Grid and Flexbox will significantly improve your ability to create professional, responsive web layouts. Practice with real projects to solidify your understanding.`,
    author: 'Ananya Singh',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ananya',
    category: 'Design',
    tags: ['CSS', 'Flexbox', 'Grid', 'Responsive Design'],
    coverImage: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&h=400&fit=crop',
    date: '2026-09-28',
    readTime: '6 min read',
    likes: 38,
    bookmarked: false,
    comments: [
      { id: 'c3', author: 'Vikram Reddy', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vikram', text: 'Finally understood the difference between Grid and Flexbox!', date: '2026-09-29' }
    ]
  },
  {
    id: '3',
    title: 'Building RESTful APIs with Node.js',
    excerpt: 'Learn how to design and build robust REST APIs using Node.js, Express, and MongoDB.',
    content: `Building RESTful APIs is an essential skill for full-stack developers. In this guide, we'll create a complete REST API using Node.js and Express.\n\n## What is a REST API?\n\nREST (Representational State Transfer) is an architectural style for designing networked applications. It uses HTTP methods to perform CRUD operations.\n\n## Setting Up Express\n\n\`\`\`javascript\nconst express = require('express');\nconst app = express();\napp.use(express.json());\n\napp.listen(3000, () => {\n  console.log('Server running on port 3000');\n});\n\`\`\`\n\n## Creating Routes\n\n\`\`\`javascript\n// GET all items\napp.get('/api/items', (req, res) => {\n  res.json(items);\n});\n\n// POST new item\napp.post('/api/items', (req, res) => {\n  const newItem = req.body;\n  items.push(newItem);\n  res.status(201).json(newItem);\n});\n\`\`\`\n\n## Error Handling\n\nProper error handling is crucial for a production API. Use middleware to catch and handle errors gracefully.\n\n## Authentication\n\nSecure your API using JWT (JSON Web Tokens) for authentication and authorization.\n\n## Conclusion\n\nBuilding REST APIs with Node.js and Express is straightforward and powerful. Follow best practices for error handling, validation, and security to build production-ready APIs.`,
    author: 'Rohan Mehta',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rohan',
    category: 'Backend',
    tags: ['Node.js', 'Express', 'API', 'Backend'],
    coverImage: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=400&fit=crop',
    date: '2026-09-25',
    readTime: '10 min read',
    likes: 55,
    bookmarked: true,
    comments: []
  },
  {
    id: '4',
    title: 'Introduction to TypeScript for JavaScript Developers',
    excerpt: 'Discover how TypeScript can improve your development experience with static typing and better tooling.',
    content: `TypeScript is a superset of JavaScript that adds static typing to the language. It helps catch errors early and improves code quality.\n\n## Why TypeScript?\n\nTypeScript provides several benefits:\n- **Type Safety**: Catch errors at compile time\n- **Better IDE Support**: Autocomplete, refactoring, and navigation\n- **Self-documenting Code**: Types serve as documentation\n\n## Basic Types\n\n\`\`\`typescript\nlet name: string = 'John';\nlet age: number = 25;\nlet isActive: boolean = true;\nlet items: string[] = ['apple', 'banana'];\n\`\`\`\n\n## Interfaces\n\n\`\`\`typescript\ninterface User {\n  id: number;\n  name: string;\n  email: string;\n  isAdmin?: boolean;\n}\n\`\`\`\n\n## Generics\n\n\`\`\`typescript\nfunction getFirst<T>(arr: T[]): T {\n  return arr[0];\n}\n\`\`\`\n\n## Conclusion\n\nTypeScript is a game-changer for JavaScript development. Start with basic types and gradually adopt more advanced features as you get comfortable.`,
    author: 'Sneha Kapoor',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sneha',
    category: 'Technology',
    tags: ['TypeScript', 'JavaScript', 'Programming'],
    coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop',
    date: '2026-09-20',
    readTime: '7 min read',
    likes: 29,
    bookmarked: false,
    comments: [
      { id: 'c4', author: 'Amit Joshi', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amit', text: 'Switching to TypeScript was the best decision!', date: '2026-09-21' },
      { id: 'c5', author: 'Neha Gupta', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=neha', text: 'Very clear explanation of generics.', date: '2026-09-22' },
      { id: 'c6', author: 'Karan Singh', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=karan', text: 'Can you write about advanced TypeScript patterns?', date: '2026-09-23' }
    ]
  },
  {
    id: '5',
    title: 'The Complete Guide to Git and GitHub',
    excerpt: 'Master version control with Git and learn how to collaborate effectively using GitHub.',
    content: `Git is the most widely used version control system in the world. Combined with GitHub, it provides a powerful platform for collaboration.\n\n## Git Basics\n\n\`\`\`bash\ngit init\ngit add .\ngit commit -m "Initial commit"\n\`\`\`\n\n## Branching Strategy\n\nBranches allow you to work on features in isolation without affecting the main codebase.\n\n\`\`\`bash\ngit checkout -b feature/new-feature\ngit merge feature/new-feature\n\`\`\`\n\n## GitHub Collaboration\n\n1. Fork the repository\n2. Clone your fork\n3. Create a feature branch\n4. Make changes and commit\n5. Push and create a Pull Request\n\n## Best Practices\n\n- Write meaningful commit messages\n- Keep commits small and focused\n- Use .gitignore for unnecessary files\n- Review code before merging\n\n## Conclusion\n\nGit and GitHub are essential tools for every developer. Master the basics and adopt best practices to collaborate effectively with your team.`,
    author: 'Yash Wankhede',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=yash',
    category: 'DevOps',
    tags: ['Git', 'GitHub', 'Version Control', 'Collaboration'],
    coverImage: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&h=400&fit=crop',
    date: '2026-09-15',
    readTime: '5 min read',
    likes: 67,
    bookmarked: false,
    comments: [
      { id: 'c7', author: 'Deepak Kumar', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=deepak', text: 'Git commands cheat sheet would be great to have!', date: '2026-09-16' }
    ]
  },
  {
    id: '6',
    title: 'UI/UX Design Principles Every Developer Should Know',
    excerpt: 'Understanding design principles can make you a better developer and help you create more user-friendly applications.',
    content: `Good design is not just about aesthetics — it's about creating interfaces that are intuitive, accessible, and enjoyable to use.\n\n## Key Design Principles\n\n### 1. Consistency\nKeep your design consistent across the application. Use the same colors, fonts, and spacing throughout.\n\n### 2. Visual Hierarchy\nGuide users' attention by using size, color, and contrast to highlight important elements.\n\n### 3. White Space\nDon't be afraid of empty space. White space improves readability and gives your design room to breathe.\n\n### 4. Accessibility\nEnsure your application is accessible to everyone, including users with disabilities. Use proper contrast ratios, alt text, and keyboard navigation.\n\n### 5. Feedback\nProvide visual feedback for user actions. Buttons should have hover states, forms should show validation messages, and loading states should be clear.\n\n## Color Theory\n\nChoose a color palette that reflects your brand and creates the right mood. Use tools like Coolors or Adobe Color.\n\n## Typography\n\nSelect fonts that are readable and complement your design. Limit yourself to 2-3 fonts maximum.\n\n## Conclusion\n\nUnderstanding UI/UX principles will make you a more well-rounded developer and help you create applications that users love.`,
    author: 'Meera Nair',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=meera',
    category: 'Design',
    tags: ['UI/UX', 'Design', 'User Experience', 'Accessibility'],
    coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop',
    date: '2026-09-10',
    readTime: '6 min read',
    likes: 45,
    bookmarked: true,
    comments: []
  }
];

export const categories = ['All', 'Technology', 'Design', 'Backend', 'DevOps'];

export default blogData;
