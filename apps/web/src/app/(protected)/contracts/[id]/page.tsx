
import { ContractDetails } from "@/features/contracts/components/contract-details";
import { Suspense } from "react";

interface ContractDetailsPageProps {
  params: Promise<{ id: string }>;
}

async function ContractDetailContent({ params }: ContractDetailsPageProps) {
  const { id } = await params;
  return <ContractDetails id={id} />;
}

export default async function ContractDetailsPage({
  params,
}: ContractDetailsPageProps) {
  return (
    <Suspense fallback={<p>Loading contract details...</p>}>
        <ContractDetailContent params={params} />
    </Suspense>
  );
}
