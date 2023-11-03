import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Box,
} from "@mui/material";
import { useApi } from "../contexts/ApiProvider";

function AddList({ onUpdateLists }) {
  const [listName, setListName] = useState("");
  const [isNameValid, setNameValid] = useState(true);
  const [open, setOpen] = useState(false);
  const api_provider = useApi();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleListNameChange = (e) => {
    setNameValid(true);
    setListName(e.target.value);
  };

  async function addList(e) {
    e.preventDefault();
    if (!listName.trim()) {
      setNameValid(false);
      return;
    }
    const list = await api_provider.post("/add_list", { name: listName });
    onUpdateLists(list);
    setListName("");
    handleClose();
  }

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        marginY={2}
      >
        <Button variant="contained" color="primary" onClick={handleClickOpen}>
          Add New List
        </Button>
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add a New List</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the name for your new list.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="List Name"
            type="text"
            fullWidth
            variant="outlined"
            value={listName}
            onChange={handleListNameChange}
            error={!isNameValid}
            helperText={!isNameValid ? "List name cannot be empty" : ""}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={addList}>Add</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AddList;
