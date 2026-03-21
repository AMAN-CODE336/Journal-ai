import SkeletonLib, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const theme = { baseColor: '#1a1917', highlightColor: '#2a2825' }

const CardSkeleton = ({ lines = 2 }: { lines?: number }) => {
  return (
    <SkeletonTheme {...theme}>
      <div className="bg-surface border border-border rounded-xl p-5">
        <SkeletonLib width={200} height={16} className="mb-2" />
        {Array.from({ length: lines }).map((_, i) => (
          <SkeletonLib key={i} height={12} className="mb-1" />
        ))}
        <div className="flex gap-4 mt-3">
          <SkeletonLib width={80} height={10} />
          <SkeletonLib width={60} height={10} />
          <SkeletonLib width={50} height={10} />
        </div>
      </div>
    </SkeletonTheme>
  )
}

export default CardSkeleton