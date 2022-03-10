const express = require('express');
const bodyParser = require('body-parser');
const { stringify } = require('nodemon/lib/utils');
const app = express();
const https = require('https');
const { options } = require('nodemon/lib/config');
const { exit, env } = require('process');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
});

app.post('/', (req, res) => {
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;

    let data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }

            }
        ]
    }
    const jsonData = JSON.stringify(data);
    const url = 'https://us20.api.mailchimp.com/3.0/lists/398bf3ffaf';
    const options = {
        method: 'POST',
        auth: 'vadim3:5efc7b3a7d9889cd769c89af7fbdb8b2-us20'
    }

    const request = https.request(url, options, (response) => {
        response.on('data', (data) => {
            if (response.statusCode === 200) {
                res.sendFile(__dirname + '/success.html')
            } else {
                res.sendFile(__dirname + '/failure.html');
            }
        });
    });

    request.write(jsonData);
    request.end();

});

app.post('/success', (req, res) => {
    res.redirect('/');
});

app.post('/failure', (req, res) => {
    res.redirect('/');
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on port 5000.');
});

// API KEY MAILCHIMP
// 5efc7b3a7d9889cd769c89af7fbdb8b2-us20

// AUDIENCE ID
// 398bf3ffaf