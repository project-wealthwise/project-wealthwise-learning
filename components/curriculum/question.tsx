import { Question } from "@/lib/curriculum";
import { useState } from "react";

type QuestionProps = {
    question: Question
};

export default function CurriculumQuestion({
    question
}: QuestionProps) {
    const [questionText, setQuestionText] = useState(question.question);
    const [answers, setAnswers] = useState(question.answers);

    return (
        <div className="question-container">
            <label className="question-label font-medium" htmlFor={`question-${question.id}`}>Question:</label>
            <input 
                type="text"
                id={`question-${question.id}`}
                defaultValue={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                className="question-input pww-input form-input font-medium"
            ></input>
            <div className="answers-container">
                {answers.map((answer, index) => (
                    <div key={index} className="answer-container">
                        <label className="answer-label" htmlFor={`answer-${question.id}-${index}`}>Answer {index + 1}:</label>
                        <input 
                            type="text"
                            id={`answer-${question.id}-${index}`}
                            defaultValue={answer.answer}
                            onChange={(e) => {
                                const newAnswers = [...answers];
                                newAnswers[index].answer = e.target.value;
                                setAnswers(newAnswers);
                            }}
                            className="answer-input pww-input form-input"
                        ></input>
                        <label className="correct-label" htmlFor={`correct-${question.id}-${index}`}>Correct</label>
                        <input 
                            type="checkbox"
                            id={`correct-${question.id}-${index}`}
                            checked={answer.correct}
                            onChange={(e) => {
                                const newAnswers = [...answers];
                                newAnswers[index].correct = e.target.checked;
                                setAnswers(newAnswers);
                            }}
                            className="correct-checkbox"
                        ></input>
                    </div>
                ))}
            </div>
        </div>
    );
}