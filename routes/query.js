var express = require('express');
var router = express.Router();

var Mysqlconnect = require('mysql');
var sql = Mysqlconnect.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'czjoyrry',
    database: 'trip'
});
sql.connect();

var multer = require('multer');
var fs = require('fs');
/* GET users listing. */
router.get('/', function (req, res, next) {

    sql.query("select * from tour", [], function (err, data) {
        console.log(data);
        res.send(data);
    });

});
// 登录
router.post('/login', function (req, res, next) {
    sql.query("select * from user where username = ? and password = ?", [req.body.username, req.body.password], function (err, data) {
        console.log(data);
        if (err) {
            console.log(err);
            return;
        }
        res.send(data);
    });

});
// 获取信息
router.get('/getInfo', function (req, res, next) {
    var id = req.query.id;

    sql.query("select *  from  tour where id = ? ", [req.query.id], function (err, data) {
        console.log('data:', data);
        // res.send(data);
        if (err) {
            console.log(err);
            return;
        }
        res.send(data);

    });
});
router.get('/keys', function (req, res, next) {

    var name = req.query.name;
    console.log(name)
    sql.query("select * from tour where name= ?", [name], function (err, data) {
        console.log(data);
        res.send(data);
    });
});
router.get('/delete', function (req, res, next) {

    var id = req.query.id;
    console.log(id)
    sql.query("delete from tour where id = ?", [id], function (err, data) {
        console.log(data);
        res.send(data);
    });
});
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // 接收到文件后输出的保存路径（若不存在则需要创建）
        cb(null, 'upload/');
    },
    filename: function (req, file, cb) {
        // 将保存文件名设置为 时间戳 + 文件原始名，比如 151342376785-123.jpg
        cb(null, Date.now() + "-" + file.originalname);
    }
});

// 创建文件夹
var createFolder = function (folder) {
    try {
        // 测试 path 指定的文件或目录的用户权限,我们用来检测文件是否存在
        // 如果文件路径不存在将会抛出错误"no such file or directory"
        fs.accessSync(folder);
    } catch (e) {
        // 文件夹不存在，以同步的方式创建文件目录。
        fs.mkdirSync(folder);
    }
};

var uploadFolder = './upload/';
createFolder(uploadFolder);

// 创建 multer 对象
var upload = multer({ storage: storage });
router.post('/upload', upload.single('file'), function (req, res, next) {
    var file = req.file;
    console.log('文件类型：%s', file.mimetype);
    console.log('原始文件名：%s', file.originalname);
    console.log('文件大小：%s', file.size);
    console.log('文件保存路径：%s', file.path);
    // 接收文件成功后返回数据给前端
    res.json({ res_code: '0', name: file.originalname, url: file.path });
});
// 新增
router.post('/add', function (req, res, next) {

    var params = req.body.params.img;

    sql.query("insert into tour (name,intro,line,img,city) values (?,?,?,?,?) ", [req.body.params.name, req.body.params.intro, req.body.params.line, req.body.params.img, req.body.params.city], function (err, data) {
        console.log('data:', data);
        // res.send(data);
        if (err) {
            console.log(err);
            return;
        }
        res.json({ res_code: 0 });
    });

});
// 修改
router.post('/edit', function (req, res, next) {
    // console.log(req);
    var params = req.body.params.img;

    sql.query("update tour set name = ?,intro = ?,line = ?,img = ? ,city = ? where id =? ", [req.body.params.name, req.body.params.intro, req.body.params.line, req.body.params.img, req.body.params.city, req.body.params.id], function (err, data) {
        console.log('data:', data);
        // res.send(data);
        if (err) {
            console.log(err);
            return;
        }
        res.json({ res_code: 0 });
    });

});
module.exports = router;