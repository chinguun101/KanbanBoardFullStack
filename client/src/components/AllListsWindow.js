import React, { useEffect, useState, useContext, useCallback } from "react";
import List from "./List";
import { useApi } from "../contexts/ApiProvider";
import AddList from "./ListAdd";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const Container = styled("div")({
  display: "flex",
  flexDirection: "column",
  overflowX: "auto",
  alignItems: "center", // Align items horizontally at the center
  justifyContent: "center", // Align items vertically at the center
  width: "100%",
  maxWidth: "1200px", // Adjust the maximum width as needed
  margin: "0 auto", // Center the container
});

const AllLists = () => {
  const api_provider = useApi();
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  const [data, setData] = useState({
    columns: {},
  });

  const fetchLists = useCallback(async () => {
    if (!isLoggedIn) {
      console.log("User not logged in, skipping fetchLists.");
      return;
    }
    try {
      const response = await api_provider.get("/lists");

      let columns = {};

      if (response.ok) {
        for (const list of response.body.lists) {
          columns[list.id] = {
            id: list.id,
            name: list.name,
            tasks: list.tasks,
          };
        }

        localStorage.setItem("columns", JSON.stringify(columns));

        setData({
          columns: columns,
        });
      }
      console.log("Fetched lists:", response.body);
      console.log("Data:", columns);
    } catch (error) {
      console.error("Failed to fetch lists:", error);
    } finally {
    }
  }, [api_provider, isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchLists();
    } else {
      console.log("User not logged in, skipping fetchLists.");
    }
  }, [fetchLists, isLoggedIn]);

  return (
    <>
      <AddList onUpdateLists={fetchLists} />
      <Container>
        {data.columns &&
          Object.values(data.columns).map((column, index) => {
            return (
              <List
                key={column.id}
                id={column.id}
                name={column.name}
                tasks={column.tasks}
                index={index}
                onUpdateLists={fetchLists}
              />
            );
          })}
      </Container>
    </>
  );
};

export default AllLists;
