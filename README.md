# ⚙️ Backend Setup (PHP + MySQL with XAMPP)
## 1. Install XAMPP

Download: https://www.apachefriends.org/

Start the following services:

Apache

MySQL

## 2. Place Backend Files into htdocs

macOS:

/Applications/XAMPP/xamppfiles/htdocs/workout-tracker-api/


Windows:

C:\xampp\htdocs\workout-tracker-api\


Your folder must contain:

- config.php
- utils.php
- register.php
- login.php

Above files can be found in https://drive.google.com/drive/folders/1P0e0WeeH_KRUnd-KRlmaRoeDIy4nJGAh 

## 3. Ensure Users_ID is AUTO_INCREMENT

Run this inside phpMyAdmin → SQL:
```
ALTER TABLE FoodLog DROP FOREIGN KEY foodlog_ibfk_1;
ALTER TABLE Workouts DROP FOREIGN KEY workouts_ibfk_1;
```

```
ALTER TABLE Users
MODIFY Users_ID INT NOT NULL AUTO_INCREMENT;
```

```
ALTER TABLE FoodLog
ADD CONSTRAINT foodlog_ibfk_1
FOREIGN KEY (Users_ID)
REFERENCES Users(Users_ID)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE Workouts
ADD CONSTRAINT workouts_ibfk_1
FOREIGN KEY (Users_ID)
REFERENCES Users(Users_ID)
ON DELETE CASCADE
ON UPDATE CASCADE;
```



This is required for signup to work.

## 4. Enable AUTO_INCREMENT for Workout Tables

Run these SQL commands in phpMyAdmin → SQL to enable workout functionality:

```sql
-- 1. Fix Workouts Table

-- Drop foreign key temporarily
ALTER TABLE PerformedExercises
DROP FOREIGN KEY performedexercises_ibfk_1;

-- Add AUTO_INCREMENT to primary key
ALTER TABLE Workouts
MODIFY Workouts_ID INT NOT NULL AUTO_INCREMENT;

-- Restore foreign key
ALTER TABLE PerformedExercises
ADD CONSTRAINT performedexercises_ibfk_1 
FOREIGN KEY (Workouts_ID) 
REFERENCES Workouts (Workouts_ID);

-- 2. Fix PerformedExercises Table

-- Drop foreign key temporarily
ALTER TABLE sets
DROP FOREIGN KEY sets_ibfk_1;

-- Add AUTO_INCREMENT to primary key
ALTER TABLE PerformedExercises
MODIFY PerformedExercises_ID INT NOT NULL AUTO_INCREMENT;

-- Restore foreign key
ALTER TABLE sets
ADD CONSTRAINT sets_ibfk_1 
FOREIGN KEY (PerformedExercises_ID) 
REFERENCES PerformedExercises (PerformedExercises_ID);

-- 3. Fix Sets Table

-- Add AUTO_INCREMENT to primary key
ALTER TABLE sets
MODIFY Sets_ID INT NOT NULL AUTO_INCREMENT;
```

This is required for workout creation to work properly.

## 5. Start ngrok Tunnel

Your mobile device cannot reach localhost, so tunnel port 80:

```
ngrok http 80
```


Copy the HTTPS URL displayed, e.g.:

https://holocrine-shantae-prestricken.ngrok-free.dev


You will use this in your frontend.


# 📱 Frontend Setup (Expo App)
## 1. Install Dependencies
npm install

or:

yarn install

## 2. Install Expo CLI (If Needed)
npm install -g expo-cli

## 3. Update API Base URL

Open:

/services/api.ts


Set:

const BASE_URL =
  "https://YOUR_NGROK_URL.ngrok-free.dev/workout-tracker-api";


Example:

const BASE_URL =
  "https://holocrine-shantae-prestricken.ngrok-free.dev/workout-tracker-api";

## 4. Run the App
npx expo start


Then:

Scan the QR code with Expo Go

Or run on iOS/Android simulator

# 🔑 API Endpoints
➤ POST /register.php

Creates a new user.

Request Body Example:
{
  "first_name": "Juno",
  "last_name": "Lee",
  "email": "test@gmail.com",
  "password": "12345",
  "age": 22,
  "gender": "Male"
}

➤ POST /login.php

Authenticates existing users.

Request Body:
{
  "email": "test@gmail.com",
  "password": "12345"
}

Successful Response:
{
  "status": "success",
  "user": {
    "id": 1,
    "first_name": "Juno",
    "last_name": "Lee",
    "username": "juno1234",
    "email": "test@gmail.com"
  }
}

# 🧪 Testing the Backend Without Expo
✔ CURL Test
curl -X POST "https://YOUR_NGROK_URL/workout-tracker-api/register.php" \
 -H "Content-Type: application/json" \
 -d '{"first_name":"Test","last_name":"User","email":"test@example.com","password":"12345"}'

# 🤝 Git Workflow
Create a New Branch
git checkout -b feature/login

Push Changes
git push origin feature/login


Create a Pull Request on GitHub.
<<<<<<< HEAD
<<<<<<< Updated upstream
=======


>>>>>>> Stashed changes
=======


>>>>>>> 11b6c8e86fe05c134df226232a96a684b16dd70d
