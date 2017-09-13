//播放页面相关变量
var oControl = document.getElementById("control"),
    oPlayList = document.getElementById("play-list"),
    oWrapper = document.getElementById("wrapper"),
    oNeedle = document.getElementById("needle"),
    oCurrentTime = document.getElementById("currentTime"),
    oSongName = document.getElementById("songName"),
    oAudio = document.getElementsByTagName("audio")[0],
    oSinger = document.getElementById("singer"),
    oTotalTime = document.getElementById("total-time"),
    oProcessBar = document.getElementById("process-bar"),
    oProcessCur = document.getElementById("process-cur"),
    oCurBtn = document.getElementById("cur-btn"),
    oPlayListCount = document.getElementById("playListCount"),
    aDiskAlbumBg = document.getElementsByClassName("disk-album-bg"),
    aDiskM = document.getElementsByClassName("diskM"),
    oBg = oWrapper.getElementsByClassName("bg")[0],
    oLTC = oPlayList.getElementsByClassName("list-title-close")[0],
    oPlayListUl = oPlayList.getElementsByTagName("ul")[0],
    oList = oControl.getElementsByTagName("span")[5],
    oPlay = oControl.getElementsByTagName("span")[2],
    oLoop = oControl.getElementsByTagName("span")[0],
    oPrev = oControl.getElementsByTagName("span")[1],
    oPause = oControl.getElementsByTagName("span")[3],
    oNext = oControl.getElementsByTagName("span")[4];
var winW = document.documentElement.clientWidth,
    kW = winW + 122,
    aPlayListLi = oPlayListUl.children,
    timer = null,
    timer1 = null,
    durationT = 0,//总时长
    prevSong = -1, //上一首歌的序号
    changing = false, //切换过程是否在进行 true 进行中 false 没有进行切换
    curIsDrag = false,//监控进度块是否在拖拽中
    ended = false,//判断当前歌曲是否结束
    index = 0;
//歌词相关变量
var oCenter = document.getElementById("center"),
    oLyricsLine = document.getElementById("line"),
    oListMask = document.getElementById("list-mask"),
    oLyrics = document.getElementsByClassName("lyric")[0],
    oLyricsUl = oLyrics.getElementsByTagName("ul")[0],
    aLyricsLi = oLyricsUl.getElementsByTagName("li"),
    oBgMask = oWrapper.getElementsByClassName("bg-mask")[0]; // 歌词界面遮罩背景
var Lyrics = { //歌词数据处理
    lyricStr:"",//储存当前歌曲歌词的字符串数据
    lyricLiH:42,//每句歌词所在li的高度
    lyricUlTop:138,//初始ul的top
    lyricIndex:0,//每句歌词的序号
    lyricTime:[],//存储每句歌词的持续时间
    lyricText:[],//存储每一句歌词
    lyricTimer:null,//歌词滚动定时器
    lyricPrevNum:-1,//上一句歌词序号
    color:'#2b9742',//改变当前播放歌词颜色
    offset:0,//歌词偏移（可以提前或延迟歌词滚动，负数提前正数延迟）
    isDrag:false //是否拖拽
};

//主页模块
(function () {
    var oStage = document.getElementById("stage"),
        oContainer = oStage.getElementsByClassName("container")[0],
        aDiv = oStage.querySelectorAll("#stage .container div"),
        aDisk = document.getElementsByClassName("disk"),
        oBack = document.getElementById("back"),
        length = aDiv.length,
        onOver = true,//判读鼠标是否在其上面
        Timer = null,
        Timer1 = null,
        rotating = true, // 判断oContainer 是否放大
        Num = 0;
    //初始化
    oContainer.style.transform = "rotateY(360deg)";
    Rotation();
    //oContainer 自转函数
    function Rotation() {
        clearInterval(Timer1);
        Timer1 = setInterval(function () {
            if(onOver){
                oContainer.style.transform = "rotateY(0deg)";
            }else {
                oContainer.style.transform = "rotateY(360deg)";
            }
            onOver = !onOver;
        },3000);
    }
    //事件委托 鼠标移入事件
    oContainer.onmouseenter = function () {
        for (var i = 0; i < length; i++) {
            aDiv[i].className = "item"+ (i+1);
        }
        var arr = [
            "rotateY(190deg)",
            "rotateY(190deg)",
            "rotateY(190deg)",
            "rotateY(190deg)",
            "rotateY(190deg)",
            "rotateY(190deg)"
        ];
        for (i = 0; i < length; i++) {
            if(rotating){
                (function (i) {
                    oContainer.style.transform = arr[i];
                })(i)
            }
        }
        clearInterval(Timer1);//清除定时器
    };
    //事件委托 鼠标移出事件
    oContainer.onmouseleave = function () {
        for (var i = 0; i < length; i++) {
            aDiv[i].className = "list"+ (i+1);
        }
        Rotation();
        rotating = false;
    };
    //aDiv事件
    for (var i = 0; i < length; i++) {
        // 显示碟片
        aDiv[i].onmouseover = function () {
            this.style.opacity = 1;
        };
        // 隐藏碟片
        aDiv[i].onmouseout = function () {
            clearInterval(Timer);
            this.style.opacity = .8;
            tMove(aDisk[this.Num],{
                left:-100
            },1000);
        };
        aDiv[i].Num = i;
        // Div点击居中
        aDiv[i].onclick = function () {
            clearTimeout(this.timer);
            var This = this;
            Timer = setTimeout(function () {
                tMove(aDisk[This.Num],{
                    left:0
                },1000);
            },1000);
            
            this.timer = setTimeout(function () {
                rotating = false;
                Num = This.Num;
                switch (This.className){
                    case "item1":
                        oContainer.style.transform='rotateY(190deg)';
                        break;
                    case 'item2':
                        oContainer.style.transform='rotateY(130deg)';
                        break;
                    case 'item3':
                        oContainer.style.transform='rotateY(70deg)';
                        break;
                    case 'item4':
                        oContainer.style.transform='rotateY(10deg)';
                        break;
                    case 'item5':
                        oContainer.style.transform='rotateY(310deg)';
                        break;
                    case 'item6':
                        oContainer.style.transform='rotateY(250deg)';
                        break;
                }
            },500)
        };
        //Div双击进入播放页面
        aDiv[i].ondblclick = function () {
            clearInterval(Timer);
            if(Num !== this.Num)return;
            var _This = this;
            tMove(aDisk[this.Num],{
                left:-100
            },1000);
            //进入播放页面
            setTimeout(function () {
                oStage.style.display = "none";
                for (var i = 0; i < aPlayListLi.length; i++) { //样式初始化
                    aPlayListLi[i].className = "";
                }
                prevSong = index;
                index = _This.Num;
                aPlayListLi[index].className = "active";
                loadLyrics(Data[index].lyric);
                oPlay.ifDown = true;
                oPlay.style.display = "none";
                oPause.style.display = "inline-block";
                LyricsIsScrollWithTime();
                scrollTime();
                oNeedle.className = "play-needle";
                oBg.style.webkitFilter = "blur(10px)";//改变背景模糊度
                setTimeout(function(){
                    Round(index,0,1);
                },500);
            },200);
            setTimeout(function(){
                oStage.style.display='none';
            },1000);
        }
    }
    //回到主页
    oBack.onclick = function () {
        rotating = true;
        oStage.style.display = "block";
        oPlay.ifDown = false;
        oPause.style.display='none';
        oPlay.style.display='inline-block';
        init();
        oNeedle.className = "play-needle";
        clearInterval(timer1);
        oBg.style.webkitFilter='blur(18px)';
        tMove(oStage,{opacity:1},500);
    };
})();

// 播放模块
(function () {
    //初始化渲染
    Show(0,0,1);
    aDiskAlbumBg[0].src = Data[0].img;
    aDiskAlbumBg[1].src = Data[1].img;
    //歌词初始化
    var d = Data[index];
    loadLyrics(d.lyric);
    oSongName.innerHTML = d.song;
    oSinger.innerHTML = d.singer;
    //各种点击事件
    oList.onclick = function () {
        oListMask.style.display = "block";
        tMove(oPlayList, {
            bottom: 0
        }, 500)
    };
    oLTC.onclick = function () { // 不执行 -.-! -.-!  原因是因为oLTC获取时没有加具体位置，而getElementsByClassName()获取的是一个集合
        oListMask.style.display = "none";
        tMove(oPlayList, {
            bottom: -360
        }, 500)
    };
    oListMask.onclick = function () {
        oListMask.style.display = "none";
        tMove(oPlayList, {
            bottom: -360
        }, 500)
    };
    oPlayListUl.onclick = function (e) { //事件委托比较好
        e = e || window.event;
        var target = e.target || e.srcElement;
        if((/li/i.test(target.nodeName))||(/span/i.test(target.nodeName))){
            var thisLi = target;
            if(changing)return;//歌曲切换过程中，直接return;
            if(index === thisLi.index)return;
            prevSong = index;
            aPlayListLi[index].className = "";
            index = thisLi.index;
            aPlayListLi[index].className = "active";
            var d = Data[index];
            loadLyrics(d.lyric);
            oSongName.innerHTML = d.song;
            oSinger.innerHTML = d.singer;
            init();
            changing = true;
            oPlay.onclick();//点击歌曲列表，进行歌曲播放
            onClickRun(prevSong,index);
            scrollToMove(oPlayListUl,42*(index-2),400);
        }
    };
    oPlay.onclick = function () {
        ended = oAudio.ended;
        this.ifDown = true;//判读播放键是否切换为暂停状态
        this.style.display = "none";
        oPause.style.display = "inline-block";
        if(!changing){
            oAudio.play();
            animationRun();
            LyricsIsScrollWithTime();
        }
        scrollTime();
        oNeedle.className = "";
        oBg.style.webkitFilter = "blur(10px)";//改变背景模糊度
    };
    oPause.onclick = function () {
        oPlay.ifDown = false;
        clearInterval(Lyrics.lyricTimer);
        this.style.display = "none";
        oPlay.style.display = "inline-block";
        animationPau();
        oAudio.pause();
        oNeedle.className = "play-needle";
        clearInterval(timer1);
        oBg.style.webkitFilter = "blur(18px)";//改变背景模糊度
    };
    oPrev.onclick = function (){
        change(0);
    };
    oNext.onclick = function () {
        change(1);
    };
    oLoop.ifShow = true;
    oLoop.onclick = function () {
        if(this.ifShow){ // 单曲循环
            this.style.background = "url(css/images/play_icn_loop_solo.png)";
            this.ifShow = false;
        }else {//列表循环
            this.style.background = "url(css/images/play_icn_loop.png)";
            this.ifShow = true;
        }
    };
    oCenter.onclick = function () { //歌词面板显示点击事件
        oLyrics.style.display = "block";
        oCenter.style.opacity = 0.0001;
        oBgMask.style.display = "block";
    };
    oLyrics.ifShow = true;
    oLyrics.onclick = function () {//歌词面板隐藏点击事件
        if(this.ifShow){
            oLyrics.style.display = "none";
            oCenter.style.opacity = 1;
            oBgMask.style.display = "none";
        }
    };
    oCurBtn.onclick = function (e) {
        e = e || window.event;
        e.stopPropagation();//阻止默认事件
    };
    oProcessBar.onclick = function (e) {
        e = e || window.event;
        if (changing) return;
        var objBCLeft = oCurBtn.getBoundingClientRect().left;//getBoundingClientRect用于获得页面中某个元素的左，上，右和下分别相对浏览器视窗的位置
        var sX = e.clientX;
        var objOffsetLeft = oCurBtn.offsetLeft;//到定位父级的距离
        curBtnMoveByMouse(sX,objBCLeft,objOffsetLeft);
        
    };
    //各种拖拽事件
    oCurBtn.onmousedown = function (e) {
        e = e || window.event;
        if(changing)return;
        curIsDrag = false;
        var L = oCurBtn.offsetLeft + 10;//进度条本身left (offset不包括margin)
        var X = e.clientX;//鼠标X位置
        var DisX = L;//移动距离
        document.onmousemove = function (e) {
            curIsDrag = true;
            DisX = e.clientX - X + L; // 滑块移动的距离
            //边界条件
            if(DisX > 235)DisX = 235;
            if(DisX < 0)DisX = 0;
            oCurBtn.style.left = DisX + "px";
            oProcessCur.style.width = DisX + "px";
            LyricsMoveByTime((DisX/235)*durationT);
            sToM((DisX/235)*durationT,oCurrentTime);//移动中 不改变当前歌词时间
        };
        document.onmouseup = function () {
            curIsDrag = false;
            oAudio.currentTime = (DisX/235)*durationT;//鼠标抬起后改变当前时间
            //移除move, up事件
            document.onmousemove = null;
            document.onmouseup = null;
        }
    };
    oLyrics.onmousedown = function (e) {
        e = e || window.event;
        this.ifShow = true;
        var sY = e.clientY,//当前鼠标的y坐标值
            oLyricsUlTop = oPlayListUl.offsetTop,//当前歌词ul的offsetTop值 动态获取
            oLyricsUlFinalTop = oPlayListUl.offsetTop;//拖拽后的top值，初始化
        document.onmousemove = function (e) {
            if(changing)return;
            e = e || window.event;
            if(Math.abs(e.clientY - sY)<4)return;
            Lyrics.isDrag = true;
            oLyrics.ifShow = false;
            oLyricsLine.style.display = "block";
            var Dis = e.clientY - sY + oLyricsUlTop;//当前 ul 的top 值
            if(Dis > Lyrics.lyricUlTop)Dis = Lyrics.lyricUlTop;
            if(Dis < (-oLyrics.offsetHeight + Lyrics.lyricUlTop + Lyrics.lyricLiH)){
                Dis = (-oLyrics.offsetHeight + Lyrics.lyricUlTop + Lyrics.lyricLiH);
            }
            oLyricsUl.style.top = Dis + "px";
            var Num = Math.round((Dis - Lyrics.lyricUlTop)/Lyrics.lyricLiH);
            oLyricsUlFinalTop = Lyrics.lyricUlTop + Lyrics.lyricLiH*Num;
            if(Lyrics.lyricPrevNum > -1){
                aLyricsLi[Lyrics.lyricPrevNum].className = "";
                aLyricsLi[Lyrics.lyricPrevNum].style.cssText = "";
            }
            Lyrics.lyricIndex = Math.abs(Num);
            aLyricsLi[Lyrics.lyricIndex].className = "active";
            aLyricsLi[Lyrics.lyricIndex].style.color = Lyrics.color;
            Lyrics.lyricPrevNum = Lyrics.lyricIndex;
        };
        document.onmouseup = function () {
            if(changing)return;
            if(Lyrics.isDrag){
                Lyrics.isDrag = false;
                oLyricsLine.style.display = "none";
                if(Lyrics.lyricTime[Lyrics.lyricIndex]){
                    oAudio.currentTime = (Lyrics.lyricTime[Lyrics.lyricIndex] + 0.001);
                }else oAudio.currentTime =(Lyrics.lyricTime[0] + 0.001);
                sToM(Lyrics.lyricTime[Lyrics.lyricIndex],oCurrentTime);
                curBtnByTime(Lyrics.lyricTime[Lyrics.lyricIndex],durationT);
                tMove(oLyricsUl,{
                    top:oLyricsUlFinalTop
                },100)
            }
            document.onmousemove = null;
            document.onmouseup = null;
        }
    }
})();


//歌曲切换函数
function change(click) {
    if(!changing){
        init();
        changing = true;
        prevSong = index;
        aPlayListLi[prevSong].className = "";
        if(click === 1){
            index++;
            if(index > Data.length - 1)index = 0;
        }
        if(click === 0){
            index--;
            if(index < 0)index = Data.length-1;
        }
        //数据切换
        var d = Data[index];
        loadLyrics(d.lyric);
        oSongName.innerHTML = d.song;
        oSinger.innerHTML = d.singer;
        if(click === 0){
            if(oPlay.ifDown){
                oNeedle.className = "play-needle";
                setTimeout(function(){
                    Round(index,1,0);
                },500);
            }else {
                Round(index,1,0);
            }
        }
        if(click === 1){
            if(oPlay.ifDown){
                oNeedle.className = "play-needle";
                setTimeout(function(){
                    Round(index,0,1);
                },500);
            }else {
                Round(index,0,1);
            }
        }
    }
}
//初始化函数
function init() {
    oCurrentTime.innerHTML = "00:00";
    oAudio.currentTime = 0.001;
    curBtnByTime(oAudio.currentTime,durationT);
    oAudio.pause();
    animationPau();
    clearInterval(Lyrics.lyricTimer);
}
//唱片运动函数
function animationRun () {
    aDiskM[0].style.animationPlayState="running";
    aDiskM[0].style.WebkitAnimationPlayState="running";
    aDiskM[1].style.animationPlayState="running";
    aDiskM[1].style.WebkitAnimationPlayState="running";
}
//唱片静止函数
function animationPau () {
    aDiskM[0].style.animationPlayState="paused";
    aDiskM[0].style.WebkitAnimationPlayState="paused";
    aDiskM[1].style.animationPlayState="paused";
    aDiskM[1].style.WebkitAnimationPlayState="paused";
}
//aDiskM 位置变化函数 (响应式)
window.onresize = function () {
    var prevW = winW;
    winW = document.documentElement.clientWidth;
    if(aDiskM[0].offsetLeft > 0 && aDiskM[0].offsetLeft < prevW){
        aDiskM[0].style.left = winW/2 + "px";
    }
    if(aDiskM[1].offsetLeft > 0 && aDiskM[1].offsetLeft < prevW){
        aDiskM[1].style.left = winW/2 + "px";
    }
};
//aDiskM 左右切换状态改变函数
function Round(i,x,k) {
    // i:数据的下标 x:轮播图的下标0 k:轮播图下标1   //有些绕脑
    var d = Data[i];
    oAudio.src = d.src;
    Time();
    if(x<k){
        aDiskM[0].style.left = winW/2 + "px";
        aDiskM[1].style.left = kW + "px";
        if(prevSong>-1)aDiskAlbumBg[0].src = Data[prevSong].img;
        aDiskAlbumBg[1].src = Data[index].img;
        tMove(aDiskM[x],{left:-122},610,function () {
            aDiskAlbumBg[x].src = d.img;
            aDiskM[x].style.left = "";
            aDiskM[k].style.left = kW + "px";
            Show(i,x,k);
            isRunning();
            changing = false;
        });
        tMove(aDiskM[k],{left:winW/2},600);
    }
    if(x>k){
        aDiskM[0].style.left = "-122px";
        aDiskM[1].style.left = winW/2 + "px";
        aDiskAlbumBg[0].src = Data[index].img;
        if(prevSong>-1)aDiskAlbumBg[1].src = Data[prevSong].img;
        tMove(aDiskM[x],{left:kW},610,function () {
            aDiskAlbumBg[x].src = d.img;
            aDiskM[x].style.left = "";
            aDiskM[k].style.left = "-122px";
            Show(i,x,k);
            isRunning();
            changing = false;
        });
        tMove(aDiskM[k],{left:winW/2},600)
    }
}
// 歌曲列表点击运动函数
function onClickRun(prevSong,index) {
    if(oPlay.ifDown){
        oNeedle.className = "play-needle";
        setTimeout(function(){
            if(prevSong>index)Round(index,1,0);
            if(prevSong<index) Round(index,0,1);
        },500);
    }else {
        if(prevSong>index)Round(index,1,0);
        if(prevSong<index)Round(index,0,1);
    }
}
// 歌曲状态改变时页面渲染 函数
function Show(i,x,k) {
    var d = Data[i];
    oSongName.innerHTML = d.song;
    oSinger.innerHTML = d.singer;
    aDiskM[x].style.left = winW/2 + "px";
    aDiskAlbumBg[x].src = d.img;
    if(x<k)aDiskM[k].style.left = kW + "px";
    if(x>k)aDiskM[k].style.left = "-122px";
    oBg.style.backgroundImage = "url("+d.img+")";
    oAudio.src = d.src;
    Time();
    oPlayListCount.innerHTML = Data.length;
}
//进度点位置(当前播放时间)根据鼠标位置移动（改变）函数
function curBtnMoveByMouse(sX,styleLeft,objOffsetLeft) {
    var tar = sX - styleLeft + objOffsetLeft;
    //限制范围
    if(tar>235)tar = 235;
    if(tar < 0)tar = 0;
    oCurBtn.style.left = tar + "px";
    oProcessCur.style.width = tar +"px";
    LyricsMoveByTime((tar/235)*durationT);
    oAudio.currentTime = (tar/235)*durationT;//对应位置的时间戳
    sToM((tar/235)*durationT,oCurrentTime);
    
}
//进度点跟随时间运动函数
function curBtnByTime(nowTime,allTime) {
    if(nowTime>allTime)nowTime=allTime;
    oCurBtn.style.left = (nowTime/allTime)*235 + "px";
    oProcessCur.style.width = (nowTime/allTime)*235 + "px";
}
//获取歌曲总时间函数
function Time() {
    timer = setInterval(function () {
        if(oAudio.duration){
            durationT = oAudio.duration;//获取一次就可以了
            clearInterval(timer);
            sToM(durationT,oTotalTime);
        }
    },16)
}
//判读歌曲是否播放完毕
function isEnd() {
    if(ended){
        init();
        if(oLoop.ifShow){
            if(!changing){
                //切换下一首
                change(1);
            }
        }else{
            isRunning();
        }
    }
}
//歌曲播放状态函数
function isRunning() {
    if(oPlay.ifDown){
        oAudio.play();
        oNeedle.className = "";
        animationRun();
        LyricsIsScrollWithTime();
    }else {
        oNeedle.className = "play-needle"
    }
}
//动态获取当前时间函数
function scrollTime() {
    isEnd();
    clearInterval(timer1);
    timer1 = setInterval(function () {
        if(curIsDrag) return;
        ended = oAudio.ended;
        sToM(oAudio.currentTime,oCurrentTime);
        isEnd();
        curBtnByTime(oAudio.currentTime,durationT)
    },500);
}
//秒化分函数
function sToM(sec,obj) {
    var M = Math.floor(sec/60);
    var S = Math.floor(sec%60);
    obj.innerHTML = toTwo(M)+":"+toTwo(S);
}
//补0 函数
function toTwo(n) {
    return n<10?"0"+n:""+n;
}


//歌词相关函数
//载入歌词、生成li 函数
function loadLyrics(key) {
    LyricsReset();
    Lyrics.lyricStr = lyrics[key];
    Lyrics.lyricTime = returnTimeLyrics(Lyrics.lyricStr)[0];
    Lyrics.lyricText = returnTimeLyrics(Lyrics.lyricStr)[1];
    oLyricsUl.innerHTML = "";
    for (var i = 0; i < Lyrics.lyricText.length; i++) {// 不在这里i为1 开始 是因为在这里时间歌词不匹配
        var oLi = document.createElement("li");
        if(Lyrics.lyricText[i] === "")oLi.innerHTML = "&nbsp;";
        else oLi.innerHTML = Lyrics.lyricText[i];
        oLyricsUl.appendChild(oLi);
    }
}
//一曲结束后，下一曲开始前 ，歌词列表样式进行重置
function LyricsReset() {
    Lyrics.lyricPrevNum = -1;
    Lyrics.lyricIndex = 0;
    oLyricsUl.style.top = Lyrics.lyricUlTop + "px";
}
//歌词跟随时间滚动
function LyricsMoveByTime(Time) {
    var last = true;//判读是否是最后一句
    for (var i = 0; i < Lyrics.lyricTime.length; i++) {
        if(Lyrics.lyricTime[i]>(Time - Lyrics.offset)){
            Lyrics.lyricIndex = i-1;// 改变序号
            last = false;
            break;//跳出循环 ，显示第i个
        }
    }
    if(last)Lyrics.lyricIndex = Lyrics.lyricTime.length - 1;
    if(Lyrics.lyricIndex < 0)Lyrics.lyricIndex = 0;
    if(!aLyricsLi[Lyrics.lyricIndex])return;//判断这个li存不存在，不存在直接返回
    if(Lyrics.lyricPrevNum === Lyrics.lyricIndex){
        return;// 由于当前序号在for循环里面已经改变，上一个的序号和当前序号相等 直接返回
    }else{
        if(Lyrics.lyricPrevNum>-1){
            aLyricsLi[Lyrics.lyricPrevNum].className = "";
            aLyricsLi[Lyrics.lyricPrevNum].style.cssText = "";
            /**  cssText
             * cssText：当前规则的所有样式声明文本。该属性可读写，即可用来设置当前规则。
             * elm.style.cssText = ""; //快速清空该规则的所有声明
             */
        }
        Lyrics.lyricPrevNum = Lyrics.lyricIndex;
    }
    //当前li添加独特样式
    aLyricsLi[Lyrics.lyricIndex].className = "active";
    aLyricsLi[Lyrics.lyricIndex].style.color = Lyrics.color;
    tMove(oLyricsUl,{
        top:Lyrics.lyricUlTop-Lyrics.lyricLiH*Lyrics.lyricIndex
    },250)
}
//判读歌词是否滚动函数
function LyricsIsScrollWithTime() {
    clearInterval(Lyrics.lyricTimer);
    Lyrics.lyricTimer = setInterval(function () {
        if(curIsDrag)return;//进度点在拖拽中 不随时间自动滚动
        if(Lyrics.isDrag)return;//歌词被拖拽时 不随时间自动滚动
        if(!oPlay.ifDown){ // 歌词暂停时 清除滚动定时器
            clearInterval(Lyrics.lyricTimer);
            return;
        }
        if(!oAudio.currentTime)return;
        LyricsMoveByTime(oAudio.currentTime);
    },150)
}
//拆分歌词数据中的时间和歌词，并做匹配一一对应
function returnTimeLyrics(lyrics) {
    var arr = lyrics.split("["),
        arrTime = [],//存储时间
        arrLyrics = [],//存储歌词
        arrTemp = [];// 存储时间和歌词
    for (var i = 1; i < arr.length; i++) {//i为1 开始 解决 第一个li内容为und 的问题
        arrTime.push(mToS(arr[i].split("]")[0]));
        arrLyrics.push(arr[i].split("]")[1]);
    }
    arrTemp.push(arrTime,arrLyrics);
    return arrTemp;
}
//分化秒函数
function mToS(strTime) {
    var arr = strTime.split(":");
    var S = parseFloat((parseFloat(arr[0])*60 + parseFloat(arr[1])).toFixed(2));
    return S;
    /**
     *  parseFloat() 解析一个字符串，并返回一个浮点数。
     *  toFixed()  Number 四舍五入为指定小数位数的数字。
     * */
}


//歌曲列表相关函数
//动态生成对应的歌曲列表li
(function createPlayListLi() {
    for (var i = 0; i < Data.length; i++) {
        var oLi = document.createElement("li"),
            oSpan = document.createElement("span");
        if(i === index)oLi.className = "active";
        oLi.index = i;
        oSpan.index = i;
        oLi.innerHTML = Data[i].song;
        oSpan.innerHTML = "&nbsp;&nbsp;-"+ Data[i].singer;
        oLi.appendChild(oSpan);
        oPlayListUl.appendChild(oLi);
    }
})();
//播放列表根据点击歌曲上下滚动函数
function scrollToMove(obj,Dis,time) {
    var scrollTopMax = 0;
    if(document.documentElement.clientHeight < obj.offsetHeight){
        scrollTopMax = obj.scrollHeight - document.documentElement.clientHeight;
    }else {
        scrollTopMax = obj.scrollHeight - obj.offsetHeight;
    }
    if(Dis<0)Dis = 0;
    if(Dis>scrollTopMax)Dis = scrollTopMax;
    var scrollTop = obj.scrollTop,
        _Dis = Dis - scrollTop,
        Num = time/20, //随意设置的20
        PreDis = _Dis/Num,//每次移动的距离
        index = 0;
    clearInterval(obj.timer);
    if(obj.scrollTop === scrollTopMax && PreDis >= 0)return;
    if(obj.scrollTop === 0 && PreDis <= 0)return;
    obj.timer = setInterval(function () {
        index++;
        var All = scrollTop + Math.round(PreDis*index);
        if(All < 0) All = 0;
        if(All > scrollTopMax)All = scrollTopMax;
        obj.scrollTop = All;
        if(index === Num){
            obj.scrollTop = Dis;
            clearInterval(obj.timer);
        }
    },20)
}


// 时间版运动插件 简易版
function tMove( obj , json , time , callback ) {
    window.requestAnimationFrame = window.requestAnimationFrame||function(a){return setTimeout(a,1000/60)};
    window.cancelAnimationFrame = window.cancelAnimationFrame||clearTimeout;
    var cssJson = obj.currentStyle || getComputedStyle(obj);
    var start = {},S = {};
    for (var key in json) {
        start[key] = parseFloat(cssJson[key]);//储存每个属性的 初始值
        S[key] = json[key] - start[key];//存储每个属性的 总路程
        if ( !S[key] ){
            delete start[key];
            delete S[key];
        }
    }
    var sTime = new Date();
    (function fn() {
        var prop = (new Date() - sTime) / time;
        prop>=1?prop = 1:requestAnimationFrame(fn);
        for (var key in start){
            if ( key === "opacity" ){
                var val = S[key] * prop + start[key];
                obj.style[key] = val;
                obj.style.filter = "alpha(opacity="+ val*100 +")";
            }else{
                obj.style[key] = S[key] * prop + start[key] + 'px';
            }
        }
        if ( prop === 1 )callback && callback.call( obj );
    })();
}
