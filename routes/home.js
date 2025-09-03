const express = require('express');
const axios = require('axios');
const router = express.Router();
const path = require('path');
// Git
router.get('/', (req, res) => {
    try {
        console.log("This is Home Js" , __filename);
        res.sendFile(path.join(__dirname, '../public/randomRecipe.html'));        
    } catch (error) {
        console.log("The Error in Home Js", error);
        res.status(500).send("Internal Server Error"); // إضافة معالجة الخطأ
    }
});

module.exports = router;