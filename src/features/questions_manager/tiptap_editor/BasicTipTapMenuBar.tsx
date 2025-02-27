

export const BasicTipTapMenuBar = (props: { editor: any }) => {
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
    <div className="flex flex-row justify-start">
      <div className="flex flex-row justify-around wrap gap-2 text-textColor2 menu-bar">
        <div>
        <input
            type="color"
            onInput={event => props.editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()}
            value={props.editor.getAttributes('textStyle').color}
            data-testid="setColor"
          />
        </div>

        <div>  
          <button
            onClick={() => props.editor.chain().focus().toggleBold().run()}
            disabled={
              !props.editor.can()
                .chain()
                .focus()
                .toggleBold()
                .run()
            }
            className={props.editor.isActive('bold') ? 
              'is-active  bg-bgColorTipTapMenuBtnActive font-extrabold text-textColorTipTapMenuBtnActive hover:text-textColorTipTapMenuBtnHover hover:bg-bgColorTipTapMenuBtnHover p-2 m-2' : 
              'p-2 m-2 bg-bgColorTipTapMenuBtn text-textColorTipTapMenuBtn hover:bg-bgColorTipTapMenuBtnHover hover:text-textColorTipTapMenuBtnHover'}
          >
            bold
          </button>
        </div>

        <div>
          <button
            onClick={() => props.editor.chain().focus().toggleItalic().run()}
            disabled={
              !props.editor.can()
                .chain()
                .focus()
                .toggleItalic()
                .run()
            }
            className={props.editor.isActive('italic') ? 
              'is-active  bg-bgColorTipTapMenuBtnActive md:italic text-textColorTipTapMenuBtnActive hover:text-textColorTipTapMenuBtnHover hover:bg-bgColorTipTapMenuBtnHover p-2 m-2' : 
              'p-2 m-2 bg-bgColorTipTapMenuBtn text-textColorTipTapMenuBtn hover:bg-bgColorTipTapMenuBtnHover hover:text-textColorTipTapMenuBtnHover'}
          >
            italic
          </button>
        </div>

        <div>
          <button
            onClick={() => props.editor.chain().focus().toggleStrike().run()}
            disabled={
              !props.editor.can()
                .chain()
                .focus()
                .toggleStrike()
                .run()
            }
            className={props.editor.isActive('strike') ? 
              'is-active  bg-bgColorTipTapMenuBtnActive line-through text-textColorTipTapMenuBtnActive hover:text-textColorTipTapMenuBtnHover hover:bg-bgColorTipTapMenuBtnHover p-2 m-2' : 
              'p-2 m-2 bg-bgColorTipTapMenuBtn text-textColorTipTapMenuBtn hover:bg-bgColorTipTapMenuBtnHover hover:text-textColorTipTapMenuBtnHover'}
          >
            strike
          </button>
        </div>

        <div>
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
        </div>

        <div>
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
        </div>

        <div>
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
      </div>
    </div>
  )
  }
  