import { PagesOverview } from '@/components/pages-overview'
import { UserSession } from '@/components/user-session'

export default function Home() {
  return (
    <>

      <UserSession />

      <hr className="my-8" />

      <PagesOverview />
    </>
  )
}
