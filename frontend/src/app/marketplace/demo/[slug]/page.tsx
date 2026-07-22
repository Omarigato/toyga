import { redirect } from "next/navigation";

export default async function MarketplaceDemoRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/templates/${slug}`);
}
