import SkeletonLib, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const theme = { baseColor: '#1a1917', highlightColor: '#2a2825' }

const TableSkeleton = ({ rows = 5 }: { rows?: number }) => {
  return (
    <SkeletonTheme {...theme}>
      <div className="flex flex-col gap-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="bg-surface border border-border rounded-xl p-5">
            <div className="flex justify-between mb-2">
              <SkeletonLib width={200} height={16} />
              <SkeletonLib width={40} height={14} />
            </div>
            <SkeletonLib count={2} height={12} className="mb-1" />
            <div className="flex gap-4 mt-3">
              <SkeletonLib width={80} height={10} />
              <SkeletonLib width={60} height={10} />
              <SkeletonLib width={50} height={10} />
            </div>
          </div>
        ))}
      </div>
    </SkeletonTheme>
  )
}

export default TableSkeleton