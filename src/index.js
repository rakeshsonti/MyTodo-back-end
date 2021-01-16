const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const port = 9999;
//middleware used for parsing body
app.use(
   cors({
      credentials: true,
      origin: "http://localhost:3000",
   })
);
mongoose.set("useFindAndModify", false);
app.use(express.json());
const url = "mongodb://localhost:27017/MyTodo";
//create a connection to mongodb
const db = new mongoose.createConnection(url, {
   useUnifiedTopology: true,
   useNewUrlParser: true,
});
const todoSchema = mongoose.Schema({
   creationTime: Date,
   task: String,
});
//model for todo
const todoModel = db.model("todoCollection", todoSchema);
app.post("/saveTodo", async (req, res) => {
   try {
      const { task } = req.body;
      console.log(task);
      const newObj = new todoModel({
         task: task,
         creationTime: new Date(),
      });
      await newObj.save();
      res.send({ success: "todo list saved successfully" });
   } catch (err) {
      console.log(err);
      res.status(401).send({ err: err });
   }
});
app.put("/updateTodo", async (req, res) => {
   const { id, newTask } = req.body;
   await todoModel.findByIdAndUpdate(
      {
         _id: id,
      },
      { task: newTask }
   );
   res.send({ success: "update successfuly" });
});
app.delete("/deleteTodo", async (req, res) => {
   const { id } = req.headers;
   console.log(id);
   await todoModel.findByIdAndDelete({ _id: id });
   res.send({ success: "deleted" });
});
app.get("/getTodo", async (req, res) => {
   const allTodo = await todoModel.find();
   res.send({ data: allTodo });
});
app.listen(port, () => {
   console.log(`App is listening on port${port}.........`);
});
