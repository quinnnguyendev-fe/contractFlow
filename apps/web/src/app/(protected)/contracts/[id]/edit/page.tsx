
import { EditContract } from "@/features/contracts/components/edit-contract";
import { Suspense } from "react";

interface EditContractPageProps {
  params: Promise<{ id: string }>;
}

async function EditContractContent({ params }: EditContractPageProps) {
  const { id } = await params;
  return <EditContract contractId={id} />;
}

export default async function EditContractPage({
  params,
}: EditContractPageProps) {
  return (
    <Suspense fallback={<p>Loading edit contract...</p>}>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold">Edit Contract</h1>
            <p className="text-muted-foreground">
              Update the information of this contract
            </p>
          </div>

          <EditContractContent params={params} />
        </div>
    </Suspense>
  );
}
