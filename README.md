# NSBM-Roommate-Finder
SOFTWARE REQUIREMENTS SPECIFICATION (SRS) & TECHNICAL REPORT

Project Title: NSBM Roommate & Shared Apartment Finder

Course Module: Full-Stack Application Development (Spring Boot & React)


SECTION 1: EXECUTIVE SUMMARY
The NSBM Roommate & Shared Apartment Finder is a production-style, enterprise-grade full-stack web application designed specifically for the NSBM Green University student and landlord community. The platform addresses a critical real-world challenge: enabling university students to discover verified shared rooms, roommates, or rental apartments while seamlessly coordinating lifestyle and budget preferences within the campus locality. The platform operates beyond standard CRUD flows by combining stateful search capabilities, custom multi-faceted filters, a soft-deletion safety ecosystem for data management, and an integrated multi-pane chat messaging architecture.
SECTION 2: SYSTEM ARCHITECTURE & INTEGRATION MATRIX
The application layout relies strictly on a decoupled client-server structure. The frontend functions as a responsive Single Page Application (SPA), while the backend operates as a stateless RESTful API service built with Spring Boot, communicating via secure JSON payloads over HTTP.
2.1 Backend Layered Architecture (Spring Boot)
The server-side ecosystem is organized around a strict Layered Design Pattern:
•	Controller Layer: Exposes protected REST API endpoints and marshals incoming data transfer object (DTO) payloads.
•	Service Layer: Encapsulates the core logical business processing layer, coordinating ownership validation rules, security checks, and backend transactions.
•	Repository Layer: Abstract data access layer built via Spring Data JPA interfaces executing safe relational SQL queries.
•	Entity Layer (Model): Maps relational database schema structures directly into Java object configurations using Hibernate ORM definitions.
2.2 Frontend Application Layout (React)
The client user interface utilizes an atomic layout inside the Vite compilation bundle:
•	Components Layer: Contains modular visual blocks (e.g., PropertyCard, Navbar, Sidebar) to maintain styling uniformity across diverse workspace routes.
•	Context Layer: Uses an AuthContext state provider to dynamically maintain session data across components.
•	Services Layer: Features a global Axios networking client (api.js) that automatically injects JWT Bearer tokens into request headers and captures session failures via response interceptors.
SECTION 3: FUNCTIONAL & STATE SPECIFICATIONS
3.1 User Account Session & Authentication Cross-Flow
Security guidelines deploy state-aware security configurations to guard internal platform routes:
•	Secure Registration: Evaluates account properties and encrypts raw passwords using the BCrypt hashing function.
•	State Verification (Hybrid JWT & Session Flow): To satisfy core assignment constraints, successful logins generate stateless signed JSON Web Tokens (JWT) and simultaneously execute a Session & Cookie backup tracking flow.
•	Production Hardened Flags: Session context tokens distributed through cookie layers apply absolute production profiles: HttpOnly=true, Secure=true, and explicit SameSite=Strict restrictions to neutralize security leakage.
•	CSRF Security Interception: Incorporates comprehensive Cross-Site Request Forgery (CSRF) protection structures safeguarding stateful form submissions.
3.2 Data Validation & Centralized Interceptor Infrastructure
•	Bean Validation Constraints: Server input components are decorated with Jakarta validation parameters at the DTO layer (e.g., @NotNull, @Min(1), @Size).
•	Dynamic Validation Outline Warnings: If input attributes break validation requirements, the frontend captures this error matrix, outlines the failing fields in red, and renders structural error subtitles directly below the input boxes.
•	Centralized Exception Handler: Features a custom @ControllerAdvice global error handler. It captures internal stack failures and formats them into clean JSON error feedback payloads mapped to explicit HTTP status response codes (e.g., 400 Bad Request, 401 Unauthorized).
SECTION 4: DOMAIN ENHANCEMENTS (BEYOND CRUD ADVANCED FEATURES)
4.1 Granular Multi-Filter Search Directory
To exceed standard CRUD capabilities, the repository integrates an interactive directory interface mapping client requests to database query states:
•	Facilitates complex parameter evaluations processing matching fields including explicit Municipal City Locations, Maximum Target Rent Budgets, Bedrooms Quantity, and Bathroom Layout Specs.
•	Leverages indexing methodologies to extract subsets smoothly through integrated pagination matrices without causing database timeouts.
4.2 Relational Chat System Architecture
The application handles internal real-time text communications between student accounts via a dual-pane messaging engine:
•	Roster Index Pane: Tracks active conversation nodes, user details, online indicator triggers, and recent message snippets.
•	Conversation Pane: Organizes and aligns text exchanges, separating sent message groups (deep blue bubbles) from incoming message responses (light gray bubbles).
4.3 Automated Soft-Deletion Ecosystem
•	Rather than invoking physical record drops from tables, deletion commands toggle a soft-delete status field setting attributes to archived = true.
•	Public marketplace arrays automatically hide archived assets.
•	Individual owner overview consoles retain these entries but cover them with a semi-transparent gray overlay (rgba(17, 24, 39, 0.75)) while locking editing operations to ensure data historical trace security.
SECTION 5: DATABASE RELATIONAL SCHEMA DEFINITION
The active schema utilizes core central tables linked via primary and foreign key constraints managed dynamically through Hibernate Auto-DDL configurations:
5.1 Users Table (users)
Stores verified accounts and identity configurations.
•	id (BIGINT, Primary Key, Auto-Increment)
•	email (VARCHAR, Unique, Not Null)
•	password (VARCHAR, Not Null)
•	user_type (VARCHAR, Null)
5.2 Properties Table (properties)
Stores rental listings and room openings.
•	id (BIGINT, Primary Key, Auto-Increment)
•	rent (DOUBLE, Not Null)
•	archived (BIT, Default 0)
•	owner_id (BIGINT, Foreign Key referencing users.id)
5.3 Messages Table (messages)
Tracks communication history.
•	id (BIGINT, Primary Key, Auto-Increment)
•	sender_id (BIGINT, Foreign Key referencing users.id)
•	receiver_id (BIGINT, Foreign Key referencing users.id)
•	message (TEXT, Not Null)
SECTION 6: LOCAL APPLICATION DEPLOYMENT BLUEPRINT
6.1 Backend Core Configuration
1.	Open a local database client and execute schema initialization:
CREATE DATABASE roommate_db;

1.	Adjust access values within backend/src/main/resources/application.properties:
spring.datasource.url=jdbc:mysql://localhost:3306/roommate_db?createDatabaseIfNotExist=true
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password
spring.jpa.hibernate.ddl-auto=update

1.	Compile components and run the compiled JAR file while setting the mandatory execution memory constraints:
./mvnw clean package -DskipTests
java -Xmx256m -jar target/finder-0.0.1-SNAPSHOT.jar

6.2 Frontend Client Startup
1.	Open a system terminal prompt within the frontend/ workspace directory.
2.	Install package nodes and initialize the development instance:
npm install
npm run dev

1.	Load the output port address within a browser (typically http://localhost:5173).

<img width="451" height="692" alt="image" src="https://github.com/user-attachments/assets/5f3a2da7-0d7b-47c4-ac7c-e0b9721fb42b" />
