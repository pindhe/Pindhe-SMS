import GenericCrudPage from '../../components/GenericCrudPage';

export default function Staff() {
  return (
    <GenericCrudPage
      title="Staff"
      description="Manage staff records"
      endpoint="/staff"
      fields={[
        { key: 'firstName', label: 'First Name', required: true },
        { key: 'lastName', label: 'Last Name', required: true },
        { key: 'employeeId', label: 'Employee ID', required: true },
        { key: 'department', label: 'Department', required: true },
        { key: 'jobTitle', label: 'Job Title', required: true },
        { key: 'phone', label: 'Phone' },
      ]}
    />
  );
}
