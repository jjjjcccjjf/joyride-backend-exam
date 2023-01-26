# Github API - Backend Engineer Technical Exam
A Nodejs API project that has an API endpoint that takes a list of github usernames (up to a maximum of 10 names) and returns to the user a list of basic information for those users including:
1. Name
2. Login
3. Company
4. Number of followers
5. Number of public repositories
6. The average number of followers per public repository (ie. number of followers divided by the number of public repositories)

In order to access the API endpoint described above, the user should register and login.


## Table of contents 
* [Base URL](#Base-URL)
* [Authorization](#Authorization)
* [Endpoints](#Endpoints)
	* Does not require Auth
		* [Register](#Register)
		* [Login](#Login)
	* Requires Auth
		* [List users by handle](#List-users-by-handle)


## Base URL
`https://joyride-backend-exam.herokuapp.com/api/`


## Authorization
Authorization headers

```
x-access-token: <JWT>
```

Obtain an access token from the [Login](#Login) endpoint.

## Endpoints

### Register
---
__Route:__ `auth/register`  
__Description:__ Pass an email and password to get a JWT valid for 24 hours  
__Authorization required:__ `false`  
__Method:__ `\POST`  

#### Request Payload
__Content-Type:__ `application/json`

| Key | Example value | Required |
| ---- | ---------------- | --------- |
| email | lorenzodante.dev@gmail.com | true |
| password | supersecret | true |

```
{
    "email": "lorenzodante.dev@gmail.com",
    "password": "supersecret"
}
```

#### Response

##### 200 OK
```
{
    "data": {
        "id": 114,
        "email": "lorenzodante.dev@gmail.com",
        "createdAt": "2023-01-26T13:19:07.848Z",
        "updatedAt": "2023-01-26T13:19:07.848Z"
    },
    "meta": {
        "errors": "",
        "totalRows": 1
    }
}
```

##### 400 Bad Request

###### Existing email
```
{
    "data": {},
    "meta": {
        "errors": "Email is already in use",
        "totalRows": 0
    }
}
```

###### Missing fields
```
{
    "data": {},
    "meta": {
        "errors": "Email and password is required. See documentation for more info: https://github.com/jjjjcccjjf/joyride-backend-exam",
        "totalRows": 0
    }
}
```


### Login
---
__Route:__ `auth/login`  
__Description:__ Pass an email and password to get a JWT valid for 24 hours  
__Authorization required:__ `false`  
__Method:__ `\POST`  

#### Request Payload
__Content-Type:__ `application/json`

| Key | Example value | Required |
| ---- | ---------------- | --------- |
| email | lorenzodante.dev@gmail.com | true |
| password | supersecret | true |

```
{
    "email": "lorenzodante.dev@gmail.com",
    "password": "supersecret"
}
```

#### Response

##### 200 OK
```
{
    "data": {
        "id": 114,
        "email": "lorenzodante.dev@gmail.com",
        "createdAt": "2023-01-26T13:19:07.848Z",
        "updatedAt": "2023-01-26T13:19:07.848Z",
        "accessToken": "xxx"
    },
    "meta": {
        "errors": "",
        "totalRows": 1
    }
}
```

##### 400 Bad Request

###### Invalid credentials
```
{
    "data": {},
    "meta": {
        "errors": "Invalid credentials",
        "totalRows": 0
    }
}
```

###### Invalid email
```
{
    "data": {},
    "meta": {
        "errors": "User not found.",
        "totalRows": 0
    }
}
```


### List users by handle 
---
__Route:__ `list`  
__Description:__ List details of GitHub users based on account handle. Max 10.  
__Authorization required:__ `true` (see [Authorization](#Authorization))  
__Method:__ `\POST`  

#### Headers
| Key | Example value | Required |
| ---- | ---------------- | --------- |
| x-access-token | \<JWT\> | true |

#### Request Payload
__Content-Type:__ `application/json`

| Key | Example value | Required |
| ---- | ---------------- | --------- |
| login | Array\<String\> | true |

```
{
    "login": [
        "ro11ingbutler",
        "jjjjcccjjf",
        "jadjoubran",
        "octokit",
        "sh",
        "zim",
        "amy",
        "sherlock",
        "holmes",
        "watson"
    ]
}
```

#### Response

##### 200 OK
```
{
    "data": [
        {
            "name": "Amy Chen",
            "login": "amy",
            "company": null,
            "repo_count": 57,
            "followers_count": 333,
            "avg_followers_count": 5.842105263157895
        },
        {
            "name": "Jason Holmes",
            "login": "holmes",
            "company": "@Square",
            "repo_count": 42,
            "followers_count": 10,
            "avg_followers_count": 0.23809523809523808
        },
        {
            "name": "Jad Joubran",
            "login": "jadjoubran",
            "company": "Jad Joubran B.V.",
            "repo_count": 172,
            "followers_count": 1492,
            "avg_followers_count": 8.674418604651162
        }, 
        ...
    ],
    "meta": {
        "errors": "Request failed due to following response errors:\n - Could not resolve to a User with the login of 'octokit'.",
        "totalRows": 9
    }
}
```

##### 400 Bad Request

###### Request Payload exceeds required amount
```
{
    "data": [],
    "meta": {
        "errors": "Bad request. Provided users cannot exceed amount: 10",
        "totalRows": 0
    }
}
```

###### Invalid or empty request payload
```
{
    "data": [],
    "meta": {
        "errors": "Invalid request payload. See documentation for more info: https://github.com/jjjjcccjjf/joyride-backend-exam",
        "totalRows": 0
    }
}
```

---

###### 🚧 End of documentation - [back to top](#Github-API---Backend-Engineer-Technical-Exam) 🚧