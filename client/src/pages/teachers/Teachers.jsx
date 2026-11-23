import GenericCrudPage from '../../components/GenericCrudPage';

export default function Teachers() {
  return (
    <GenericCrudPage
      title="Teachers"
      description="Manage teacher records"
      endpoint="/teachers"
      fields={[
        { key: 'firstName', label: 'First Name', required: true },
        { key: 'lastName', label: 'Last Name', required: true },
        { key: 'employeeId', label: 'Employee ID', required: true },
        { key: 'phone', label: 'Phone' },
        { key: 'email', label: 'Email', type: 'email' },
        { key: 'qualification', label: 'Qualification' },
      ]}
    />
  );
}
