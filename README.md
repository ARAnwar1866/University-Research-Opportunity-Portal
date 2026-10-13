# University Research Opportunity Portal

A full-stack web application where faculty members can post, view, update, close, and delete research opportunities in one place.

**GitHub Repository:** https://github.com/ARAnwar1866/University-Research-Opportunity-Portal

**Demo Video:** https://drive.google.com/file/d/1_rtkGTkFFfwerCJoJbZ6VesGhZ_GdKrW/view?usp=sharing

**Author:** Abdul Rehman Mohammad Anwar | Roll. No: 24P-0601 | Class: BCS 5B

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express |
| Database | MySQL (`mysql2` driver) |
| Frontend | HTML, CSS, JavaScript, Bootstrap 5 |
| API testing | Postman |

## Project Structure

```
research-opportunity-portal/
├── backend/        Express REST API (routes, controllers, validation)
├── frontend/       HTML, CSS, and JS interface
├── database/       schema.sql (required) and seed.sql (optional sample data)
├── postman/        Exported Postman collection
├── .gitignore
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- [MySQL](https://dev.mysql.com/downloads/) 8 or newer, running locally

## Setup and Run

**1. Clone the repository**
```
git clone https://github.com/YOUR-USERNAME/research-opportunity-portal.git
cd research-opportunity-portal
```

**2. Create the database**
```
mysql -u <your_mysql_username> -p < database/schema.sql
```
Optional sample data: `mysql -u <your_mysql_username> -p < database/seed.sql`

**3. Configure environment variables**

Copy `backend/.env.example` to `backend/.env` and fill in your MySQL credentials:
```
DB_HOST=localhost
DB_USER=mysql_username
DB_PASSWORD=mysql_password
DB_NAME=research_portal
PORT=3000
```
The `.env` file is git-ignored and must never be committed.

**4. Install dependencies and start the backend**
```
cd backend
npm install
npm start
```
The API runs at `http://localhost:3000`. (Use `npm run dev` for auto-restart while developing.)

**5. Open the frontend**

Open `frontend/index.html` in your browser (or use the VS Code "Live Server" extension). The backend must be running. If you changed the backend port, update `API_URL` in `frontend/js/api.js`.

## API Endpoints

Base URL: `http://localhost:3000/api/opportunities`

| Method | Endpoint | Description | Success | Errors |
|---|---|---|---|---|
| POST | `/api/opportunities` | Create an opportunity | 201 | 400, 500 |
| GET | `/api/opportunities` | Get all opportunities | 200 | 500 |
| GET | `/api/opportunities/:id` | Get one opportunity | 200 | 400, 404, 500 |
| PUT | `/api/opportunities/:id` | Update an opportunity (partial updates allowed) | 200 | 400, 404, 500 |
| DELETE | `/api/opportunities/:id` | Delete an opportunity | 200 | 400, 404, 500 |

**Fields:** `title`, `description`, `research_area`, `faculty_name`, `department`, `required_skills`, `positions` (integer, 1 or more), `deadline` (`YYYY-MM-DD`), `status` (`Open` or `Closed`, defaults to `Open`).

**Example request body (POST):**
```json
{
  "title": "Machine Learning for Crop Disease Detection",
  "description": "Build image classification models for plant leaf diseases.",
  "research_area": "Artificial Intelligence",
  "faculty_name": "Dr. Ahmed Khan",
  "department": "Computer Science",
  "required_skills": "Python, PyTorch, Data Analysis",
  "positions": 2,
  "deadline": "2026-12-15"
}
```

To close an opportunity: `PUT /api/opportunities/:id` with `{ "status": "Closed" }`.

## Testing with Postman

1. Open Postman and choose **Import**, then select `postman/research-portal.postman_collection.json`.
2. Make sure the backend is running.
3. Run the requests **in order** (1.1 to 8), or use the collection runner. The three create requests save their IDs automatically, so no manual editing is needed.

The collection covers: creating three opportunities, get all, get one, update, close, delete, a 404 after deletion, and a 400 for invalid data.

## Security Notes

No credentials are stored in this repository. Database settings are read from `backend/.env`, which is excluded by `.gitignore`.
