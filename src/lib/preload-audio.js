async function getAudio(name, extension, returnBlob) {
  const res = await fetch(`./audio/${name}.${extension || "mp3"}`);
  const blob = await res.blob();
  return returnBlob ? blob : URL.createObjectURL(blob);
}

async function getAllAudio() {
  const audios = ["ding", "error", "shutdown", "startup"];
  const obj = {};
  for (let i = 0; i < audios.length; i++) {
    obj[audios[i]] = await getAudio(audios[i]);
  }
  return obj;
}

const audio = getAllAudio();

export default audio;
