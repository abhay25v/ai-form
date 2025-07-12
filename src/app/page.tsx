import { auth } from '@/auth';
import ClientHome from '@/components/ClientHome';

export default async function Home() {
  const session = await auth();
  return <ClientHome session={session} />;
}