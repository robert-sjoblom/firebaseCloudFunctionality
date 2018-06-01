"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
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
    const user = req.body.list_folder.accounts;
    user.forEach(item => admin.database().ref(`/notifications/${item}`).push({ update: true }));
    res.status(200).send();
});
exports.dropbox = functions.https.onRequest(app);
// exports.truncate = functions.database.ref('/notifications').onWrite((change) => {
//     const parent = change.after.ref.parent;
//     return parent.once('value').then((snapshot) => {
//         if (snapshot.numChildren() >= 3) {
//             let count = 0;
//             const updates = {};
//             snapshot.forEach((child) => {
//                 if (++count <= snapshot.numChildren() - 3) {
//                     updates[child.key] = null;
//                     console.log(snapshot);
//                 }
//             });
//             return parent.update(updates);
//         }
//         return null;
//     });
// });
exports.truncate = functions.database.ref('/notifications/{uid}/{notification}').onWrite((change) => {
    const parentRef = change.after.ref.parent;
    return parentRef.once('value').then((snapshot) => {
        if (snapshot.numChildren() >= 3) {
            let childCount = 0;
            const updates = {};
            snapshot.forEach((child) => {
                if (++childCount <= snapshot.numChildren() - 3) {
                    updates[child.key] = null;
                }
            });
            // Update the parent. This effectively removes the extra children.
            return parentRef.update(updates);
        }
        return null;
    });
});
// exports.truncate = functions.database.ref('/notifications/{userid}').onChange((change) => {
//     const parent = change.after.ref.parent;
//     return parent.once('value').then((snapshot) => {
//         if (snapshot.numChildren() >= 3) {
//             let count = 0;
//             const updates = {};
//             snapshot.forEach((child) => {
//                 if (++count <= snapshot.numChildren() - 3) {
//                     updates[child.key] = null;
//                 }
//             });
//             return parent.update(updates);
//         }
//         return null;
//     });
// });
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
//# sourceMappingURL=index.js.map