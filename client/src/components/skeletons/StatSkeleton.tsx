import SkeletonLib, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const theme = { baseColor: '#1a1917', highlightColor: '#2a2825' }

const StatSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <SkeletonTheme {...theme}>
      <div className={`grid grid-cols-${count} gap-4`}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-surface border border-border rounded-xl p-5">
            <SkeletonLib width={80} height={10} className="mb-3" />
            <SkeletonLib width={60} height={36} />
          </div>
        ))}
      </div>
    </SkeletonTheme>
  )
}

export default StatSkeleton