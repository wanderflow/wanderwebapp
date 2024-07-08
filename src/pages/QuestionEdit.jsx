import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

function App() {
  if (!sessionStorage.getItem("auth-token")) {
    console.log("no auth token set");
    //do something like redirect to login page
  } else {
    const authToken = "13H2UThXTF";
    if (sessionStorage.getItem("auth-token") == authToken) {
      console.log("good token. Log in.");
      <Navigate to="/edit" />;
    } else {
      console.log("bad token.");
      <Navigate to="/login" />;
    }
  }

  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [answerFilter, setAnswerFilter] = useState("");
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editQuestionText, setEditQuestionText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/testdata.json"); // Adjust the path if necessary
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleAnswerFilterChange = (e) => {
    setAnswerFilter(e.target.value);
  };

  const handleEdit = (originalIndex) => {
    setEditingIndex(originalIndex);
    setEditQuestionText(data[originalIndex].question);
  };

  const handleSave = () => {
    const newData = [...data];
    newData[editingIndex].question = editQuestionText;
    setData(newData);
    setEditingIndex(-1); // Exit editing mode
  };

  const handleCancel = () => {
    setEditingIndex(-1); // Exit editing mode
  };

  const handleEditQuestionChange = (e) => {
    setEditQuestionText(e.target.value);
  };

  const filteredData = data
    .map((item, index) => ({ ...item, originalIndex: index }))
    .filter((item) => {
      if (filter === "createdByAI") {
        return item.isCreatedByAI;
      } else if (filter === "notCreatedByAI") {
        return !item.isCreatedByAI;
      }
      return true;
    })
    .filter((item) => {
      if (answerFilter) {
        return item.NumberOfAnswers === parseInt(answerFilter, 10);
      }
      return true;
    });

  const displayedData = filteredData.filter((item) =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>Search and Filter</h1>
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ marginRight: "10px" }}
        />
        <select
          value={filter}
          onChange={handleFilterChange}
          style={{ marginRight: "10px" }}
        >
          <option value="all">All</option>
          <option value="createdByAI">Created by AI</option>
          <option value="notCreatedByAI">Not created by AI</option>
        </select>
        <input
          type="number"
          placeholder="Number of Answers"
          value={answerFilter}
          onChange={handleAnswerFilterChange}
          style={{ marginRight: "10px" }}
        />
      </div>
      <h2>Filtered Data</h2>
      <table>
        <thead>
          <tr>
            <th>Date & Time</th>
            <th>Question</th>
            <th>Data</th>
            <th>Created by AI</th>
            <th>Number of Answers</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayedData.map((item) => (
            <tr key={item.originalIndex}>
              <td>
                {editingIndex === item.originalIndex ? (
                  <input
                    type="text"
                    value={editQuestionText}
                    onChange={handleEditQuestionChange}
                  />
                ) : (
                  item.question
                )}
              </td>
              <td>{item.data}</td>
              <td>{item.isCreatedByAI ? "Yes" : "No"}</td>
              <td>{item.NumberOfAnswers}</td>
              <td>
                {editingIndex === item.originalIndex ? (
                  <>
                    <button onClick={handleSave}>Save</button>
                    <button onClick={handleCancel}>Cancel</button>
                  </>
                ) : (
                  <button onClick={() => handleEdit(item.originalIndex)}>
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
