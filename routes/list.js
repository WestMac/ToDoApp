require("dotenv").config();
const express = require("express");
const router = express.Router();
const { toDoList, listUserPermission, toDoItem } = require("../models");
const jwt = require("jsonwebtoken");
const { checkJwtToken } = require("../controllers/userController");
const { createList, findUserLists, addToList, deleteList, removeFromList, updateToDo } = require("../controllers/listController");

router.get("/", checkJwtToken, findUserLists, async (req, res) => {
  let data = req.data;
//   console.log(data)
  return res.render("list", { data });
});

router.post("/addList", checkJwtToken, createList, async (req, res) => {
  
});

router.route("/:listId")
    .delete(checkJwtToken, deleteList)
    .post(checkJwtToken, addToList)



router.route("/toDo/:toDoId")
      .delete(checkJwtToken,removeFromList)
      .patch(checkJwtToken, updateToDo)


module.exports = router;
