export async function getClozeAnswerKey(question_content: string):Promise<string> {
    //console.log(" in updateQuestion id ",id )
    //console.log(" in updateQuestion id ",body )
    // const url = `${rootpath}/api/questions/${id}`
    //console.log("HEE url", url)
    // const response = await axios.put(url, body)
        var answer_str = '';
        var match_arr = question_content.match(/\[([\u00C0-\u1EF9a-zA-Z^\'\/\s.,])*\]/g);
        if (match_arr == null) {
            //alert(" Please add question content");
            //console.log()
            return answer_str += "empty content"
        }
        else {
            
            for (let i = 0; i < match_arr.length; i++) {
                let bracket_content = match_arr[i].replace('[', '').replace(']', ''); // remove square brackets
                if (bracket_content.indexOf('/') >= 0) {     //dropdown cloze question
                    if (bracket_content.indexOf('^') < 0) {
                        alert("Missing caret ^ for dropdown clozequestion");
                    }
                    else {
                        var choices = bracket_content.split('/');
                        for (let j = 0; j < choices.length; j++) {
                            if (choices[j].indexOf('^') >= 0) {
                                let my_answer = choices[j].replace('^', '');
                                if (i === 0) {
                                    answer_str += my_answer;
                                }
                                else {
                                    answer_str += '/' + my_answer;
                                }
                                break;
                            }
                        }
                    }
                }
                else if (i === 0) {
                    answer_str += bracket_content;
                }
                else {
                    answer_str += '/' + bracket_content;
                }

            }
           // return answer_str
        }
        //console.log(answer_str)

    return answer_str
    //return "test"
}