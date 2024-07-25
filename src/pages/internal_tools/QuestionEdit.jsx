import React, { useEffect, useState } from "react";
import {
  expressionsExpress,
  deleteExpression,
  deleteExpress,
  searchExpress,
  editExpress,
} from "@/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import "moment/locale/en-gb";

const QuestionsTable = () => {
  const [allData, setAllData] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [originalData, setOriginalData] = useState({});

  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);

  const [editingQuestion, setEditingQuestion] = useState(null);
  const [newExpressQuestion, setNewExpressQuestion] = useState("");

  const getQuestions = async () => {
    try {
      let response = await expressionsExpress({
        page: pageNumber,
        page_size: pageSize,
      });
      const nestledData = response.data;
      const grouped = nestledData.reduce((dataSoFar, item) => {
        const { express_question } = item;
        if (!dataSoFar[express_question]) dataSoFar[express_question] = [];
        dataSoFar[express_question].push(item);
        return dataSoFar;
      }, {});
      setOriginalData(grouped);
      setAllData(grouped);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  useEffect(() => {
    if (pageSize != 0 || pageNumber.length != 0) {
      getQuestions();
    }
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  // enter page number and size
  const handlePageNumberChange = (event) => {
    const newPageNumber = Number(event.target.value);
    if (newPageNumber > 0) {
      setPageNumber(newPageNumber);
    }
  };

  const handlePageSizeChange = (event) => {
    const newPageSize = Number(event.target.value);
    if (newPageSize > 0) {
      setPageSize(newPageSize);
    }
  };

  // search functions
  const handleSearch = async () => {
    if (searchTerm.trim() === "") {
      setAllData(originalData);
      return;
    }

    try {
      const response = await searchExpress({
        search_word: searchTerm,
        page: pageNumber,
        page_size: pageSize,
      });

      if (response && response.data) {
        const nestledData = response.data;
        const grouped = nestledData.reduce((dataSoFar, item) => {
          const { express_question } = item;
          if (!dataSoFar[express_question]) dataSoFar[express_question] = [];
          dataSoFar[express_question].push(item);
          return dataSoFar;
        }, {});
        setAllData(grouped);
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const handleReset = () => {
    setSearchTerm("");
    setAllData(originalData);
    setPageNumber(1);
    setPageSize(100);
  };

  // edit functions
  const handleEditQuestion = (
    express_pk,
    express_sk,
    currentExpressQuestion
  ) => {
    setEditingQuestion({ express_pk, express_sk });
    setNewExpressQuestion(currentExpressQuestion);
  };

  const handleSaveEditQuestion = async () => {
    const { express_pk, express_sk } = editingQuestion;
    if (!newExpressQuestion.trim()) {
      alert("The question cannot be empty.");
      return;
    }
    if (window.confirm("Are you sure you want to save this edit?")) {
      try {
        await editExpress({
          express_pk,
          express_sk,
          new_express: newExpressQuestion,
        });
        const updatedData = { ...allData };
        console.log(updatedData);
        for (const key in updatedData) {
          updatedData[key] = updatedData[key].map((item) => {
            if (item.express_pk === express_pk && item.SK_y === express_sk) {
              return { ...item, express_question: newExpressQuestion };
            }
            return item;
          });
          if (updatedData[key].length === 0) delete updatedData[key];
        }
        setAllData(updatedData);
        setEditingQuestion(null);
        setNewExpressQuestion("");
        console.log(allData);
      } catch (error) {
        console.error("Error editing question:", error);
      }
    }
  };

  // delete functions
  const handleDeleteQuestion = async (express_pk, express_sk) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        const success = await deleteExpress({ express_pk, express_sk });
        console.log("Delete Response:", success.message);

        const updatedData = { ...allData };
        for (const key in updatedData) {
          updatedData[key] = updatedData[key].filter(
            (item) =>
              !(item.express_pk === express_pk && item.SK_y === express_sk)
          );
          if (updatedData[key].length === 0) delete updatedData[key];
        }
        setAllData(updatedData);
      } catch (error) {
        console.error("Error deleting question:", error);
        alert(
          `Error deleting question: ${JSON.stringify(
            error.success ? error.success.data : error.message
          )}`
        );
      }
    }
  };

  const handleDeleteAnswer = async (expression_pk, expression_sk) => {
    if (window.confirm("Are you sure you want to delete this answer?")) {
      try {
        const success = await deleteExpression({
          expression_pk,
          expression_sk,
        });
        console.log("Delete Answer Response:", success);
        const updatedData = { ...allData };
        for (const key in updatedData) {
          updatedData[key] = updatedData[key].filter(
            (item) =>
              !(item.PK_x === expression_pk && item.SK_x === expression_sk)
          );
          if (updatedData[key].length === 0) delete updatedData[key];
        }
        setAllData(updatedData);
      } catch (error) {
        console.error("Error deleting answer:", error);
        alert(
          `Error deleting answer: ${JSON.stringify(
            error.success ? error.success.data : error.message
          )}`
        );
      }
    }
  };

  return (
    <div className="internal-container">
      <div className="search-container">
        <h1 className="title">Wander Internal Tool</h1>
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
        />
        <div style={{ width: "13%", display: "flex", gap: "10px" }}>
          <button onClick={handleSearch}>Search</button>
          <button onClick={handleReset}>Reset</button>
        </div>
        <form>
          <div>
            <label>
              Enter Page Number:
              <input
                type="number"
                value={pageNumber}
                onChange={handlePageNumberChange}
                min="1"
                required
              />
            </label>
          </div>
          <div>
            <label>
              Enter Page Size:
              <input
                type="number"
                value={pageSize}
                onChange={handlePageSizeChange}
                min="1"
                required
              />
            </label>
          </div>
        </form>
      </div>

      <table>
        <thead>
          <tr>
            <th>Question Creation Date & Time</th>
            <th>Tags</th>
            <th>Express Question</th>
            <th># of Answers</th>
            <th>Created By AI?</th>
            <th>Edit/ Delete</th>
            <th>Answer Creation Date & Time</th>
            <th>Expression Answers</th>
            <th>User</th>
            <th>Reported?</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(allData).map((question) =>
            allData[question].map((item, itemIndex) => (
              <tr key={itemIndex}>
                {itemIndex === 0 && (
                  <td rowSpan={allData[question].length}>
                    {moment.unix(item.SK_y).format("MMMM Do YYYY, h:mm:ss a")}
                  </td>
                )}
                {itemIndex === 0 && (
                  <td rowSpan={allData[question].length}>{/*Tags*/}</td>
                )}
                {itemIndex === 0 && (
                  <td rowSpan={allData[question].length}>
                    {editingQuestion &&
                    editingQuestion.express_pk === item.express_pk &&
                    editingQuestion.express_sk === item.SK_y ? (
                      <>
                        <input
                          type="text"
                          value={newExpressQuestion}
                          onChange={(e) =>
                            setNewExpressQuestion(e.target.value)
                          }
                        />
                        <button
                          onClick={() =>
                            handleSaveEditQuestion(
                              item.express_pk,
                              item.express_sk
                            )
                          }
                        >
                          Save
                        </button>
                        <button onClick={() => setEditingQuestion(null)}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      item.express_question
                    )}
                  </td>
                )}
                {itemIndex === 0 && (
                  <td rowSpan={allData[question].length}>
                    {allData[question].length}
                  </td>
                )}
                {itemIndex === 0 && (
                  <td rowSpan={allData[question].length}>
                    {/*item.created_by_ai ? 'Yes' : 'No'*/}
                  </td>
                )}
                {itemIndex === 0 && (
                  <td rowSpan={allData[question].length}>
                    <div className="action-buttons">
                      <button
                        onClick={() =>
                          handleEditQuestion(
                            item.express_pk,
                            item.SK_y,
                            item.express_question
                          )
                        }
                      >
                        Edit
                      </button>
                      <button
                        className="deleteButton"
                        onClick={() =>
                          handleDeleteQuestion(item.express_pk, item.SK_y)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                )}
                <td>
                  {moment
                    .unix(item.created_at)
                    .format("MMMM Do YYYY, h:mm:ss a")}
                </td>
                <td>{item.expression_answer}</td>
                <td>{item.creator}</td>
                <td></td>
                <td>
                  <button
                    className="deleteButton"
                    onClick={() => handleDeleteAnswer(item.PK_x, item.SK_x)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionsTable;
