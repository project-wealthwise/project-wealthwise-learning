import { getDoc, doc, getDocs, collection, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const resourceTypes = [
    'video',
    'slideshow'
] as const;

export const resourceTypeNames = {
    video: 'Video',
    slideshow: 'Slideshow'
};

type ResourceType = typeof resourceTypes;

/**
 * Type for curriculum resources
 */
type Resource = {
    id: string,
    name: string,
    link: string,
    type: ResourceType,
    ref?: [string, ...string[]],
    description?: string
};

/**
 * Type for video resources
 */
type VideoResource = Resource & {
    type: 'video';
};

/**
 * Type for slideshow resources
 */
type SlideshowResource = Resource & {
    type: 'slideshow';
};

/**
 * Type for resource component properties
 */
type ResourceProps = {
    resource: Resource
};

/**
 * Answer type for a question
 */
type QuestionAnswer = {
    answer: string,
    correct: boolean
};

/**
 * Type for a question in a lesson
 */
type Question = {
    id: string,
    question: string,
    answers: QuestionAnswer[]
};

/**
 * Type for a lesson in a subject
 */
type Lesson = {
    id: string,
    name: string,
    index: string,
    description?: string,
    resources: Resource[],
    questions: Question[],
    deleted?: boolean
};

/**
 * Type for a subject in the curriculum
 */
type Subject = {
    id: string,
    name: string,
    type?: string,
    description?: string,
    lessons: Lesson[],
    resources: Resource[],
    deleted?: boolean
};

export async function getLessons(subjectId: string): Promise<Lesson[]> {
    const lessonDocs = await getDocs(collection(db, 'subjects', subjectId, 'lessons'));
    const lessons: any[] = lessonDocs.docs.map(doc => ({...doc.data(), id: doc.id}));
    
    for (const lesson of lessons)
        lesson.resources = lesson.resources.map((r: any) => ({...r, ref: ['subjects', subjectId, 'lessons', lesson.id]}));

    return lessons as Lesson[];
}

export async function getSubject(subjectId: string): Promise<Subject | undefined> {
    const subjectDoc = await getDoc(doc(db, "subjects", subjectId));
    if (!subjectDoc.exists()) return undefined;
    
    const subjectLesssons = await getLessons(subjectId);
    const data = subjectDoc.data();
    data.resources = data.resources.map((r: any) => ({...r, ref: ['subjects', subjectId]}));
    const subjectData = { ...data, lessons: subjectLesssons, id: subjectId } as Subject;
    return subjectData;
}

export async function saveSubjectChanges(subject: Subject) {
    const processed = (({ lessons, ...o }) => o)(subject);
    await setDoc(doc(db, 'subjects', subject.id), processed);
}

export async function saveLessonChanges(subjectId: string, lesson: Lesson) {
    await setDoc(doc(db, 'subjects', subjectId, 'lessons', lesson.id), lesson);
}

export type { Resource, VideoResource, SlideshowResource, ResourceType, ResourceProps, QuestionAnswer, Question, Lesson, Subject };