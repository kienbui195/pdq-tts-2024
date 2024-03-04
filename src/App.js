import * as React from "react";
import s from "./App.module.css";
import { useSpeechSynthesis } from "react-speech-kit";

function App() {
  const [text, setText] = React.useState([]);
  const [pitch, setPitch] = React.useState(1);
  const [rate, setRate] = React.useState(1);
  const [voiceIndex, setVoiceIndex] = React.useState(null);
  const [openModal, setOpenModal] = React.useState(false);
  const [audioUrl, setAudioUrl] = React.useState([]);
  const onEnd = () => {
    // You could do something here after speaking has finished
  };

  const { speak, cancel, speaking, supported, voices } = useSpeechSynthesis({ onEnd });

  const voice = voices[voiceIndex] || null;

  const handleConvertToSpeech = () => {
    text.map((_i) => {
      if (_i.trim() !== "") {
        speak({ _i, voice, rate, pitch });

        const audioBlob = new Blob([_i], { type: "audio/wav" });
        const url = URL.createObjectURL(audioBlob);
        let data = [...audioUrl];
        data.push(url);
        setAudioUrl(data);
      }
    });

    // Tạo tệp âm thanh từ văn bản
  };

  console.log(audioUrl);

  const handleAddTextBox = () => {
    let data = [...text];
    data.push("");
    setText(data);
  };

  const handleChangeText = (e, idx) => {
    let data = [...text];
    data[idx] = e.target.value;
    setText(data);
  };

  const renderRow = (value, idx) => {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
        <span>{idx + 1}.</span>
        <textarea
          value={value}
          onChange={(e) => {
            handleChangeText(e, idx);
          }}
          placeholder="Type something..."
          rows={3}
        />
        <button
          onClick={() => {
            let data = [...text];
            data.splice(idx, 1);
            setText(data);
          }}
        >
          Xóa
        </button>
      </div>
    );
  };

  return (
    <div className={s["container"]}>
      <div className={s["header"]}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label htmlFor="voice">Chọn voice</label>
          <select
            id="voice"
            name="voice"
            value={voiceIndex || ""}
            onChange={(event) => {
              setVoiceIndex(event.target.value);
            }}
          >
            <option value="">Default</option>
            {voices.map((option, index) => (
              <option key={option.voiceURI} value={index}>
                {`${option.lang} - ${option.name}`}
              </option>
            ))}
          </select>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex" }}>
            <label htmlFor="rate">Rate: </label>
            <div className="rate-value">{rate}</div>
          </div>
          <input
            type="range"
            min="0.5"
            max="2"
            defaultValue="1"
            step="0.1"
            id="rate"
            onChange={(event) => {
              setRate(event.target.value);
            }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex" }}>
            <label htmlFor="pitch">Pitch: </label>
            <div className="pitch-value">{pitch}</div>
          </div>
          <input
            type="range"
            min="0"
            max="2"
            defaultValue="1"
            step="0.1"
            id="pitch"
            onChange={(event) => {
              setPitch(event.target.value);
            }}
          />
        </div>
        <button onClick={handleAddTextBox}>Thêm Text</button>
        <button onClick={handleConvertToSpeech}>Chuyển thành giọng nói</button>
        <button onClick={() => setOpenModal(true)}>Danh sách Audio</button>
      </div>
      <div className={s["content"]}>
        {text.map((_i, idx) => {
          return <React.Fragment key={idx}>{renderRow(_i, idx)}</React.Fragment>;
        })}
      </div>

      {audioUrl.length > 0 && openModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            opacity: 40,
            display: "flex",
            margin: 'auto',
            right: 0,
            bottom: 0
          }}
        >
          <div style={{padding: '2rem', background: 'wheat', borderRadius: '4px'}}>
            {audioUrl.map((_i, idx) => {
              return (
                <audio controls key={idx} >
                  <source src={_i} type="audio/wav" />
                </audio>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
