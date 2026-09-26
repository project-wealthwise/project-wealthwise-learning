import { getDoc, doc, getDocs, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * Type for curriculum resources
 */
type Resource = {
    id: string,
    name: string,
    link: string,
    type: 'video' | 'slideshow',
    description?: string
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
    questions: Question[]
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
    resources: Resource[]
};

export async function getLessons(subjectId: string): Promise<Lesson[]> {
    const lessonDocs = await getDocs(collection(db, 'subjects', subjectId, 'lessons'));
    const res: Lesson[] = lessonDocs.docs.map(doc => doc.data() as Lesson);
    return res;
}

export async function getSubject(subjectId: string): Promise<Subject | undefined> {
    const subjectDoc = await getDoc(doc(db, "subjects", subjectId));
    if (!subjectDoc.exists()) return undefined;
    
    const subjectLesssons = await getLessons(subjectId);
    const subjectData = { ...subjectDoc.data(), lessons: subjectLesssons, id: subjectId };
    return subjectData as Subject;

}

export type { Resource, QuestionAnswer, Question, Lesson, Subject };