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
var multer = require('multer')
var upload = multer({
  dest: 'uploads/'
})
const exec = require("child_process").exec;

var cloudinary = require("cloudinary");

bluebird.promisifyAll(cloudinary);
bluebird.promisifyAll(fs);

cloudinary.config({
  cloud_name: "blackpaper",
  api_key: "697688641462815",
  api_secret: "GgIQzx8UiQ1nrmPmVfq8Gh3cEuQ"
});


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


app.post("/pdf", upload.any(), async (req, res) => {
  //console.log(req.body) // form fields
  console.log(req.files) // form files
  let filename = req.files[0].filename;
  let path = req.files[0].path;
  //console.log(req["files"]);
  //content = req["files"][0];
  //contentName = req.files[0].file;


  generatePdf(path, function (err, result) {
    if (err) {
      console.log(err);
      return res.json({
        "error": err
      })
    }





    console.log(result);
    let filePath = "./" + path + ".pdf";
    console.log(filePath);

    let options = {};
    cloudinary.v2.uploader.upload(filePath, options).then(function (result) {
      console.log(filePath + " // has been uploaded");
      console.log(result);
      res.json({"pdf":result});

      fs.unlinkAsync(path).then(res => undefined).catch(err => console.log(err));
      fs.unlinkAsync(filePath) //filePath is pdf
                  .then(res => undefined)
                  .catch(err => console.log(err));

    }).catch(err => {
      console.log("Error in file upload");
      console.log(err);
      res.json({"error": err})
    });


    // res.send(fs.createReadStream(newPdf))
    /*
      fs.unlinkAsync(path).then(res => undefined).catch(err => console.log(err));
      fs.unlinkAsync(newPdf)
                  .then(res => undefined)
                  .catch(err => console.log(err));

    */
  });
});



// [END app]



/*
const test = () => {
  cloudinary.uploader.upload("doc.pdf", function (result) {
    console.log(result);
  });

};

export async function uploadDocument(filePath, public_id = null) {
  const options = {};
  if (public_id) {
    options["public_id"] = public_id;
  }
  return await cloudinary.v2.uploader.upload(filePath, options).then(function (result) {
    console.log(filePath + " // has been uploaded");
    console.log(result);
    return result;
  }).catch(err => {
    console.log("Error in file upload");
    console.log(err);
    return undefined;
  });
}

/*
{ public_id: "sample_document.docx",
resource_type: "raw",
raw_convert: "aspose"
}
*/
/*
export async function uploadWord(filePath, public_id = null) {
  const options = {};
  if (public_id) {
    options["public_id"] = public_id;
  }

  options["resource_type"] = "raw";

  return await cloudinary.v2.uploader.upload(filePath, options).then(function (result) {
    console.log(filePath + " // has been uploaded");
    console.log(result);
    return result;
  }).catch(err => {
    console.log("Error in file upload");
    console.log(err);
    return undefined;
  });
}


// Only call this once and save the URL.
// Question is, do we want to change the URL up every so often etc???
export async function createZipOfDocument(public_id) {
  console.log("GET DOWNLOAD URL FOR: " + public_id);
  return await cloudinary.v2.uploader.create_zip({ public_ids: public_id })
    .then(result => {
      console.log(result);
      return result;
    }).catch(error => console.log(error));
}

// createZipOfDocument("yiqbqlomynttguehkwko");
// uploadDocument("./doc.pdf");

// test(); => Save PDF
/// Good way to save files
/*


{
  public_id: 'yiqbqlomynttguehkwko',
  version: 1514573624,
  signature: '223a495a2c104c440455fc1c930350385ef77b4c',
  width: 612,
  height: 792,
  format: 'pdf',
  resource_type: 'image',
  created_at: '2017-12-29T18:53:45Z',
  tags: [],
  pages: 16,
  bytes: 92399,
  type: 'upload',
  etag: '836266cca2bbda7cd49045040531e8c0',
  placeholder: false,
  url: 'http://res.cloudinary.com/blackpaper/image/upload/v1514573624/yiqbqlomynttguehkwko.pdf',
  secure_url: 'https://res.cloudinary.com/blackpaper/image/upload/v1514573624/yiqbqlomynttguehkwko.pdf',
  original_filename: 'doc'
}
*/