# Organización de imágenes

Las imágenes de la aplicación se mantienen en `src/assets/images/` para que Astro pueda procesarlas durante el build.

- `brand/`: fuente única del logotipo utilizado en navegación, pie de página y favicon.
- `hero/`: imágenes de fondo para escritorio y móvil.
- `profile/`: fotografía de perfil.
- `projects/`: capturas e imágenes de proyectos referenciadas desde `src/content/projects/`.

No guardes copias de los mismos archivos en `public/`. Reserva `public/` para recursos estáticos que necesiten una URL fija, como el CV y `robots.txt`. Si un mismo recurso se usa en varios proyectos, referencia el archivo existente en lugar de duplicarlo.
