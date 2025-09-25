# Gruppe11-Ladeapp

This repository contains the source code for a full-stack EV charging station application developed for THM (Technische Hochschule Mittelhessen). The project consists of a Spring Boot backend API and a React Native mobile application.

## Tech Stack

-   **Backend**:
    -   Java
    -   Spring Boot
    -   Spring Security with JWT for authentication
    -   Spring Data MongoDB
    -   Gradle
-   **Frontend**:
    -   React Native (with Expo)
    -   JavaScript
    -   React Navigation
    -   Axios
-   **Database**:
    -   MongoDB

## Project Structure

The repository is organized into two main parts:

-   `src/`: Contains the Spring Boot backend application.
-   `mobile/`: Contains the React Native (Expo) mobile frontend application.

## System Overview

The application allows users to:
-   Register and log in to their accounts.
-   View a list of available EV charging points (`Ladepunkte`).
-   Filter charging points by location (`Standort`).
-   Reserve a charging point and start a charging session.
-   View the duration of an active session.
-   End a charging session.

## Prerequisites

Before you begin, ensure you have the following installed:
-   Java JDK 17 or later
-   MongoDB
-   Node.js and npm
-   Expo Go app on your mobile device or an Android/iOS emulator

## Getting Started

### 1. Backend Setup

The backend server exposes a REST API on port `4000`.

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/Jatinder529/Gruppe11-Ladeapp.git
    cd Gruppe11-Ladeapp
    ```

2.  **Configure the backend:**
    Ensure your MongoDB instance is running. You can configure the connection URI and JWT secret in `src/main/resources/application.properties`:
    ```properties
    server.port=4000
    spring.data.mongodb.uri=mongodb://localhost:27017/evapp
    app.jwt.secret=change-this-super-long-demo-secret-key-64b+
    ```
    It is highly recommended to change the `app.jwt.secret` for any production-like environment.

3.  **Run the backend:**
    Use the Gradle wrapper to start the Spring Boot application.
    ```sh
    # For macOS/Linux
    ./gradlew bootRun

    # For Windows
    gradlew.bat bootRun
    ```
    The backend API will be available at `http://localhost:4000`.

### 2. Frontend (Mobile App) Setup

The mobile app connects to the backend to fetch data and manage user sessions.

1.  **Navigate to the mobile directory:**
    ```sh
    cd mobile
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Configure API endpoint:**
    The base URL for the API is defined in `mobile/src/api.js`. The default is configured to work with the Android emulator.
    -   **Android Emulator**: `http://10.0.2.2:4000` (no changes needed)
    -   **iOS Simulator/Physical Device on same Wi-Fi**: Change the URL to your computer's local IP address, e.g., `http://192.168.1.100:4000`.

4.  **Start the app:**
    ```sh
    npm start
    ```
    This will start the Metro bundler. You can then:
    -   Scan the QR code with the Expo Go app on your phone.
    -   Press `a` to run on an Android emulator.
    -   Press `i` to run on an iOS simulator.

## API Endpoints

The backend provides the following REST endpoints:

| Method  | Endpoint                                | Description                                       |
| :------ | :-------------------------------------- | :------------------------------------------------ |
| `POST`  | `/api/auth/register`                    | Registers a new user account.                     |
| `POST`  | `/api/auth/login`                       | Authenticates a user and returns a JWT.           |
| `GET`   | `/api/auth/me`                          | Retrieves the profile of the authenticated user.  |
| `GET`   | `/api/ladepunkte`                       | Gets a list of all charging points.               |
| `GET`   | `/api/ladepunkte?standort={name}`       | Filters charging points by location.              |
| `POST`  | `/api/reservierungen/start`             | Starts a new charging session for a user.         |
| `POST`  | `/api/reservierungen/{id}/end`          | Ends a specific charging session.                 |
| `GET`   | `/api/reservierungen?benutzerId={id}`   | Retrieves all reservations for a specific user.   |
| `GET`   | `/api/reservierungen?ladepunktId={id}` | Retrieves all reservations for a charging point.  |
| `PATCH` | `/api/reservierungen/{id}/feedback`     | Adds feedback to a completed reservation.         |
| `PATCH` | `/api/reservierungen/{id}/cancel`       | Cancels an active reservation.                    |
| `GET`   | `/api/ping`                             | A simple health check endpoint.                   |
