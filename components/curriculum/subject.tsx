'use client';

import { useEffect, useState } from 'react';
import { 
    getSubject, 
    Lesson, 
    Resource, 
    ResourceType, 
    saveLessonChanges, 
    saveSubjectChanges, 
    Subject 
} from '@/lib/curriculum';
import CurriculumLesson from './lesson';
import CurriculumResource from './resource';
import { autoId } from '@/lib/firebase';
import { Modal } from '../modal';
import { closeModal, openModal } from '@/lib/modal';

type SubjectProps = {
    subjectId: string
};

export default function CurriculumSubject({
    subjectId
}: SubjectProps) {
    const [subject, setSubject] = useState<Subject | undefined>();
    const [subjectLoading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        getSubject(subjectId).then((result) => {
            if (!cancelled) { 
                setSubject(result);
                setLoading(false);
            }
        });

        return () => {
            cancelled = true;
        };
    }, [subjectId]);

    if (subjectLoading) return (<div />); 
    if (subject?.deleted) return (<div style={{ display: 'none' }} />); // Hide deleted subjects

    const lessonEles = [...(subject?.lessons || [])]
        .sort((a, b) => parseInt(a.index) - parseInt(b.index))
        .filter(lesson => !lesson.deleted)
        .map((lesson, i) => 
            <CurriculumLesson 
                key={i}
                lesson={lesson}
                subjectId={subjectId}
                onLessonDeleted={(LessonId) => {
                    const updatedLessons = subject?.lessons.filter(l => l.id !== LessonId);
                    setSubject({...subject, lessons: updatedLessons } as Subject);
                    saveSubjectChanges({ ...subject, lessons: updatedLessons } as Subject);
                }}
                onLessonUpdated={(updatedLesson: Lesson) => {
                    const updatedLessons = subject?.lessons.map(l => l.id === updatedLesson.id ? updatedLesson : l);
                    setSubject({...subject, lessons: updatedLessons } as Subject);
                }}
            />
        );

    const resources = subject?.resources.map((resource, i) =>
        <CurriculumResource
            key={i}
            resource={resource}
        /> 
    );

    return (
        <div className="subject-container">
            <h1 className="subject-title">{subject?.name}</h1>
            <p className="subject-description">{subject?.description}</p>
            <h2 className="subject-header font-title">Subject Resources</h2>
            <div className="subject-resources">
                <div className={`${subjectId}-resources-container`}>
                    {resources}
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
                            ref: ['subjects', subjectId, 'resources']
                        };

                        setSubject((current) => current
                            ? { ...current, resources: [...current.resources, resource] }
                            : current);

                        if (subject) saveSubjectChanges(subject);
                    }}
                ><b>+</b> Create New Resource</button>
            </div>
            <h2 className="subject-header font-title">Subject Lessons</h2>
            <div className="subject-lessons">
                {lessonEles}
                <button
                    className="pww-button button-small button-green create-resource-button create-lesson-button"
                    onClick={() => {
                        const lesson: Lesson = {
                            id: autoId(),
                            name: 'New Lesson',
                            index: `${subject?.lessons.length || 0}`,
                            description: '',
                            resources: [],
                            questions: []
                        };

                        setSubject((current) => current
                            ? { ...current, lessons: [...current.lessons, lesson] }
                            : current);

                        if (subject) saveSubjectChanges(subject);
                        saveLessonChanges(subjectId, lesson); // Since this just sets the lesson doc, this creates the new lesson in the database
                    }}
                ><b>+</b> Create New Lesson</button>
            </div>
            <button
                className="pww-button button-small button-blue edit-subject-button"
                onClick={() => openModal(`edit-subject-modal-${subjectId}`)}
            >
                <b>✎</b> Edit Subject
            </button>
            <button
                className="pww-button button-small button-red delete-subject-button"
                onClick={async () => {
                    if (subject && confirm('Are you sure you want to delete this subject?')) {
                        await saveSubjectChanges({ ...subject, deleted: true });
                        setSubject({ ...subject, deleted: true });
                    }
                }}
            ><b>-</b> Delete Subject</button>
            <Modal modalId={`edit-subject-modal-${subjectId}`}>
                <div className="edit-subject-container">
                    <h1 className="edit-subject-header">Edit Subject</h1>
                    <form className="edit-subject-form"
                        onSubmit={async (e) => {
                            e.preventDefault();
                            const form = e.currentTarget;
                            const subjectName = (form.querySelector('#subjectName') as HTMLInputElement).value;
                            const subjectDesc = (form.querySelector('#subjectDesc') as HTMLInputElement).value;

                            const updatedSubject = { ...subject, name: subjectName, description: subjectDesc } as Subject;
                            await saveSubjectChanges(updatedSubject);
                            setSubject(updatedSubject);
                            closeModal();
                        }}
                    >
                        <div>
                            <label htmlFor="subjectName">Subject Name</label>
                            <input 
                                type="text" 
                                id="subjectName" 
                                className="pww-input form-input" 
                                defaultValue={subject?.name} 
                            />
                        </div>
                        <div>
                            <label htmlFor="subjectDesc">Subject Description</label>
                            <input
                                type="text"
                                id="subjectDesc"
                                className="pww-input form-input"
                                defaultValue={subject?.description}
                            />
                        </div>
                        <button type="submit" className="pww-button button-small button-green save-subject-button">Save Changes</button>
                    </form>
                </div>
            </Modal>
        </div>
    );
}