const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'PLAYER_STORAGE_KEY';

const player = $('.player');
const cd = $('.cd');
const heading = $('header h2');
const playlist = $('.playlist');
const cdThumbnail = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const videoBg = $('#videoBg');
const sourceElement = videoBg.querySelector('source');
const timeLeft = $('.time-left');
const timeRight = $('.time-right');
const muteIcon = $('.icon-mute');
const unmuteIcon = $('.icon-unmute');
const volumeBar = $('.volume-bar');
const cdProgressFull = $('.cd .circle .mask.full')
const cdProgressFill = $$('.cd .circle .mask .fill')
const playlistBars = $('.playlist-bars');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    currentVolume: 1,
    isShowPlaylist: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {}, // get data từ localStorage và chuyển về dạng OBJECT thông qua JSON.parse

    songs: [
        {
            name: 'Trance',
            singer: 'Metro Boomin (with Travis Scott & Young Thug)',
            path: './assets/music/Trance (with Travis Scott & Young Thug).mp3',
            image: './assets/img/Trance (with Travis Scott & Young Thug).jpg',
            canvas: './assets/canvas/Trance (with Travis Scott & Young Thug).mp4'
        },
        {
            name: 'Popular',
            singer: 'The Weeknd (with Playboi Carti & Madonna)',
            path: './assets/music/The Weeknd (with Playboi Carti & Madonna).mp3',
            image: './assets/img/The Weeknd (with Playboi Carti & Madonna).png',
            canvas: './assets/canvas/The Weeknd (with Playboi Carti & Madonna).mp4'
        },
        {
            name: 'Tip Toe',
            singer: 'HYBS',
            path: './assets/music/Tip Toe - HYBS.mp3',
            image: './assets/img/Tip Toe - HYBS.jpg',
            canvas: './assets/canvas/Tip Toe - HYBS.mp4'
        },
        {
            name: 'Cruel Summer',
            singer: 'Taylor Swift',
            path: './assets/music/Cruel Summer - Taylor Swift.mp3',
            image: './assets/img/Cruel Summer - Taylor Swift.jpg',
            canvas: './assets/canvas/Cruel Summer - Taylor Swift.mp4'
        },
        {
            name: 'STAY',
            singer: 'The Kid LAROI (with Justin Bieber)',
            path: './assets/music/Stay The Kid LAROI (with Justin Bieber).mp3',
            image: './assets/img/Stay The Kid LAROI (with Justin Bieber).png',
            canvas: './assets/canvas/Stay The Kid LAROI (with Justin Bieber).mp4'
        },
        {
            name: 'Seven',
            singer: 'Jung Kook',
            path: './assets/music/Seven feat Latto.mp3',
            image: './assets/img/Seven feat Latto.jpg',
            canvas: './assets/canvas/Seven feat Latto.mp4'
        },
        {
            name: 'Love U Like That',
            singer: 'Lauv',
            path: './assets/music/Love U Like That - Lauv.mp3',
            image: './assets/img/Love U Like That - Lauv.jpg',
            canvas: './assets/canvas/Love U Like That - Lauv.mp4'
        },
        {
            name: 'Golden Hour',
            singer: 'Lauv',
            path: './assets/music/golden hour - JVKE.mp3',
            image: './assets/img/golden hour - JVKE.jpg',
            canvas: './assets/canvas/golden hour - JVKE.mp4'
        },
        {
            name: 'Love Me Again',
            singer: 'V',
            path: './assets/music/Love Me Again - V.mp3',
            image: './assets/img/Love Me Again - V.jpg',
            canvas: './assets/canvas/Love Me Again - V.mp4'
        },
        {
            name: 'Love Yourself',
            singer: 'Justin Bieber',
            path: './assets/music/Love Yourself - Justin Bieber.mp3',
            image: './assets/img/Love Yourself - Justin Bieber.jpg',
            canvas: './assets/canvas/Love Yourself - Justin Bieber.mp4'
        },
        {
            name: 'Someone Will Love You Better',
            singer: 'Johnny Orlando, Zack Tabudlo',
            path: './assets/music/someone will love you better - Johnny Orlando Zack Tabudlo.mp3',
            image: './assets/img/someone will love you better - Johnny Orlando Zack Tabudlo.jpg',
            canvas: './assets/canvas/someone will love you better - Johnny Orlando Zack Tabudlo.mp4'
        }
    ],
    playedSongs: [],
    // add data vào local storage
    setConfig: function(key, value) {
        this.config[key] = value; // tạo ra object config có chứa key và value tương ứng
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config)); // chuyển OBJECT sang String dựa vào JSON.stringify sau đó lưu data vào localStorage dựa theo key PLAYER_STORAGE_KEY
    },
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${this.currentIndex === index ? "active" : ""}" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}')"></div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playlist.innerHTML = htmls.join('');
        randomBtn.classList.toggle("active", this.isRandom);
        repeatBtn.classList.toggle("active",  this.isRepeat);
        sourceElement.src = this.songs[this.currentIndex].canvas;
    },
    formatTime: function(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainderSeconds = seconds % 60;
        
        const formattedTime = `${minutes}:${remainderSeconds.toString().padStart(2, '0')}`;
        return formattedTime;
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() { // thay vì tạo getCurrentSong() thì ta có thể gọi trực tiếp thành app.currentSong
                return this.songs[this.currentIndex];
            }
        });
    },
    handleEvents: function() {
        const _this = this; // gán _this bằng this của handleEvents là thằng "app"
        const cdWidth = cd.offsetWidth; // lấy ra width (do dùng padding top nên khi đổi width là sẽ đổi luôn height)
        
        // Sự kiện quay đĩa nhạc khi phát
        const cdThumbAnimate = cdThumbnail.animate([
            {//https://viblo.asia/p/tim-hieu-javascript-web-animations-api-LzD5dX2Y5jY
                transform: 'rotate(0)'
            },
            {
                transform: 'rotate(359deg)'
            }
        ], {
            duration: 10000,
            iterations: Infinity// lặp vô hạn
        });
        cdThumbAnimate.pause();// pause trước, khi nào ấn play mới quay đĩa

        // xử lý thu phóng đĩa nhạc
        document.onscroll = function() {
            // console.log(window.scrollY); //tuong tu console.log(document.documentElement.scrollTop);
            if (window.innerWidth <= 739) {// chỉ áp dụng vs mobile
                const scrollTop = window.scrollY || document.documentElement.scrollTop;
            
                // Thu nhỏ đĩa cd nhạc
                const newCdWidth = cdWidth - scrollTop;
                cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;// fix bug nếu lướt nhanh thì sẽ sinh ra giá trị âm dẫn đến, cd không thu nhỏ
                cd.style.opacity = newCdWidth / cdWidth; // mờ dần khi nhỏ lại
           
            }
        }

        //xử lý chơi nhạc
        playBtn.onclick = function() {
            if(_this.isPlaying) { // nếu đang playing thì pause
                audio.pause();// https://www.w3schools.com/tags/ref_av_dom.asp
                videoBg.pause();
                cdThumbAnimate.pause(); // dừng quay đĩa nhạc
            } else {// nếu đang pause thì playing
                audio.play();// https://www.w3schools.com/tags/ref_av_dom.asp
                videoBg.play();
                cdThumbAnimate.play(); // bắt đầu quay đĩa nhạc
            }
        }

         //Lắng nghe sự kiện khi nhạc đang chạy thì xử lý
        audio.onplay = function() {
            _this.isPlaying = true; // không sài this vì this ở đây là playBtn, còn _this thì mới là "app" do ta mới gán lại
            player.classList.add('playing');// thêm class playing để đổi sang nút pause
        }

        //Lắng nghe sự kiện khi nhạc bị dừng thì xử lý
        audio.onpause = function() {
            _this.isPlaying = false; // không sài this vì this ở đây là playBtn, còn _this thì mới là "app" do ta mới gán lại
            player.classList.remove('playing');// thêm class playing để đổi sang nút pause
        }
        
        //Lắng nghe sự kiện nhạc phát đến time bao nhiêu thì progress di chuyển đến % bấy nhiêu
        audio.ontimeupdate = function() { //https://www.w3schools.com/tags/av_event_timeupdate.asp
            if(audio.duration) { // loại bỏ trường hợp NaN
                const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100); // tính ra % đã chạy của bài hát (currentTime: giây hiện tại; duration: thời lượng bài hát)
                progress.value = progressPercent;

                // Hiện time    
                timeLeft.textContent = _this.formatTime(Math.floor(audio.currentTime));
                timeRight.textContent = _this.formatTime(Math.floor(audio.duration));
                progress.style.background = `linear-gradient(to right, var(--primary-color) ${progress.value / progress.max * 100}%, #4d4d4d ${progress.value / progress.max * 100}%)`;
            }

            // fill vòng tròn sau đĩa nhạc
            const percent = progress.value / 100 * 180;
            cdProgressFull.style.transform = `rotate(${percent}deg)`;
            cdProgressFill.forEach(fillElement => {
                fillElement.style.transform = `rotate(${percent}deg)`;
            });

            
        }

        //Lắng nghe xem người dùng tua đến đoạn nào
        // sử dụng oninput thay vì onchange vì oninput nó thay đổi tức thì
        // còn onchange thì thay đổi khi người dùng xác nhận thay đổi đó
        progress.oninput = function(e) { //e.target.value lấy ra value người dùng tua đến
            const seekTime = (audio.duration * e.target.value) / 100;// tính ra số % tua đến của bài hát vừa tua
            console.log(seekTime);
            audio.currentTime = seekTime;
        }

        
        // Chuyển bài tiếp
        nextBtn.onclick = function() {

            if(_this.isRandom) {
                _this.nextRandomSong();
            } else { 
                _this.nextSong();
            }

            // thêm class active vào song
            _this.reRender();

            _this.scrollToActiveSong();//cuộn tới bài hát đang hát

            audio.play(); // sau khi next thì tự play luôn
        }

        // Về bài cũ
        prevBtn.onclick = function() {
            _this.prevSong();

            // thêm class active vào song
            _this.reRender();

            _this.scrollToActiveSong();//cuộn tới bài hát đang hát

            audio.play(); // sau khi next thì tự play luôn
        }

        // bật tắt chức năng random
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle("active", _this.isRandom); // truyền thêm đối số boolean nếu nó true thì add vào và ngược lại
            _this.setConfig('isRandom', _this.isRandom);
            _this.playedSongs.push(_this.currentIndex);// thêm bài hiện tại đang nghe vào playedSongs sau khi bật random để tránh trường hợp bài hiện tại không được tính là playedSongs
        }

        // bật tắt chức năng lặp bài hát
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle("active",  _this.isRepeat);
            _this.setConfig('isRepeat', _this.isRepeat);
        }

        // Chuyển sang bài tiếp theo khi audio ended
        audio.onended = function() {// https://www.w3schools.com/tags/ref_av_dom.asp
            if(_this.isRepeat) {// phát lại nếu true
                audio.play();
            } else {
                nextBtn.click(); // tự click nút kế tiếp khi end bài
            }
        }

        playlist.onclick = function(e) { // gán onlclick vào cả list và lắng nghe xem user click ở chỗ target nào r dựa vào closet lấy ra class cha của nó
            const songNode = e.target.closest('.song:not(.active)');
            // e.target là đối tượng user click vào bao gồm cả ảnh, tên,...
            // closest là lấy ra phần tử cha gần nhất hoặc chính nó , không có thì trả về null
            // e.target.closest là lấy ra phần tử cha gần nhất của phần tử được click vào     
            if(songNode || e.target.closest('.option')) { // chỉ lấy phần tử .song không có .active || và lấy phần tử có cha là .option (là nút ... để download, sửa, xóa)
                if(!e.target.closest('.option')) {// Chọn bài hát hoặc chỉnh sửa nếu như không bấm vào option
                    // Thay vì dùng songNode.getAttribute('data-index') thì ta có thể dùng songNode.dataset.index do ta đã đặt tên Attribute là 'data-index' có chữ data
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.reRender();
                    videoBg.play();
                    cdThumbAnimate.play();
                    sourceElement.src = _this.songs[_this.currentIndex].canvas;
                    audio.play();
                } else {
                   // Xử lí khi click vô option
                    alert('Vẫn đang phát triển :))')
                }
            }
        }

        //Xử lý khi click vào nút volume

        if (_this.currentVolume > 0) {
            volumeBar.value = _this.currentVolume
            audio.volume = _this.currentVolume
            $('.icon-unmute').style.visibility = 'visible'
            $('.icon-mute').style.visibility = 'hidden'
        } else {
            volumeBar.value = 0
            audio.volume = 0
            $('.icon-unmute').style.visibility = 'hidden'
            $('.icon-mute').style.visibility = 'visible'
        }
        audio.onvolumechange = () => {
            volumeBar.value = audio.volume
            if (audio.volume === 0) {
                muteIcon.style.visibility = 'visible'
                unmuteIcon.style.visibility = 'hidden'
            } else {
                muteIcon.style.visibility = 'hidden'
                unmuteIcon.style.visibility = 'visible'
            }
        }

        volumeBar.oninput = e => {
            this.setConfig("currentVolume", e.target.value)
            audio.volume = volumeBar.value
            volumeBar.setAttribute("title", "Âm lượng " + volumeBar.value * 100 + "%")
        }

        audio.onvolumechange = () => {
            volumeBar.value = audio.volume
            if (audio.volume === 0) {
                muteIcon.style.visibility = 'visible';
                unmuteIcon.style.visibility = 'hidden';
            } else {
                muteIcon.style.visibility = 'hidden';
                unmuteIcon.style.visibility = 'visible';
            }
        }

        muteIcon.onclick = (e) => {
            audio.volume = this.config.savedVolume;
            this.setConfig("currentVolume", audio.volume);
        }

        unmuteIcon.onclick = e => {
            this.setConfig("savedVolume", audio.volume);
            audio.volume = 0;
            this.setConfig("currentVolume", audio.volume);
        }



        // Playlist ẩn hiện mobile
        playlistBars.onclick = function() {
            if (window.innerWidth <= 739) {
                if(_this.isShowPlaylist) {
                    playlist.style.display = 'block';
                    _this.isShowPlaylist = !_this.isShowPlaylist;
                }
                else {
                    playlist.style.display = 'none';
                    _this.isShowPlaylist = !_this.isShowPlaylist;
                }
            }
            
        }

         // bật tắt chức năng lặp bài hát
         repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle("active",  _this.isRepeat);
            _this.setConfig('isRepeat', _this.isRepeat);
        }

        
    },
    reRender: function() {
        $$('.song').forEach((song, index) => { // duyệt qua và thêm class active vào bài hát hiện tại
            if (index === this.currentIndex) {
                // Nếu có, thêm vào class "active"
                song.classList.add('active');
            } else {
                // Nếu không, xóa class "active"
                song.classList.remove('active');
            }
        });
    },
    
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({//https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
                behavior: "smooth", // trượt một cách mượt
                block: "end"   // phần dưới của phần tử .song.active sẽ được căn chỉnh với phía dưới của phần tử chứa
            });
        }, 300);
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;// gọi currentSong trong defineProperties
        cdThumbnail.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path; 
        videoBg.load();

    },
    loadConfig: function() { 
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function() {
        this.currentIndex--;
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    nextRandomSong: function() {
        let newIndex;
        
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
            console.log(1);
        } while(newIndex === this.currentIndex || this.playedSongs.includes(newIndex)); // lặp đến khi nào không trùng cái cũ hoặc bài hát đã phát thì thoát vòng lặp
        this.playedSongs.push(newIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
        
        if(this.playedSongs.length == this.songs.length) { // nếu đã phát hết danh sách rồi thì làm mới lại mảng đã phát
            this.playedSongs = [];
            this.playedSongs.push(newIndex);// để tránh lặp bài cuối ta cũng đẩy nó vào danh sách mới
        }
    },

    start: function () {
        this.loadConfig();// gán cấu hình vào ứng dụng

        this.defineProperties();//định nghĩa ra các thuộc tính

        this.handleEvents();// lắng nghe xử lý sự kiện DOM

        this.loadCurrentSong();// load current song khi chạy 


        this.render();// render list nhạc

       
    }
}

// Giúp ứng dụng chỉ gọi duy nhất 1 lần là thằng start(), đỡ phải gọi nhiều hàm
app.start();