const Empty = ({ title, description, action, onAction }: {
  title: string
  description?: string
  action?: string
  onAction?: () => void
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
      <div className="w-16 h-16 rounded-full bg-surface2 border border-border flex items-center justify-center text-3xl mb-2">
        📭
      </div>
      <h3 className="text-text font-medium text-lg">{title}</h3>
      {description && (
        <p className="text-sm text-muted max-w-xs leading-relaxed">{description}</p>
      )}
      {action && onAction && (
        <button
          onClick={onAction}
          className="mt-3 bg-accent text-bg px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity"
        >
          {action}
        </button>
      )}
    </div>
  )
}

export default Empty