export interface ColumnProps { 
    Header: string, accessor: string 
}

export interface DataRowProps {
    id: string,
    item_number: string,
    item_name: string,
    edit_link: string,
    extra_link?: string,
    clone_button: string,
    delete_button: string,
    move_button?: string,
    format?: string; 
    content?: string; 
    answer_key?: string;
    data_type: string;
}
//format: string; content: string; answer_key: string;
export interface UnitProps {
    id: string,
    unit_number: number,
    name: string,
    level?: string,
    content?: string,
    quizzes?: QuizProps[] | undefined,
    subCategoryId?: number,
}

/*
id          | int          | NO   | PRI | NULL    | auto_increment |
| user_name   | varchar(255) | YES  |     | NULL    |                |
| full_name   | varchar(255) | YES  |     | NULL    |                |
| role        | varchar(255) | NO   |     | NULL    |                |
| level       | varchar(255) | NO   |     | NULL    |                |
| message     | text         | YES  |     | NULL    |                |
| password    | varchar(64)  | YES  |     | NULL    |                |
| classId     | int          | YES  |     | NULL    |                |
| user_number 
*/

export type UserProps = {
  id: number,
  user_name: string,
  full_name: string,
  role: string,
  level: string,
  classId: string,
  message: string,
}
/*
{
    "id": 13,
    "name": "Giới Từ",
    "unit_number": 1,
    "level": "beginner,basic,intermediate,advanced",
    "content": "<p>Unit content</p>",
    "subCategoryId": 6
}
*/

export interface QuizProps {
  id: string;
  name: string;
  quiz_number: string;
  disabled?: boolean;
  video_url?: string | undefined;
  unitId: string;
  question?: QuestionProps[]
}

export type QuestionProps = {
  id: string,
  question_number: number,
  format: number,
  audio_src: string,
  audio_str : string,
  video_src : string,
  instruction : string,
  display_instruction : boolean,
  prompt : string,
  content : string,
  words_scramble_direction : string,
  answer_key : string,
  timeout : number,
  score : number,
  show_help : boolean,
  help1 : string,
  help2 : string,
  coding : boolean,
  quizId : number,
  radio : RadioProps,
  speech_recognition : boolean
  button_cloze_options?: string,
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
    radio_data: string
    set_radio_answer_key: (answer_key: string) => void
  }

  export interface WordScrambleComponentHandle {
    getDirection: () => string;
  }

export interface CategoryRowProps {
    id: string,
    item_number: number,
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

