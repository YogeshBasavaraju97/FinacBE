# FincapBE
Backend Setup – FinacBE
1. Clone the Repository
sh
Copy
Edit
git clone https://github.com/YogeshBasavaraju97/FinacBE.git
cd FinacBE
2. Install Dependencies
sh
Copy
Edit
npm install
3. Setup Environment Variables
Create a .env file in the root directory and add the following:

ini
Copy
Edit
PORT=7777
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-secret-key>
4. Start MongoDB
If using MongoDB Atlas, ensure the MONGO_URI is correctly set in .env.
5. Run the Backend Server
sh
Copy
Edit
npm run start
