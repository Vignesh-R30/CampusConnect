# MERN Stack Lab Record: CampusConnect

## 1. Aim of the Project
To design, develop, and deploy a unified smart campus platform named **CampusConnect** using the MERN (MongoDB, Express.js, React.js, Node.js) stack to digitize campus communication, manage events, and foster a student-faculty community.

## 2. Problem Statement
Traditional educational institutions rely on fragmented communication systems such as physical notice boards, scattered email threads, and informal chat groups. This leads to information silos, missed academic updates, inefficient administration processes, and a lack of a centralized digital community. 

## 3. System Architecture
The application follows a standard three-tier architecture:
- **Presentation Tier (Frontend):** Developed using React.js and Vite. It utilizes React Router for Single Page Application (SPA) navigation and Context API for global state management (Authentication).
- **Application Tier (Backend):** Built with Node.js and Express.js. It handles business logic, RESTful API routing, JWT-based authentication, and Zod-based request validation.
- **Data Tier (Database):** MongoDB is used as the primary NoSQL database, structured with Mongoose ORM. Cloudinary is integrated for scalable cloud media storage.

## 4. Hardware & Software Requirements
### Software Requirements:
- **Operating System:** Windows 10/11, macOS, or Linux
- **Environment:** Node.js (v18+)
- **Database:** MongoDB Atlas (Cloud Database)
- **Frontend Framework:** React.js (Vite)
- **Backend Framework:** Express.js
- **Dependencies:** Mongoose, Zod, Cloudinary, Multer, bcryptjs, jsonwebtoken

### Hardware Requirements:
- **Processor:** Intel Core i3 or equivalent (minimum)
- **RAM:** 4GB (minimum), 8GB (recommended)
- **Storage:** 500MB free disk space

## 5. Modules Description
1. **Authentication & Authorization Module:** 
   - Handles secure user registration and login using `bcryptjs` for password hashing and `jsonwebtoken` (JWT) for session management. Includes distinct Role-Based Access Control (RBAC) for 'Students' and 'Admins'.
2. **Dashboard Module:** 
   - A centralized UI providing users with a quick overview of upcoming events, recent announcements, and quick-action navigation.
3. **Event Management Module:** 
   - Allows administrators to create, read, update, and delete campus events. Features server-side pagination to optimize database load and network bandwidth.
4. **Community Discussion Module:** 
   - A forum system for students and faculty to post queries and share resources categorized by Academics, Placements, and General queries.
5. **Media & File Management Module:** 
   - Integrated with Cloudinary via Multer to securely upload, stream, and store user profile pictures and event banners in the cloud.

## 6. Implementation Highlights
- **Schema Validation:** Implemented an enterprise-grade middleware pipeline using **Zod** to intercept and validate incoming HTTP requests, ensuring data integrity before processing.
- **Database Optimization:** Applied `.skip()` and `.limit()` queries in Mongoose to achieve O(1) memory complexity during large dataset retrievals.
- **Security:** Replaced plaintext passwords with salt-hashed algorithms and secured API endpoints using Bearer token verification.

## 7. Result & Output
The CampusConnect application was successfully developed and deployed to production. 
- **Frontend Hosting:** Deployed on Vercel with SPA routing configurations.
- **Backend Hosting:** Deployed on Render with environment variables securely managing Cloudinary and MongoDB API keys.
All modules, including event registration, community discussions, and role-based routing, execute flawlessly without errors.

## 8. Conclusion
The CampusConnect platform successfully achieves its objective of unifying campus communications. By implementing the MERN stack alongside modern enterprise practices like Zod validation, cloud storage, and server-side pagination, the project demonstrates a robust, scalable, and secure full-stack web application.
