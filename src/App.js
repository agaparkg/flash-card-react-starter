import React, { useState, useEffect } from "react";
import "./styles.css";

const getLocalStorageData = () =>
  JSON.parse(localStorage.getItem("flash-cards")) || {};

const updateLocalStorage = (data) =>
  localStorage.setItem("flash-cards", JSON.stringify(data));

const getClonedData = (data) => JSON.parse(JSON.stringify(data));

const App = () => {
  const [flashcards, setFlashcards] = useState(getLocalStorageData());
  const [showForm, setShowForm] = useState(false);
  const [questionId, setQuestionId] = useState(null);
  const [showAnswerId, setShowAnswerId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const toggleAnswer = (id) => {
    if (showAnswer) {
      setShowAnswerId(null);
    } else {
      setShowAnswerId(id);
    }
    setShowAnswer(!showAnswer);
  };

  const addOrEditFlashcard = (id) => {
    const newFlashCards = getClonedData(flashcards);

    if (id) {
      setQuestionId(id);
      setQuestion(newFlashCards[id].question);
      setAnswer(newFlashCards[id].answer);
    } else {
      setQuestionId(null);
      setQuestion("");
      setAnswer("");
    }

    setShowForm(true);
  };

  const deleteFlashcard = (id) => {
    const newFlashCards = getClonedData(flashcards);
    delete newFlashCards[id];
    setFlashcards(newFlashCards);
  };

  const closeFormBtn = () => {
    setShowForm(!showForm);
    setQuestionId(null);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newFlashCards = getClonedData(flashcards);

    if (question.trim() !== "" && answer.trim() !== "") {
      if (questionId) {
        newFlashCards[questionId].question = question;
        newFlashCards[questionId].answer = answer;
      } else {
        const newId = Object.keys(newFlashCards).length
          ? Math.max(...Object.keys(newFlashCards)) + 1
          : 1;

        const newQuestion = {
          question: question,
          answer: answer,
        };

        newFlashCards[newId] = newQuestion;
      }

      setFlashcards(newFlashCards);
      updateLocalStorage(newFlashCards);
      setQuestion("");
      setAnswer("");
      setQuestionId(null);
      setShowForm(!showForm);
    } else {
      setErrorMessage("Cannot add empty values");

      setTimeout(() => {
        setErrorMessage(null);
      }, 2000);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-11 col-lg-6 my-3">
          <h3 className="text-capitalize">flashcards</h3>
          <button
            onClick={() => addOrEditFlashcard(null)}
            className="btn text-capitalize my-2 show-btn"
          >
            add question
          </button>
          {showForm && (
            <div className="card card-body my-3 question-card showItem">
              <a href="#" className="close-btn mt-0">
                <i className="fa fa-window-close" onClick={closeFormBtn}></i>
              </a>
              {errorMessage && (
                <div className="feedback alert w-75 text-capitalize showItem alert-danger">
                  {errorMessage}
                </div>
              )}
              <form onSubmit={handleFormSubmit}>
                <h5 className="text-capitalize">question</h5>
                <div className="form-group">
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="w-100"
                    rows="3"
                  ></textarea>
                </div>
                <h5 className="text-capitalize">answer</h5>
                <div className="form-group">
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="w-100"
                    rows="3"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="btn submitBtn text-capitalize w-50"
                >
                  save
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      <div className="row px-2">
        {Object.entries(flashcards).map(([id, flashcard]) => {
          return (
            <div key={id} className="col-md-4">
              <div className="card card-body flashcard my-3">
                <h4 className="text-capitalize">{flashcard.question}</h4>
                <a
                  href="#"
                  className="text-capitalize my-3 show-answer"
                  onClick={() => toggleAnswer(id)}
                >
                  {showAnswerId === id && showAnswer
                    ? "hide answer"
                    : "show answer"}
                </a>
                {showAnswerId === id && showAnswer && (
                  <h5 className="answer mb-3 showItem">{flashcard.answer}</h5>
                )}
                <div className="flashcard-btn d-flex justify-content-between">
                  <a
                    href="#"
                    className="btn my-1 edit-flashcard text-uppercase"
                    onClick={() => addOrEditFlashcard(id)}
                  >
                    edit
                  </a>
                  <a
                    href="#"
                    className="btn my-1 delete-flashcard text-uppercase"
                    onClick={() => deleteFlashcard(id)}
                  >
                    delete
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;
