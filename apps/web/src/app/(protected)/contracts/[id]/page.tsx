
import { ContractDetails } from "@/features/contracts/components/contract-details";

interface ContractDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function ContractDetailsPage({
  params,
}: ContractDetailsPageProps) {
  const { id } = await params;
  return <ContractDetails id={id} />;
}
