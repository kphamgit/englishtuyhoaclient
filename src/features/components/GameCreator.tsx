import { useState } from "react";
import DynamicInput from "./DynamicInput";
import { useNavigate } from "react-router-dom";
import { createGame } from "../services/list";
import { useRootUrl } from "../../contexts/root_url";

interface InputField {
  source: string;
  target: string;
}

export default function GameCreator(props: any) {

    const [name, setName] = useState('')
    const [gameNumber, setGameNumber] = useState('')
    const [videoUrl, setVideoUrl] = useState('')
    const [videoDuration, setVideoDuration] = useState('')

    const [matchPairs, setMatchPairs] = useState<InputField[]>([])
    const [sourceLanguage, setSourceLanguage] = useState('')
    const [targetLanguage, setTargetLanguage] = useState('')
    const [isContinuous, setIsContinuous] = useState(false);
    const {rootUrl} = useRootUrl();

    const navigate = useNavigate()

    const handleCancel = () => {
      const url = `/list_games`
      navigate(url)
    }

    const handleCheckBoxChange = () => {
      setIsContinuous(!isContinuous);
    };

    const handleSave = () => {
      console.log("mmmmm match pairs:", matchPairs)
      const sources = matchPairs.map((pair, index) => (
        pair.source
      ))
      console.log(" sources =", sources)
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

      createGame(rootUrl, {create_params: game_params})
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
    <div>
    <div className="m-2"><label >Name:</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} /></div>
    <div className="m-2"><label >Game Number:</label><input type="text" value={gameNumber} onChange={(e) => setGameNumber(e.target.value)} /></div>
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
        <option value="n/a">N/A</option>
      </select>
    </div>
    <div  className="m-2"><label>Ending Video URL:</label><input type="text" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} /></div>
    <div  className="m-2"><label>Duration for Video (in miliseconds):</label><input type="text" value={videoDuration} onChange={(e) => setVideoDuration(e.target.value)} /></div>
    <div className="m-3">Images are only allowed for TARGET column. Need to insert jpeg tags</div>
      <DynamicInput inputs ={matchPairs} parent_func={setMatchPairs} />
      <button className='bg-bgColor1 text-textColor1 p-2 rounded-md' type="button" onClick={handleSave}>Save</button>
      <button className='bg-bgColor2 m-3 p-1 text-white' onClick={handleCancel}>Cancel</button>
    </div>
)

}