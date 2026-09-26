"use client";

import { useEffect, useState } from "react";
import { getSubject, Subject } from "@/lib/curriculum";

type SubjectProps = {
    subjectId: string
};


export default function CurriculumSubject({
    subjectId
}: SubjectProps) {
    const [subject, setSubject] = useState<Subject | undefined>();

    useEffect(() => {
        let cancelled = false;

        getSubject(subjectId).then((result) => {
            if (!cancelled) setSubject(result);
        });

        return () => {
            cancelled = true;
        };
    }, [subjectId]);

    return (
        <div className="subject-container">
            {JSON.stringify(subject)}
        </div>
    );
}