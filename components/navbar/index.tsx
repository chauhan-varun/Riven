'use client'

import { usePathname, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useQuery } from "convex/react"
import { Id } from "@/convex/_generated/dataModel"
import { api } from "@/convex/_generated/api"
import { Hash, LayoutTemplate, CircleHelp } from "lucide-react"
import { UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"

type TabProps = { 
  label: string,
  href: string,
  icon?: React.ReactNode
}

const Navbar = () => {
  const params = useSearchParams();
  const projectId = params.get('project');

  const project = useQuery(
    api.project.getProject,
    projectId ? { projectId: projectId as Id<'projects'> } : 'skip'
  )

  const me = useQuery(api.users.current);

  const pathname = usePathname();
  const hasCanvas = pathname.includes('canvas');
  const hasStyleGuide = pathname.includes('style-guide');

  const tabs: TabProps[] = [
    {
      label: 'Canvas',
      href: `/dashboard/${me?.name}/canvas?project=${projectId}`,
      icon: <Hash className="h-4 w-4" />,
    },
    {
      label: 'Style Guide',
      href: `/dashboard/${me?.name}/style-guide?project=${projectId}`,
      icon: <LayoutTemplate className="h-4 w-4" />,
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 p-6 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center gap-4">
        <Link
          href={`/dashboard`}
          className="w-8 h-8 rounded-full border-3 border-white bg-black flex items-center justify-center"
        >
          <div className="w-4 h-4 rounded-full bg-white"></div>
        </Link>

        <div className="lg:inline-block hidden rounded-full text-primary/60 border border-white/[0.12] backdrop-blur-xl bg-white/[0.08] px-4 py-2 text-sm saturate-150">
          Project
        </div>
      </div>

      <div className="lg:flex hidden items-center justify-center gap-2">
        <div className="flex items-center gap-2 backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] rounded-full p-2 saturate-150">
          {tabs.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className={[
                'group inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition',
                `${pathname}?project=${projectId}` === t.href
                  ? 'bg-white/[0.12] text-white border border-white/[0.16] backdrop-blur-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06] border border-transparent',
              ].join(' ')}
            >
              <span
                className={
                  `${pathname}?project=${projectId}` === t.href
                    ? 'opacity-100'
                    : 'opacity-70 group-hover:opacity-90'
                }
              >
                {t.icon}
              </span>
              <span>{t.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 justify-end">
        <span className="text-sm text-white/50">TODO: credits</span>
        <Button
          variant="secondary"
          className="rounded-full h-12 w-12 flex items-center justify-center backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] saturate-150 hover:bg-white/[0.12]"
        >
          <CircleHelp className="size-5 text-white" />
        </Button>
        
        <UserButton />
        
        {/* {hasCanvas && <Autosave />} */}
        {/* {!hasCanvas && !hasStyleGuide && <CreateProject />} */}
      </div>
    </div>
  )
}

export default Navbar
