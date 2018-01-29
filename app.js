/**
 * Copyright 2017, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

// [START app]
const express = require('express');
const bluebird = require("bluebird")

const app = express();
const fs = require("fs");
const path = require("path");
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
const exec = require("child_process").exec;

app.get('/', (req, res) => {
  res.status(200).send('Hello, world!').end();
});


// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});


const generatePdf = function (filename, next) {
  exec('unoconv -f pdf "' + filename + '"', function (error, stdout, stderr) {
    if (error) return next(error);
    return next(null, "pdf of " + filename + " has been successfully generated.");
  });
};

const generatePdfAsync = bluebird.promisify(generatePdf);



app.post("/pdf", upload.any(), (req, res) => {
  //console.log(req.body) // form fields
  console.log(req.files) // form files
  let filename = req.files[0].filename;
  let path = req.files[0].path;
  //console.log(req["files"]);
  //content = req["files"][0];
  //contentName = req.files[0].file;

  
  generatePdfAsync(path)


});



// [END app]
