export interface ColumnProps { 
    Header: string, accessor: string 
}

export interface QuestionRowProps {
    id: string,
    question_number?: number,
    format?: string,
    content? : string,
    answer_key? : string,
    edit_link: string
    clone_button: string,
    delete_button: string
}
export interface RadioComponentHandle {
    //declare or type the child component handle
    getRadioTexts: (base_params:any) => RadioProps;
  }

export interface RadioComponentProps {
    answer_key: string,
    radio_data: RadioProps
    set_radio_answer_key: (answer_key: string) => void
  }

  export interface WordScrambleComponentHandle {
    getDirection: () => string;
  }

export interface CategoryRowProps {
    id: string,
    category_number: number,
    edit_link: string
    clone_button: string,
    delete_button: string
}

export interface RadioProps{
    choice_1_text: string,
    choice_2_text: string,
    choice_3_text: string,
    choice_4_text: string,
  }

export interface QuestionRowPropsExtended extends QuestionRowProps {
    row_index: number;
    columns: ColumnProps[];
  }

export interface QuestionTableProps {
    columns: ColumnProps[],
    data: QuestionRowProps[] | undefined,
    renumber_question: () => void
    //clone_func: (event: React.MouseEvent<HTMLButtonElement>) => void; 
  }

