import aws from 'aws-sdk';
// var aws = require('aws-sdk');
// import multer from 'multer';
// import multerS3 from 'multer-s3';
import config from '../utils/config.js';
// const multer = require('multer');
// const multerS3 = require('multer-s3');
// const config = require('../utils/config.js');
import S3 from 'aws-sdk/clients/s3.js';
import fs from 'fs';

const bucketName = "ubereatsayush";
const region = "us-east-2";
const awsAccessKey = config.awsAccessKey;
const awsSecretKey = config.awsSecretKey;

const s3 = new aws.S3({
  region,
  accessKeyId: awsAccessKey,
  secretAccessKey: awsSecretKey,
});

// aws.config.update({
//   accessKeyId: awsAccessKey,
//   secretAccessKey: awsSecretKey,
//   region: "us-east-2",
// })

export function uploadFile(file) {
  // console.log("fileDesc", file);
  const fileStream = fs.createReadStream(file.path)
  // console.log("file", file);

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename,
  }

  return s3.upload(uploadParams).promise()
}

export function getFileStream(fileKey) {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName
  }
  return s3.getObject(downloadParams).createReadStream()
}

export default uploadFile

// const isImage = (req,file,callbck)=>{
//     if(file.mimetype.startsWith('image')){
//       callbck(null,true)
//     }else{
//         callbck(new Error('Only Image is allowed'))
//     }
// }

// var upload = multer({
//     fileFilter : isImage,
//     storage: multerS3({
//       s3: s3,
//       bucket: bucketName,
//       acl: 'public-read',
//       metadata: function (req, file, cb) {
//         cb(null, {fieldName: 'testing'});
//       },
//       key: function (req, file, cb) {
//         const ext = file.mimetype.split("/")[1];
//         const imagePath = req.params.entity + "/" + Date.now().toString() + "." + ext;
//         cb(null, imagePath);
//       }
//     })
//   });
  
// exports.upload = upload;
// export default upload;
