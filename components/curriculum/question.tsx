import { Question } from '@/lib/curriculum';
import { useState } from 'react';

type QuestionProps = {
    question: Question,
    onQuestionDeleted?: (questionId: string) => void,
    onQuestionUpdated?: (updatedQuestion: Question) => void
};

export default function CurriculumQuestion({
    question,
    onQuestionDeleted,
    onQuestionUpdated
}: QuestionProps) {
    const [questionText, setQuestionText] = useState(question.question);
    const [answers, setAnswers] = useState(question.answers);

    console.log('Rendering question', question.id, 'with answers', answers);

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
                        <label 
                            className="answer-label" 
                            htmlFor={`answer-${question.id}-${index}`}
                        >Answer {index + 1}:</label>
                        <input 
                            type="text"
                            id={`answer-${question.id}-${index}`}
                            value={answer.answer}
                            onChange={(e) => {
                                const newAnswers = [...answers];
                                newAnswers[index].answer = e.target.value;
                                setAnswers(newAnswers);
                                onQuestionUpdated?.({...question, answers: newAnswers});
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
                                onQuestionUpdated?.({...question, answers: newAnswers});
                            }}
                            className="correct-checkbox"
                        ></input>
                        <button
                            className="pww-button button-small button-red delete-answer-button"
                            onClick={() => {
                                const newAnswers = answers.filter((_, i) => i !== index);
                                console.log('Deleting answer at index', index, 'New answers:', newAnswers);
                                setAnswers(newAnswers);
                                onQuestionUpdated?.({...question, answers: newAnswers});
                            }}
                        ><b>-</b> Delete Answer</button>
                    </div>
                ))}
                <div className="question-buttons">
                    <button
                        className="pww-button button-small button-green add-answer-button"
                        onClick={() => {
                            const newAnswers = [...answers, { answer: '', correct: false }];
                            setAnswers(newAnswers);
                            onQuestionUpdated?.({...question, answers: newAnswers});
                        }}
                    ><b>+</b> Add Answer</button>
                    <button
                        className="pww-button button-red button-small delete-question-button"
                        onClick={async () => {
                            if (!confirm(`Are you sure you want to delete this question? This operation cannot be undone.`))
                                return;
                            onQuestionDeleted?.(question.id);
                        }}
                    ><b>-</b> Delete Question</button>
                </div>
            </div>
        </div>
    );
}