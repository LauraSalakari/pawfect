
# MeetPup   

## Description

Meetpup is a platform for finding your "pawfect" event for your pup. You can meet new friends, create new relationships and expand your dog community. You can create your own events or attend those in your area. It's time to find your furr-ever best friend! 
 
## User Stories

- **404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault 
- **500** - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault
- **homepage** - As a user I want to be able to access the homepage so that I see what the app is about and login and signup
- **sign up** - As a user I want to sign up on the webpage so that I can see all the events that I could attend
- **login** - As a user I want to be able to log in on the webpage so that I can get back to my account
- **logout** - As a user I want to be able to log out from the webpage so that I can make sure no one will access my account
- **create owner profile**
- **create pet profile**
- **edit profile(s)**
- **search pet(s)**
- **search owner(s)**
-**leave a message**
-**past messages**
-**about pawfect**
-**view own profile**
-**view profiles**
-**change password**

## Backlog

List of other features outside of the MVPs scope

Geo Location:
- See accurate user distance between pets/people
- see distance between users and major events


Messages
- chat feature 
  -unread messages?
  

## ROUTES:

## Landing
- GET / 
  - renders the homepage
- GET /auth/signup
  - redirects to / if user logged in
  - renders the signup form (with flash msg)
- POST /auth/signup
  - redirects to / if user logged in
  - body:
    - username
    - email
    - password
    - location
    - pet owner [y/n]
- GET /auth/login
  - redirects to / if user logged in
  - renders the login form (with flash msg)
- POST /auth/login
  - redirects to / if user logged in
  - body:
    - username
    - password
- POST /auth/logout
  - body: (empty)

## Search-events
- GET/search
  - render search page with filters 
- POST/search
  - getting information from database
 
 ## Messages
 -GET /chat
  -rendering chat logs 
 -Get /chat/:id
  -renders page of specific chat
 -POST /chat/:id
  - sending message in particular chat 
  
## Profile-Person
  - GET /profile/:id
    -renders profile (yours with link to edit)
  - GET /profile/:id/edit
    -form to edit your profile 
    -link to changing password 
  - POST /profile/:id/edit
    -redirects to your profile page 
    - alert that profile was updated (or not)
  - GET /profile/:id/changepassword
    -form to change password
      -takes current password 
      -takes new password x2
  - POST /profile/:id/changepassword
    -redirects back into edit page 
    -alert that password changed 
    
## Pet Profiles
  
  - GET /petprofile/:id
    - renders pet profile 
      -owner of pet = link to edit pet profile page 
  - GET /petprofile/:id/edit
    -form to edit pet profile
  - POST /petprofile/:id/edit
    -redirects back into pet profile with banner of update 
  
  # About Meetpup
  -GET /about 
    -renders info page about pawfect

# Create Event
  -GET /createevent
    -allows users to make own events
  -POST /createevent


# Event Details 
- GET /event/:id
- GET /event/:id/edit
    -allows users to edit event

- POST / event/:id/edit

  
  
## Models

UserModel
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    location: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isPetOwner: {
        type: bool
    }
PetModel
    name: {
        type: String,
        required: true
    },
    animal: {
        type: String,
        enum validation/radio buttons/dropdown menu
    },
    characteristics: {
        type: [String], (checkboxes)
        required: true (validate elsewhere? eg. must select 3) 
    },
    age: { // year of brith
        type: Number,
        required: true
    },
    aboutMe: {
        type: String
    },
    owner: {
        {
            type: Schema.Types.ObjectId, 
            ref: "owner"
        }
    }
EventModel
    name: {
      type: String,
      required: true
    },
    about: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    attendees {
        {
            type: Schema.Types.ObjectId, 
            ref: "owner"
        }
    },
    time: {
      type: date, 
      required: true 
    },
    duration: {
      type: Number
    }

## Links

### Trello

[Pawfect - Project 2](https://trello.com/b/l5er81CT/pawfect-project-2)

### Git

The url to your repository and to your deployed project

[Repository Link](https://github.com/LauraSalakari/pawfect)

[Deploy Link](https://meet-pup.herokuapp.com/)

### Slides

[Slides Link](https://docs.google.com/presentation/d/1MShwMFqaZzvGfOqGtutZwuecXpXQXtdJn1HBcACC-nw/edit?usp=sharing)
