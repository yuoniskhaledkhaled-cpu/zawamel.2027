const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/audio', express.static('audio'));
app.use('/public', express.static('public')); // للسماح بقراءة الصور

let zawamelData = [
    { id: 1, title: "زامل العهد والوفاء", duration: 210, url: "/audio/ahd.mp3", favorite: true },
    { id: 2, title: "زامل صاعقة الحق", duration: 195, url: "/audio/saeqa.mp3", favorite: false },
    { id: 3, title: "زامل سيل الحزم", duration: 220, url: "/audio/hazm.mp3", favorite: false }
];

app.get('/api/songs', (req, res) => {
    res.json(zawamelData);
});

app.post('/api/favorite', (req, res) => {
    const { id } = req.body;
    const song = zawamelData.find(s => s.id == id);
    if (song) {
        song.favorite = !song.favorite;
        res.json({ success: true, favorite: song.favorite });
    } else {
        res.status(404).json({ success: false, message: "غير موجود" });
    }
});

// الصفحة الرئيسية مع إمكانية عرض صورة حقيقية
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>زوامل عيسى الليث</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <style>
            * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, sans-serif; }
            body { background: radial-gradient(circle at top, #1e1b4b 0%, #05080f 70%); color: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; padding: 25px 15px; }
            .avatar-container { width: 115px; height: 115px; background: linear-gradient(135deg, #38bdf8, #6366f1, #e11d48); clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 30px rgba(56, 189, 248, 0.6); margin-bottom: 15px; }
            .avatar-img { width: 109px; height: 109px; clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); background: #0f172a; display: flex; align-items: center; justify-content: center; overflow: hidden; }
            .avatar-img img { width: 100%; height: 100%; object-fit: cover; }
            .main-title { font-size: 24px; font-weight: 800; margin-bottom: 25px; color: #ffffff; }
            .menu-card { background: #f8fafc; border-radius: 26px; width: 100%; max-width: 360px; padding: 6px 0; box-shadow: 0 20px 40px rgba(0,0,0,0.7); display: flex; flex-direction: column; }
            .menu-item { display: flex; align-items: center; justify-content: space-between; padding: 15px 22px; text-decoration: none; color: #0f172a; font-size: 16px; font-weight: 700; border-bottom: 1px solid #e2e8f0; }
            .menu-item:last-child { border-bottom: none; }
            .circle-icon { width: 38px; height: 38px; background: #e2e8f0; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 15px; }
        </style>
    </head>
    <body>
        <div class="avatar-container">
            <div class="avatar-img">
                <img src="/public/cover.jpg" alt="صورة المنشد" onerror="this.style.display='none'; document.getElementById('fallbackIcon').style.display='block';">
                <i id="fallbackIcon" class="fa-solid fa-microphone-lines" style="font-size: 45px; color: #38bdf8; display: none;"></i>
            </div>
        </div>
        <div class="main-title">زوامل عيسى الليث</div>
        <div class="menu-card">
            <a href="/player" class="menu-item"><span>بدء الاستماع</span><div class="circle-icon"><i class="fa-solid fa-play" style="color:#0d9488"></i></div></a>
            <a href="/player" class="menu-item"><span>قائمتي المفضلة</span><div class="circle-icon"><i class="fa-solid fa-heart" style="color:#f43f5e"></i></div></a>
            <a href="https://play.google.com" target="_blank" class="menu-item"><span>تطبيقاتنا</span><div class="circle-icon"><i class="fa-solid fa-plus" style="color:#475569"></i></div></a>
            <a href="https://play.google.com" target="_blank" class="menu-item"><span>قيمنا + تعليق</span><div class="circle-icon"><i class="fa-solid fa-star" style="color:#d97706"></i></div></a>
        </div>
    </body>
    </html>
    `);
});

app.get('/player', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>مشغل الزوامل الحقيقي</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <style>
            * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, sans-serif; }
            body { background: #090d16; color: #fff; padding: 15px; display: flex; flex-direction: column; align-items: center; min-height: 100vh; padding-bottom: 160px; }
            .header-row { display: flex; justify-content: space-between; align-items: center; width: 100%; max-width: 400px; margin-bottom: 12px; }
            .artist-badge { display: flex; align-items: center; gap: 8px; background: rgba(30,41,59,0.7); padding: 5px 12px 5px 5px; border-radius: 30px; border: 1px solid rgba(56,189,248,0.2); }
            .artist-name { font-size: 13px; font-weight: 700; color: #38bdf8; }
            .top-btn { width: 40px; height: 40px; background: #1e293b; border-radius: 50%; color: #fff; display: flex; align-items: center; justify-content: center; text-decoration: none; border: 1px solid rgba(255,255,255,0.08); cursor: pointer; }
            .controls-row { display: flex; justify-content: space-between; width: 100%; max-width: 400px; margin-bottom: 15px; gap: 6px; }
            .sub-btn { flex: 1; background: #1e293b; color: #cbd5e1; padding: 8px; border-radius: 20px; font-size: 12px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 5px; border: 1px solid rgba(255,255,255,0.06); cursor: pointer; text-decoration: none; }
            .search-box { width: 100%; max-width: 400px; margin-bottom: 15px; position: relative; }
            .search-box input { width: 100%; padding: 10px 15px 10px 40px; background: #1e293b; border-radius: 20px; color: #fff; border: 1px solid rgba(255,255,255,0.08); outline: none; text-align: right; font-size: 13px; }
            .search-box i { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #94a3b8; }
            .songs-list { width: 100%; max-width: 400px; display: flex; flex-direction: column; gap: 8px; }
            .song-item { display: flex; align-items: center; justify-content: space-between; padding: 12px 15px; background: rgba(30,41,59,0.4); border-radius: 12px; border: 1px solid rgba(255,255,255,0.03); }
            .song-item.active { background: rgba(56,189,248,0.15); border-color: rgba(56,189,248,0.4); }
            .song-title { font-size: 14px; font-weight: 600; cursor: pointer; color: #f1f5f9; }
            .play-btn { width: 32px; height: 32px; background: #38bdf8; color: #0f172a; border: none; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 11px; }
            .bottom-player { position: fixed; bottom: 0; left: 0; width: 100%; background: #0f172a; border-top: 1px solid rgba(255,255,255,0.1); padding: 12px 15px; display: flex; flex-direction: column; align-items: center; gap: 8px; z-index: 100; }
            .player-progress { width: 100%; max-width: 400px; display: flex; align-items: center; gap: 10px; font-size: 11px; color: #94a3b8; direction: ltr; }
            .progress-bg { flex: 1; height: 5px; background: #334155; border-radius: 3px; position: relative; overflow: hidden; cursor: pointer; }
            .progress-fill { width: 0%; height: 100%; background: #38bdf8; border-radius: 3px; }
            .player-controls { display: flex; align-items: center; justify-content: center; gap: 12px; width: 100%; max-width: 400px; }
            .ctrl-btn { background: #1e293b; border: 1px solid rgba(255,255,255,0.06); color: #cbd5e1; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 12px; }
            .ctrl-btn.main { background: #38bdf8; color: #0f172a; width: 44px; height: 44px; font-size: 15px; border: none; }
            .ctrl-btn.active-mode { color: #38bdf8; border-color: #38bdf8; }
            .toast { position: fixed; top: 20px; left: 50%; transform: translateX(-50%) translateY(-100px); background: #38bdf8; color: #0f172a; padding: 8px 16px; border-radius: 10px; font-weight: bold; font-size: 13px; transition: 0.3s; z-index: 1000; }
            .toast.show { transform: translateX(-50%) translateY(0); }
        </style>
    </head>
    <body>
        <div class="header-row">
            <div class="artist-badge"><span class="artist-name">عيسى الليث</span><i class="fa-solid fa-microphone" style="color:#38bdf8; font-size:12px;"></i></div>
            <a href="/" class="top-btn"><i class="fa-solid fa-house"></i></a>
        </div>
        <div class="controls-row">
            <button class="sub-btn" onclick="loadSongs()"><i class="fa-solid fa-rotate" style="color:#38bdf8"></i> تحديث</button>
            <a href="https://play.google.com" target="_blank" class="sub-btn"><i class="fa-solid fa-star" style="color:#f59e0b"></i> قيمنا</a>
            <button class="sub-btn" onclick="showToast('تم تعيين النغمة بنجاح')"><i class="fa-solid fa-music" style="color:#38bdf8"></i> نغمة</button>
            <button class="sub-btn" onclick="showToast('تم ضبط مؤقت الإيقاف')"><i class="fa-solid fa-stopwatch" style="color:#38bdf8"></i></button>
        </div>
        <div class="search-box">
            <input type="text" id="searchInput" placeholder="بحث سريع عن زامل..." oninput="filterSongs()">
            <i class="fa-solid fa-magnifying-glass"></i>
        </div>
        <div class="songs-list" id="songsList"></div>
        <div class="bottom-player">
            <div id="currentSongTitle" style="font-size:13px; color:#38bdf8; font-weight:bold;">اختر زاملاً للبدء</div>
            <div class="player-progress">
                <span id="currentTime">00:00</span>
                <div class="progress-bg" onclick="seekAudio(event)"><div class="progress-fill" id="progressFill"></div></div>
                <span id="totalDuration">00:00</span>
            </div>
            <div class="player-controls">
                <button class="ctrl-btn" id="shuffleBtn" onclick="toggleShuffle()"><i class="fa-solid fa-shuffle"></i></button>
                <button class="ctrl-btn" onclick="prevSong()"><i class="fa-solid fa-forward-step"></i></button>
                <button class="ctrl-btn main" id="mainPlayBtn" onclick="togglePlay()"><i class="fa-solid fa-play" id="playIcon"></i></button>
                <button class="ctrl-btn" onclick="nextSong()"><i class="fa-solid fa-backward-step"></i></button>
                <button class="ctrl-btn" id="repeatBtn" onclick="toggleRepeat()"><i class="fa-solid fa-rotate-right"></i></button>
            </div>
        </div>
        <div class="toast" id="toastMsg">تمت العملية</div>

        <script>
            let songs = [];
            let currentIndex = 0, isShuffle = false, isRepeat = false;
            const audioElement = new Audio();

            async function loadSongs() {
                try {
                    const res = await fetch('/api/songs');
                    songs = await res.json();
                    renderSongs();
                } catch (e) {
                    showToast('خطأ في الاتصال بالخادم');
                }
            }

            function renderSongs() {
                const list = document.getElementById('songsList');
                list.innerHTML = '';
                songs.forEach((song, idx) => {
                    list.innerHTML += \`
                        <div class="song-item \${idx === currentIndex ? 'active' : ''}">
                            <div style="display:flex; align-items:center; gap:10px;">
                                <button class="play-btn" onclick="playSong(\${idx})"><i class="fa-solid \${idx === currentIndex && !audioElement.paused ? 'fa-pause' : 'fa-play'}"></i></button>
                                <span class="song-title" onclick="playSong(\${idx})">\${song.title}</span>
                            </div>
                            <i class="fa-solid fa-heart" style="color:\${song.favorite ? '#f43f5e' : '#64748b'}; cursor:pointer;" onclick="toggleFavorite(\${song.id}, this)"></i>
                        </div>
                    \`;
                });
            }

            async function toggleFavorite(id, el) {
                try {
                    const res = await fetch('/api/favorite', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id })
                    });
                    const data = await res.json();
                    if (data.success) {
                        el.style.color = data.favorite ? '#f43f5e' : '#64748b';
                        showToast(data.favorite ? 'تمت الإضافة للمفضلة' : 'تمت الإزالة من المفضلة');
                    }
                } catch (e) {
                    showToast('فشل تحديث المفضلة');
                }
            }

            function playSong(idx) {
                currentIndex = idx;
                audioElement.src = songs[currentIndex].url;
                audioElement.play().then(() => {
                    document.getElementById('playIcon').className = "fa-solid fa-pause";
                    renderSongs();
                    showToast('جاري تشغيل: ' + songs[currentIndex].title);
                }).catch(err => {
                    showToast('ملف الصوت غير موجود في المجلد');
                });
            }

            function togglePlay() {
                if (songs.length === 0) return;
                if (audioElement.paused) {
                    if (!audioElement.src) {
                        audioElement.src = songs[currentIndex].url;
                    }
                    audioElement.play();
                    document.getElementById('playIcon').className = "fa-solid fa-pause";
                    showToast('جاري التشغيل');
                } else {
                    audioElement.pause();
                    document.getElementById('playIcon').className = "fa-solid fa-play";
                    showToast('تم الإيقاف المؤقت');
                }
                renderSongs();
            }

            function nextSong() {
                if (songs.length === 0) return;
                currentIndex = isShuffle ? Math.floor(Math.random() * songs.length) : (currentIndex + 1) % songs.length;
                playSong(currentIndex);
            }

            function prevSong() {
                if (songs.length === 0) return;
                currentIndex = (currentIndex - 1 + songs.length) % songs.length;
                playSong(currentIndex);
            }

            function toggleShuffle() {
                isShuffle = !isShuffle;
                document.getElementById('shuffleBtn').classList.toggle('active-mode', isShuffle);
                showToast(isShuffle ? 'تشغيل عشوائي مفعل' : 'إيقاف التشغيل العشوائي');
            }

            function toggleRepeat() {
                isRepeat = !isRepeat;
                document.getElementById('repeatBtn').classList.toggle('active-mode', isRepeat);
                showToast(isRepeat ? 'تكرار مفعل' : 'إيقاف التكرار');
            }

            function formatTime(s) {
                if (isNaN(s)) return "00:00";
                return (Math.floor(s/60)<10?"0":"") + Math.floor(s/60) + ":" + (Math.floor(s%60)<10?"0":"") + Math.floor(s%60);
            }

            function filterSongs() {
                const q = document.getElementById('searchInput').value.toLowerCase();
                document.querySelectorAll('.song-item').forEach((item, idx) => {
                    item.style.display = songs[idx].title.toLowerCase().includes(q) ? 'flex' : 'none';
                });
            }

            function seekAudio(e) {
                if (!audioElement.duration) return;
                const bg = e.currentTarget;
                const pos = (e.clientX - bg.getBoundingClientRect().left) / bg.clientWidth;
                audioElement.currentTime = pos * audioElement.duration;
            }

            audioElement.ontimeupdate = () => {
                if (songs.length === 0) return;
                document.getElementById('currentTime').innerText = formatTime(audioElement.currentTime);
                document.getElementById('totalDuration').innerText = formatTime(audioElement.duration);
                if (audioElement.duration) {
                    document.getElementById('progressFill').style.width = (audioElement.currentTime / audioElement.duration) * 100 + "%";
                }
                document.getElementById('currentSongTitle').innerText = songs[currentIndex].title;
            };

            audioElement.onended = () => {
                if (isRepeat) {
                    audioElement.play();
                } else {
                    nextSong();
                }
            };

            function showToast(msg) {
                const t = document.getElementById('toastMsg');
                t.innerText = msg; t.classList.add('show');
                setTimeout(() => t.classList.remove('show'), 2000);
            }

            loadSongs();
        </script>
    </body>
    </html>
    `);
});

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});

