# notepad_app_1
You can see the working application [here](https://gentle-caverns-58489.herokuapp.com/).  
Use login 'test' and password 'test' to enter.

## Summary
The application uses:
- Vue front-end framework & Vue Router
- Node & Express back-end framework
- Mongo database & Mongoose ODM
- JWT & BCrypt for authorization
- Markdown markup language for creating formatted text

## Usage
You can:
- register a new user & login an existing user
- add a new note, edit & delete the node
- add a subnote to an existing note, move the subnote to another note

## Back-end API
Task | Method | Path
--- | --- | ---
Home page | GET | /home
Search for notes | GET | /notes
Create a note | POST | /notes
Read a note | GET | /notes/:id
Update a note | PUT | /notes/:id
Delete a note | DELETE | /notes/:id
Edit page | GET | /edit/:id
