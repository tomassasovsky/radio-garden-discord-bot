const axios = require("axios");
const pathToFfmpeg = require('ffmpeg-static')

async function detectSong(buffer) {
  buffer = buffer.toString('base64');

  // ffmpeg - i input.wav - vn - ar 44100 - ac 2 - b:a 192k output.mp3

  // let inputRawFile = ".../clinteastwood_portion_mono.raw";
  // let byteArray = readFile(inputRawFile);
  // let base64Str = Base64.getEncoder().encodeToString(byteArray);
  // try {
  //   let out = new OutputStreamWriter(new FileOutputStream(".../clinteastwood_portion_mono.txt"), StandardCharsets.UTF_8)
  // } catch (e) {
  //   out.write(base64Str);
  // }

  const options = {
    method: 'POST',
    url: 'https://shazam.p.rapidapi.com/songs/detect',
    headers: {
      'content-type': 'text/plain',
      'X-RapidAPI-Host': 'shazam.p.rapidapi.com',
      'X-RapidAPI-Key': '5ee553337emsh26b7051fd260f78p16b7eajsnf7174dfb8860'
    },
    data: buffer,
  };

  try {
    const response = await axios.request(options);
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  detectSong
};
