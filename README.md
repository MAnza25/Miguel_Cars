# Miguel Cars - Sistema de Gestión de Taller Automotriz 🚗💨

## Descripción
**Miguel Cars** es una plataforma web integral diseñada para optimizar la gestión operativa de un taller automotriz. El sistema permite administrar clientes, vehículos, citas, órdenes de servicio, facturación y roles de usuario, proporcionando una interfaz moderna y eficiente para el personal administrativo y técnico.

## 🚀 Características Principales
- **Gestión de Citas:** Programación y seguimiento de servicios.
- **Control de Inventario y Repuestos:** Seguimiento detallado de piezas utilizadas.
- **Órdenes de Servicio:** Registro completo del trabajo realizado en cada vehículo.
- **Facturación Automática:** Generación de facturas basadas en servicios y repuestos.
- **Seguridad:** Control de acceso basado en roles (RBAC) con Spring Security.

## 🛠️ Tecnologías Utilizadas

### Backend
- **Java 21**
- **Spring Boot 4.x** (Spring Data JPA, Spring Security)
- **PostgreSQL** (Base de datos relacional)
- **Maven** (Gestor de dependencias)

### Frontend
- **React 19**
- **Vite 8**
- **TypeScript**
- **Axios** (Peticiones HTTP)
- **Recharts** (Visualización de datos)
- **CSS3 (Custom Design System)**

## 💻 Configuración Local

### Requisitos Previos
- Java 21 instalado.
- Node.js (v18 o superior).
- PostgreSQL configurado y corriendo.
- Maven.

### Paso 1: Clonar el repositorio
```bash
git clone https://github.com/MAnza25/Miguel_Cars.git
cd Miguel_Cars
```

### Paso 2: Configuración del Backend
1. Navega a la carpeta del backend:
   ```bash
   cd backend-miguelcars
   ```
2. Configura tu base de datos en `src/main/resources/application.properties`. Asegúrate de que las credenciales coincidan con tu instancia local de PostgreSQL.
3. Ejecuta el servidor:
   ```bash
   mvn spring-boot:run
   ```

### Paso 3: Configuración del Frontend
1. Navega a la carpeta del frontend:
   ```bash
   cd ../frontend-miguelcars
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## 👥 Equipo de Desarrollo
Este proyecto ha sido desarrollado por:
- **JAROL MARCEL ANDRADE GIL**
- **BRAQNER DUVAN ALVARADO DELGADO**
- **JAVIER ANDRES GOMEZ AREVALO**

---
*Miguel Cars — Potencia y Control en tu Taller.*
