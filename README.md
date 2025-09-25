# Gruppe11-Ladeapp

Dieses Repository enthält den Quellcode für eine Full-Stack-Anwendung für E-Ladesäulen, entwickelt für die THM (Technische Hochschule Mittelhessen). Das Projekt besteht aus einer Spring-Boot-Backend-API und einer React-Native-Mobilanwendung.

## Tech Stack

-   **Backend**:
    -   Java
    -   Spring Boot
    -   Spring Security mit JWT für Authentifizierung
    -   Spring Data MongoDB
    -   Gradle
-   **Frontend**:
    -   React Native (mit Expo)
    -   JavaScript
    -   React Navigation
-   **Datenbank**:
    -   MongoDB

## Projektstruktur

Das Repository ist in zwei Hauptteile gegliedert:

-   `src/`: Enthält die Spring-Boot-Backend-Anwendung.
-   `mobile/`: Enthält die React-Native (Expo) mobile Frontend-Anwendung.

## Systemüberblick

Die Anwendung ermöglicht Nutzer:innen:
-   Sich zu registrieren und anzumelden.
-   Eine Liste verfügbarer E-Ladepunkte (`Ladepunkte`) anzusehen.
-   Ladepunkte nach Standort (`Standort`) zu filtern.
-   Einen Ladepunkt zu reservieren und eine Ladesitzung zu starten.
-   Die Dauer einer aktiven Sitzung anzuzeigen.
-   Eine Ladesitzung zu beenden.

## Voraussetzungen

Bevor du startest, stelle sicher, dass Folgendes installiert ist:
-   Java JDK 17 oder neuer
-   MongoDB
-   Node.js und npm
-   Expo Go App auf deinem Mobilgerät oder ein Android/iOS-Emulator

## Los geht’s

### 1. Backend einrichten

Der Backend-Server stellt eine REST-API auf Port `4000` bereit.

1.  **Repository klonen:**
    ```sh
    git clone https://github.com/Jatinder529/Gruppe11-Ladeapp.git
    cd Gruppe11-Ladeapp
    ```

2.  **Backend konfigurieren:**
    Stelle sicher, dass deine MongoDB-Instanz läuft. Die Verbindungs-URI und das JWT-Secret kannst du in `src/main/resources/application.properties` einstellen:
    ```properties
    server.port=4000
    spring.data.mongodb.uri=mongodb://localhost:27017/evapp
    app.jwt.secret=change-this-super-long-demo-secret-key-64b+
    ```
    Es wird dringend empfohlen, das `app.jwt.secret` in produktionsnahen Umgebungen zu ändern.

3.  **Backend starten:**
    Verwende den Gradle-Wrapper, um die Spring-Boot-Anwendung zu starten.
    ```sh
    # Für macOS/Linux
    ./gradlew bootRun

    # Für Windows
    gradlew.bat bootRun
    ```
    Die Backend-API ist dann unter `http://localhost:4000` erreichbar.

### 2. Frontend (Mobile App) einrichten

Die Mobile-App verbindet sich mit dem Backend, um Daten abzurufen und Sitzungen zu verwalten.

1.  **Zum Mobile-Ordner wechseln:**
    ```sh
    cd mobile
    ```

2.  **Abhängigkeiten installieren:**
    ```sh
    npm install
    ```

3.  **API-Endpoint konfigurieren:**
    Die Basis-URL der API ist in `mobile/src/api.js` definiert. Die Standard-Konfiguration funktioniert mit dem Android-Emulator.
    -   **Android-Emulator**: `http://10.0.2.2:4000` (keine Änderung nötig)
    -   **iOS-Simulator/Physisches Gerät im selben WLAN**: URL auf die lokale IP-Adresse deines Rechners ändern, z. B. `http://192.168.1.100:4000`.

4.  **App starten:**
    ```sh
    npm start
    ```
    Dadurch startet der Metro-Bundler. Du kannst anschließend:
    -   Den QR-Code mit der Expo-Go-App auf deinem Smartphone scannen.
    -   `a` drücken, um im Android-Emulator zu starten.
    -   `i` drücken, um im iOS-Simulator zu starten.

## API-Endpunkte

Das Backend bietet folgende REST-Endpunkte:

| Method  | Endpoint                                | Description                                       |
| :------ | :-------------------------------------- | :------------------------------------------------ |
| `POST`  | `/api/auth/register`                    | Registriert ein neues Benutzerkonto.              |
| `POST`  | `/api/auth/login`                       | Authentifiziert einen Benutzer und gibt ein JWT zurück. |
| `GET`   | `/api/auth/me`                          | Ruft das Profil des authentifizierten Benutzers ab. |
| `GET`   | `/api/ladepunkte`                       | Gibt eine Liste aller Ladepunkte zurück.          |
| `GET`   | `/api/ladepunkte?standort={name}`       | Filtert Ladepunkte nach Standort.                 |
| `POST`  | `/api/reservierungen/start`             | Startet eine neue Ladesitzung für einen Benutzer. |
| `POST`  | `/api/reservierungen/{id}/end`          | Beendet eine bestimmte Ladesitzung.               |
| `GET`   | `/api/reservierungen?benutzerId={id}`   | Ruft alle Reservierungen eines bestimmten Benutzers ab. |
| `GET`   | `/api/reservierungen?ladepunktId={id}`  | Ruft alle Reservierungen für einen Ladepunkt ab.  |
| `PATCH` | `/api/reservierungen/{id}/feedback`     | Fügt Feedback zu einer abgeschlossenen Reservierung hinzu. |
| `PATCH` | `/api/reservierungen/{id}/cancel`       | Storniert eine aktive Reservierung.               |
| `GET`   | `/api/ping`                             | Ein einfacher Health-Check-Endpunkt.              |
