/** @format */

'use strict';

const multer = require('multer');
const express = require('express');
const rp = require('request-promise');
var fs = require('fs');

const app = express();
const upload = multer();

app.get('/', (req, res) => {
    // return res.status(200).send('');
    return res.sendFile(__dirname + '/donutman.jpg');
});

app.post('/avatar', upload.single('file'), (req, res) => {
    // console.log(req.file, req.body);

    const options = {
        method: 'POST',
        uri: 'https://node-210011.appspot.com/be-avatar', // 'http://localhost:8080/be-avatar',
        formData: {
            serviceNumber: req.body.serviceNumber,
            serviceType: req.body.serviceType,
            salesChannel: 'abl_care',
            file: {
                value: req.file.stream,
                options: {
                    filename: req.file.originalName,
                    contentType: req.file.detectedMimeType
                }
            }
        }
    };

    return rp(options)
        .then(response => res.status(200).json(response))
        .catch(error => res.status(200).json(error));
});

app.post('/be-avatar', upload.single('file'), (req, res) => {
    console.log(req.file, req.body);
    const file = fs.createWriteStream(req.file.originalName);
    const stream = req.file.stream.pipe(file);

    stream.on('finish', () => {
        return res.status(200).json({ status: 'Successfully upload to BE.', file });
    });
});

app.listen(8080, () => console.log('Server online | port:8080'));
