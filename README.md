# Food Share Platform – Logistics Dashboard

![MIT License](https://img.shields.io/badge/License-MIT-green.svg)

A scalable and community-driven **food donation and distribution platform**. The logistics dashboard enhances the platform by providing real-time visibility and control over donations, deliveries, drivers, and route statuses.

---

## 🚀 Features

### 🧑‍🍳 For Donors
- Submit excess food donations
- Track donation and delivery status
- View donation history and impact

### 🚛 For Logistics Team
- Dashboard to manage all active and historical deliveries
- Real-time delivery tracking by ID
- View driver, recipient, and route details
- Delivery status updates (e.g., pending, en route, completed)
- Route optimization features (upcoming)

### 📦 For Recipients
- Receive food support based on verified need
- Get notified upon dispatch and arrival

---

## 📁 Project Structure

```
food_share/
├── client/                   # React frontend
│   ├── pages/                # Page-level views
│   ├── components/           # UI components
│   ├── features/             # Feature-specific logic (donations, logistics)
│   └── ...
├── server/                   # Express backend
│   ├── controllers/          # Logic for API endpoints
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API route definitions
│   └── ...
└── README.md
```

---

## 🛠️ Tech Stack

**Frontend:**
- React
- Vite
- Tailwind CSS
- React Query
- Axios

**Backend:**
- Express.js
- PostgreSQL with Prisma
- JWT Authentication

**Other Tools:**
- ESLint + Prettier
- GitHub Actions (CI/CD – upcoming)

---

## ⚙️ Getting Started

### Prerequisites

- Node.js (v18 or later)
- PostgreSQL
- Yarn or npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AbiyuNigussie/food_share.git
   cd food_share
   ```

2. Install dependencies:

   **Frontend:**
   ```bash
   cd client
   npm install
   ```

   **Backend:**
   ```bash
   cd ../server
   npm install
   ```

3. Configure environment variables:

   Create a `.env` file inside the `/server` folder:

   ```env
   PORT=5000
   DB_URL=your_postgreSQL_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. Run the development servers:

   **Frontend:**
   ```bash
   cd client
   npm run dev
   ```

   **Backend:**
   ```bash
   cd ../server
   npm run dev
   ```

---

## 📬 API Overview

| Method | Endpoint                  | Description                       |
|--------|---------------------------|-----------------------------------|
| GET    | `/api/donations`          | Get all donations                 |
| POST   | `/api/donations`          | Create a new donation             |
| GET    | `/api/deliveries/:id`     | Get delivery by ID                |
| POST   | `/api/deliveries`         | Create a new delivery             |
| PATCH  | `/api/deliveries/:id`     | Update delivery status            |
| GET    | `/api/users/:id`          | Fetch donor/driver/recipient info |

---

## 🧪 Testing

_Coming soon:_  
- Backend integration tests  
- Frontend E2E testing with Cypress  

---

## 📸 Logistics Dashboard Preview

_(Screenshot or GIF of the dashboard will be added here)_

---

## 🤝 Contributing

We welcome contributions!  
To contribute:

1. Fork this repository  
2. Create a new branch (`git checkout -b feature/your-feature-name`)  
3. Commit your changes (`git commit -m 'Add some feature'`)  
4. Push to your fork (`git push origin feature/your-feature-name`)  
5. Create a Pull Request  

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙌 Acknowledgements

Thanks to all open-source libraries, contributors, and supporters of the project.  
Special recognition to the community volunteers and logistics partners helping fight food insecurity.

---

## 📫 Contact

Maintainers: **Abiyu Nigussie**, **Yonathan Girmachew**, **Lealem Mekurial**, **Dagim Sisay**, **Mohammed Elamin**.
GitHub: [@food_share](https://github.com/AbiyuNigussie/food_share)  
Feel free to open an [issue](https://github.com/AbiyuNigussie/food_share/issues) for questions or suggestions.
