# School Management 

## Description

This project is a backend API for managing a school system with features for managing students, teachers, and classes. It also supports Cloudinary for storing profile images of students and teachers. The system is built with **Node.js**, **Express.js**, and **MongoDB**.

---

## Features

1. **Students Management**

   - Add, view (with pagination and filtering), update, and delete students.
   - Soft delete functionality.
   - Profile image upload via Cloudinary.

2. **Teachers Management**

   - Add, view (with pagination), update, and delete teachers.
   - Soft delete functionality.
   - Profile image upload via Cloudinary.

3. **Classes Management**

   - Create, update, and delete classes.
   - Assign teachers to classes.
   - View classes with pagination.

4. **Authentication**
   - JWT-based authentication for admin access.
   - Protected routes to ensure only authorized users can perform operations.

---

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Cloudinary:** For profile image storage
- **Authentication:** JWT-based authentication

---

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- MongoDB (local or cloud instance)
- Cloudinary account

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-link>
   cd SchoolManagement
   ```
