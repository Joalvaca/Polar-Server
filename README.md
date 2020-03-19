# Polar Footprints API

Polar Footprints API controls the interactions between the front end and database.

## Technologies

Polar Footprints was built using Node, Express and knex. PostgreSQL was used to built the database.

## Client Repo

<div>https://github.com/Joalvaca/Polar-Footprint.git</div>

## Live Site

<div><img src="src/images/Polarform.jpg" alt="form"><div>

# Using this API

## Add user

used to add a user to database

## URL

```
/api/users
```

- Method

```
POST
```

- Body Params\
  First name\
  Last name\
  User name\
  Password

- Success Response\
  code: 201

- Error Response\
  code: 400

---

## Login

Searches database to authenticate login credentials

## URL

```
/api/auth
```

- Method

```
POST
```

- Body Params\
  User name\
  Password

- Success Response\  
  Code: 200\
  Content:

  ```
  {
      username: 'username'
      authToken: 'authToken'
  }
  ```

- Error Response\
  code 400

---

## URL

```
/api/footprints
```

- Method

```
GET
```

- Body Params\
  None

- Success Response\
  Code: 200\
  Content:

  ```
  {
      footprints:'footprints'
  }

  ```

---

## URL

```
/api/footprints
```

- Method

```
POST
```

- Body Params\
  Id\
  Product Name\
  Date Purchased\
  Date Sold\
  Purchase Price\
  Sold Price\

- Success Response\
  Code: 201

- Error Response\
  Code: 400

---

## URL

```
/api/footprints/print_id
```

- Method

```
PATCH
```

- Body Params\
  Product Name\
  Date Purchased\
  Date Sold\
  Purchase Price\
  Sold Price\

- Success Response\
  Code: 204

- Error Response\
  Code: 404\

---

## URL

```
/api/footprints/print_id
```

- Method

```
DELETE
```

- URL Params\

- Body Params\
  none

- Success Response\
  Code: 204

- Error Response\
  Code: 404

---
