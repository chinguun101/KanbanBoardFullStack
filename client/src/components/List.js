import React from "react";
import AddTaskForm from "./TaskAdd";
import { styled } from "@mui/material/styles";
import AccordionTaskViewer from "./AccordionTaskViewer.js";
import ListActions from "./ListActions";
import { useRef, useState, useEffect } from "react";

const Container = styled("div")({
  margin: "1.5rem 0.6rem",
  border: "2px solid #ddd",
  borderRadius: "5px",
  width: "80vw", // Increase the width
  height: "auto", // Adjust the height as needed
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#f4f7fa",
  minWidth: "300px", // Adjust the minimum width as needed
  maxWidth: "1000px", // Set a maximum width
  margin: "20px auto", // Center the list
  justifyContent: "center", // Center the title
});

const TasksContainer = styled("div")({
  flexGrow: 1,
  overflowY: "auto",
  padding: "0.5rem",
});

const AddTaskContainer = styled("div")({
  borderTop: "1px solid #ccc",
  paddingTop: "0.5rem", // reduced padding
  paddingBottom: "0.5rem", // reduced padding
});

const ButtonContainer = styled("div")({});

const TitleContainer = styled("div")({
  display: "flex",
  justifyContent: "space-between", // Space between title and buttons
  alignItems: "center",
  padding: "0 0.8rem",
  borderBottom: "1px solid #ccc",
  paddingBottom: "0.5rem",
});

const Title = styled("h3")({
  margin: "0.8rem 0",
  color: "black",
  fontSize: "0.9rem",
  flexGrow: 1, // Allows the title to take up the available space
  textAlign: "center", // Centers the title text
});

const List = ({ id, name, tasks, onUpdateLists }) => {
  const buttonContainerRef = useRef(null);
  const [buttonContainerWidth, setButtonContainerWidth] = useState(0);

  useEffect(() => {
    if (buttonContainerRef.current) {
      setButtonContainerWidth(buttonContainerRef.current.offsetWidth);
    }
  }, [buttonContainerRef.current]); // Dependency array ensures effect runs when ref changes

  const Spacer = styled("div")({
    width: `${buttonContainerWidth}px`, // Set width dynamically
    visibility: "hidden",
  });

  return (
    <Container>
      <TitleContainer>
        <Spacer /> {/* Invisible spacer */}
        <Title>{name}</Title>
        <ButtonContainer ref={buttonContainerRef}>
          <ListActions
            columnId={id}
            initialName={name}
            onUpdateLists={onUpdateLists}
          />
        </ButtonContainer>
      </TitleContainer>
      <TasksContainer>
        {tasks.map((task) => (
          <AccordionTaskViewer
            key={task.id}
            task={task}
            onUpdateLists={onUpdateLists}
          />
        ))}
      </TasksContainer>

      <AddTaskContainer>
        <AddTaskForm onUpdateLists={onUpdateLists} listID={id} />
      </AddTaskContainer>
    </Container>
  );
};

export default List;
