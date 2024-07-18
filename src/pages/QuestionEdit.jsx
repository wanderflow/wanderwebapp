import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import "moment/locale/en-gb";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [answerSearchTerm, setAnswerSearchTerm] = useState("");
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [groupedData, setGroupedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const postData = async () => {
      try {
        const response = await fetch(
          "https://api.wander.one/get_all_expressions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              page: 1,
              page_size: 100,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.statusText}`
          );
        }

        const result = await response.json();
        console.log("Fetched data:", result);

        const nestedData = result.data?.data;
        if (Array.isArray(nestedData)) {
          const grouped = nestedData.reduce((acc, item) => {
            const { express_question } = item;
            if (!acc[express_question]) {
              acc[express_question] = [];
            }
            acc[express_question].push(item);
            return acc;
          }, {});

          setGroupedData(grouped);
        } else {
          throw new Error("Expected nested data to be an array");
        }
      } catch (error) {
        console.error("Error posting data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    postData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleDeleteExpress = async (express, time) => {
    setLoading(true);
    try {
      const response = await fetch("https://api.wander.one/delete_express", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          express_pk: express,
          express_sk: time,
        }),
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      setGroupedData(
        items.filter(
          (item) => item.express_pk !== express || item.express_sk !== time
        )
      );
    } catch (error) {
      console.error("Error deleting item:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExpression = async (expression, time) => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://api.wander.one/delete_expressions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            expression_pk: expression,
            expression_sk: time,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      setGroupedData(
        items.filter(
          (item) => item.express_pk !== express || item.express_sk !== time
        )
      );
    } catch (error) {
      console.error("Error deleting item:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

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
      {Object.keys(groupedData).length > 0 ? (
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
            {Object.keys(groupedData).map((question, index) =>
              groupedData[question].map((item, itemIndex) => (
                <tr key={itemIndex}>
                  {itemIndex === 0 && (
                    <td rowSpan={groupedData[question].length}>
                      {moment.unix(item.SK_x).format("MMMM Do YYYY, h:mm:ss a")}
                    </td>
                  )}
                  {itemIndex === 0 && (
                    <td rowSpan={groupedData[question].length}></td>
                  )}
                  {itemIndex === 0 && (
                    <td rowSpan={groupedData[question].length}>
                      {item.express_question}
                    </td>
                  )}
                  {itemIndex === 0 && (
                    <td rowSpan={groupedData[question].length}>
                      {groupedData[question].length}
                    </td>
                  )}
                  {itemIndex === 0 && (
                    <td rowSpan={groupedData[question].length}></td>
                  )}
                  {itemIndex === 0 && (
                    <td rowSpan={groupedData[question].length}>
                      <button
                        className="deleteButton"
                        onClick={() =>
                          handleDeleteExpress(item.PK_y, item.SK_y)
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
                        handleDeleteExpression(item.PK_x, item.SK_x)
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
      ) : (
        <div>No data available</div>
      )}
    </div>
  );
};

export default App;
