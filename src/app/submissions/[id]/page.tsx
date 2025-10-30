import SubmissionDetail from '@/components/submissions/SubmissionDetail';

const SubmissionDetailPage = ({ params }: { params: { id: string } }) => {
  return (
    <div className="container mx-auto py-8">
      <SubmissionDetail submissionId={params.id} />
    </div>
  );
};

export default SubmissionDetailPage;
