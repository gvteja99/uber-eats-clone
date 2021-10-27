// const { upload } = require("../service/fileUploadService");
import upload from "../service/fileUploadService.js";
import express from "express";

const router = express.Router();

router.post("/image/:entity",upload.single('image'),(req,res,next)=>{
    res.send({imageUrl:req.file.location});
});

// module.exports = router;
export default router;