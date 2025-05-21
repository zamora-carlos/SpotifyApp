# Spotify App

This project consists of a full-stack application that integrates with the Spotify API to fetch and display information about artists, albums, and tracks.

---

## Technologies

### Backend

- **Java**: Primary language.
- **Gradle**: Build tool.
- **Spring Boot**: Framework for building and running the REST API.

### Frontend

- **React**: UI library for building components.
- **TypeScript**: Strongly typed JavaScript for improved development experience.
- **react-router-dom**: Declarative routing library.
- **Spotify Web Playback SDK**: JavaScript library for integrating Spotify's player into the browser.

---

## Getting started

### Prerequisites

1. **Docker**
   Make sure you have Docker installed.

2. **Spotify Developer Application**
   You need to register an application with Spotify:

   - Go to the [Spotify for Developers Dashboard](https://developer.spotify.com/dashboard).
   - Log in with your Spotify account.
   - Create a new app.
   - Under **Redirect URIs**, add:
     `http://127.0.0.1:8080/callback`
   - Under **API/SDKs**, enable both:
     - Web API
     - Web Playback SDK

> **Note:** Unfortunately, a Spotify Premium account is required to play music in the browser using the Web Playback SDK.

### Setup

- Clone the repository:

  ```bash
  git clone https://github.com/zamora-carlos/SpotifyApp
  ```

- Navigate to project folder:

  ```bash
  cd SpotifyApp
  ```

- Create a `.env` file in the root of the repository following the structure of the `.env.example` file:

  ```bash
  SPOTIFY_CLIENT_ID=your_client_id
  SPOTIFY_CLIENT_SECRET=your_client_secret
  SPOTIFY_REDIRECT_URI=http://127.0.0.1:8080/callback
  ```

### Running the project

- **Start the application**:

  The following command will start both the frontend and backend services:

  - Frontend: http://localhost:8080
  - Backend (API): http://localhost:9090

  ```bash
  docker-compose up
  ```

- **Stop the application**:

  ```bash
  docker-compose down
  ```

---

## Application features

- Authentication: Login and token refresh with Spotify OAuth integration.
- Top artists: View your top artists.
- Artist details: Get detailed info on artists, including albums and top tracks.
- Search functionality: Search for tracks, artists, albums, or playlists.
- Playback control: Play, pause, and control Spotify playback directly from the app.

---

## API Endpoints

Once the application is running, you can start making HTTP requests to the backend API at http://localhost:9090/api/v1.

### `POST /auth/token`

Exchanges an authorization code for an access token.

#### Request Body

- `code` (string, required): The authorization code received from the Spotify authorization URL.

#### Response

`200 OK`: Returns a JSON object containing the access token and its expiration time.

```json
{
  "accessToken": "string",
  "expiresAt": "2025-05-21T12:34:56.789Z"
}
```

### `POST /auth/refresh`

Refreshes the access token using the current access token.

#### Request Body

- `accessToken` (string, required): The current or expired access token to be refreshed.

#### Response

`200 OK`: Returns a new access token and its expiration time.

```json
{
  "accessToken": "string",
  "expiresAt": "2025-05-21T13:45:00.000Z"
}
```

### `GET /top/artists`

Fetches a paginated list of the user's top artists.

#### Query parameters

- `token` (string, required): Spotify access token.
- `page` (integer, required): Page number for pagination.

#### Response

`200 OK`: Returns a JSON object containing the user's top artists.

### `GET /top/tracks`

Fetches a paginated list of the user's top tracks.

#### Query parameters

- `token` (string, required): Spotify access token.
- `page` (integer, required): Page number for pagination.

#### Response

`200 OK`: Returns a JSON object containing the user's top tracks.

### `GET /artist/{id}`

Retrieves detailed information about an artist by ID.

#### Path parameters

- `id` (string, required): Spotify artist ID.

#### Query parameters

- `token` (string, required): Spotify access token.

#### Response

`200 OK`: Returns a JSON object with artist details.

### `GET /artist/{id}/top-tracks`

Retrieves the top tracks for a given artist.

#### Path parameters

- `id` (string, required): Spotify artist ID.

#### Query parameters

- `token` (string, required): Spotify access token.

#### Response

`200 OK`: Returns a JSON object with the artist’s top tracks.

### `GET /artist/{id}/albums`

Fetches a paginated list of albums for a specific artist.

#### Path parameters

- `id` (string, required): Spotify artist ID.

#### Query parameters

- `token` (string, required): Spotify access token.
- `page` (integer, required): Page number for pagination.

#### Response

`200 OK`: Returns a JSON object with the artist's albums.

### `GET /album/{id}`

Fetches album details by ID.

#### Path parameters

- `id` (string, required): Spotify album ID.

#### Query parameters

- `token` (string, required): Spotify access token.

#### Response

`200 OK`: Returns a JSON object with album details.

### `GET /track/{id}`

Fetches track details by ID.

#### Path parameters

- `id` (string, required): Spotify track ID.

#### Query parameters

- `token` (string, required): Spotify access token.

#### Response

`200 OK`: Returns a JSON object with track details.

### `GET /search`

Performs a search across Spotify for tracks, artists, albums, or playlists.

#### Query parameters

- `query` (string, required): Search term.
- `type` (string, required): The type of item to search for. Can be `track`, `artist`, `album`, or `playlist`.
- `page` (integer, required): Page number for pagination.
- `token` (string, required): Spotify access token.

#### Response

`200 OK`: Returns a JSON object with search results.
