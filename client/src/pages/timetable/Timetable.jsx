import GenericCrudPage from '../../components/GenericCrudPage';

export default function Timetable() {
  return (
    <GenericCrudPage
      title="Timetable"
      description="Manage weekly class schedules"
      endpoint="/timetables"
      fields={[
        { key: 'class', label: 'Class ID', required: true },
        { key: 'subject', label: 'Subject ID', required: true },
        { key: 'teacher', label: 'Teacher ID', required: true },
        { key: 'day', label: 'Day', default: 'Monday', options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] },
        { key: 'startTime', label: 'Start Time', required: true },
        { key: 'endTime', label: 'End Time', required: true },
      ]}
    />
  );
}
