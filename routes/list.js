require("dotenv").config();
const express = require("express");
const router = express.Router();
const { checkJwtToken } = require("../controllers/userController");
const { createList, findUserLists, addToList, deleteList, removeFromList, updateToDo, findUser, addEditor } = require("../controllers/listController");

router.get("/", checkJwtToken, findUserLists, async (req, res) => {
  let data = req.data;
  let dupa = req.dupa;
  return res.render("list", { data, dupa });
});

router.post("/addList", checkJwtToken, createList, async (req, res) => {
  
  res.redirect('/list')
});

router.route("/:listId")
    .delete(checkJwtToken, deleteList)
    .post(checkJwtToken, addToList)

router.route("/toDo/:toDoId")
      .delete(checkJwtToken,removeFromList)
      .patch(checkJwtToken, updateToDo)

router.get("/:listId/:username", checkJwtToken, findUser, async (req,res) => {
})
router.post("/:listId/:username", checkJwtToken, addEditor, async(req,res) =>{

})
module.exports = router;
