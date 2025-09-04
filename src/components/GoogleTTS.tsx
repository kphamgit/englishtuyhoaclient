import axios from 'axios';
import React, { useEffect } from 'react'
import { useAppSelector } from '../redux/store';
import { useRootUrl } from '../contexts/root_url';

export default function GoogleTTS({ text }: { text: string }) {
    //{ text } destructures the text property from the props object.
    //{ text: string } specifies the type of the text property.
    //this is the same as GoogleTTS(props: { text: string })  kpham
    const [audioSrc, setAudioSrc] = React.useState<string | null>(null);
    
    
    const { rootUrl } = useRootUrl();

    useEffect(() => {
        const fetchAudio = async () => {
            //const url = 'http://localhost:5001/api/tts/text_to_speech'
            ///api/google_tts/text_to_speech',
            const url = `${rootUrl}/api/google_tts/text_to_speech`
            console.log("GoogleTTS, playAudio url = ", url)
            //console.log("playAudio question.audio_str = ", question?.audio_str)
            const response = await axios.post(url,{
                text: text,
               // voice: "en-US-JennyNeural",
            })
            //console.log("response data audioContent= ", response.data.audioContent)
            const audioSrc = `data:audio/mp3;base64,${response.data.audioContent}`;
            setAudioSrc(audioSrc);
        };
        if (text) {
            fetchAudio();
        }
    },[text])

    return (
        <div>
                
        {audioSrc && (
            <audio src={audioSrc} controls />
        )}
    </div>
    )
}
