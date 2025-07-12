import { redirect } from 'next/navigation';

// Temporary redirect to under construction page
export default function HomePage() {
  redirect('/under-construction');
}
