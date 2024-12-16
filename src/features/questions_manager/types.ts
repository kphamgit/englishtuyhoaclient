export interface ColumnProps { 
    Header: string, accessor: string 
}

export interface QuestionRowProps {
    id: string,
    question_number: number,
    format: number,
    content : string,
    answer_key : string,
    edit_link: string
    clone_button: string,
    delete_button: string
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

