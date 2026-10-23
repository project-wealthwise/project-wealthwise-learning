'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lesson, Question, Resource, ResourceType, saveLessonChanges } from '@/lib/curriculum';
import CurriculumResource from './resource';
import { Modal } from '../modal';
import { closeModal, openModal } from '@/lib/modal';
import { autoId } from '@/lib/firebase';
import CurriculumQuestion from './question';

type LessonProps = {
    lesson: Lesson,
    subjectId: string,
    onLessonDeleted: (lessonId: string) => void
};


export default function CurriculumLesson({
    lesson,
    subjectId,
    onLessonDeleted
}: LessonProps) {
    const [resources, setResources] = useState(lesson.resources);
    const resourceElements = resources.map((resource) =>
        <CurriculumResource
            key={resource.id}
            resource={resource}
        /> 
    );

    const [questions, setQuestions] = useState(lesson.questions);
    const questionElements = questions.map((question) =>
        <CurriculumQuestion
            key={question.id}
            question={question}
            onQuestionUpdated={(updatedQuestion: Question) => {
                setQuestions((currentQuestions) => currentQuestions.map((currentQuestion) =>
                    currentQuestion.id === updatedQuestion.id ? updatedQuestion : currentQuestion
                ));
            }}
            onQuestionDeleted={(questionId) => {
                const updatedQuestions = questions.filter(q => q.id !== questionId);
                setQuestions(updatedQuestions);
                saveLessonChanges(subjectId, { ...lesson, questions: updatedQuestions });
            }}
        />
    );

    return (
        <div className="lesson-container">
            <div className='lesson-top'>
                <h2 className='font-medium lesson-title'>{lesson.name}</h2>
            </div>
            <div className='lesson-description'>{lesson?.description}</div>
            <button 
                className="pww-button button-green button-small"
                onClick={() => openModal(`${lesson.id}-resources-modal`)}
                style={{margin: '0.5rem 0'}}
            >Edit Resources</button>
            <button 
                className="pww-button button-blue button-small"
                onClick={() => openModal(`${lesson.id}-questions-modal`)}
            >Edit Questions</button>
            <button 
                className="pww-button button-red button-small"
                style={{margin: '0.5rem 0'}}
                onClick={async () => {
                    if (lesson && confirm(`Are you sure you want to delete ${lesson.name}?`)) {
                        await saveLessonChanges(subjectId, { ...lesson, deleted: true });
                        onLessonDeleted(lesson.id);
                    }
                }}
            >Delete Lesson</button>
            <Modal modalId={`${lesson.id}-resources-modal`}>
                <h2 className="font-title edit-resource-header">Edit {lesson.name} Resources</h2>
                <div className="resources-container">
                    {resourceElements}
                </div>
                <button
                    className="pww-button button-small button-green create-resource-button"
                    onClick={() => {
                        const resource: Resource = {
                            id: autoId(),
                            name: 'New Resource',
                            link: '',
                            type: 'video' as unknown as ResourceType,
                            description: '',
                            ref: ['subjects', subjectId, 'lessons', lesson.id]
                        };

                        const updatedResources = [...resources, resource];
                        setResources(updatedResources);
                        saveLessonChanges(subjectId, { ...lesson, resources: updatedResources });
                    }}
                ><b>+</b> Create New Resource</button>
            </Modal>
            <Modal modalId={`${lesson.id}-questions-modal`}>
                <h2 className="font-title edit-resource-header">Edit {lesson.name} Questions</h2>
                {questionElements}
                <button 
                    className="pww-button button-small button-green create-resource-button"
                    onClick={() => {
                        const question: Question = {
                            id: autoId(),
                            question: 'New Question',
                            answers: [
                                { answer: 'Answer 1', correct: true },
                                { answer: 'Answer 2', correct: false },
                                { answer: 'Answer 3', correct: false },
                                { answer: 'Answer 4', correct: false }
                            ],
                        };

                        const updatedQuestions = [...questions, question];
                        setQuestions(updatedQuestions);
                        saveLessonChanges(subjectId, { ...lesson, questions: updatedQuestions });
                    }}
                ><b>+</b> Create New Question</button>
                <button
                    className="pww-button button-green button-small question-save-button"
                    onClick={() => {
                        const updatedQuestions = questions.map((question) => ({
                            ...question,
                            answers: question.answers.map((answer) => ({ ...answer }))
                        }));
                        setQuestions(updatedQuestions);
                        saveLessonChanges(subjectId, { ...lesson, questions: updatedQuestions });
                        closeModal();
                    }}
                >Save Changes</button>
            </Modal>
        </div>
    );
}