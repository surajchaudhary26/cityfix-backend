# 🏙️ CityFix API (Backend Services)

The core Node.js backend engine for **CityFix**, a platform bridging the gap between citizens and local municipalities. 

This RESTful API is engineered with a strict Separation of Concerns (MVC architecture) and production-level best practices. It acts as the central API gateway, managing high-throughput web traffic, secure citizen reports, and administrative ticketing, while being completely decoupled to allow future integration with Python-based AI microservices.

**Core Tech Stack:** Node.js, Express.js, MongoDB (Mongoose)
**Key Features:** Role-Based Access Control (RBAC), Centralized Error Handling, Secure File Uploads, and API Security (Helmet/Sanitization).