import * as functions from 'firebase-functions';
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');


const app = express();


app.use(cors({ origin: true }));

app.use('*', (req, res) => {
    console.log(req);
    res.send(req);
})


/*
set headers:
'Content-Type: text/plain'
'X-Content-Type-Options: nosniff'
in challenge request

*/

exports.dropbox = functions.https.onRequest(app);

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

