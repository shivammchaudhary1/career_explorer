import "../../styles/Question.css";

import { CircularProgress } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { GrLinkNext } from "react-icons/gr";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectToken, selectUserId } from "../../redux/slices/authSlice.js";
import { saveDiscAnswers } from "../../redux/slices/discSlice.js";
import { getUnifiedRecordData, selectUnifiedRecord } from "../../redux/slices/unifiedRecordSlice.js";

const QuestionCard = ({
  questionNumber,
  totalQuestions,
  questionStatements,
  onNext,
  onPrevious,
  isLastQuestion,
  isFirstQuestion,
  overallAnswers = [],
  setOverallAnswers,
}) => {
  const navigate = useNavigate();
  const [ans, setAns] = useState([]);
  const userId = useSelector(selectUserId);
  const token = useSelector(selectToken);
  const unifiedRecord = useSelector(selectUnifiedRecord);
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const dispatchToRedux = useDispatch();

  useEffect(() => {
    dispatchToRedux(getUnifiedRecordData({ userId, token }));
  }, []);

  const addStatementAns = (currentAns, statementQuestionIndex) => {
    setAns((prevAns) => {
      const statementNumber = statementQuestionIndex + 1;

      let updatedAns = prevAns.filter((ans) => ans.statementNumber !== statementNumber);

      if (currentAns.most) {
        updatedAns = updatedAns.filter((ans) => !ans.statementAns.hasOwnProperty("most"));
      }
      if (currentAns.least) {
        updatedAns = updatedAns.filter((ans) => !ans.statementAns.hasOwnProperty("least"));
      }

      updatedAns.push({ statementNumber, statementAns: currentAns });
      return updatedAns;
    });
  };

  const getSelectedOption = (currentIndex) => {
    const statementNumber = currentIndex + 1;
    const selectedAns = ans.find(({ statementNumber: num }) => num === statementNumber);
    return selectedAns ? Object.keys(selectedAns.statementAns)[0] : null;
  };

  const allAnswersSelected = ans.length === 2;

  const handleNext = () => {
    const updatedOverallAnswers = overallAnswers.filter((answer) => answer.questionNumber !== questionNumber);
    updatedOverallAnswers.push({ questionNumber, questionAns: ans });
    setOverallAnswers(updatedOverallAnswers);
    setAns([]);
    onNext();
  };

  const handlePrevious = () => {
    onPrevious();
  };

  useEffect(() => {
    const currentQuestionAns = overallAnswers.find((ans) => ans.questionNumber === questionNumber);

    if (currentQuestionAns) {
      setAns(currentQuestionAns.questionAns.map((answer) => ({ ...answer })));
    } else {
      setAns([]);
    }
  }, [overallAnswers, questionNumber]);

  const progressBarRef = useRef(null);
  useEffect(() => {
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${(questionNumber / totalQuestions) * 100}%`;
    }
  }, [questionNumber]);

  const handleSubmitButton = async () => {
    // Update the overallAnswers with the current question's answers
    const updatedOverallAnswers = overallAnswers.filter((answer) => answer.questionNumber !== questionNumber);
    updatedOverallAnswers.push({ questionNumber, questionAns: ans });
    setOverallAnswers(updatedOverallAnswers);

    if (allAnswersSelected) {
      try {
        setIsButtonLoading(true);
        await dispatchToRedux(saveDiscAnswers({ userId, token, answers: updatedOverallAnswers }));
        setIsButtonLoading(false);
        navigate("/survey");
      } catch (error) {
        setIsButtonLoading(false);
      }
    }
  };

  return (
    <>
      <div id="cardContainer">
        <div id="topSubCard">
          <p>Part B</p>
          <h3>Please choose one statement that is Most like you and one statement that is Least like you</h3>
          <div id="status">
            <div id="statusBar">
              <div ref={progressBarRef}></div>
            </div>
            <div id="qustionStatus">
              <span>{questionNumber}</span>
              <span>/</span>
              <span>{totalQuestions}</span>
            </div>
          </div>
          <div className="half-circle">
            <span className="inner-line"></span>
          </div>
        </div>
        <div id="bottomSubCard">
          {questionStatements.map((statement, index) => (
            <div key={index}>
              <p className="statement">{statement.statementText}</p>
              <div className="statementOptions">
                <button
                  onClick={() => addStatementAns({ most: statement["category"]["most"] }, index)}
                  className={getSelectedOption(index) === "most" ? "selected" : ""}
                >
                  Most
                </button>
                <button
                  onClick={() => addStatementAns({ least: statement["category"]["least"] }, index)}
                  className={getSelectedOption(index) === "least" ? "selected" : ""}
                >
                  Least
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="navButtonContainer">
        <button id="navButton" onClick={handlePrevious} disabled={isFirstQuestion}>
          <span>
            <IoMdArrowRoundBack />
          </span>
          Previous
        </button>

        {/* {isLastQuestion ? (
          <button id="navButton" onClick={handleSubmitButton} disabled={!allAnswersSelected}>
            Submit and move to Education Survey{" "}
            <span>
              <GrLinkNext />
            </span>
          </button>
        ) : (
          <button id="navButton" onClick={handleNext} disabled={!allAnswersSelected}>
            Next
            <span>
              <GrLinkNext />
            </span>
          </button>
        )} */}
        {isLastQuestion ? (
          <button
            id="navButton"
            onClick={handleSubmitButton}
            disabled={!allAnswersSelected || isButtonLoading}
          >
            {isButtonLoading ? (
              <div
                style={{ width: "100px", display: "flex", justifyContent: "center", alignItems: "center" }}
              >
                <CircularProgress size={20} color="inherit" />
              </div>
            ) : (
              <>
                Submit and move to Education Survey
                <span>
                  <GrLinkNext />
                </span>
              </>
            )}
          </button>
        ) : (
          <button id="navButton" onClick={handleNext} disabled={!allAnswersSelected}>
            Next
            <span>
              <GrLinkNext />
            </span>
          </button>
        )}
      </div>
    </>
  );
};

export default QuestionCard;
