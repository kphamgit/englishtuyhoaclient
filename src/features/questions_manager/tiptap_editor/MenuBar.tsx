
export const MenuBar = (props: { editor: any }) => {
    if (!props.editor) {
      return null
    }
  
    const addImage = () => {
      const url = window.prompt('Enter the image URL')
  
      if (url) {
        props.editor.chain().focus().setImage({ src: url }).run()
      }
    }
  
    //className={props.editor.isActive('bold') ? 'is-active' : ''}
    return (
      <div className='menu-bar text-red-400'>
        <button
          onClick={() => props.editor.chain().focus().toggleBold().run()}
          disabled={
            !props.editor.can()
              .chain()
              .focus()
              .toggleBold()
              .run()
          }
          className={props.editor.isActive('bold') ? 'is-active' : ''}
        >
          bold
        </button>
        <button
          onClick={() => props.editor.chain().focus().toggleItalic().run()}
          disabled={
            !props.editor.can()
              .chain()
              .focus()
              .toggleItalic()
              .run()
          }
          className={props.editor.isActive('italic') ? 'is-active' : ''}
        >
          italic
        </button>
        <button
          onClick={() => props.editor.chain().focus().toggleStrike().run()}
          disabled={
            !props.editor.can()
              .chain()
              .focus()
              .toggleStrike()
              .run()
          }
          className={props.editor.isActive('strike') ? 'is-active' : ''}
        >
          strike
        </button>
        <button
          onClick={() => props.editor.chain().focus().toggleCode().run()}
          disabled={
            !props.editor.can()
              .chain()
              .focus()
              .toggleCode()
              .run()
          }
          className={props.editor.isActive('code') ? 'is-active' : ''}
        >
          code
        </button>
        <button
          onClick={() => props.editor.chain().focus().toggleHighlight().run()}
          className={props.editor.isActive("highlight") ? "is-active" : ""}
        >
          Highlight
        </button>
        <button
          onClick={() => props.editor.chain().focus().setTextAlign('left').run()}
          className={props.editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}
        >
          left
        </button>
        <button
          onClick={() => props.editor.chain().focus().setTextAlign('center').run()}
          className={props.editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}
        >
          center
        </button>
        <button
          onClick={() => props.editor.chain().focus().setTextAlign('right').run()}
          className={props.editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}
        >
          right
        </button>
        <button onClick={() => props.editor.chain().focus().unsetAllMarks().run()}>
          clear marks
        </button>
        <button onClick={() => props.editor.chain().focus().clearNodes().run()}>
          clear nodes
        </button>
        <button
          onClick={() => props.editor.chain().focus().setParagraph().run()}
          className={props.editor.isActive('paragraph') ? 'is-active' : ''}
        >
          paragraph
        </button>
        <button
          onClick={() => props.editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={props.editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
        >
          h1
        </button>
        <button
          onClick={() => props.editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={props.editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
        >
          h2
        </button>
        <button
          onClick={() => props.editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={props.editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
        >
          h3
        </button>
        <button
          onClick={() => props.editor.chain().focus().toggleHeading({ level: 4 }).run()}
          className={props.editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}
        >
          h4
        </button>
        <button
          onClick={() => props.editor.chain().focus().toggleHeading({ level: 5 }).run()}
          className={props.editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}
        >
          h5
        </button>
        <button
          onClick={() => props.editor.chain().focus().toggleHeading({ level: 6 }).run()}
          className={props.editor.isActive('heading', { level: 6 }) ? 'is-active' : ''}
        >
          h6
        </button>
        <button
          onClick={() => props.editor.chain().focus().toggleBulletList().run()}
          className={props.editor.isActive('bulletList') ? 'is-active' : ''}
        >
          bullet list
        </button>
        <button
          onClick={() => props.editor.chain().focus().toggleOrderedList().run()}
          className={props.editor.isActive('orderedList') ? 'is-active' : ''}
        >
          ordered list
        </button>
        <button
          onClick={() => props.editor.chain().focus().toggleCodeBlock().run()}
          className={props.editor.isActive('codeBlock') ? 'is-active' : ''}
        >
          code block
        </button>
        <button
          onClick={() => props.editor.chain().focus().toggleBlockquote().run()}
          className={props.editor.isActive('blockquote') ? 'is-active' : ''}
        >
          blockquote
        </button>
        <button onClick={() => props.editor.chain().focus().setHorizontalRule().run()}>
          horizontal rule
        </button>
        <button onClick={() => props.editor.chain().focus().setHardBreak().run()}>
          hard break
        </button>
          <button onClick={() => addImage()}>Image</button>
        <button
          onClick={() => props.editor.chain().focus().undo().run()}
          disabled={
            !props.editor.can()
              .chain()
              .focus()
              .undo()
              .run()
          }
        >
          undo
        </button>
        <button
          onClick={() => props.editor.chain().focus().redo().run()}
          disabled={
            !props.editor.can()
              .chain()
              .focus()
              .redo()
              .run()
          }
        >
          redo
        </button>
      </div>
    )
  }
  