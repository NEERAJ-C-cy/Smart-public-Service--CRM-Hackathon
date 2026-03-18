# Smart Public Service CRM (PS-CRM)

A web-based citizen relationship management application designed to streamline the reporting, tracking, and resolution of public service complaints (e.g., Electricity, Water, Roads, Sanitation, and Police).

## 🚀 Features

- **Citizen Portal**: Users can submit new complaints (with optional photo uploads) and track the status of existing complaints using a unique ID.
- **Admin/Officer Dashboard**: Government officers can view all recent complaints, see aggregated statistics, and update the status of complaints (e.g., from "Received" to "In Progress" or "Resolved").
- **Real-time Analytics**: The system computes total, pending, and resolved complaints, along with breakdowns by department and area.

## 🛠️ Technology Stack

- **Frontend**: HTML, CSS, JavaScript (served via static files in the `/public` directory).
- **Backend Environment**: Node.js
- **Framework**: Express.js
- **Storage**: In-memory data structures (mock data seeded for demonstration).

## 📝 How Complaints are Stored and Sent (Easy to Understand)

To make it simple, here is a breakdown of how the technologies work together to handle your data:

### 1. Sending Complaints (Citizen -> Server)
- **Technology Used**: **JavaScript Fetch API** & **HTML Forms**.
- **How it works**: When a citizen fills out the form and clicks "Submit", their web browser uses JavaScript to bundle up the entered text and any uploaded photos. It then sends this bundle directly to the server over the internet.

### 2. Processing Data (On the Server)
- **Technology Used**: **Express.js** & **Multer**.
- **How it works**: Our backend runs on Node.js and uses the **Express.js** framework as a "traffic cop" to manage incoming requests. Because complaints can include file uploads (like photos), it uses a helper tool called **Multer** to easily read the image files along with the text.

### 3. Storing the Data
- **Technology Used**: **In-memory JavaScript Arrays (Temporary Storage)**.
- **How it works**: Instead of using a complex, heavy database, this application simply saves the complaints in a list (array) inside the server's actively running memory (RAM). When a complaint comes in, it is added to the list. *(Note: Because it's stored in memory, restarting the server resets the complaints to the default mock data. In a final production app, this would be swapped for a database like MongoDB or MySQL).*

### 4. Sending to Admins (Server -> Officer Dashboard)
- **Technology Used**: **JSON (Data Formatting)** & **REST APIs**.
- **How it works**: When an officer opens their dashboard, the dashboard asks the server to send the latest complaints. The server takes its internal list, formats it into clear, readable text called **JSON**, and sends it. The officer's screen then reads this JSON data and builds the tables, statistics, and graphs they see on their screen automatically.

## 📦 Dependencies

- **`express`**: Web framework for setting up the API routing and serving static UI files.
- **`cors`**: Middleware to enable Cross-Origin Resource Sharing.
- **`multer`**: Middleware for handling `multipart/form-data`, primarily used here for processing photo uploads associated with complaints.

## 🔌 API Endpoints

### 1. `POST /api/complaints`
- **Description**: Registers a new public service complaint.
- **Payload**: `multipart/form-data` containing `name`, `mobile`, `email`, `category`, `location`, `description`, and an optional `photo` file.
- **Response**: Returns the auto-generated unique Complaint ID (e.g., `CMD-1006`).

### 2. `GET /api/complaints/:id`
- **Description**: Retrieves details and current status of a specific complaint by its tracking ID.
- **Response**: JSON object containing complaint details or a 404 error if not found.

### 3. `GET /api/admin/stats`
- **Description**: Provides aggregated statistics for the admin dashboard.
- **Response**: JSON object containing counts for total, pending, and resolved complaints, along with distribution data by department and location.

### 4. `GET /api/officer/complaints`
- **Description**: Retrieves a list of all complaints, sorted sequentially (newest first) for officers to review.
- **Response**: JSON array of all complaint objects.

### 5. `PUT /api/officer/complaints/:id/status`
- **Description**: Updates the resolution status of a specific complaint.
- **Payload**: JSON body with the new `status` (e.g., `{"status": "Resolved"}`).
- **Response**: The updated complaint object.

## ⚙️ How It Works

1. **Initialization**: When the server (`server.js`) starts, it loads a pre-populated array of mock complaints into memory. It also serves all frontend HTML pages from the `public/` directory statically.
2. **Citizen Interaction**: A citizen fills out the complaint form. The frontend makes a POST request to `/api/complaints`. The backend receives the data, assigns the correct department based on the category, auto-generates tracking deadlines, pushes the new entry to the in-memory array, and hands the citizen a unique tracking ID.
3. **Tracking**: The citizen visits the tracking page and enters their ID. The frontend fetches the complaint details via `GET /api/complaints/:id` and displays the current status and resolution details.
4. **Officer Review**: An officer accesses the officer panel. The frontend retrieves all complaints via `GET /api/officer/complaints` and displays them in a dashboard metric and table layout. The officer can then change the status of a complaint, triggering a `PUT` request to update the in-memory record.

## 🏃 Setup and Execution

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   npm start
   ```
3. Access the application in your browser at `http://localhost:3000`.
