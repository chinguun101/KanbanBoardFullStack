import React, { useState } from "react";
import {
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { useApi } from "../contexts/ApiProvider";

const ListActions = ({ columnId, initialName, onUpdateLists }) => {
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [editedName, setEditedName] = useState(initialName);
  const [isNameValid, setNameValid] = useState(true);
  const api_provider = useApi();

  const handleOpenEditDialog = () => {
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
  };

  const handleConfirmEdit = async () => {
    if (!editedName.trim()) {
      setNameValid(false);
      return;
    }

    try {
      const response = await api_provider.patch("/update_list_name", {
        id: columnId,
        name: editedName,
      });

      if (response.ok) {
        onUpdateLists();
      }
    } catch (error) {
      console.error("Error updating column name:", error);
    }

    handleCloseEditDialog();
  };

  async function deleteList() {
    try {
      const response = await api_provider.delete("/delete_list/" + columnId);

      if (!response.ok) {
        throw new Error("Failed to delete the list.");
      }

      onUpdateLists();
    } catch (error) {
      console.error("Error deleting the list:", error);
    }
  }

  return (
    <>
      <IconButton onClick={handleOpenEditDialog} color="secondary">
        <EditIcon />
      </IconButton>
      <IconButton onClick={deleteList} color="secondary">
        <RemoveCircleOutlineIcon />
      </IconButton>

      <Dialog open={isEditDialogOpen} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit list name</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            value={editedName}
            onChange={(e) => {
              setNameValid(true);
              setEditedName(e.target.value);
            }}
            error={!isNameValid}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmEdit}
            color="primary"
            disabled={!editedName.trim()}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ListActions;
