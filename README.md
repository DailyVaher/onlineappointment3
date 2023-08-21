# onlineappointment3

This is a simple onlineappointment app built with Vue.js and Express.js. 
## Project management

https://www.pivotaltracker.com/n/projects/2633751

## Project setup

```
cp .env.example .env
npm install
```

## Running the app

```
npm start
```
## License
[MIT](https://choosealicense.com/licenses/mit/)

## Testing the app

Before testing the app, make sure that `.env` contains the following:
```
SKIP_EMAIL_VERIFICATION=true
```

Testing the app from the command line:
```
npx cypress run
```

Testing the app from the Cypress GUI:
```
npx cypress open -b chrome --e2e
```

## Acknowledgements
- [Vue.js](https://vuejs.org/)
- [Express.js](https://expressjs.com/)
- [bycrypt](https://www.npmjs.com/package/bcrypt)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [yamljs](https://www.npmjs.com/package/yamljs)
- [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express)

