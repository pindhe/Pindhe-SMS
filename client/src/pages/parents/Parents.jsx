import GenericCrudPage from '../../components/GenericCrudPage';

export default function Parents() {
  return (
    <GenericCrudPage
      title="Parents"
      description="Manage parent records"
      endpoint="/parents"
      fields={[
        { key: 'firstName', label: 'First Name', required: true },
        { key: 'lastName', label: 'Last Name', required: true },
        { key: 'phone', label: 'Phone', required: true },
        { key: 'email', label: 'Email', type: 'email' },
        { key: 'occupation', label: 'Occupation' },
        { key: 'address', label: 'Address' },
      ]}
    />
  );
}
