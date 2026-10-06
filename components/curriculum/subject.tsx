"use client";

import { useEffect, useState } from "react";
import { getSubject, Lesson, Resource, ResourceType, saveLessonChanges, saveSubjectChanges, Subject } from "@/lib/curriculum";
import CurriculumLesson from "./lesson";
import CurriculumResource from "./resource";
import { autoId } from "@/lib/firebase";

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

    const lessons = subject?.lessons.sort((a, b) => parseInt(a.index) - parseInt(b.index)).map((lesson, i) => 
        <CurriculumLesson 
            key={i}
            lesson={lesson}
            subjectId={subjectId}
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
            <h2 className="subject-header font-title">Subject Resources</h2>
            <div className="subject-resources">
                <div className={`${subjectId}-resources-container`}>
                    {resources}
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
                {lessons}
                <button
                    className="pww-button button-small button-green create-resource-button"
                    onClick={(e) => {
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
        </div>
    );
}