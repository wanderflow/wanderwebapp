import React, { useEffect, useState } from "react";
import {
  expressionsExpress,
  deleteExpression,
  deleteExpress,
  searchExpress,
  editExpress,
} from "@/api";
import DeleteModal from "./DeleteModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import "moment/locale/en-gb";

const QuestionsTable = () => {
  const [allData, setAllData] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [originalQuestion, setOriginalQuestion] = useState("");
  const [originalData, setOriginalData] = useState({});

  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [editedQuestion, setEditedQuestion] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [deleteType, setDeleteType] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const getQuestions = async () => {
      const response = await expressionsExpress({
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
    };
    getQuestions();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // enter page number and size
  const handlePageNumberChange = (event) => {
    setPageNumber(event.target.value);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
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
  const handleEdit = (id, question) => {
    setEditingId(id);
    setOriginalQuestion(question);
    setEditedQuestion(question);
  };

  const handleSave = async () => {
    try {
      const question = Object.values(allData)
        .flat()
        .find((q) => q.express_pk === editingId);
      if (question) {
        const payload = {
          express_pk: question.express_pk,
          express_sk: question.express_sk,
          new_express: editedQuestion,
        };
        console.log("Saving question:", payload);

        const response = await editExpress(payload);
        console.log("Save response:", response);
        setAllData((prevData) => {
          const updatedData = { ...prevData };
          for (const key in updatedData) {
            updatedData[key] = updatedData[key].map((q) =>
              q.express_pk === editingId
                ? { ...q, express_question: editedQuestion }
                : q
            );
          }
          return updatedData;
        });
        setEditingId(null);
        setEditedQuestion("");
        setOriginalQuestion("");
        console.log(editingId);
      }
    } catch (error) {
      console.error(
        "Error updating question:",
        error.response?.data || error.message || error
      );
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedQuestion("");
    setOriginalQuestion("");
  };

  // delete functions
  const handleDelete = async () => {
    if (deleteType === "question") {
      await deleteExpress({
        express_pk: express_pk,
        express_sk: express_sk,
      });
    } else if (deleteType === "answer") {
      await deleteExpression({
        expression_pk: expression_pk,
        expression_sk: expression_sk,
      });
    }

    // modal
    setShowModal(false);
    const response = await expressionsExpress();
    const nestledData = response.data;
    const grouped = nestledData.reduce((dataSoFar, item) => {
      const { express_question } = item;
      if (!dataSoFar[express_question]) dataSoFar[express_question] = [];
      dataSoFar[express_question].push(item);
      return dataSoFar;
    }, {});
    setAllData(grouped);
  };

  const openModal = (type, id) => {
    setDeleteType(type);
    setDeleteId(id);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

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
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(allData).map((question) =>
            allData[question].map((item, itemIndex) => (
              <tr key={itemIndex}>
                {itemIndex === 0 && (
                  <td rowSpan={allData[question].length}>
                    {moment.unix(item.SK_x).format("MMMM Do YYYY, h:mm:ss a")}
                  </td>
                )}
                {itemIndex === 0 && (
                  <td rowSpan={allData[question].length}>{/*Tags*/}</td>
                )}
                {itemIndex === 0 && (
                  <td rowSpan={allData[question].length}>
                    {editingId === item.express_pk ? (
                      <input
                        type="text"
                        value={editedQuestion}
                        onChange={(e) => setEditedQuestion(e.target.value)}
                      />
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
                    {/*Created by AI*/}
                  </td>
                )}
                {itemIndex === 0 && (
                  <td rowSpan={allData[question].length}>
                    {editingId === item.express_pk ? (
                      <div className="action-buttons">
                        <button onClick={handleSave}>Save</button>
                        <button className="editButton" onClick={handleCancel}>
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="action-buttons">
                        <button
                          onClick={() =>
                            handleEdit(item.express_pk, item.express_question)
                          }
                        >
                          Edit
                        </button>
                        <button
                          className="deleteButton"
                          onClick={() => openModal("question", item.express_pk)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
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
                    onClick={() => openModal("answer", item.expression_pk)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <DeleteModal
        show={showModal}
        handleClose={handleClose}
        handleDelete={handleDelete}
        type={deleteType}
      />
    </div>
  );
};

export default QuestionsTable;
