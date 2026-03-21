import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import FontFamily from '@tiptap/extension-font-family'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Placeholder from '@tiptap/extension-placeholder'
import FontSize from '@/lib/FontSize'

interface EditorProps {
  initialContent?: string
  onChange: (content: string, plainText: string) => void
}

const btn = (active: boolean) =>
  `px-2.5 py-1.5 rounded text-xs cursor-pointer transition-colors font-medium ${
    active ? 'bg-accent text-bg' : 'text-muted hover:text-text hover:bg-surface2'
  }`

const divider = <div className="w-px bg-border mx-1 self-stretch" />

const Editor = ({ initialContent, onChange }: EditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      FontFamily,
       FontSize,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'Start writing your journal entry...' }),
    ],
    content: initialContent ? JSON.parse(initialContent) : '',
    onUpdate({ editor }) {
      onChange(JSON.stringify(editor.getJSON()), editor.getText())
    }
  })

  if (!editor) return null

  const wordCount = editor.getText().split(/\s+/).filter(Boolean).length
  // const today = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric', year: 'numeric' })

  return (
    <div>
      {/* Meta bar */}
      <div className="flex items-center justify-between py-2 border-b border-border mb-2 text-xs text-muted">
        <div className="flex items-center gap-4">
          {/* <span>📅 {today}</span> */}
          <span>{wordCount} words</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 py-2 border-b border-border mb-6">

        {/* Font family */}
        <select
          className="bg-surface2 text-muted text-xs px-2 py-1.5 rounded border border-border outline-none cursor-pointer"
          onChange={e => editor.chain().focus().setFontFamily(e.target.value).run()}
          defaultValue=""
        >
          <option value="">Default</option>
          <option value="Georgia">Georgia</option>
          <option value="'Times New Roman'">Times New Roman</option>
          <option value="'Courier New'">Courier New</option>
          <option value="Arial">Arial</option>
        </select>

        {divider}

        {/* Text formatting */}
        <button className={btn(editor.isActive('bold'))} onClick={() => editor.chain().focus().toggleBold().run()}><strong>B</strong></button>
        <button className={btn(editor.isActive('italic'))} onClick={() => editor.chain().focus().toggleItalic().run()}><em>I</em></button>
        <button className={btn(editor.isActive('underline'))} onClick={() => editor.chain().focus().toggleUnderline().run()}><u>U</u></button>
        <button className={btn(editor.isActive('strike'))} onClick={() => editor.chain().focus().toggleStrike().run()}><s>S</s></button>

        {divider}

        {/* Font size */}
<select
  className="bg-surface2 text-muted text-xs px-2 py-1.5 rounded border border-border outline-none cursor-pointer w-16"
  value={editor.getAttributes('textStyle').fontSize || '16px'}
  onChange={e => {
    if (e.target.value) {
      editor.chain().focus().setFontSize(e.target.value).run()
    } else {
      editor.chain().focus().unsetFontSize().run()
    }
  }}
>
  <option value="12px">12</option>
  <option value="14px">14</option>
  <option value="16px">16</option>
  <option value="18px">18</option>
  <option value="20px">20</option>
  <option value="24px">24</option>
  <option value="32px">32</option>
  <option value="48px">48</option>
</select>
        {divider}

        {/* Alignment */}
        <button className={btn(editor.isActive({ textAlign: 'left' }))} onClick={() => editor.chain().focus().setTextAlign('left').run()}>≡</button>
        <button className={btn(editor.isActive({ textAlign: 'center' }))} onClick={() => editor.chain().focus().setTextAlign('center').run()}>≡</button>
        <button className={btn(editor.isActive({ textAlign: 'right' }))} onClick={() => editor.chain().focus().setTextAlign('right').run()}>≡</button>

        {divider}

        {/* Lists */}
        <button className={btn(editor.isActive('bulletList'))} onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</button>
        <button className={btn(editor.isActive('orderedList'))} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</button>

        {divider}

        {/* Highlight & Code */}
        <button className={btn(editor.isActive('highlight'))} onClick={() => editor.chain().focus().toggleHighlight({ color: '#e8b86d33' }).run()}>✦ Highlight</button>
        <button className={btn(editor.isActive('codeBlock'))} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>{'</>'}</button>
        <button className={btn(editor.isActive('blockquote'))} onClick={() => editor.chain().focus().toggleBlockquote().run()}>" Quote</button>

        {divider}

        {/* Color */}
        <input
          type="color"
          defaultValue="#f5f0e8"
          onChange={e => editor.chain().focus().setColor(e.target.value).run()}
          className="w-6 h-6 rounded cursor-pointer bg-transparent border-none outline-none"
          title="Text color"
        />

        {divider}

        {/* Undo/Redo */}
        <button className={btn(false)} onClick={() => editor.chain().focus().undo().run()}>↩</button>
        <button className={btn(false)} onClick={() => editor.chain().focus().redo().run()}>↪</button>

      </div>

      {/* Editor content */}
      <EditorContent
        editor={editor}
        className="min-h-[500px] text-text text-base leading-relaxed outline-none prose prose-invert max-w-none"
      />
    </div>
  )
}

export default Editor