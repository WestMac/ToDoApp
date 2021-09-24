require('dotenv').config();
const jwt = require("jsonwebtoken");
const { listUserPermission, toDoList, toDoItem, User } = require("../models");
const { Op } = require("sequelize");

module.exports.createList = async (req, res, next) => {
  let { name } = req.body;
  const token = await req.cookies.token;
  const decode = jwt.verify(token, process.env.JWT_SECRET);
  let toDo = await toDoList.create({ name: name, UserId: decode.id });
  let permission = await listUserPermission.create({
    UserId: decode.id,
    toDoListId: toDo.id,
    isAuthor: true,
    isEditor: true,
  });
  return res.redirect("/list");
};

module.exports.deleteList = async (req, res, next) => {
  let { listId } = req.params;
  const token = await req.cookies.token;
  const decode = jwt.verify(token, process.env.JWT_SECRET);
  let ownership = await listUserPermission.findOne({
    where: { UserId: decode.id, toDoListId: listId, isAuthor: true },
  });
  if (ownership) {
    await toDoList.destroy({ where: { id: listId, UserId: decode.id } });
  }
  return res.redirect("/list");
};

module.exports.findUserLists = async (req, res, next) => {
  const token = await req.cookies.token;
  const decode = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.redirect("login");
    }
    return decoded;
  });
  let data = await listUserPermission.findAll({ where: { UserId: decode.id } });
 
  let result = [];
  let username = [];
  let editors = [];
 
  for (let i = 0; i < data.length; i++) {
    editors = [];
    
    let items = await toDoItem.findAll({ where: { toDoListId: data[i].toDoListId } });
    let lists = await toDoList.findOne({ where: { id: data[i].toDoListId } });
    let editorsPermission = await listUserPermission.findAll({ where: { toDoListId: data[i].toDoListId, isEditor: true} } )
    
    for(let k = 0; k < editorsPermission.length; k++) {
      username = await User.findOne({where: { id: editorsPermission[k].UserId } })
      editors.push(username.username)  
    }
       
if(data[i].isAutor || data[i].isEditor) {
    result.push({
      username: decode.username,
      name: lists.name,
      listId: lists.id,
      listItems: items,
      isAuthor: data[i].isAuthor,
      editors: editors
    });
  }
  }
  req.data = result;
  next();
};

module.exports.addToList = async (req, res, next) => {
  let { listId } = req.params;
  let { toDo } = req.body;
  await toDoItem.create({
    toDoListId: listId,
    text: toDo,
    isCompleted: false,
  });
  return res.redirect("/list");
};

module.exports.removeFromList = async (req, res, next) => {
  let { toDoId } = req.params;
  const token = await req.cookies.token;
  const decode = jwt.verify(token, process.env.JWT_SECRET);
  let list = await toDoItem.findOne({ where: { id: toDoId } });
  let ownership = await listUserPermission.findOne({
    where: { UserId: decode.id, toDoListId: list.toDoListId },
  });
  if (ownership) {
    await toDoItem.destroy({ where: { id: toDoId } });
  }
  return res.redirect("/list");
};

module.exports.updateToDo = async (req, res, next) => {
  let { toDoId } = req.params;
  let { text } = req.body;
  const token = await req.cookies.token;
  const decode = jwt.verify(token, process.env.JWT_SECRET);
  let list = await toDoItem.findOne({ where: { id: toDoId } });
  let ownership = await listUserPermission.findOne({
    where: { UserId: decode.id, toDoListId: list.toDoListId },
  });
  if (ownership) {
    await toDoItem.update({ text: text }, { where: { id: toDoId } });
  }
};

module.exports.findUser = async (req, res, next) => {
  const token = await req.cookies.token;
  const decode = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.redirect("login");
    }
    return decoded;
  });
  let { listId, username } = req.params;

  let users = await User.findAll({ where: { username: { [Op.iLike]: `${username}%` } } });
  let data = [];
  if (users.length) {
    for (let i = 0; i < users.length; i++) {
      data.push(users[i].username);
    }
    return res.json(data);
  }
};

module.exports.addEditor = async (req, res, next) => {
  let newEditor;
  const token = await req.cookies.token;
  const decode = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.redirect("login");
    }
    return decoded;
  });
  let { listId, username } = req.params;
  let user = await User.findOne({ where: { username: username } });
  let permission = await listUserPermission.findOne({
    where: { UserId: user.id, toDoListId: listId },
  });
  console.log(listId,username)
  if (permission) {
    await permission.update({ isEditor: !permission.isEditor });
  } else {
      newEditor = await listUserPermission.build({
      UserId: user.id,
      toDoListId: listId,
      isAuthor: false,
      isEditor: true,
    });
    await newEditor.save();
  }

  return res.redirect("back");
};
