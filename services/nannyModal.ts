import axios from 'axios';

interface LessonData {
  Address: string;
  Email: string;
  Phone: string;
  ChildAge: number;
  MeetingTime: string;
  ParentName: string;
  Comment: string;
}
export async function sendLessonEmail(lessonData: LessonData) {
  const result = await axios.post(
    'https://formspree.io/f/mgolbvkj',
    lessonData
  );
  return result.data;
}
