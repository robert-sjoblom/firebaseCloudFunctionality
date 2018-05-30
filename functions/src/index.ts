import * as functions from 'firebase-functions';
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

const app = express();

admin.initializeApp();

app.use(cors({ origin: true }));

app.get('/', (req, res) => {
    if (!req.query.challenge) {
        // if there's no challenge, we kill the get request
        // we only deal with POST here.
        res.status(404).send("Yeah no boi.");
    }
    res.set({
        'Content-Type': 'text/plain',
        'X-Content-Type-Options': 'nosniff'
    });
    res.send(req.query.challenge);
});

app.post('/', (req, res) => {
    const user = req.body.list_folder.accounts
    user.forEach(item => admin.database().ref(`/notifications/${item}`).push({ update: true }));
    res.status(200).send();
});

// lets a user know that shit happened to their files.
exports.dropbox = functions.https.onRequest(app);

// removes all but the last 3 notifications from the uid node.
exports.truncate = functions.database.ref('/notifications/{uid}/{notification}').onWrite((change) => {
    const parent = change.after.ref.parent;
    return parent.once('value').then((snapshot) => {
        if (snapshot.numChildren() >= 3) {
            let childCount = 0;
            const updates = {};
            snapshot.forEach((child) => {
                if (++childCount <= snapshot.numChildren() - 3) {
                    updates[child.key] = null;
                }
            });
            // Update the parent. This effectively removes the extra children.
            return parent.update(updates);
        }
        return null;
    });
});
