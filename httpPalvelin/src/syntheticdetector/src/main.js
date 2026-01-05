
async function submitVideo() {
    //Get necessary elements
    //const youtubeLink = document.getElementById('youtubeLink').value;
    const fileInput = document.getElementById('videoFile');
    const status = document.getElementById('status');
    const videoPreview = document.getElementById('videoPreview');
    const resultsDiv = document.getElementById("results");
    const technicalP = document.getElementById("technical-data");
    //Inform user
    status.style.visibility = "visible";
    status.className = "status status-success";
    status.innerText = "Processing video..."; 
    technicalP.innerText = "";
    
    document.getElementById("technical-data-div").style.visibility = "hidden";
    resultsDiv.style.visibility = "hidden";
    //Get form data 
    const formData = new FormData();
    if (fileInput.files.length > 0) {
      formData.append("file", fileInput.files[0]);
    } else if (youtubeLink) {
      formData.append("youtube_url", youtubeLink);
    } else {
      status.className = "status status-error";
      status.innerText = "Please provide a video file or YouTube link.";
      return;
    }
    //console.log(formData);
    //We start analysis by first sending the video data/Youtubet link
    let response = await fecthAndGetResponse(formData);
    //If we get an error here inform user
    if (response === "Error") {
      status.innerText = "Error when fetching, analysis server most likely not online. Try again later."
    }
    //Next up get video data
    formData.delete("file");
    formData.append("function", "video_data");
    formData.append("path", response);
    response = await fecthAndGetResponse(formData);
    let video_data = JSON.parse(response);
    //console.log(video_data);
    //Append data to metrcis container 
    const upload = document.getElementsByClassName("upload-section")[0];
    const metricsContainer = document.getElementsByClassName("metricsContainer")[0];
    metricsContainer.innerHTML = "";
    metricsContainer.style.display = "flex";
    metricsContainer.style.gap = "1rem";         
    metricsContainer.style.justifyContent = "space-between";
    //Iterate and add each metric
    Object.entries(video_data).forEach((k) => {
      // Create column div
      const col = document.createElement("div");
      col.style.background = "white";
      col.style.padding = "1rem";
      col.style.borderRadius = "10px";
      col.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
      col.style.textAlign = "center";
      col.style.flex = "0 0 auto";

      // Create key label
      const label = document.createElement("div");
      label.style.fontSize = "0.9rem";
      label.style.color = "#555";
      label.style.marginBottom = "0.5rem";
      label.innerText = k[0].replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());

      // Create value display
      const val = document.createElement("div");
      val.style.fontSize = "1rem";
      val.style.fontWeight = "700";
      val.innerText = k[1];
      

      col.appendChild(label);
      col.appendChild(val);
      metricsContainer.appendChild(col);
      
    });
    
    //Finally add metrics container into the upload container 
    upload.appendChild(metricsContainer);

    //Next up inform user and perform metadata/geometrical analysis
    status.innerText = "Performing metadata analysis";
    formData.set("function", "metadata");
    response = await fecthAndGetResponse(formData);
    let metadata = response;
    status.innerText = "Performing anatomical analysis, this might take a while...";
    formData.set("function", "anatomy");
    //Show results on screen
    response = await fecthAndGetResponse(formData);
    let analysis = JSON.parse(response);
    const resultsUL = document.createElement("ul");
    technicalP.appendChild(resultsUL);
    Object.entries(analysis).forEach(([k,v]) => {
      let li = document.createElement("li");
      let text = `${k.replaceAll("_", " ")}: ${v}`;
      li.innerText = text;
      resultsUL.appendChild(li);

    });
    document.getElementById("technical-data-div").style.visibility = "visible";
    status.innerText = "Getting response from agent..."
    //Get response from agent
    await getAgentResponse(metadata, JSON.stringify(analysis), resultsDiv, formData);
    status.style.visibility = "hidden";
    resultsDiv.style.visibility = "visible";
}

async function getAgentResponse(metadata, analysis, resultsDiv, formData) {
  let prompt = generatePrompt(metadata, analysis);
  //send message 
  formData.set("function", "analysis");
  formData.set("prompt", prompt);
  const response = await fecthAndGetResponse(formData);
  resultsDiv.innerText = "Rating: \n " + response;
}

function generatePrompt(metadata, analysis) {
  let prompt = ` 
    GUIDELINES:
    1. Videos with unnatural geometry in faces or bodies are likely synthetic.
    2. Metadata inconsistencies increase suspicion. These include for example if the device info shows the video coming from a camera/phone or does it come from an editing software, etc. While this doesnt always mean that the video is synthethic you should point this out. IGNORE THE DATE IN THE METADATA
    3. Motion anomalies (e.g., jitter, unnatural physics) are strong indicators.
    4. Give justification even if the video is likely real.
    5. The anatomy_anomaly_rating score corresponds with these values Anomaly score < 0.025: Likely a real video; 0.025 ≤ Anomaly score < 0.050: Probably a real video but some minor anomalies were detected; 0.05 ≤ Anomaly score < 0.075: Most possibly a low quality or highly edited video with some synthetic tampering, some anomalies were detected; 0.075 ≤ Anomaly score ≤ 0.1: Probably synthetic video, quite many anomalies; Anomaly score > 0.1: Highly suspicious, most likely a synthetic video, many anomalies detected. 
    6. The anatomy_anomaly_rating score should not be the only factor to consider, conscider also the amount and type of anomalies spotted.
    7. Be confident if the scores say likely real video you should mainly point it to be a real video (ofcourse mention that some anomalies were found but the overall analysis needs to match the results)
    8. Even though you understand the anomaly rating keep the explanation simple so that a non tech savvy person can understand it i.e dont mention the actual score, mentioning that some amount of frames contained anomalies is ok just dont mention the anomaly score itself just reference it.
    9. Motion score indicates how much motion is in the scene, higher scores indicate more motion, which in turn raises the amount of anomalies even in real videos. So always take motion score into account when justifying, i.e with enough movement even a real video can have quite many anomalies.  
    10. Make your own decisions based on the data, dont just parrot back the data, but ofcourse dont make assumptions that arent present.
    PROMPT:
    You are a professional synthetic video analyst.
Your job is to review the following video data and 4 frames from the video (three of them contain an anomaly one doesnt). After reviewing provide a human-like justification
about whether the video is synthetic or not with a max 6-word summary in the start with a score related emoji (for example a real video start could be "The video is real :Thumbsup:"). Focus on generalization a non tech savvy person needs to understand the justification, without needing to understand our scores in depth (ofcourse you can mention that score is a factor).
Make the justification max 6 senteces. IF one of the frames is not loading, just ignore it and continue with the rest, the absense of frames shouldnt stop you from giving a justification.
Dont mention the actual scores in the justification, just reference them in a human understandable way, also dont reference how many frames you got and how many were anomalous the frames are there so that you get a feel of how a certain anomaly or no anomaly might look (ofcourse you can mention that you analyzed frames and found that the anomalies were present).
    metadata: ${metadata}
    anatomy analysis: ${analysis}
    `
  return prompt;
}

async function fecthAndGetResponse(formData) {
  try {
    let response = await fetch("http://backend.konstalahtinen.dev", {
      method: "POST",
      body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`)
      }
      
      let result = await response.text();
      //console.log(result);    
      return result;    
      
    } catch (error) {
      console.error(error);
      return "Error";
    }
}


