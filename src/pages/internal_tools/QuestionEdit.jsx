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

// calls all data
const QuestionsTable = () => {
  const [allData, setAllData] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(100);

  const [searchWord, setSearchWord] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [loading, setLoading] = useState(true);

  const [filterType, setFilterType] = useState("ALL");

  const [editingQuestion, setEditingQuestion] = useState(null);
  const [newExpressQuestion, setNewExpressQuestion] = useState("");

  const [sortConfig, setSortConfig] = useState({
    key: "numberOfAnswers",
    direction: "asc",
  });

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
      if (!isSearching) {
        setAllData(grouped);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  useEffect(() => {
    getQuestions();
  }, [pageNumber, pageSize, isSearching]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // enter page number and size
  const handlePageNumberChange = (event) => {
    const value = event.target.value;
    const newPageNumber = value === "" ? "" : parseInt(value, 10);
    setPageNumber(newPageNumber > 0 ? newPageNumber : "");
  };

  const handlePageSizeChange = (event) => {
    const value = event.target.value;
    const newPageSize = value === "" ? "" : parseInt(value, 10);
    setPageSize(newPageSize > 0 ? newPageSize : "");
  };

  // search functions
  const handleSearch = async () => {
    if (searchWord.trim() === "") {
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    try {
      let response = await searchExpress({
        search_word: searchWord,
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
      setAllData(grouped);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
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

  // sorting functions for number of questions
  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });

    const sortedData = Object.entries(allData).sort((a, b) => {
      const numA = a[1].length;
      const numB = b[1].length;

      if (numA < numB) return direction === "asc" ? -1 : 1;
      if (numA > numB) return direction === "asc" ? 1 : -1;
      return 0;
    });

    const sortedGroupedData = sortedData.reduce((acc, [key, items]) => {
      acc[key] = items;
      return acc;
    }, {});

    setAllData(sortedGroupedData);
  };

  // filter functions for AI
  const filteredData = Object.keys(allData).reduce((result, key) => {
    let filteredItems;
    if (filterType === "AI") {
      filteredItems = allData[key].filter((item) => item.type === "AI");
    } else if (filterType === "NON_AI") {
      filteredItems = allData[key].filter((item) => item.type !== "AI");
    } else {
      filteredItems = allData[key];
    }
    if (filteredItems.length > 0) {
      result[key] = filteredItems;
    }
    return result;
  }, {});

  return (
    <div className="internal-container">
      <div
        className="search-container"
        style={{ display: "flex", alignItems: "center", gap: "20px" }}
      >
        <h1 className="title">Wander Internal Tool</h1>
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
        <input
          type="text"
          value={searchWord}
          onChange={(e) => setSearchWord(e.target.value)}
          placeholder="Search..."
        />
        <div style={{ width: "10%", display: "flex", gap: "5px" }}>
          <button onClick={handleSearch}>Search</button>
        </div>
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: "20px",
          }}
        >
          <div style={{ marginBottom: "10px" }}>
            <label>
              Enter Page Number (min: 1, max: 100):
              <input
                type="number"
                value={pageNumber}
                onChange={handlePageNumberChange}
                min="1"
                required
                style={{ marginLeft: "5px" }}
              />
            </label>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>
              Enter Page Size (min: 1, max: 1,000):
              <input
                type="number"
                value={pageSize}
                onChange={handlePageSizeChange}
                min="1"
                required
                style={{ marginLeft: "5px" }}
              />
            </label>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>
              <input
                type="radio"
                value="ALL"
                checked={filterType === "ALL"}
                onChange={() => setFilterType("ALL")}
              />
              All Express
            </label>
            <label>
              <input
                type="radio"
                value="AI"
                checked={filterType === "AI"}
                onChange={() => setFilterType("AI")}
              />
              AI-generated Express
            </label>
            <label>
              <input
                type="radio"
                value="NON_AI"
                checked={filterType === "NON_AI"}
                onChange={() => setFilterType("NON_AI")}
              />
              Non-AI-generated Express
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
            <th onClick={() => handleSort("numberOfAnswers")}>
              # of Answers{" "}
              {sortConfig.key === "numberOfAnswers" &&
                (sortConfig.direction === "asc" ? "🔼" : "🔽")}
            </th>
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
          {Object.keys(filteredData).map((question) =>
            filteredData[question].map((item, itemIndex) => (
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
                        <button
                          className="editButton"
                          onClick={() => setEditingQuestion(null)}
                        >
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
                    {item.type ? "AI" : "Not AI"}
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
                <td>{item.creator.slice(5)}</td>
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
