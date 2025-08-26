# 🏠 Inmobiliaria Web - Plataforma de Propiedades

Una aplicación web moderna y completa para gestión inmobiliaria, construida con Next.js 15, TypeScript, Tailwind CSS y Supabase.

## ✨ Características

### 🎯 Funcionalidades Principales

- **Catálogo de Propiedades**: Visualización completa de propiedades con filtros avanzados
- **Gestión de Emprendimientos**: Administración de proyectos inmobiliarios
- **Panel de Administración**: Dashboard completo para gestión de contenido
- **Sistema de Contacto**: Formularios de contacto y tasaciones
- **Propiedades Destacadas**: Sección especial para propiedades premium
- **Diseño Responsive**: Optimizado para todos los dispositivos

### 🛠️ Tecnologías Utilizadas

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4, Radix UI Components
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Formularios**: React Hook Form + Zod
- **UI/UX**: Lucide React Icons, Sonner Toasts

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18+
- pnpm (recomendado) o npm
- Cuenta de Supabase

### 1. Clonar el repositorio

```bash
git clone https://github.com/facupascale/inmobiliaria-poire.git
cd inmobiliaria-web
```

### 2. Instalar dependencias

```bash
pnpm install
# o
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase

# Opcional: Para funcionalidades adicionales
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Configurar la base de datos

Ejecuta los scripts SQL en tu proyecto de Supabase:

1. `scripts/01-create-tables.sql` - Crear tablas
2. `scripts/02-insert-sample-data.sql` - Datos de ejemplo
3. `scripts/03-enable-rls.sql` - Configurar RLS

### 5. Ejecutar el proyecto

```bash
# Desarrollo
pnpm dev

# Producción
pnpm build
pnpm start
```

El proyecto estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
inmobiliaria-web/
├── app/                    # App Router de Next.js
│   ├── admin/             # Panel de administración
│   ├── propiedades/       # Páginas de propiedades
│   ├── emprendimientos/   # Páginas de emprendimientos
│   ├── contacto/          # Página de contacto
│   └── tasaciones/        # Página de tasaciones
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes de UI base
│   └── ...               # Componentes específicos
├── lib/                  # Utilidades y configuración
├── contexts/             # Contextos de React
├── hooks/                # Custom hooks
└── public/               # Archivos estáticos
```

## 🎨 Componentes Principales

### UI Components

- **Navigation**: Navegación principal responsive
- **HeroSection**: Sección hero con call-to-action
- **PropertyGrid**: Grid de propiedades con filtros
- **PropertyDetail**: Vista detallada de propiedades
- **ContactForm**: Formularios de contacto
- **AdminDashboard**: Panel de administración

### Funcionalidades

- **Sistema de Filtros**: Búsqueda avanzada de propiedades
- **Gestión de Imágenes**: Carga y optimización de imágenes
- **Autenticación**: Sistema de login para administradores
- **CRUD Completo**: Crear, leer, actualizar y eliminar contenido

## 🔧 Scripts Disponibles

```bash
pnpm dev          # Servidor de desarrollo
pnpm build        # Construir para producción
pnpm start        # Servidor de producción
pnpm lint         # Linting del código
```

## 🌐 Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. Deploy automático en cada push

### Otros proveedores

- Netlify
- Railway
- DigitalOcean App Platform

## 🔐 Variables de Entorno

| Variable                        | Descripción                 | Requerida |
| ------------------------------- | --------------------------- | --------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | URL de tu proyecto Supabase | ✅        |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima de Supabase   | ✅        |
| `NEXT_PUBLIC_SITE_URL`          | URL del sitio en producción | ❌        |

## 📱 Características Responsive

- **Mobile First**: Diseño optimizado para móviles
- **Tablet**: Adaptación para tablets
- **Desktop**: Experiencia completa en escritorio
- **Touch Friendly**: Interacciones táctiles optimizadas

## 🎯 Roadmap

- [ ] Sistema de notificaciones push
- [ ] Chat en tiempo real
- [ ] Integración con Google Maps
- [ ] Sistema de favoritos
- [ ] Comparador de propiedades
- [ ] Calculadora de hipotecas
- [ ] Integración con WhatsApp Business

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**Facundo Pascale**

- GitHub: [@facupascale](https://github.com/facupascale)
- LinkedIn: [Facundo Pascale](https://linkedin.com/in/facupascale)

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/) - Framework de React
- [Supabase](https://supabase.com/) - Backend as a Service
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Radix UI](https://www.radix-ui.com/) - Componentes accesibles
- [Lucide](https://lucide.dev/) - Iconos hermosos

---

⭐ Si este proyecto te ayuda, ¡dale una estrella al repositorio!
