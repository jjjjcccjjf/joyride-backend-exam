# Github API - Backend Engineer Technical Exam
---
A Nodejs API project that has an API endpoint that takes a list of github usernames (up to a maximum of 10 names) and returns to the user a list of basic information for those users including:
1. Name
2. Login
3. Company
4. Number of followers
5. Number of public repositories
6. The average number of followers per public repository (ie. number of followers divided by the number of public repositories)
In order to access the API endpoint described above, the user should register and login.


## Table of contents 
---
* [Base URL](#Base%20URL)
* [Authorization](#Authorization)
* [Endpoints](#Endpoints)
	* [Register](#Register)
	* [Login](#Login)
	* [List users by handle](#List%20users%20by%20handle)


## Base URL
---
`https://joyride-backend-exam.herokuapp.com/api/`


## Authorization
---
Authorization headers

```
Authorization: Bearer <JWT>
```


## Endpoints
---


### Register
---
Description: Pass an email and password to get a JWT valid for 24 hours
Authorization required: `false`
Method: `\POST`
Content-Type: `application/json`

#### Request 

```
{
    "email": "lorenzodante.dev@gmail.com",
    "password": "supersecret"
}
```

#### Response

```
# TODO
```


### Login
---
Description: Pass an email and password to get a JWT valid for 24 hours
Authorization required: `false`
Method: `\POST`
Content-Type: `application/json`

#### Request 

```
{
    "email": "lorenzodante.dev@gmail.com",
    "password": "supersecret"
}
```

#### Response

```
# TODO
```


### List users by handle 
---
Description: List details of GitHub users based on account handle. Max 10.
Authorization required: `true` (see [Authorization](#Authorization))
Method: `\POST`
Content-Type: `application/json`

#### Request 

```
{

    "login": [
        "ro11ingbutler",
        "jjjjcccjjf",
        "jadjoubran",
        "octokit",
        "sh",
        "abra",
        "zim",
        "hound",
        "sherlock",
        "holmes",
        "watson"
    ]
}
```

#### Response

```
# TODO
```

