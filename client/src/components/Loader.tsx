import { ClipLoader } from 'react-spinners'

const Loader = ({ text = 'Loading...' }: { text?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <ClipLoader color="#e8b86d" size={36} />
      <p className="text-sm text-muted">{text}</p>
    </div>
  )
}

export default Loader