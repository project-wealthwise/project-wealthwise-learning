"use client";

import { Lesson } from "@/lib/curriculum";
import CurriculumResource from "./resource";

// import { useEffect, useState } from "react";
// import { getSubject, Subject } from "@/lib/curriculum";

type LessonProps = {
    lesson: Lesson
};


export default function CurriculumLesson({
    lesson
}: LessonProps) {

    const resources = lesson.resources.map((resource, i) =>
        <CurriculumResource
            key={i}
            resource={resource}
        /> 
    );

    return (
        <div className="lesson-container">
            <div className='lesson-top'>
                <h2 className='font-medium lesson-title'>{lesson.name}</h2>
                <button className="pww-button button-green button-small">Edit</button>
            </div>
            <div className='lesson-description'>{lesson?.description}</div>
            {/* {JSON.stringify(lesson)}
            <div className="resources-container">
                {resources}
            </div> */}
        </div>
    );
}