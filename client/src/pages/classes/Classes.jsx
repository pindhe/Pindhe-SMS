import GenericCrudPage from '../../components/GenericCrudPage';

export default function Classes() {
  return (
    <GenericCrudPage
      title="Classes"
      description="Manage classes and capacity"
      endpoint="/classes"
      fields={[
        { key: 'name', label: 'Name', required: true },
        { key: 'grade', label: 'Grade', required: true },
        { key: 'capacity', label: 'Capacity', type: 'number', required: true },
        { key: 'academicYear', label: 'Academic Year', required: true },
        { key: 'status', label: 'Status', default: 'active', options: ['active', 'inactive'] },
      ]}
    />
  );
}
