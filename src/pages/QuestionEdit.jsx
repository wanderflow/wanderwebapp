import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { expressionsExpress } from "@/api";
import { deleteExpression } from "@/api";
import { deleteExpress } from "@/api";
import moment from "moment";
import "moment/locale/en-gb";
import Modal from "./Modal";

const App = () => {
  const [searchExpress, setSearchExpress] = useState("");

  const [deleteInfo, setDeleteInfo] = useState({ pk: null, sk: null });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [allData, setAllData] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(100);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getexpressionsExpress = async () => {
    let data = await expressionsExpress({
      page: pageNumber,
      page_size: pageSize,
    });
    const nestledData = data.data;
    const grouped = nestledData.reduce((dataSoFar, item) => {
      const { express_question } = item;
      if (!dataSoFar[express_question]) dataSoFar[express_question] = [];
      dataSoFar[express_question].push(item);
      return dataSoFar;
    }, {});
    setAllData(grouped);
    setLoading(false);
  };

  useEffect(() => {
    if (pageSize != 0 || pageNumber.length != 0) {
      getexpressionsExpress();
    }
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // enter page number and size
  const handlePageNumberChange = (event) => {
    setPageNumber(event.target.value);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
  };

  // search functions
  const handleSearchExpress = (event) => {
    setSearchExpress(event.target.value);
  };

  const filteredData = Object.keys(allData).map((question) =>
    allData[question].filter((item) =>
      item.express_question.toLowerCase().includes(searchExpress.toLowerCase())
    )
  );

  // edit and delete functions
  const handleDeleteExpress = async (express_pk, express_sk) => {
    try {
      const toBeDeleted = await deleteExpress({
        express_pk: express_pk,
        express_sk: express_sk,
      });
      if (!toBeDeleted.ok) {
        setAllData(
          allData.data.filter(
            (item) =>
              item.express_pk !== express_pk && item.express_sk !== express_sk
          )
        );
        setDeleteInfo({ pk: null, sk: null });
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      setError(error);
    }
  };

  const handleDeleteExpression = async (expression_pk, expression_sk) => {
    try {
      const toBeDeleted = await deleteExpression({
        expression_pk: expression_pk,
        expression_sk: expression_sk,
      });
      if (!toBeDeleted.ok) {
        setAllData(
          allData.data.filter(
            (item) =>
              item.expression_pk !== expression_pk &&
              item.expression_sk !== expression_sk
          )
        );
        setDeleteInfo({ pk: null, sk: null });
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      setError(error);
    }
  };

  // handles pop ups in delete function
  const openModal = (pk, sk) => {
    setDeleteInfo({ pk, sk });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setDeleteInfo({ pk: null, sk: null });
    setIsModalOpen(false);
  };

  return (
    <div className="internal-container">
      <div className="search-container">
        <h1 className="title">Wander Internal Tool</h1>
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
        <input
          type="text"
          placeholder="Search by keywords"
          value={searchExpress}
          onChange={handleSearchExpress}
        />

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

      <br />
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
          {Object.keys(filteredData).map((question) =>
            filteredData[question].map((item, itemIndex) => (
              <tr key={itemIndex}>
                {itemIndex === 0 && (
                  <td rowSpan={filteredData[question].length}>
                    {moment.unix(item.SK_x).format("MMMM Do YYYY, h:mm:ss a")}
                  </td>
                )}
                {itemIndex === 0 && (
                  <td rowSpan={filteredData[question].length}>{/*Tags*/}</td>
                )}
                {itemIndex === 0 && (
                  <td rowSpan={filteredData[question].length}>
                    {item.express_question}
                  </td>
                )}
                {itemIndex === 0 && (
                  <td rowSpan={filteredData[question].length}>
                    {filteredData[question].length}
                  </td>
                )}
                {itemIndex === 0 && (
                  <td rowSpan={filteredData[question].length}>
                    {/*Created by AI*/}
                  </td>
                )}
                {itemIndex === 0 && (
                  <td rowSpan={filteredData[question].length}>
                    <button
                      className="deleteButton"
                      onClick={() =>
                        openModal(item.express_pk, item.express_sk)
                      }
                    >
                      Delete
                    </button>
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
                    onClick={() =>
                      openModal(item.expression_pk, item.expression_sk)
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={() => handleDeleteExpress(deleteInfo.pk, deleteInfo.sk)}
      />
    </div>
  );
};

export default App;
