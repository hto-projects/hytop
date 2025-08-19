async function speak(message) {
  let ttsUrl = `https://tiktok-tts.weilnet.workers.dev/api/generation`;
  let body = {
    text: message,
    voice: 'en_us_rocket'
  }

  try {
    let response = await fetch(ttsUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    let responseJson = await response.json();
    let audioUrl = `data:audio/wav;base64,${responseJson.data}`;
    let audio = new Audio(audioUrl);

    setTimeout(() => audio.play(), 1000);

  } catch (e) {
    alert(e);
    return;
  }
}
