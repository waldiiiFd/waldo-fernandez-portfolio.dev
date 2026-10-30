const TECH_ICON_MAP: Record<string, string> = {
  Astro: "astro",
  "Tailwind CSS": "tailwindcss",
  TypeScript: "typescript",
  Vercel: "vercel",
  PHP: "php",
  Laravel: "laravel",
  "Laravel 11": "laravel",
  NestJS: "nestjs",
  PostgreSQL: "postgresql",
  Docker: "docker",
  Vue: "vuedotjs",
  JavaScript: "javascript",
  "Node.js": "nodedotjs",
  MySQL: "mysql",
  MariaDB: "mariadb",
  Git: "git",
  GitHub: "github",
  Postman: "postman",
  "Postman API": "postman",
  "REST APIs": "fastapi",
};

export function getTechIcon(tech: string): string | null {
  const slug = TECH_ICON_MAP[tech];
  if (!slug) return null;
  return `https://cdn.simpleicons.org/${slug}`;
}
