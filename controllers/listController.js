
const { listUserPermission, toDoList, toDoItem, User } = require("../models");
const { Op } = require("sequelize");

module.exports.createList = async (req, res, next) => {
  let { name } = req.body;
  let { decode } = res.locals
  let toDo = await toDoList.create({ name: name, UserId: decode.id });
  let permission = await listUserPermission.create({
    UserId: decode.id,
    toDoListId: toDo.id,
    isAuthor: true,
    isEditor: true,
  });
  res.body = toDo.id;
  req.body = toDo.id;
  next();
};

module.exports.deleteList = async (req, res, next) => {
  let { listId } = req.params;
  let { decode } = res.locals
  let ownership = await listUserPermission.findOne({
    where: { UserId: decode.id, toDoListId: listId, isAuthor: true },
  });
  if (ownership) {
    await toDoList.destroy({ where: { id: listId, UserId: decode.id } });
  }
  return res.redirect("/list");
};

module.exports.findUserLists = async (req, res, next) => {
  let { decode } = res.locals
  let permission = await listUserPermission.findAll({ where: { UserId: decode.id } });
  let result = [];
  let username = [];
  let editors = [];

  for(const permissions of permission) {
    editors = [];
    let test = await toDoList.findOne({ where: { id: permissions.toDoListId}, include: [ {model: toDoItem, as: 'toDoItem'} ] })
    let editorsPermissions = await listUserPermission.findAll({
      where: { toDoListId: permissions.toDoListId, isEditor: true },
    });

    for(const editorPermission of editorsPermissions) {
      username = await User.findOne({ where: { id: editorPermission.UserId } });
      editors.push(username.username);
    }

    if (permissions.isAuthor || permissions.isEditor) {
      result.push({
        username: decode.username,
        name: test.name,
        listId: test.id,
        listItems: test.toDoItem,
        isAuthor: permissions.isAuthor,
        editors: editors,
      });
    }
  }
  req.data = result;
  next();
};

module.exports.addToList = async (req, res, next) => {
  let { listId } = req.params;
  let { toDo } = req.body;
  let { decode } = res.locals
  try {
    let ownership = await listUserPermission.findOne({
      where: { toDoListId: listId, UserId: decode.id },
    });

    if (!ownership.isAuthor || !ownership.isEditor) {
      throw new Error("Permission denied");
    }
    await toDoItem.create({
      toDoListId: listId,
      text: toDo,
      isCompleted: false,
    });
  } catch (err) {
    console.log(err);
    return res.redirect(403, "/list");
  }
  return res.redirect("/list");
};

module.exports.removeFromList = async (req, res, next) => {
  let { toDoId } = req.params;
  let { decode } = res.locals
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
  let { decode } = res.locals
  let list = await toDoItem.findOne({ where: { id: toDoId } });
  let ownership = await listUserPermission.findOne({
    where: { UserId: decode.id, toDoListId: list.toDoListId },
  });
  if (ownership) {
    await toDoItem.update({ text: text }, { where: { id: toDoId } });
    res.status(302).send("Succes");
  }
};

module.exports.findUser = async (req, res, next) => {
  let { username } = req.params;

  let users = await User.findAll({ where: { username: { [Op.iLike]: `${username}%` } } });
  let data = [];
 
    for (let i = 0; i < users.length; i++) {
      data.push(users[i].username);
    }
    return res.json(data);
  
};

module.exports.addEditor = async (req, res, next) => {
  let newEditor;
  let { decode } = res.locals
  try {
    let { listId, username } = req.params;
    let user = await User.findOne({ where: { username: username } });
    let permission = await listUserPermission.findOne({
      where: { UserId: user.id, toDoListId: listId },
    });

    if (permission) {
      await permission.update({ isEditor: !permission.isEditor });
      let data = user.username;
      return res.json( data );
    } else {
      newEditor = await listUserPermission.build({
        UserId: user.id,
        toDoListId: listId,
        isAuthor: false,
        isEditor: true,
      });
      await newEditor.save();
    }
    res.json(newEditor);
  } catch (err) {
    res.status(400);
  }
};
