'use client';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import Header from '@/components/header';
import { auth, autoId, db } from '@/lib/firebase';
import { collection, doc, DocumentData, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import CurriculumSubject from '@/components/curriculum/subject';
import { saveSubjectChanges, Subject } from '@/lib/curriculum';

const editorRoles = ['admin', 'curriculum-developer'];

export default function CurriculumPage() {
    const router = useRouter();
    const [user, setUser] = useState<DocumentData | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [subjects, setSubjects] = useState<Subject[]>([]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            const userData = (await getDoc(doc(db, 'users', currentUser?.uid ?? ''))).data();
            setUser(userData ?? null);
            setAuthLoading(false);
        });

        return unsubscribe;
    }, []);

    useEffect(() => {
        if (!authLoading && !user) router.replace('/login');
        if (!authLoading && user && !editorRoles.some(role => user.roles?.includes(role)))
            router.replace('/account');
    }, [authLoading, router, user]);

    useEffect(() => {
        if (!authLoading && user && editorRoles.some(role => user.roles?.includes(role))) {
            const fetchSubjects = async () => {
                const subjectsCollection = await getDocs(collection(db, 'subjects'));
                setSubjects(subjectsCollection.docs.map((doc) => doc.data() as Subject));
            };

            fetchSubjects();
        }
    }, [authLoading, user]);

    if (authLoading || !user) {
        return (
            <>
                <Header />
                {/* <p>Loading...</p> */}
            </>
        );
    }

    return (
        <div className="root">
            <Header />
            <div className="curriculum-container">
                {subjects.map((subject) => (
                    <CurriculumSubject key={subject.id} subjectId={subject.id} />
                ))}
                <button
                    className="pww-button add-subject-button"
                    onClick={async () => {
                        const subject: Subject = {
                            id: autoId(),
                            name: 'New Subject',
                            lessons: [
                                {
                                    id: autoId(),
                                    name: 'New Lesson',
                                    index: '0',
                                    resources: [],
                                    questions: []
                                }
                            ],
                            resources: []
                        };

                        await saveSubjectChanges(subject);
                        await setDoc(doc(db, 'subjects', subject.id, 'lessons', subject.lessons[0].id), subject.lessons[0]);
                        setSubjects([...subjects, subject]);
                    }}
                ><b>+</b> Add Subject</button>
            </div>
        </div>
    );
}