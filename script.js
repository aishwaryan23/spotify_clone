let currentsong=new Audio;
let songs;
let currentfolder;
function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

async function getsongs(folder){
    currentfolder=folder;
let a= await fetch(`${folder}/`);
let response=await a.text();
console.log(response);
let div=document.createElement("div");
div.innerHTML=response;
let as=div.getElementsByTagName("a");
let songs=[];
for(let index=0;index<as.length;index++){
    const element=as[index];
    if(element.href.endsWith(".mp3")){
       songs.push(element.href.split("/songs/")[1]);
    }
}
return songs
}
const playMusic=(track)=>{
//let audio=new Audio("/songs/"+track)
currentsong.src=`/${currentfolder}/`+track;
currentsong.play();
play.src="svg_files/pause.svg";
document.querySelector(".songinfo").innerHTML=decodeURI(track);
document.querySelector(".songtime").innerHTML="00:00 / 00:00"
}
 async function songQueue(){
    let songs=await getsongs("songs")
    console.log(songs);
    let songUl= document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUl.innerHTML="" 
    for (const song of songs) {
        songUl.innerHTML=songUl.innerHTML+`<li> 
        <img class="invert"src="svg_files/musics.svg" alt="music">
        <div class="info">
            <div> ${song.replaceAll("%20"," ")}</div>
        </div>
        <div class="playnow">
        <span>Play Now</span>
        <img class="invert" src="svg_files/playnow.svg">
        </div>
    </li>`;
    }
 //attach an event listener to each selector 
 Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
    e.addEventListener("click",element=>{
    console.log(e.querySelector(".info").firstElementChild.innerHTML)
    playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
 })
 
});
play.addEventListener("click",()=>{
    if(currentsong.paused)
    {
        currentsong.play()
        play.src="svg_files/pause.svg"
    }
    else{
        currentsong.pause()
        play.src="svg_files/play.svg"
    }
})
//listen for time update
currentsong.addEventListener("timeupdate",()=>{
    console.log(currentsong.currentTime,currentsong.duration);
    document.querySelector(".songtime").innerHTML=`${formatTime(currentsong.currentTime)}/${formatTime(currentsong.duration)}`
    document.querySelector(".circle").style.left = (currentsong.currentTime/currentsong.duration)*100+"%"
})
//add an event listener to seekbar
document.querySelector(".seekbar").addEventListener("click",e=>{
    let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
    document.querySelector(".circle").style.left = percent +"%";
    currentsong.currentTime = ((currentsong.duration)*percent)/100;
})
//Add an event listener for hamburger
document.querySelector(".hamburger").addEventListener("click",()=>{
    document.querySelector(".left").style.left ="0"
})
//Add an event listener for close
document.querySelector(".close").addEventListener("click",()=>{
    document.querySelector(".left").style.left ="-100%"
})
// Add an event listener to previous
previous.addEventListener("click", () => {
    currentsong.pause()
    console.log("Previous clicked")
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
    if ((index - 1) >= 0) {
        playMusic(songs[index - 1])
    }
})

// Add an event listener to next
next.addEventListener("click", () => {
    currentsong.pause()
    console.log("Next clicked")

    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
    if ((index + 1) < songs.length) {
        playMusic(songs[index + 1])
    }
})

//Add an event to volume
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, "/ 100")
        currentsong.volume = parseInt(e.target.value) / 100
        if (currentsong.volume >0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
    }
})

//Add event listener to mute the track
document.querySelector(".volume>img").addEventListener("click", e=>{ 
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentsong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentsong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }

})
    
}
 songQueue()