# Contrats API - Académie Oftalmo

## Architecture Backend

### Modèles de Données (MongoDB)

#### 1. User (Utilisateur)
```python
{
    "_id": ObjectId,
    "name": str,
    "email": str (unique),
    "password": str (hashed),
    "role": str (enum: "student", "admin"),
    "created_at": datetime,
    "updated_at": datetime
}
```

#### 2. Course (Cours)
```python
{
    "_id": ObjectId,
    "title": str,
    "description": str,
    "duration": str,
    "level": str (enum: "Débutant", "Intermédiaire", "Avancé"),
    "price": float,
    "image": str (URL),
    "enrolled_count": int,
    "rating": float,
    "created_at": datetime,
    "updated_at": datetime
}
```

#### 3. Enrollment (Inscription)
```python
{
    "_id": ObjectId,
    "user_id": ObjectId,
    "course_id": ObjectId,
    "progress": int (0-100),
    "enrolled_at": datetime,
    "completed_at": datetime (nullable)
}
```

#### 4. Stats (Statistiques)
```python
{
    "_id": ObjectId,
    "webinar_listeners": int,
    "virtual_classes": int,
    "key_opinion_leaders": int,
    "subscribers": int,
    "updated_at": datetime
}
```

#### 5. Campus
```python
{
    "_id": ObjectId,
    "name": str,
    "location": str,
    "image": str (URL),
    "description": str,
    "created_at": datetime
}
```

---

## Endpoints API

### Authentication

#### POST /api/auth/register
- **Description**: Inscription d'un nouvel utilisateur
- **Body**: `{ "name": str, "email": str, "password": str }`
- **Response**: `{ "token": str, "user": {...} }`

#### POST /api/auth/login
- **Description**: Connexion utilisateur
- **Body**: `{ "email": str, "password": str }`
- **Response**: `{ "token": str, "user": {...} }`

#### GET /api/auth/me
- **Description**: Récupérer l'utilisateur connecté
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ "user": {...} }`

---

### Courses (Cours)

#### GET /api/courses
- **Description**: Liste de tous les cours
- **Query Params**: `?level=Avancé&search=cataracte`
- **Response**: `[{ "id", "title", "description", ... }]`

#### GET /api/courses/:id
- **Description**: Détails d'un cours
- **Response**: `{ "id", "title", "description", ... }`

#### POST /api/courses (Admin)
- **Description**: Créer un nouveau cours
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ "title", "description", "duration", "level", "price", "image" }`
- **Response**: `{ "id", "title", ... }`

#### PUT /api/courses/:id (Admin)
- **Description**: Modifier un cours
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ "title", "description", ... }`
- **Response**: `{ "id", "title", ... }`

#### DELETE /api/courses/:id (Admin)
- **Description**: Supprimer un cours
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ "message": "Cours supprimé" }`

---

### Enrollments (Inscriptions)

#### POST /api/enrollments
- **Description**: S'inscrire à un cours
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ "course_id": str }`
- **Response**: `{ "enrollment": {...} }`

#### GET /api/enrollments/my-courses
- **Description**: Cours de l'utilisateur connecté
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `[{ "course": {...}, "progress": int, "enrolled_at": datetime }]`

#### PUT /api/enrollments/:id/progress
- **Description**: Mettre à jour la progression
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ "progress": int }`
- **Response**: `{ "enrollment": {...} }`

---

### Stats (Statistiques)

#### GET /api/stats
- **Description**: Récupérer les statistiques du site
- **Response**: `{ "webinar_listeners", "virtual_classes", "key_opinion_leaders", "subscribers" }`

#### PUT /api/stats (Admin)
- **Description**: Mettre à jour les statistiques
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ "webinar_listeners": int, ... }`
- **Response**: `{ "stats": {...} }`

---

### Campuses

#### GET /api/campuses
- **Description**: Liste des campus
- **Response**: `[{ "id", "name", "location", "image", "description" }]`

#### POST /api/campuses (Admin)
- **Description**: Créer un campus
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ "name", "location", "image", "description" }`
- **Response**: `{ "campus": {...} }`

---

### Admin

#### GET /api/admin/users
- **Description**: Liste de tous les utilisateurs
- **Headers**: `Authorization: Bearer <token>` (admin only)
- **Response**: `[{ "id", "name", "email", "role", ... }]`

#### GET /api/admin/dashboard
- **Description**: Statistiques du dashboard admin
- **Headers**: `Authorization: Bearer <token>` (admin only)
- **Response**: `{ "total_users", "total_courses", "total_enrollments", ... }`

---

## Données Mock à Remplacer

### mock.js
- `mockStats` → GET /api/stats
- `mockCampuses` → GET /api/campuses
- `mockFeatures` → Reste en frontend (statique)
- `mockCourses` → GET /api/courses
- `mockUser` → GET /api/auth/me

---

## Intégration Frontend-Backend

### 1. Landing Page
- Remplacer `mockStats` par appel API `GET /api/stats`
- Remplacer `mockCampuses` par appel API `GET /api/campuses`

### 2. Courses Page
- Utiliser `GET /api/courses` pour afficher la liste
- Filtres: niveau, recherche

### 3. Auth Pages
- Login: `POST /api/auth/login`
- Register: `POST /api/auth/register`
- Stocker JWT dans localStorage
- Créer un AuthContext React

### 4. Dashboard Étudiant
- `GET /api/enrollments/my-courses`
- Afficher progression
- Mettre à jour progression: `PUT /api/enrollments/:id/progress`

### 5. Dashboard Admin
- `GET /api/admin/dashboard`
- CRUD Cours: `GET/POST/PUT/DELETE /api/courses`
- Liste utilisateurs: `GET /api/admin/users`

---

## Sécurité

- JWT pour authentification
- Middleware pour vérifier les tokens
- Middleware pour vérifier le rôle admin
- Hashage des mots de passe (bcrypt)
- Validation des données avec Pydantic

---

## Notes d'Implémentation

1. Créer les modèles Pydantic
2. Implémenter les routes d'authentification
3. Implémenter les routes CRUD pour chaque ressource
4. Créer middlewares d'auth et d'autorisation
5. Tester avec curl/Postman
6. Intégrer avec le frontend
7. Retirer les données mock du frontend
