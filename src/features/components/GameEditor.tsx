import { useEffect, useState } from "react";
import DynamicInput from "./DynamicInput";
import { useNavigate, useParams } from "react-router-dom";
import { getAGame } from "../../services/list";
import { updateGame } from "../services/list";


interface InputField {
  source: string;
  target: string;
}

export default function GameEditor(props: any) {

    const [name, setName] = useState('')
    const [gameNumber, setGameNumber] = useState('')
    const [videoUrl, setVideoUrl] = useState('')
    const [videoDuration, setVideoDuration] = useState('')
    const [matchPairs, setMatchPairs] = useState<InputField[]>([])
    const [sourceLanguage, setSourceLanguage] = useState('')
    const [targetLanguage, setTargetLanguage] = useState('')
    const [isContinuous, setIsContinuous] = useState(false);

    const params = useParams<{id: string}>()

    const navigate = useNavigate()

    const handleCancel = () => {
      const url = `/list_games`
      navigate(url)
    }

    useEffect(() => {
       getAGame(params.id)
       .then((response) => {
          //console.log("xxxx response: ", response)
          setName(response.name)
          setGameNumber(response.game_number)
          setVideoUrl(response.video_url)
          setVideoDuration(response.video_duration)
          const target_array = response.target.split('/')
          const match_pairs = response.base.split('/').map((item:string, index: number) => {
              return {source: item, target: target_array[index]}
          })
          setMatchPairs(match_pairs)
       })
       .catch(error => {
          console.log(error)
       })
    },[params.id])

    const handleCheckBoxChange = () => {
      setIsContinuous(!isContinuous);
    };

    const handleSave = () => {
      const sources = matchPairs.map((pair, index) => (
        pair.source
      ))
      const targets = matchPairs.map((pair, index) => (
        pair.target
      ))

      const game_params = { 
        name: name,
        game_number: gameNumber,
        base: sources.join('/'),
        target: targets.join('/'),
        continuous: isContinuous,
        video_url: videoUrl,
        video_duration: videoDuration,
        source_language: sourceLanguage,
        target_language: targetLanguage,
      };

      updateGame(params.id, {update_params: game_params})
      .then(response => {
        //console.log("xxxx after update response =  ", response)
        const url = `/list_games`
        navigate(url)
      })
      .catch(error => {
        console.log(error)
      })
    }

    const handleSourceLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSourceLanguage(event.target.value);
    }

    const handleTargetLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setTargetLanguage(event.target.value)
    }

return (
    <div className="text-textColor1 bg-bgColor1">
    
    <div>
      <label >Name:</label>
      <input  className="bg-bgColor2 m-3 p-1 text-textColor2" type="text" value={name} onChange={(e) => setName(e.target.value)} /></div>
    <div><label >Game Number:</label>
      <input className="m-2 bg-bgColor2  p-1 text-textColor2" type="text" value={gameNumber} onChange={(e) => setGameNumber(e.target.value)} /></div>
      <div className="m-2">
    <label>
        <input
         className="m-2"
          type="checkbox"
          checked={isContinuous}
          onChange={handleCheckBoxChange}
        />
        Continuous
      </label>
    </div>
    <div>
      <span className="m-2 bg-bgColor2  p-1 text-textColor2">Source Language</span>
      <select className="m-2 bg-bgColor2  p-1 text-textColor2" value={sourceLanguage} onChange={handleSourceLanguageChange}>
        <option value="vn" >VN</option>
        <option value="en">EN</option>
      </select>
    </div>
    <div>
      <span className="m-2 bg-bgColor2  p-1 text-textColor2">Target Language</span>
      <select className="m-2 bg-bgColor2  p-1 text-textColor2" value={targetLanguage} onChange={handleTargetLanguageChange}>
        <option value="vn" >VN</option>
        <option value="en">EN</option>
      </select>
    </div>
    <div><label>Ending Video URL:</label>
      <input  className="bg-bgColor2 m-3 p-1 text-textColor2" type="text" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} /></div>
    <div><label>Duration for Video (in miliseconds):</label>
      <input className="bg-bgColor2 m-3 p-1 text-textColor2" type="text" value={videoDuration} onChange={(e) => setVideoDuration(e.target.value)} /></div>
    <div>Images are only allowed for TARGET column. Need to insert jpeg tags</div>
    <DynamicInput  inputs ={matchPairs}/>
      <button className='bg-bgColor2 m-3 p-1 text-textColor2' onClick={handleCancel}>Cancel</button>
      <button className='bg-bgColor1 text-textColor1 p-2 rounded-md' type="button" onClick={handleSave}>Save</button>
      <div className='bg-bgColor2 m-3 p-1 text-textColor2'>nnn {sourceLanguage}</div>
    </div>
    
)

}

//  <DynamicInput  inputs ={[{ source: 'aa', target: 'bb' }]}/>