var express = require('express');
var app = express();
var url = require("url");
var path = require("path");
var fs = require("fs");

var bodyParser = require('body-parser');
var multer = require('multer');

// app.get('/index.html', function (req, res) {
//     res.sendFile(__dirname + "/" + "index.html");
// })


//上传请求路径是/file_upload，然后图片其实是写到/upload里，客户端获取图片也是从upload里获取
var getImg = function (req, res, next) {

    console.log("aabbcc");
    console.log(req.url);

    var pathname = __dirname + url.parse(req.url).pathname;
    console.log(pathname);

    if (pathname.indexOf("/file_upload") >= 0) {
        console.log("next");
        return next();
    }

    console.log("eeee");

    if (path.extname(pathname) == "") {
        pathname += "/";
    }
    console.log(pathname);
    if (pathname.charAt(pathname.length - 1) == "/") {
        pathname += "index.html";
    }
    console.log(pathname);

    if (path.isAbsolute(pathname)) {
        switch (path.extname(pathname)) {
            case ".html":
                res.writeHead(200, {
                    "Content-Type": "text/html"
                });
                break;
            case ".js":
                res.writeHead(200, {
                    "Content-Type": "text/javascript"
                });
                break;
            case ".css":
                res.writeHead(200, {
                    "Content-Type": "text/css"
                });
                break;
            case ".gif":
                res.writeHead(200, {
                    "Content-Type": "image/gif"
                });
                break;
            case ".jpg":
                res.writeHead(200, {
                    "Content-Type": "image/jpeg"
                });
                break;
            case ".png":
                res.writeHead(200, {
                    "Content-Type": "image/png"
                });
                break;
            default:
                res.writeHead(200, {
                    "Content-Type": "application/octet-stream"
                });
        }

        fs.readFile(pathname, function (err, data) {
            res.end(data);
        });
    } else {
        res.writeHead(404, {
            "Content-Type": "text/html"
        });
        res.end("<h1>404 Not Found</h1>");
    }
};

app.all('*', getImg);

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(multer({dest: '/tmp/'}).array('img'));

app.post('/file_upload', function (req, res) {

    console.log("upload");  // 上传的文件信息
    console.log(req.files[0]);  // 上传的文件信息

    var des_file = __dirname + "/upload/" + req.files[0].originalname;
    fs.readFile(req.files[0].path, function (err, data) {
        fs.writeFile(des_file, data, function (err) {
            if (err) {
                console.log(err);
            } else {
                response = {
                    message: 'File uploaded successfully',
                    filename: req.files[0].originalname
                };
            }
            console.log(response);
            res.end(JSON.stringify(response));
        });
    });
})


var server = app.listen(8081, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("应用实例，访问地址为 http://%s:%s", host, port)

})