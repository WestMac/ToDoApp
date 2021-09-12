const jwt = require("jsonwebtoken");
const { listUserPermission, toDoList, toDoItem } = require("../models");

module.exports.createList = async (req, res, next) => {
  let { name } = req.body;
  const token = await req.cookies.token;
  const decode = jwt.verify(token, process.env.JWT_SECRET);
  let toDo = await toDoList.create({ name: name, userId: decode.id });
  let permission = await listUserPermission.create({
    UserId: decode.id,
    toDoListId: toDo.id,
    isAuthor: true,
    isEditor: true,
  });
  return res.redirect("/list");
};

module.exports.deleteList = async (req,res,next) => {
    let { listId } = req.params;
    const token = await req.cookies.token;
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    let ownership = await listUserPermission.findOne({where: {UserId: decode.id, toDoListId: listId, isAuthor: true}})
    if(ownership) {await toDoList.destroy({where: { id: listId, userId: decode.id }})}
    return res.redirect('/list')    
}


module.exports.findUserLists = async (req, res, next) => {
  const token = await req.cookies.token;
  const decode = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.redirect("login");
    }
    return decoded;
  });
  let data = await listUserPermission.findAll({ where: { UserId: decode.id } });
  let lists = await toDoList.findAll({ where: { userId: decode.id } });

  let result = [];

  for (let i = 0; i < data.length; i++) {
    let items = await toDoItem.findAll({where: {toDoListId: lists[i].id }})
      
    result.push({
      name: lists[i].name,
      listId: lists[i].id,
      listItems: items,
      isAuthor: data[i].isAuthor,
      isEditor: data[i].isEditor,
    });
  }
  req.data = result;
  next();
};

module.exports.addToList = async (req,res,next) => {
    let { listId } = req.params
    let { toDo } = req.body
      await toDoItem.create({
        toDoListId: listId,
        text: toDo,
        isCompleted: false
      })
      return res.redirect('/list')
}

module.exports.removeFromList = async(req,res,next) => {
 
    let { toDoId } = req.params;
    const token = await req.cookies.token;
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    let list = await toDoItem.findOne({where: {id: toDoId}})
    let ownership = await listUserPermission.findOne({where : {UserId: decode.id, toDoListId: list.toDoListId}})
    if(ownership){
     await toDoItem.destroy({ where: {id:toDoId}})
    }
    next();
}