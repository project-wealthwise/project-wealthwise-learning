"use client";

import { useState } from "react";
import { Lesson, Question, Resource, ResourceType, saveLessonChanges } from "@/lib/curriculum";
import CurriculumResource from "./resource";
import { Modal } from "../modal";
import { openModal } from "@/lib/modal";
import { autoId } from "@/lib/firebase";
import CurriculumQuestion from "./question";

// import { useEffect, useState } from "react";
// import { getSubject, Subject } from "@/lib/curriculum";

type LessonProps = {
    lesson: Lesson,
    subjectId: string
};


export default function CurriculumLesson({
    lesson,
    subjectId
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
                onClick={(e) => openModal(`${lesson.id}-resources-modal`)}
                style={{margin: '0.5rem 0'}}
            >Edit Resources</button>
            <button 
                className="pww-button button-green button-small"
                onClick={(e) => openModal(`${lesson.id}-questions-modal`)}
            >Edit Questions</button>
            <Modal modalId={`${lesson.id}-resources-modal`}>
                <h2 className="font-title edit-resource-header">Edit {lesson.name} Resources</h2>
                <div className="resources-container">
                    {resourceElements}
                </div>
                <button
                    className="pww-button button-small button-green create-resource-button"
                    onClick={(e) => {
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
                    onClick={(e) => {
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
                    onClick={(e) => {
                        saveLessonChanges(subjectId, { ...lesson, questions: questions });
                    }}
                >Save Changes</button>
            </Modal>
        </div>
    );
}