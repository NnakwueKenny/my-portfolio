/**
 * These words are buzzwords that should be highlighted
 */
const buzzwords = [
  'Coding',
  'Gaming',
  'Movies',
  'Football',
  'Movies',
  'Material UI',
  'Yoris Africa',
  'Twitter',
  "Adobe Illustrator",
  "Adobe Photoshop",
  "Adobe XD",
  "AWS",
  "Chai",
  "CSS",
  "Directus CMS",
  "Directus",
  "Docker",
  "EJS",
  "ESLint",
  "Express.js",
  "Express",
  "Figma",
  "Git",
  "GitHub",
  "HTML",
  "JavaScript",
  "Linux",
  "Mocha",
  "MongoDB",
  "MySQL",
  "Next.js",
  "Node.js",
  "Node",
  "Node/Express.js",
  "NoSQL",
  "NotJustEvent",
  "PHP",
  "PostgreSQL",
  "Python",
  "React.js",
  "React",
  "Redis",
  "REST/GraphQL",
  "SanityCMS",
  "Sass",
  "Selenium",
  "SQL",
  "SQL/NoSQL",
  "Tailwind CSS",
  "TailwindCSS",
  "TypeScript",
  "WordPress",
  "REST",
  "Vanilla Javascript",
];

// Add tags that should be searched for buzzwords
const paragraphs = document.querySelectorAll("p");
const lis = document.querySelectorAll("li");
const tags = [...paragraphs, ...lis];

for (const word of buzzwords) {
  const regex = new RegExp(`(\\s|^)(${word})([.,/()"']?)(\\s|$)`, 'g');
  for (const element of tags) {
    element.innerHTML = element.innerHTML.replace(regex, (match, p1, p2, p3, p4) => `${p1}<span class="buzzword">${p2}</span>${p3}${p4}`);
  }
}