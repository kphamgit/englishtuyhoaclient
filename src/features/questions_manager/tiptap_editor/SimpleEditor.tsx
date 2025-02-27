import {  forwardRef, useImperativeHandle, useState } from "react";

// => Tiptap packages
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from '@tiptap/starter-kit'
//import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import Image from "@tiptap/extension-image";
import ResizableImage from 'tiptap-resize-image'
import TextStyle from '@tiptap/extension-text-style'
//import styles from "./input_letter_style.module.css";
import mystyles from "./content-editor.module.css"
//import { LinkModal } from "./LinkModal";
import styled from 'styled-components'
import { BasicTipTapMenuBar } from "./BasicTipTapMenuBar";

/*
  <SimpleEditor setContent={setMyContent} />
*/


interface MyProps {
  initialContent: string | undefined;
}

export interface EditorRef {
  get_content: () => string | undefined;
 
}

//export function SimpleEditor(props: MyProps) {

export const SimpleEditor = forwardRef<EditorRef, MyProps>((props, ref) => {


  // Highlight,
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Color,
      TextStyle,
      ResizableImage,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
     
      
    ],
    content: props.initialContent,
    onBlur: ({ editor }) => {
      console.log(" setting content......")
      //props.setContent({
        //console.log(editor.getHTML())
        
     // })
  }
  }) as Editor;
 
  if (!editor) {
    return null;
  }

  useImperativeHandle(ref, () => ({
    get_content() {
      return editor.getHTML();
    }
  }))

  /*
  useImperativeHandle(ref, () => ({
  const get_content() {
    //console.log(editor.getHTML())
    return editor.getHTML()
    //props.parentFunc(editor.getHTML())
  }
  }
  */
  const addImage = () => {
    const url = window.prompt('Enter the image URL')

    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

// <MenuBar editor={editor} />
  return (
    
    <div>
      <BasicTipTapMenuBar editor={editor} />
      <EditorContent editor={editor} className={mystyles.content} />
     
    </div>
  
  );
});

