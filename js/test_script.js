var mysql = require('mysql');
var app = express();

var con = mysql.createConnection({
    host: "m4k-database.c947krbzy1fm.us-west-1.rds.amazonaws.com",
    user: "databois",
    password: "databoisroxx",
    database: "miracles"
});

con.connect(function(err) {
    if (err) throw err;
    con.query("SELECT * FROM DONORS", function (err, result) {
        if (err) throw err;
        console.log(result);
    });
});

app.get('/dowork',function(res,req){
    console.log(req.params.msg);
  /... code to do your work .../
});


