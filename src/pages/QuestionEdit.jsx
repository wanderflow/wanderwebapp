import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import "moment/locale/en-gb";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [answerSearchTerm, setAnswerSearchTerm] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [editingItem, setEditingItem] = useState({
    type: "",
    id: null,
    text: "",
  });
  const [currentPage, setCurrentPage] = useState(1);

  // set number of questions per page
  const [questionsPerPage] = useState(10);

  useEffect(() => {
    fetch("data/express.csv")
      .then((response) => response.text())
      .then((data) => {
        const parsedQuestions = parseCSV(data);
        setQuestions(parsedQuestions);
        setFilteredQuestions(parsedQuestions);
      })
      .catch((error) => console.error("Error fetching express:", error));

    fetch("data/expression.csv")
      .then((response) => response.text())
      .then((data) => {
        const parsedAnswers = parseCSV(data);
        setAnswers(parsedAnswers);
      })
      .catch((error) => console.error("Error fetching expressions:", error));
  }, []);

  const parseCSV = (csvString) => {
    const lines = csvString.split("\n");
    const headers = lines[0].split(",");
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const currentLine = lines[i].split(",");
      if (currentLine.length === headers.length) {
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
          obj[headers[j].trim()] = currentLine[j].trim();
        }
        data.push(obj);
      }
    }
    return data;
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

  const startEdit = (type, id, text) => {
    setEditingItem({ type, id, text });
  };

  const cancelEdit = () => {
    setEditingItem({ type: "", id: null, text: "" });
  };

  const saveEdit = () => {
    if (editingItem.type === "question") {
      const updatedQuestions = questions.map((question) =>
        question.PK === editingItem.id
          ? { ...question, express_question: editingItem.text }
          : question
      );
      setQuestions(updatedQuestions);
      setFilteredQuestions(updatedQuestions);
    } else if (editingItem.type === "answer") {
      const updatedAnswers = answers.map((answer) =>
        answer.PK_x === editingItem.id
          ? { ...answer, expression_answer: editingItem.text }
          : answer
      );
      setAnswers(updatedAnswers);
    }
    setEditingItem({ type: "", id: null, text: "" });
  };

  const handleDeleteQuestion = (questionID) => {
    const updatedQuestions = questions.filter(
      (question) => question.PK !== questionID
    );
    setQuestions(updatedQuestions);
    setFilteredQuestions(updatedQuestions);
    alert(`Deleted question with ID ${questionID}`);
  };

  // Merge questions with answers
  const questionsWithAnswers = filteredQuestions.map((question) => ({
    ...question,
    answers: answers.filter((answer) => answer.express_pk === question.PK),
  }));

  // Get current questions for pagination
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = questionsWithAnswers.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (
    let i = 1;
    i <= Math.ceil(filteredQuestions.length / questionsPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

  return (
    <div className="internal-container">
      <div className="search-container">
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
        <input
          type="text"
          placeholder="Search questions..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
        <input
          type="text"
          placeholder="Search answers..."
          value={answerSearchTerm}
          onChange={handleAnswerSearchChange}
        />
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Question Creation Date</th>
              <th>Express Question</th>
              <th>Edit/ Delete</th>
              <th>Answer Creation Date</th>
              <th>Expression Answers</th>
              <th>User</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {currentQuestions.map((question, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td rowSpan={question.answers.length}>
                    {moment
                      .unix(question.created_at)
                      .format("MMMM Do YYYY, h:mm:ss a")}
                  </td>
                  <td rowSpan={question.answers.length}>
                    {editingItem.type === "question" &&
                    editingItem.id === question.PK ? (
                      <div>
                        <input
                          type="text"
                          value={editingItem.text}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              text: e.target.value,
                            })
                          }
                        />
                      </div>
                    ) : (
                      <span title={question.express_question}>
                        {question.express_question}
                      </span>
                    )}
                  </td>
                  <td rowSpan={question.answers.length}>
                    {editingItem.type === "question" &&
                    editingItem.id === question.PK ? (
                      <div className="action-buttons">
                        <button onClick={() => saveEdit(question.PK)}>
                          Save
                        </button>
                        <button onClick={cancelEdit} className="editButton">
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="action-buttons">
                        <button
                          onClick={() =>
                            startEdit(
                              "question",
                              question.PK,
                              question.express_question
                            )
                          }
                        >
                          Edit
                        </button>
                        <button
                          className="deleteButton"
                          onClick={() => handleDeleteQuestion(question.PK)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                  {question.answers.length > 0 ? (
                    <>
                      <td>
                        {moment
                          .unix(question.answers[0].created_at)
                          .format("MMMM Do YYYY, h:mm:ss a")}
                      </td>
                      <td>{question.answers[0].expression_answer}</td>
                      <td>{question.answers[0].creator}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            onClick={() =>
                              startEdit(
                                "answer",
                                question.answers[0].PK_x,
                                question.answers[0].expression_answer
                              )
                            }
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td rowSpan={1} className="default">
                        [N/A]
                      </td>
                      <td rowSpan={1} className="default">
                        [No answer]
                      </td>
                      <td rowSpan={1} className="default">
                        [N/A]
                      </td>
                      <td rowSpan={1} className="default">
                        [N/A]
                      </td>
                    </>
                  )}
                </tr>

                {question.answers.slice(1).map((answer, index) => (
                  <tr key={`${question.PK}-${index}`} className="answer-row">
                    {editingItem.type === "answer" &&
                    editingItem.id === answer.PK_x ? (
                      <div className="action-buttons">
                        <button onClick={() => saveEdit(answer.PK_x)}>
                          Save
                        </button>
                        <button onClick={cancelEdit} className="editButton">
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <td>
                          {moment
                            .unix(answer.created_at)
                            .format("MMMM Do YYYY, h:mm:ss a")}
                        </td>
                        <td>{answer.expression_answer}</td>
                        <td>{answer.creator}</td>
                      </>
                    )}
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() =>
                            startEdit(
                              "answer",
                              answer.PK_x,
                              answer.expression_answer
                            )
                          }
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="pagination">
          <div className="pagination">
            {pageNumbers.map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={number === currentPage ? "active" : ""}
              >
                {number}
              </button>
            ))}
          </div>
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentQuestions.length < questionsPerPage}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
