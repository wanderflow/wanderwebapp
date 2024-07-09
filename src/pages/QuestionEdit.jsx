import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

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
      .catch((error) => console.error("Error fetching CSV:", error));

    fetch("data/expression.csv")
      .then((response) => response.text())
      .then((data) => {
        const parsedAnswers = parseCSV(data);
        setAnswers(parsedAnswers);
      })
      .catch((error) => console.error("Error fetching answers CSV:", error));
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
    filterQuestions(searchTerm, answerSearchTerm);
  };

  const handleAnswerSearchChange = (e) => {
    const searchTerm = e.target.value;
    setAnswerSearchTerm(searchTerm);
    filterQuestions(searchTerm, answerSearchTerm);
  };

  const filterQuestions = (questionTerm, answerTerm) => {
    const filtered = questions.filter(
      (question) =>
        question.express_question
          .toLowerCase()
          .includes(questionTerm.toLowerCase()) ||
        answers.some(
          (answer) =>
            answer.questionID === question.questionID &&
            answer.answerText.toLowerCase().includes(answerTerm.toLowerCase())
        )
    );
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
        question.questionID === editingItem.id
          ? { ...question, express_question: editingItem.text }
          : question
      );
      setQuestions(updatedQuestions);
      setFilteredQuestions(updatedQuestions);
    } else if (editingItem.type === "answer") {
      const updatedAnswers = answers.map((answer) =>
        answer.answerID === editingItem.id
          ? { ...answer, answerText: editingItem.text }
          : answer
      );
      setAnswers(updatedAnswers);
    }
    setEditingItem({ type: "", id: null, text: "" });
  };

  const handleDeleteQuestion = (questionID) => {
    const updatedQuestions = questions.filter(
      (question) => question.questionID !== questionID
    );
    setQuestions(updatedQuestions);
    setFilteredQuestions(updatedQuestions);
    alert(`Deleted question with ID ${questionID}`);
  };

  const handleDeleteAnswer = (answerID) => {
    const updatedAnswers = answers.filter(
      (answer) => answer.answerID !== answerID
    );
    setAnswers(updatedAnswers);
    alert(`Deleted answer with ID ${answerID}`);
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
                    {question.created_at}
                  </td>
                  <td rowSpan={question.answers.length}>
                    {editingItem.type === "question" &&
                    editingItem.id === question.questionID ? (
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
                        <button onClick={saveEdit}>Save</button>
                        <button onClick={cancelEdit}>Cancel</button>
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
                            startEdit(question.PK, question.express_question)
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
                      <td>{question.answers[0].created_at}</td>
                      <td>{question.answers[0].expression_answer}</td>
                      <td>{question.answers[0].creator}</td>
                    </>
                  ) : (
                    <>
                      <td rowSpan={1} class="default">
                        [N/A]
                      </td>
                      <td rowSpan={1} class="default">
                        [No answer]
                      </td>
                      <td rowSpan={1} class="default">
                        [N/A]
                      </td>
                    </>
                  )}
                  <td rowSpan={question.answers.length}>
                    <div className="action-buttons">
                      <button
                        onClick={() =>
                          startEdit(
                            "question",
                            question.questionID,
                            question.express_question
                          )
                        }
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
                {question.answers.slice(1).map((answer, index) => (
                  <tr key={`${question.PK}-${index}`} className="answer-row">
                    {editingItem.type === "answer" &&
                    editingItem.id === answer.PK_x ? (
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
                        <button onClick={saveEdit}>Save</button>
                        <button onClick={cancelEdit}>Cancel</button>
                      </div>
                    ) : (
                      <>
                        <td>{answer.created_at}</td>
                        <td>{answer.expression_answer}</td>
                        <td>{answer.creator}</td>
                      </>
                    )}
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
