import GenericCrudPage from '../../components/GenericCrudPage';

export default function Subjects() {
  return (
    <GenericCrudPage
      title="Subjects"
      description="Manage school subjects"
      endpoint="/subjects"
      fields={[
        { key: 'name', label: 'Name', required: true },
        { key: 'code', label: 'Code', required: true },
        { key: 'description', label: 'Description' },
        { key: 'status', label: 'Status', default: 'active', options: ['active', 'inactive'] },
      ]}
    />
  );
}
