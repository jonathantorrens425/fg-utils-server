
var express = require('express');
var router = express.Router();
var ctrlEspn = require('./../controllers/ctrl-espn-injury-parser');

/* GET home page. */
router.get('/injuries', ctrlEspn.getEspnInjuries);

module.exports = router;