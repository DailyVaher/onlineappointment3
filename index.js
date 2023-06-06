const express = require('express')
const verifier = require('@gradeup/email-verify')
const bcrypt = require('bcrypt')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 3000
let expressWs = require('express-ws')(app);
const {v4: uuidv4} = require('uuid');

// Add Swagger UI
const swaggerUi = require('swagger-ui-express');
const yamlJs = require('yamljs');
const swaggerDocument = yamlJs.load('./swagger.yml');
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.static('public'))
app.use(express.json())
app.ws('/', function (ws, req) {
    ws.on('message', function (msg) {
        expressWs.getWss().clients.forEach(client => client.send(msg));
    });
    console.log('socket', req.testing);
});

const users = [
    {id: 1, email: 'admin', password: '$2b$10$0EfA6fMFRDVQWzU0WR1dmelPA7.qSp7ZYJAgneGsy2ikQltX2Duey'} // KollneKollne
]

const appointments = [
    {
        id: 1,
        title: 'Appointment 1',
        content: 'This is the content of appointment 1',
        userId: 1
    },
    {
        id: 2,
        title: 'Appointment 2',
        content: 'This is the content of appointment 2',
        userId: 2
    },
    {
        id: 3,
        title: 'Appointment 3',
        content: 'This is the content of appointment 3',
        userId: 1
    }
]

let sessions = [
    {id: '123', userId: 1}
]

function tryToParseJson(jsonString) {
    try {
        let o = JSON.parse(jsonString);
        if (o && typeof o === "object") {
            return o;
        }
    } catch (e) {
    }
    return false;
}
app.post('/users', async (req, res) => {

    // Validate email and password
    if (!req.body.email || !req.body.password) return res.status(400).send('Email and password are required')
    if (req.body.password.length < 8) return res.status(400).send('Password must be at least 8 characters long')
    if (!req.body.email.match(/^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) return res.status(400).send('Email must be in a valid format')

    // Check if email already exists
    if (users.find(user => user.email === req.body.email)) return res.status(409).send('Email already exists')

    // Find user in database
    //const user = users.find(user => user.email === req.body.email)
    //if (!user) return res.status(404).send('User not found')

    // Try to contact the mail server and send a test email without actually sending it
    try {
        const result = await verifyEmail(req.body.email);
        if (!result.success) {
            return res.status(400).send('Invalid email: ' + result.info)
        }
        console.log('Email verified')
    } catch (error) {
        const errorObject = tryToParseJson(error)
        if (errorObject && errorObject.info) {
            return res.status(400).send('Invalid email: ' + errorObject.info)
        }
        return res.status(400).send('Invalid email: ' + error)
    }

    // Hash password
    let hashedPassword
    try {
        hashedPassword = await bcrypt.hash(req.body.password,10);
    } catch (error) {
        console.error(error);
    }

    // Find max id
    const maxId = users.reduce((max, user) => user.id > max ? user.id : max, users[0].id)

    // Save user to database
    users.push({id: maxId + 1, email: req.body.email, password: hashedPassword})

    res.status(201).end()
})

// POST /sessions
app.post('/sessions', async (req, res) => {
    // Validate email and password
    if (!req.body.email || !req.body.password) return res.status(400).send('Email and password are required')

    // Find user in database
    const user = users.find(user => user.email === req.body.email)
    if (!user) return res.status(404).send('User not found')

    // Compare passwords
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            // Passwords match
            // Create session
            const session = {id: uuidv4(), userId: user.id}

            //Add session to sessions array
            sessions.push(session)

            // Send session to client
            res.status(201).send(session)
        } else {
            // Passwords don't match
            res.status(401).send('Invalid password')
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error')
    }
})

function authorizeRequest(req, res, next) {
    // Check that there is an authorization header
    if (!req.headers.authorization) return res.status(401).send('Missing authorization header')

    // Check that the authorization header is in the correct format
    const authorizationHeader = req.headers.authorization.split(' ')
    if (authorizationHeader.length !== 2 || authorizationHeader[0] !== 'Bearer') return res.status(400).send('Invalid authorization header')

    // Get sessionId from authorization header
    const sessionId = authorizationHeader[1]

    // Find session in sessions array
    const session = sessions.find(session => session.id === sessionId)
    if (!session) return res.status(401).send('Invalid session')

    // Check that the user exists
    const user = users.find(user => user.id === session.userId)
    if (!user) return res.status(401).send('Invalid session')

    // Add user to request object
    req.user = user

    // Add session to request object
    req.session = session

    // Call next middleware
    next()

}

app.get('/appointments', authorizeRequest, async (req, res) => {
    // await delay(1000)
    // Get appointments for user
    const appointmentsForUser = appointments.filter(appointment => appointment.userId === req.user.id)

    // Send appointments to client
    res.send(appointmentsForUser)
})

app.post('/appointments', authorizeRequest, (req, res) => {

    // Validate title and content
    if (!req.body.title || !req.body.content) return res.status(400).send('Title and content are required')

    // Find max id
    const maxId = appointments.reduce((max, appointment) => appointment.id > max ? appointment.id : max, 0)

    // Save appointment to database
    const appointment= ({id: maxId + 1, title: req.body.title, content: req.body.content, userId: req.user.id})

    appointments.push(appointment)

    // Send appointment to client
    expressWs.getWss().clients.forEach(client => client.send(JSON.stringify({event: 'create', appointment})));

    res.status(201).send(appointments[appointments.length - 1])

})
app.delete('/appointments/:id', authorizeRequest, (req, res) => {

    // Find appointment in database
    const appointmentIndex = appointments.findIndex(appointment => appointment.id === parseInt(req.params.id))
    if (appointmentIndex === -1) return res.status(404).send('Appointment not found')

    // Check that the appointment belongs to the user
    if (appointments[appointmentIndex].userId !== req.user.id) return res.status(401).send('Unauthorized');

    // Remove appointment from active appointments
    appointments.splice(appointmentIndex, 1);

    // Send appointment delete to client
    expressWs.getWss().clients.forEach(client => client.send(JSON.stringify({event: 'delete', id: req.params.id})));

    res.status(204).end()
})

app.put('/appointments/:id', authorizeRequest, (req, res) => {

    // Find appointment in database
    const appointment = appointments.find(appointment => appointment.id === parseInt(req.params.id))
    if (!appointment) return res.status(404).send('Appointment not found')

    // Check that the appointment belongs to the user
    if (appointment.userId !== req.user.id) return res.status(401).send('Unauthorized')

    // Validate title and content
    if (!req.body.title || !req.body.content) return res.status(400).send('Title and content are required')

    // Update appointment
    appointment.title = req.body.title
    appointment.content = req.body.content

    // Send updated appointment to client
    expressWs.getWss().clients.forEach(client => client.send(JSON.stringify({event: 'update', appointment})));

    // Send appointment to client
    res.send(appointment)
})

app.delete('/sessions', authorizeRequest, (req, res) => {
    // Remove session from sessions array
    sessions = sessions.filter(session => session.id !== req.session.id)

    res.status(204).end()
})
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

function verifyEmail(email) {
    return new Promise((resolve, reject) => {
        verifier.verify(email, (err, info) => {
            console.log(err, info);
            if (err) {
                reject(JSON.stringify(info));
            } else {
                resolve(info);
            }
        });
    });
}
