const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const bodyParser = require('body-parser');
var path = require('path');

const app = express();
const port = 3000;

app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"))

function checkIdExists(req, res, next) {
    fs.readFile('./dev-data/todos.json', 'utf-8', (err, data) => {
        if (err) {
            res.send(401).json({ message: "Bad Request" });
        }
        let todos = JSON.parse(data);
        // Initial for req.todo and req.check
        req.todo = [];
        req.check = 0;
        req.index = -1;
        req.id = -1;
        req.todos = todos;
        // Filter request in data
        req.id = todos[todos.length - 1].id + 1;
        req.todo = todos.reduce((obj, item, _index) => {
            if (item.id == req.params.id) {
                obj.push(item);
                req.index = _index;
            }
            return obj;
        }, []);
        if (req.todo.length != 0) {
            req.check = 1;
        }
        next();
    })
}

function checkTitleExists(req, res, next) {
    fs.readFile('./dev-data/todos.json', 'utf-8', (err, data) => {
        if (err) {
            res.send(401).json({ message: "Bad Request" });
        }
        let todos = JSON.parse(data);
        // Initial for req.todo and req.check
        req.todo = [];
        req.check = 0;
        req.index = -1;
        req.id = -1;
        req.todos = todos;
        // Filter request in data

        req.id = todos[todos.length - 1].id + 1;
        req.todo = todos.filter((item) => {
            return item.title == req.body.title;
        });
        if (req.todo.length != 0) {
            req.check = 1;
        }
        next();
    })

}

let updateTodos = (data, id, newObj) => {
    return data.reduce((obj, item) => {
        if (id == item.id) {
            let updateOpj = {
                ...item
            }
            for (var key in newObj) {
                updateOpj[key] = newObj[key];
            }
            obj.push(updateOpj);
        }
        else {
            obj.push(item)
        }
        return obj
    }, [])
};
function checkNumPage(req, res, next) {
    if (Object.keys(req.query).length === 0 || Object.keys(req.query).length > 1) {
        req.checkPage = 0;
        next();
    }
    else {
        let keys = Object.keys(req.query);
        req.page = Number(req.query[keys[0]]);
        fs.readFile('./dev-data/todos.json', 'utf-8', (err, data) => {
            if (err) {
                res.status(401).json({ message: "Bad Request" });
            }
            else{
                let todos = JSON.parse(data);
                let len = todos.length;
                let totalPage = 0;
                if (len % 5 == 0) {
                    totalPage = len / 5;
                }
                else {
                    totalPage = Math.floor(len / 5) + 1;
                }
                let newTodos = [];
                let startPage = req.page;
                if (startPage < totalPage - 1) {
                    req.checkPage = 1;
                    let startIndex = startPage * 5;
                    let endIndex = startIndex + 5;
                    if (endIndex > data.length) {
                        endIndex = data.length
                    }
                    for (let i = startIndex; i < endIndex; i++) {
                        newTodos.push(todos[i]);
                    };
                    req.newTodos = newTodos;
                    next();
                }
                else {
                    req.checkPage = 0;
                    next();
                }
            }
        });
    }
}

app.get('/api/v1/todos', checkNumPage, (req, res) => {
    if (req.checkPage == 1) {
        res.status(200).json(req.newTodos);
    }
    else {
        fs.readFile('./dev-data/todos.json', 'utf-8', (err, data) => {
            if (err) {
                res.status(401).json({ message: "Bad Request" });
            }
            let todos = JSON.parse(data);
            res.status(200).json(todos);
        });
    }
});

app.get('/api/v1/todos/:id', checkIdExists, (req, res) => {
    if (req.check == 1) {
        res.status(200).json(req.todo);
    }
    else {
        res.status(201).json({ message: "Todo not found" });
    }
});

app.post('/api/v1/todos', checkTitleExists, (req, res) => {
    if (req.check == 0) {
        let newTodo = {
            id: req.id,
            ...req.body
        };
        req.todos.push(newTodo);
        fs.writeFile('./dev-data/todos.json', JSON.stringify(req.todos), (err) => {
            if (err) {
                res.status(401).json({ message: "Bad Request" });
            }
            res.status(200).json({ message: "Create successfully" });
        })
    }
    else {
        res.status(202).json({ message: "Todo already exists" });
    }
});

app.put('/api/v1/todos/:id', checkIdExists, (req, res) => {
    if (req.check == 1) {
        let newTodos = updateTodos(req.todos, Number(req.params.id), req.body);
        fs.writeFile('./dev-data/todos.json', JSON.stringify(newTodos), (err) => {
            if (err) {
                res.status(401).json({ message: "Bad Request" });
            }
            res.status(200).json({ message: "Update successfully" });
        });
    }
    else {
        res.status(201).json({ message: "Todo not found" });
    }
});

app.delete('/api/v1/todos/:id', checkIdExists, (req, res) => {
    if (req.check == 1) {
        req.todos.splice(req.index, 1);
        fs.writeFile('./dev-data/todos.json', JSON.stringify(req.todos), (err) => {
            if (err) {
                res.status(401).json({ message: "Bad Request" });
            }
            res.status(200).json({ message: "Delete successfully" });
        })
    }
    else {
        res.status(201).json({ message: "Todo not found" });
    }
});

app.get('/', (req, res) => {
    var options = {
        root: path.join(__dirname, './public')
    };
    res.sendFile('index.html', options);
});
app.get('/page/:id', (req, res) => {
    var options = {
        root: path.join(__dirname, './public')
    };
    res.sendFile('index.html', options);
});

app.listen(port, () => {
    console.log(`Example app listening on port http://127.0.0.1:${port}`);
});

// Làm thế nào để cập nhật lại dữ liệu mà không load lại trang web
// Nếu load lại trang web thì làm thế nào để cập nhật lại trạng thái trước đó người dùng đang xem