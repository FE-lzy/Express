var express = require('express');
var router = express.Router();


var multer = require('multer');
var fs = require('fs');
var Mysqlconnect = require('mysql');
var sql = Mysqlconnect.createConnection({
    host:'localhost',
    user:'root',
    password:'czjoyrry',
    database:'trip'
  });
  sql.connect();
/* GET users listing. */
router.get('/', function(req, res, next) {
    var sql = Mysqlconnect.createConnection({
        host:'localhost',
        user:'root',
        password:'czjoyrry',
        database:'trip'
      });
      sql.connect();
        sql.query("select * from tour",[],function(err,data){
            console.log(data);
            res.send(data);
        });
    
});
// 登录
router.post('/login', function(req, res, next) {
      console.log(req.body.username);
        sql.query("select * from user_app where username = ? and password = ?",[req.body.username,req.body.password],function(err,data){
            console.log(data);
            if(err){
                console.log(err);
                return;
            }
            res.send(data);
        });
    
});
// 注册
router.post('/register', function(req, res, next) {
      console.log(req.body.username);
        sql.query("insert into user_app (username,password,phone) value (?,?,?)",[req.body.username,req.body.password,req.body.phone],function(err,data){
            console.log(data);
            if(err){
                console.log(err);
                return;
            }
            res.json({res_code:0});
        });
    
});
// 搜索记录
router.post('/searchadd', function(req, res, next) {
      console.log(req.body.username);
        sql.query("insert into search_his (uid,content) value (?,?)",[req.body.uid,req.body.content],function(err,data){
            console.log(data);
            if(err){
                console.log(err);
                return;
            }
            res.json({res_code:0});
        });
    
});
// 获取搜索历史
router.post('/getSearch',function(req,res,next){
    var id = req.query.id;
    
        sql.query("select *  from  search_his where uid = ? ",[req.query.id],function(err,data){
            console.log('data:',data);
            // res.send(data);
            if(err){
                console.log(err);
                return;
            }
            res.send(data);
            
        });
});
// 删除
router.get('/deleteSearch',function(req,res,next){
    
      var id = req.query.id;
        sql.query("delete from search_his where id = ?",[id],function(err,data){
            console.log(data);
            res.send(data);
        });
});
// 获取用户信息
router.get('/getInfo',function(req,res,next){
    var id = req.query.id;
   
        sql.query("select *  from  user_app where id = ? ",[req.query.id],function(err,data){
            console.log('data:',data);
            // res.send(data);
            if(err){
                console.log(err);
                return;
            }
            res.send(data);
            
        });
});
// 获取信息
router.get('/getTourList',function(req,res,next){
    var city = req.query.city;
    sql.query("select *  from  tour where city like ?",['%'+ city +'%'],function(err,data){
        console.log('data:',data);
        // res.send(data);
        if(err){
            console.log(err);
            return;
        }
        res.send(data);
    });
});

// 获取详情
router.get('/getTourDetail',function(req,res,next){
    var id = req.query.id;
    sql.query("select *  from  tour where id = ?",[id],function(err,data){
        console.log('data:',data);
        // res.send(data);
        if(err){
            console.log(err);
            return;
        }
        res.send(data);
        
    });
});
// 获取用户信息
router.post('/findPerson',function(req,res,next){
        sql.query("select *  from  user_app where username = ? and phone = ? ",[req.body.username,req.body.phone],function(err,data){
            console.log('data:',data);
            // res.send(data);
            if(err){
                console.log(err);
                return;
            }
            res.send(data);
            
        });
});
// 修改密码
router.post('/updatePwd',function(req,res,next){
        sql.query("update  user_app set password = ?  where id = ? ",[req.body.password,req.body.id],function(err,data){
            console.log('data:',data);
            // res.send(data);
            if(err){
                console.log(err);
                return;
            }
            res.json({res_code:0});
            
        });
    });
// 获取评论列表
router.get('/findTour',function(req,res,next){
    
    var name = req.query.name;

    sql.query("select *  from  tour  where name = ? ",[name],function(err,data){
        console.log('data:',data);
        // res.send(data);
        if(err){
            console.log(err);
            return;
        }
        res.send(data);
        
    });
});
// 获取评论列表
router.get('/selectComment',function(req,res,next){
   
    var tid = req.query.tid;
    
        sql.query("select *  from  comment,user_app  where comment.tid = ?  and comment.uid = user_app.id",[tid],function(err,data){
            console.log('data:',data);
            // res.send(data);
            if(err){
                console.log(err);
                return;
            }
            res.send(data);
            
        });
});
router.get('/keys',function(req,res,next){
      var name = req.query.name;
      console.log(name)
        sql.query("select * from tour where name= ?",[name],function(err,data){
            console.log(data);
            res.send(data);
        });
});
router.get('/delete',function(req,res,next){
      var id = req.query.id;
      console.log(id)
        sql.query("delete from tour where id = ?",[id],function(err,data){
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
var createFolder = function(folder){
    try{
        // 测试 path 指定的文件或目录的用户权限,我们用来检测文件是否存在
        // 如果文件路径不存在将会抛出错误"no such file or directory"
        fs.accessSync(folder); 
    }catch(e){
        // 文件夹不存在，以同步的方式创建文件目录。
        fs.mkdirSync(folder);
    }  
};

var uploadFolder = './upload/';
createFolder(uploadFolder);

// 创建 multer 对象
var upload = multer({ storage: storage });
router.post('/upload', upload.single('file'), function(req, res, next) {
    var file = req.file;
    console.log('文件类型：%s', file.mimetype);
    console.log('原始文件名：%s', file.originalname);
    console.log('文件大小：%s', file.size);
    console.log('文件保存路径：%s', file.path);
    // 接收文件成功后返回数据给前端
    res.json({res_code: '0',name:file.originalname,url:file.path});
});
// 新增
router.post('/addComment',function(req,res,next){
        sql.query("insert into comment (uid,tid,comment,createtime) values (?,?,?,?) ",[req.body.uid,req.body.tid,req.body.comment,req.body.createtime],function(err,data){
            console.log('data:',data);
            // res.send(data);
            if(err){
                console.log(err);
                return;
            }
            res.json({res_code:0});
        });

});
// 修改
router.post('/edit',function(req,res,next){
        sql.query("update user_app set username = ?,nickname = ?,phone = ?,sex = ? where id =? ",[req.body.username,req.body.nickname,req.body.phone,req.body.sex,req.body.id],function(err,data){
            console.log('data:',data);
            // res.send(data);
            if(err){
                console.log(err);
                return;
            }
            res.json({res_code:0});
        });

});
module.exports = router;