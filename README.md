# ticketingNotes API

Welcome to the backend API for the ticketing notes app, facilitating communication with the frontend.

The project is live at [ticketingNotes API](https://ticketingnotes-api.onrender.com).

Explore the implemented user stories in the user stories document.

## Installation and setup
1. **Installation:** Clone the repository to your local machine.

   ```bash
   git clone https://github.com/Okunola11/ticketingNotes
   
2. **Dependencies:** Install the required dependencies using npm or yarn.
   ```bash
   cd techNotes
   npm install
   ```
    Or
   ```bash
   yarn install
   ```
3. **Set Up Environment Variables:**
   Create a .env file in the root directory and configure the necessary environment variables.
5. **Run the Server:** Start the development server.
   ```bash
   npm start
   ```
6. **Access the API:**
   The API will be accessible at http://localhost:3000.

## Technologies Used
- Express.js
- Node.js
- MongoDB (or other database of choice)
- JWT (JSON Web Tokens) for authentication

## Learning
This project has provided valuable learning opportunities in several key areas:
- Request-Response Cycle: Understanding how requests are processed by the backend and responses are sent back to the frontend.
- User-based Authentication: Implementing user authentication to secure endpoints and restrict access based on user credentials.
- Role-based Authorization: Implementing role-based access control to define different levels of access for different user roles.
Processing Data in the Backend: Handling data received from the frontend, processing it, and performing necessary operations in the backend.

This project has provided valuable learning opportunities in implementing CRUD (Create, Read, Update, Delete) operations at the backend:
- Create: Implementing functionality to create new notes in the database based on user input from the frontend.
- Read: Retrieving and displaying existing notes from the database to the frontend, allowing users to view the data.
- Update: Implementing functionality to update existing notes in the database based on user edits from the frontend.
- Delete: Implementing functionality to delete notes from the database based on user actions from the frontend.
These CRUD operations are fundamental in building a robust backend API that allows for efficient data management and manipulation, enhancing the overall functionality and user experience of the application.

## Acknowledgements

Special thanks to [Dave Gray](https://github.com/gitdagray) who have helped make this project possible.
