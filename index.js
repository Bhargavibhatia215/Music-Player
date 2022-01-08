var isShuffle = false;
const container = document.querySelector(".container"),
songName = container.querySelector(".song-det .song-name"),
songArtist = container.querySelector(".song-det .song-artist"),
songAudio = container.querySelector("#main-audio"),
playBtn = container.querySelector(".play"),
prevBtn = container.querySelector("#prev"),
nextBtn = container.querySelector("#next"),
voulme_slider = container.querySelector(".volume_slider"),
progressBar = container.querySelector(".progress-bar"),
progress = container.querySelector(".progress"),
mlist = container.querySelector(".m-list"),
showSongsBtn = container.querySelector("#queue"),
hideSongsBtn = container.querySelector("#close");

let sIndex = Math.floor((Math.random()*allSongs.length)+1);
window.addEventListener("load",() =>{
    loadSong(sIndex);
})


function loadSong(index){
    songName.innerText = allSongs[index-1].name;
    songArtist.innerText = allSongs[index-1].artist;
    songAudio.src = `Songs/${allSongs[index-1].src}.mp3`;
}

function playMusic(){
    container.classList.add("paused");
    playBtn.querySelector("i").innerText = "pause";
    songAudio.play();
    playNow();
}

function pauseMusic(){
    container.classList.remove("paused");
    playBtn.querySelector("i").innerText = "play_arrow";
    songAudio.pause();
}

function nextSong(){
    // let random = Math.floor((Math.random()*allSongs.length)+1);
    // do{
    //     random = Math.floor((Math.random()*allSongs.length)+1);
    // }while(sIndex == random);
    // sIndex = random;
    // if(sIndex>allSongs.length){
    //     sIndex = 1;
    // }
    // loadSong(sIndex);
    // playMusic();
    sIndex++;
    if(sIndex>allSongs.length){
        sIndex = 1;
    }
    loadSong(sIndex);
    playMusic();
}

function prevSong(){
    sIndex--;
    if(sIndex<1){
        sIndex = allSongs.length;
    }
    loadSong(sIndex);
    playMusic();
}
playBtn.addEventListener("click",()=>{
    const isMusicPaused = container.classList.contains("paused");
    isMusicPaused ? pauseMusic() : playMusic();
    playNow()
})

function setVolume(){
    songAudio.volume = voulme_slider.value/100;
}

prevBtn.addEventListener("click",()=>{
    prevSong();
})

nextBtn.addEventListener("click",()=>{
    nextSong();
})

songAudio.addEventListener("timeupdate",(e)=>{
    const currTime = e.target.currentTime;
    const dur = e.target.duration;
    let progressWidth = (currTime/dur)*100;
    progressBar.style.width = `${progressWidth}%`;
    let songCurrentTime = container.querySelector(".current"),
        songDuration = container.querySelector(".duration");
        

    songAudio.addEventListener("loadeddata",()=>{
        let duration = songAudio.duration;
        let min = Math.floor(duration/60);
        let sec = Math.floor(duration%60);
        if(sec < 10){
            sec = `0${sec}`;
        }
        songDuration.innerText = `${min}:${sec}`;
    })

        let currMin = Math.floor(currTime/60);
        let currSec = Math.floor(currTime%60);
        if(currSec < 10){
            currSec = `0${currSec}`;
        }
        songCurrentTime.innerText = `${currMin}:${currSec}`;
    
})

progress.addEventListener("click",(e)=>{
    let width = progress.clientWidth;
    let offsetX = e.offsetX;
    let duration = songAudio.duration;

    songAudio.currentTime = (offsetX/width)*duration;
    playMusic();

})
// songAudio.addEventListener("ended",()=>{
//     let getText = shuffleBtn.innerHTML;
//     let random = Math.floor((Math.random()*allSongs.length)+1);
//     do{
//         random = Math.floor((Math.random()*allSongs.length)+1);
//     }while(sIndex == random);
//     sIndex = random;
//     loadSong(sIndex);
//     playMusic();
// })
songAudio.addEventListener("ended",()=>{
    nextSong();
})

showSongsBtn.addEventListener("click",()=>{
    mlist.classList.toggle("show");
})

hideSongsBtn.addEventListener("click",()=>{
    showSongsBtn.click();
})

const ulTag = container.querySelector("ul"); 
for(let i=0;i<allSongs.length;i++){
    let liTag = `<li li-index = "${i+1}">
                    <div class="row">
                        <span>${allSongs[i].name}</span>
                        <p>${allSongs[i].artist}</p>
                    </div>
                    <audio class="${allSongs[i].src}" src="songs/${allSongs[i].src}.mp3"></audio>
                    <span id="${allSongs[i].src}" class="duration">3:40</span>
                </li>`;
    ulTag.insertAdjacentHTML("beforeend",liTag);
    let audioDuration = ulTag.querySelector(`[id = "${allSongs[i].src}"]`);
    let liAudioTag = ulTag.querySelector(`[class = "${allSongs[i].src}"]`);
    liAudioTag.addEventListener("loadeddata",()=>{
        let duration = liAudioTag.duration;
        let min = Math.floor(duration/60);
        let sec = Math.floor(duration%60);
        if(sec < 10){
            sec = `0${sec}`;
        }
        audioDuration.innerText = `${min}:${sec}`;
        audioDuration.setAttribute("t-duration",`${min}:${sec}`);
    })
}

const allliTags = ulTag.querySelectorAll("li");
function playNow(){
    for(let i=0;i<allliTags.length;i++){
        let audioTag = allliTags[i].querySelector(".duration");
        if(allliTags[i].classList.contains("playing")){
            allliTags[i].classList.remove("playing");
            let aDur = audioTag.getAttribute("t-duration");
            audioTag.innerHTML = aDur;

        }
        if(allliTags[i].getAttribute("li-index") == sIndex){
            allliTags[i].classList.add("playing");
            audioTag.innerText = "Playing";
        }
        allliTags[i].setAttribute("onclick","clicked(this)");
    }    
}
function clicked(element){
    let getIndex = element.getAttribute("li-index");
    sIndex = getIndex;
    loadSong(sIndex);
    playMusic();
}
