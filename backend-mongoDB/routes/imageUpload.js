// const { upload } = require("../service/fileUploadService");
import uploadFile, {getFileStream} from "../service/fileUploadService.js";
import express from "express";
import multer from 'multer';
import Customers from "../Models/customers.js";

const upload = multer({dest: 'uploads/'})

const router = express.Router();

router.get("/images/:key", (req, res) => {
    const key = req.params.key;
    const readStream = getFileStream(key);
    readStream.pipe(res);
})
router.post("/image/customer/:id", upload.single('image'), async (req,res,next)=>{
    // res.send({imageUrl:req.file.location});
    const id = req.params.id;
    console.log("id", id);
    console.log(JSON.stringify(req.file));
    console.log("boday==", JSON.stringify(req.body));
    const file = req.file
    const result = await uploadFile(file);
    let customer = await Customers.findById( id );
    customer.profile_pic = `/images/${result.key}`;
    const updatedCustomer = await customer.save();
    console.log("====result", result);
    res.status(200).json(updatedCustomer)
});

// module.exports = router;
export default router;