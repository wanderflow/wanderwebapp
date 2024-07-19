import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { expressionsExpress } from "@/api";
import moment from "moment";
import "moment/locale/en-gb";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [answerSearchTerm, setAnswerSearchTerm] = useState("");
  const [filteredQuestions, setFilteredQuestions] = useState([]);

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
    console.log(grouped);
    setAllData(grouped);
    setLoading(false);
  };

  useEffect(() => {
    if (pageSize != 0 && pageNumber.length != 0) {
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

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    filterQuestions(searchTerm);
  };

  const handleAnswerSearchChange = (e) => {
    const searchTerm = e.target.value;
    setAnswerSearchTerm(searchTerm);
    if (searchTerm === "") {
      setFilteredQuestions(questions);
    } else {
      filterAnswers(searchTerm);
    }
  };

  const filterQuestions = (questionTerm) => {
    const filtered = questions.filter((question) =>
      question.express_question
        .toLowerCase()
        .includes(questionTerm.toLowerCase())
    );
    setFilteredQuestions(filtered);
    setCurrentPage(1);
  };

  const filterAnswers = (answerTerm) => {
    const filtered = questions.reduce((acc, question) => {
      const matchingAnswers = answers.filter(
        (answer) =>
          answer.express_pk === question.PK &&
          answer.expression_answer
            .toLowerCase()
            .includes(answerTerm.toLowerCase())
      );
      if (matchingAnswers.length > 0) {
        acc.push({
          ...question,
          answers: matchingAnswers,
        });
      }
      return acc;
    }, []);
    setFilteredQuestions(filtered);
    setCurrentPage(1);
  };

  return (
    <div className="internal-container">
      <div className="search-container">
        <h1 className="title">Wander Internal Tool</h1>
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
        <input
          type="text"
          placeholder="Search questions..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <br />
        <br />
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
        <input
          type="text"
          placeholder="Search answers..."
          value={answerSearchTerm}
          onChange={handleAnswerSearchChange}
        />
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
          {Object.keys(allData).map((question, index) =>
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
                    {item.express_question}
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
                  <td rowSpan={allData[question].length}>{/*Edit/ Delete*/}</td>
                )}
                <td>
                  {moment
                    .unix(item.created_at)
                    .format("MMMM Do YYYY, h:mm:ss a")}
                </td>
                <td>{item.expression_answer}</td>
                <td>{item.creator}</td>
                <td></td>
                <td></td>
              </tr>
            ))
          )}
        </tbody>
      </table>
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
  );
};

export default App;
