import GenericCrudPage from '../../components/GenericCrudPage';

export default function Exams() {
  return (
    <GenericCrudPage
      title="Examinations"
      description="Manage examinations and results"
      endpoint="/examinations"
      fields={[
        { key: 'name', label: 'Name', required: true },
        { key: 'type', label: 'Type', required: true },
        { key: 'examDate', label: 'Exam Date', type: 'date', required: true },
        { key: 'academicYear', label: 'Academic Year', required: true },
        { key: 'status', label: 'Status', default: 'scheduled', options: ['scheduled', 'ongoing', 'completed', 'cancelled'] },
      ]}
    />
  );
}
