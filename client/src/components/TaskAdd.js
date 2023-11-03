import React, { useState } from "react";
import { useApi } from "../contexts/ApiProvider";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
} from "@mui/material";

function AddTaskForm({ onUpdateLists, listID }) {
  const [taskName, setTaskName] = useState("");
  const [isNameValid, setNameValid] = useState(true);
  const [open, setOpen] = useState(false);
  const api_provider = useApi();

  const handleTaskNameChange = (e) => {
    setNameValid(true);
    setTaskName(e.target.value);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTaskName(""); // Reset task name on close
    setNameValid(true); // Reset validation state
  };

  async function addTask() {
    if (!taskName.trim()) {
      setNameValid(false);
      return;
    }

    try {
      const new_task = await api_provider.post("/add_task", {
        name: taskName,
        id: listID,
      });

      if (new_task.ok) {
        console.log("Task added successfully:", new_task);
        setTaskName(""); // Reset the task name for next input
        setNameValid(true); // Reset validation state
        onUpdateLists();
      } else {
        console.error("Failed to add task:", new_task);
      }
    } catch (error) {
      console.error("Error while adding task:", error.message);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    addTask();
  };

  return (
    <Box display="flex" justifyContent="center" my={2}>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add Task
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add a New Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Task Name"
            type="text"
            fullWidth
            value={taskName}
            onChange={handleTaskNameChange}
            error={!isNameValid}
            helperText={!isNameValid ? "Task name cannot be empty" : ""}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AddTaskForm;
