import { PagesOverview } from '@/components/pages-overview'
import { UserSession } from '@/components/user-session'
import { Button } from '@frontend/ui/components/button'
import Link from 'next/link'

export default function Home() {
  return (
    <>

      <UserSession />

      <hr className="my-8" />

      <PagesOverview />

      <hr className="my-8" />

      <Button asChild>
        <Link href="/patients">View Patients</Link>
      </Button>
    </>
  )
}
