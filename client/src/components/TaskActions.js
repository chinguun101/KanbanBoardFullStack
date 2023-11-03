import React, { useState } from "react";
import {
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/RemoveCircleOutline";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useApi } from "../contexts/ApiProvider";
import MoveTask from "./TaskMove";
import { styled } from "@mui/material/styles";

const TaskActions = ({ task, onUpdateLists, onSubtaskAdded }) => {
  const api = useApi();
  const [openDialog, setOpenDialog] = useState(false);
  const [subtaskName, setSubtaskName] = useState("");
  const [openMoveDialog, setOpenMoveDialog] = useState(false);

  const handleOpenMoveDialog = () => {
    setOpenMoveDialog(true);
  };

  const handleCloseMoveDialog = () => {
    setOpenMoveDialog(false);
  };

  const handleDeleteTask = async () => {
    try {
      await api.delete(`/tasks/${task.id}/delete`);
      onUpdateLists();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleAddSubtask = async (subtaskName) => {
    try {
      await api.post(`/tasks/${task.id}/add_subtask`, {
        name: subtaskName,
        list_id: task.list_id,
      });
      onUpdateLists();
      onSubtaskAdded();
    } catch (error) {
      console.error("Failed to add subtask:", error);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSubtaskName("");
  };

  const handleConfirmAddSubtask = async () => {
    if (subtaskName) {
      await handleAddSubtask(subtaskName);
    }
    handleCloseDialog();
  };

  const SmallIconButton = styled(IconButton)({
    padding: 1,
  });

  return (
    <>
      <Tooltip title="Add Subtask">
        <SmallIconButton
          onClick={handleOpenDialog}
          aria-label="Add subtask"
          color="secondary"
        >
          <AddIcon />
        </SmallIconButton>
      </Tooltip>
      <Tooltip title="Move Task">
        <SmallIconButton
          size="small"
          onClick={handleOpenMoveDialog}
          aria-label="Move task"
          color="secondary"
        >
          <ArrowForwardIcon />
        </SmallIconButton>
      </Tooltip>
      <Tooltip title="Delete Task">
        <SmallIconButton
          onClick={handleDeleteTask}
          aria-label="Delete task"
          color="secondary"
        >
          <DeleteIcon />
        </SmallIconButton>
      </Tooltip>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add Subtask</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ marginBottom: "1rem" }}>
            Please enter the name for the new subtask.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Subtask Name"
            type="text"
            fullWidth
            value={subtaskName}
            onChange={(e) => setSubtaskName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirmAddSubtask} color="secondary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <MoveTask
        open={openMoveDialog}
        onClose={handleCloseMoveDialog}
        task={task}
        fetchLists={onUpdateLists}
      />
    </>
  );
};

export default TaskActions;
