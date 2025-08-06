import { TextStyle } from '@tiptap/extension-text-style'
import { FontSize } from 'tiptap-extension-font-size'
import { EditorContent, useEditor } from '@tiptap/react'
import Color from "@tiptap/extension-color";
import { BackColor } from "./extensions/backgroundColor";
import StarterKit from '@tiptap/starter-kit'

import { useImperativeHandle } from 'react';

interface MyProps {
  initialContent: string | undefined;
  ref: React.Ref<EditorRef>;
}
export interface EditorRef {
  get_content: () => string | undefined;
 
}

/*
  content: `
        <p>Adjusting font sizes can greatly affect the readability of your text, making it easier for users to engage with your content.</p>
        <p>When designing a website, it's crucial to balance large headings and smaller body text for a clean, organized layout.</p>
        <p>When setting font sizes, it's important to consider accessibility, ensuring that text is readable for users with different visual impairments.</p>
        <p><span style="font-size: 10px">Too small</span> a font size can strain the eyes, while <span style="font-size: 40px">too large</span> can disrupt the flow of the design.</p>
        <p>When designing for mobile, font sizes should be adjusted to maintain readability on smaller screens.</p>
      `,
*/

const SimpleEditor = (props: MyProps) => {

  const editor = useEditor({
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit,
      TextStyle,
      FontSize,
      Color,
      BackColor,
      
    ],
    content: props.initialContent,
  
  })

  if (!editor) {
    return null
  }

 useImperativeHandle(props.ref, () => ({
    get_content() {
      return editor.getHTML();
    }
  }))

  return (
    <>
      <div className="flex flex-row justify-start align-baseline wrap gap-1 text-textColor2">
        <div>
        <input
            type="color"
            onInput={event => editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()}
            value={editor.getAttributes('textStyle').color}
            data-testid="setColor"
          />
        </div>
        <div>
        <input
            type="color"
            onInput={event => editor.chain().focus().setBackColor((event.target as HTMLInputElement).value).run()}
            value={editor.getAttributes('textStyle').backColor}
            data-testid="setBackColor"
          />
        </div>
        <div className="flex justify-center gap-2">
          <div 
                     className={editor.isActive('bold') ? 
                      'is-active  bg-bgColorTipTapMenuBtnActive font-extrabold text-textColorTipTapMenuBtnActive hover:text-textColorTipTapMenuBtnHover hover:bg-bgColorTipTapMenuBtnHover p-2 m-2' : 
                      'p-2 m-1 bg-bgColorTipTapMenuBtn text-textColorTipTapMenuBtn hover:bg-bgColorTipTapMenuBtnHover hover:text-textColorTipTapMenuBtnHover'}
          
          >
          <button
            onClick={() => editor.chain().focus().setFontSize('11px').run()}
            className={editor.isActive('textStyle', { fontSize: '11px' }) ? 'is-active' : ''}
            data-test-id="11px"
          >
            11px
          </button>
          </div>
          <div 
                     className={editor.isActive('bold') ? 
                      'is-active  bg-bgColorTipTapMenuBtnActive font-extrabold text-textColorTipTapMenuBtnActive hover:text-textColorTipTapMenuBtnHover hover:bg-bgColorTipTapMenuBtnHover p-2 m-2' : 
                      'p-2 m-1 bg-bgColorTipTapMenuBtn text-textColorTipTapMenuBtn hover:bg-bgColorTipTapMenuBtnHover hover:text-textColorTipTapMenuBtnHover'}
          
          >
          <button
            onClick={() => editor.chain().focus().setFontSize('12px').run()}
            className={editor.isActive('textStyle', { fontSize: '12px' }) ? 'is-active' : ''}
            data-test-id="12px"
          >
            12px
          </button>
          </div>    <div 
                     className={editor.isActive('bold') ? 
                      'is-active  bg-bgColorTipTapMenuBtnActive font-extrabold text-textColorTipTapMenuBtnActive hover:text-textColorTipTapMenuBtnHover hover:bg-bgColorTipTapMenuBtnHover p-2 m-2' : 
                      'p-2 m-1 bg-bgColorTipTapMenuBtn text-textColorTipTapMenuBtn hover:bg-bgColorTipTapMenuBtnHover hover:text-textColorTipTapMenuBtnHover'}
          
          >
          <button
            onClick={() => editor.chain().focus().setFontSize('14px').run()}
            className={editor.isActive('textStyle', { fontSize: '14px' }) ? 'is-active' : ''}
            data-test-id="14px"
          >
            14px
          </button>
          </div>
          <div 
                     className={editor.isActive('bold') ? 
                      'is-active  bg-bgColorTipTapMenuBtnActive font-extrabold text-textColorTipTapMenuBtnActive hover:text-textColorTipTapMenuBtnHover hover:bg-bgColorTipTapMenuBtnHover p-2 m-2' : 
                      'p-1 m-1 bg-bgColorTipTapMenuBtn text-textColorTipTapMenuBtn hover:bg-bgColorTipTapMenuBtnHover hover:text-textColorTipTapMenuBtnHover'}
          
          >
          <button
            onClick={() => editor.chain().focus().setFontSize('16px').run()}
            className={editor.isActive('textStyle', { fontSize: '16px' }) ? 'is-active' : ''}
            data-test-id="16px"
          >
            16px
          </button>
          </div>
          <div 
                     className={editor.isActive('bold') ? 
                      'is-active  bg-bgColorTipTapMenuBtnActive font-extrabold text-textColorTipTapMenuBtnActive hover:text-textColorTipTapMenuBtnHover hover:bg-bgColorTipTapMenuBtnHover p-2 m-2' : 
                      'p-1 m-1 bg-bgColorTipTapMenuBtn text-textColorTipTapMenuBtn hover:bg-bgColorTipTapMenuBtnHover hover:text-textColorTipTapMenuBtnHover'}
          
          >
          <button
            onClick={() => editor.chain().focus().setFontSize('18px').run()}
            className={editor.isActive('textStyle', { fontSize: '18px' }) ? 'is-active' : ''}
            data-test-id="18px"
          >
            18px
          </button>
          </div>
          <div 
                     className={editor.isActive('bold') ? 
                      'is-active  bg-bgColorTipTapMenuBtnActive font-extrabold text-textColorTipTapMenuBtnActive hover:text-textColorTipTapMenuBtnHover hover:bg-bgColorTipTapMenuBtnHover p-2 m-2' : 
                      'p-1 m-1 bg-bgColorTipTapMenuBtn text-textColorTipTapMenuBtn hover:bg-bgColorTipTapMenuBtnHover hover:text-textColorTipTapMenuBtnHover'}
          
          >
          <button
            onClick={() => editor.chain().focus().setFontSize('20px').run()}
            className={editor.isActive('textStyle', { fontSize: '20px' }) ? 'is-active' : ''}
            data-test-id="20px"
          >
            20px
          </button>
          </div>
          <div 
                     className={editor.isActive('bold') ? 
                      'is-active  bg-bgColorTipTapMenuBtnActive font-extrabold text-textColorTipTapMenuBtnActive hover:text-textColorTipTapMenuBtnHover hover:bg-bgColorTipTapMenuBtnHover p-2 m-2' : 
                      'p-1 m-1 bg-bgColorTipTapMenuBtn text-textColorTipTapMenuBtn hover:bg-bgColorTipTapMenuBtnHover hover:text-textColorTipTapMenuBtnHover'}
          
          >
          <button
            onClick={() => editor.chain().focus().setFontSize('22px').run()}
            className={editor.isActive('textStyle', { fontSize: '22px' }) ? 'is-active' : ''}
            data-test-id="22px"
          >
            22px
          </button>
          </div>
          <div 
                     className={editor.isActive('bold') ? 
                      'is-active  bg-bgColorTipTapMenuBtnActive font-extrabold text-textColorTipTapMenuBtnActive hover:text-textColorTipTapMenuBtnHover hover:bg-bgColorTipTapMenuBtnHover p-2 m-2' : 
                      'p-1 m-1 bg-bgColorTipTapMenuBtn text-textColorTipTapMenuBtn hover:bg-bgColorTipTapMenuBtnHover hover:text-textColorTipTapMenuBtnHover'}
          
          >
          <button onClick={() => editor.chain().focus().unsetFontSize().run()} data-test-id="unsetFontSize">
            Unset font size
          </button>
          </div>
        </div>
  
        <div>  
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={
              !editor.can()
                .chain()
                .focus()
                .toggleBold()
                .run()
            }
            className={editor.isActive('bold') ? 
              'is-active  bg-bgColorTipTapMenuBtnActive font-extrabold text-textColorTipTapMenuBtnActive hover:text-textColorTipTapMenuBtnHover hover:bg-bgColorTipTapMenuBtnHover p-2 m-2' : 
              'p-2 m-2 bg-bgColorTipTapMenuBtn text-textColorTipTapMenuBtn hover:bg-bgColorTipTapMenuBtnHover hover:text-textColorTipTapMenuBtnHover'}
          >
            bold
          </button>
        </div>
        <div>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={
              !editor.can()
                .chain()
                .focus()
                .toggleItalic()
                .run()
            }
            className={editor.isActive('italic') ? 
              'is-active  bg-bgColorTipTapMenuBtnActive md:italic text-textColorTipTapMenuBtnActive hover:text-textColorTipTapMenuBtnHover hover:bg-bgColorTipTapMenuBtnHover p-2 m-2' : 
              'p-2 m-2 bg-bgColorTipTapMenuBtn text-textColorTipTapMenuBtn hover:bg-bgColorTipTapMenuBtnHover hover:text-textColorTipTapMenuBtnHover'}
          >
            italic
          </button>
        </div>
        <div>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={
              !editor.can()
                .chain()
                .focus()
                .toggleStrike()
                .run()
            }
           className={editor.isActive('strike') ? 
              'is-active  bg-bgColorTipTapMenuBtnActive line-through text-textColorTipTapMenuBtnActive hover:text-textColorTipTapMenuBtnHover hover:bg-bgColorTipTapMenuBtnHover p-2 m-2' : 
               'p-2 m-2 bg-bgColorTipTapMenuBtn text-textColorTipTapMenuBtn hover:bg-bgColorTipTapMenuBtnHover hover:text-textColorTipTapMenuBtnHover'}
          >
            strike
          </button>
        </div>
        <div>
        <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={
              !editor.can()
                .chain()
                .focus()
                .undo()
                .run()
            }
            className={editor.isActive('strike') ? 
              'is-active  bg-bgColorTipTapMenuBtnActive line-through text-textColorTipTapMenuBtnActive hover:text-textColorTipTapMenuBtnHover hover:bg-bgColorTipTapMenuBtnHover p-2 m-2' : 
               'p-2 m-2 bg-bgColorTipTapMenuBtn text-textColorTipTapMenuBtn hover:bg-bgColorTipTapMenuBtnHover hover:text-textColorTipTapMenuBtnHover'}
    
          >
            Undo
          </button>
          </div>
 
      </div>
      <div>
      <EditorContent editor={editor} />
      </div>
    </>
  )
}

export default SimpleEditor