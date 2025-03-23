const app_date = "2025/3/9",app_name = "ccb-simulator-dx",app_ver = "0.0.11"
const app = document.getElementById("ccb_app")
const screen1 = document.getElementById("ccb_screen_1")
const screen2 = document.getElementById("ccb_screen_2")
const screen3 = document.getElementById("ccb_screen_3")
const screen4 = document.getElementById("ccb_screen_4")
const screen5 = document.getElementById("ccb_screen_5")
const screen6 = document.getElementById("ccb_screen_6")
const progress = document.getElementById("ccb_noti_progress")
const clt_2bt = document.getElementById("clt_2bt")
const play_ccb = document.getElementById("play_ccb")
const cmt = document.getElementById("ccb_mode_title")
app.style = ""
screen1.style = ""
let ccb_started,ccb_evl1,cb_count=0,first_click_time,last_click_time,score=0,tps,cb_allow,cmi,ptm1,ptm2
let ccb_game_mode,ccb_cm_level,last10click=[],ccb_lc_doubt,first_cb=0,bgm_on,bgm_type,cb_key_state
document.body.addEventListener("contextmenu", (e) => {
    e.preventDefault();
})
function play() {
    document.getElementById("pic_forload").style.display = "none"
    screen1.style.display = "none"
    screen2.style.display = ""
    const img = document.getElementById("screen2_img")
    img.src = "assets/webp/scene_1.webp"
    document.getElementById("story1").play()
    ptm1 = setTimeout(()=>{
        img.src = "assets/webp/scene_2.webp"
    },3600)
    ptm2 = setTimeout(()=>{
        ccb_start()
    },11000)
}
function play_ccb_sound() {
    document.getElementById("ccb1").currentTime = 0
    document.getElementById("ccb1").play()
}
function ccb_start() {
    clearTimeout(ptm1)
    clearTimeout(ptm2)
    if (ccb_started) {
        return
    }
    ccb_started = 1
    document.getElementById("story1").pause()
    document.getElementById("story2").play()
    screen2.style.display = "none"
    screen3.style.display = ""
    const img = document.getElementById("screen3_img")
    let a = setInterval(()=>{
        img.src = "assets/webp/elep_1.webp"
        setTimeout(()=>{
            img.src = "assets/webp/elep_2.webp"
        },100)
    },200)
    setTimeout(()=>{
        img.style = "left:calc(var(--ccb_font_size)*4)"
    },50)
    setTimeout(()=>{
        document.getElementById("cnp_txt").innerText = "点击屏幕！"
        document.getElementById("ccb_noti_title").style = "display:block"
    },3500)
    setTimeout(()=>{
        clearInterval(a)
        img.style = "left:calc(var(--ccb_font_size)*100);bottom:calc(var(--ccb_font_size)*360)"
    },4000)
    setTimeout(()=>{
        ccb_main()
    },4400)
}
function ccb_main() {
    cb_allow = 1
    screen3.style.display = "none"
    screen4.style.display = ""
    progress.style.display = ""
    progress.value = 100
    const img = document.getElementById("screen4_elp")
    setTimeout(()=>{
        img.style = "bottom:0px"
    },50)
    ccb_evl1 = document.body.addEventListener("click",ccb_click)
    cmi = setInterval(()=>{
        progress.value = progress.value - 1
        if (progress.value <= 0) {
            over()
        }
    },10)
}
function changecmil(ms,num) {
    clearInterval(cmi)
    cmi = setInterval(()=>{
        progress.value = progress.value - (num || 1)
        if (progress.value <= 0) {
            over()
        }
    },ms)
}
function ccb_click() {
    if (!cb_allow) {
        return
    }
    if (!first_click_time) {
        first_click_time = Date.now()
        last_click_time = Date.now()
        scorec(5)
    } else {
        let tm = Math.pow(last_click_time-Date.now()+1000,2)
        if (ccb_game_mode == 1) {
            lct_value_ev()
        }
        last_click_time = Date.now()
        scorec(Math.ceil(tm/200000))
        tps = Math.floor(cb_count/(last_click_time - first_click_time)*10000)/10
        document.getElementById("cet_txt3").innerText = "CPS: "+tps
    }
    document.getElementById("cet_txt2").innerText = "CCB: "+score
    const img = document.getElementById("screen4_elp")
    const wow = document.getElementById("screen4_wow")
    img.style = "bottom:10px;transition:none"
    gen_audio_el("assets/mp3/wow_1.mp3")
    wow.style = "display:block;transition:none"
    setTimeout(()=>{
        wow.style = "display:block;width:calc(var(--ccb_font_size)*25);left:calc(var(--ccb_font_size)*-7);bottom:calc(var(--ccb_font_size)*-4)"
        img.style = "bottom:-10px;transition:.05s"
    },2)
    cb_count++
    document.getElementById("cnp_txt").innerText = "踩背次数："+cb_count
    progress.value += 40
    if (ccb_game_mode == 1) {
        if (score > 2500) {
            if (ccb_cm_level != 3) {
                ccb_cm_level = 3
                genscorec_text("2500分！加速x4！",1)
                changecmil(10,4)
            }
        } else if (score > 1000) {
            if (ccb_cm_level != 2) {
                ccb_cm_level = 2
                genscorec_text("1000分！加速x3！",1)
                changecmil(10,3)
            }
        } else if (score > 500) {
            if (ccb_cm_level != 1) {
                ccb_cm_level = 1
                genscorec_text("500分！加速x2！",1)
                changecmil(10,2)
            }
        }
    }
    if (cb_count/100 == Math.floor(cb_count/100)) {
        document.getElementById("wcsndm").play()
    }
}
function gen_audio_el(url,removeafter) {
    const el = document.createElement("audio")
    el.src = url
    document.body.appendChild(el)
    el.play()
    setTimeout(()=>{
        document.body.removeChild(el)
    },(removeafter || 1000))
}
function over() {
    cb_allow = 0
    first_cb = 1
    clearInterval(cmi)
    document.body.removeEventListener("click",ccb_click)
    document.getElementById("ccb_noti_title").style = "display:none"
    const bgm = document.getElementById("bgm")
    if (cb_count) {
        document.getElementById("cet_txt").innerText = "您一共踩了"+cb_count+"次背！"
        document.getElementById("wow_2").play()
        if (bgm_on && bgm_type) {
            bgm.src = "assets/opus/bgm_wmc24_result.opus"
            bgm.play()
        }
    } else {
        document.getElementById("cet_txt").innerText = "踩背失败！"
        document.getElementById("screen4_elp").style = "left:calc(var(--ccb_font_size)*100)"
        document.getElementById("fail").play()
        if (bgm_on && bgm_type) {
            bgm.src = "assets/opus/bgm_wmc24_fail.opus"
            bgm.play()
        }
    }
    setTimeout(()=>{
        screen4.style.display = "none"
        screen5.style.display = ""
    },1000)
}
function scorec(value) {
    score += value
    genscorec_text("+"+value)
}
function genscorec_text(str,type) {
    const ss = document.createElement("span")
    ss.className = "score_show"
    let ss_time = 500
    if (type) {
        ss.classList.add("slow")
        ss_time = 2000
    }
    ss.innerText = str
    document.body.appendChild(ss)
    setTimeout(()=>{
        document.body.removeChild(ss)
    },ss_time)
}
function reset() {
    screen5.style.display = "none"
    screen1.style.display = ""
    clt_2bt.style.display = "none"
    play_ccb.style.display = ""
    document.getElementById("cnp2_txt").style.display = "none"
    ccb_started=ccb_evl1=first_click_time=last_click_time=tps=cb_allow=cmi=null
    cb_count=score=ccb_cm_level=ccb_lc_doubt=0
    last10click=[]
    document.getElementById("screen3_img").style = ""
    document.getElementById("screen4_elp").style = ""
    document.getElementById("screen4_wow").style = ""
    document.getElementById("cet_txt").innerText = ""
    document.getElementById("cet_txt2").innerText = ""
    document.getElementById("cet_txt3").innerText = ""
    document.getElementById("story1").currentTime = 0
    cmt.innerText = ""
    document.getElementById("us_notify").style.display = "block"
    const bgm = document.getElementById("bgm")
    if (bgm_on && bgm_type) {
        bgm.src = "assets/opus/bgm_wmc24.opus"
        bgm.play()
    }
}
function play0() {
    clt_2bt.style.display = ""
    play_ccb.style.display = "none"
    if (first_cb) {
        document.getElementById("play_ccb3").style = ""
    }
}
function play1() {
    ccb_game_mode = 0
    cmt.innerText = "经典模式"
    if (bgm_type) {
        const bgm = document.getElementById("bgm")
        bgm.src = "assets/opus/bgm.opus"
        bgm_type = 0
        if (bgm_on) {
            bgm.play()
        }
    }
    play()
}
function play2() {
    ccb_game_mode = 1
    cmt.innerText = "挑战模式"
    if (!bgm_type) {
        const bgm = document.getElementById("bgm")
        bgm.src = "assets/opus/bgm_wmc24.opus"
        bgm_type = 1
        if (bgm_on) {
            bgm.play()
        }
    }
    play()
}
function lct_value_ev() {
    if (last10click.length < 10) {
        last10click[last10click.length] = Date.now() - last_click_time
    } else {
        last10click.shift()
        last10click[9] = Date.now() - last_click_time
        let l1c_avg = 0,l1c_diff = 0
        for (i=0;i<10;i++) {
            l1c_avg += last10click[i]/10
        }
        for (i=0;i<10;i++) {
            l1c_diff += Math.abs(last10click[i] - l1c_avg)
        }
        if (l1c_diff < 50) {
            ccb_lc_doubt++
            if (ccb_lc_doubt > 5) {
                over()
                document.getElementById("cet_txt").innerText = "你是不是开了！？"
                console.log("挑战模式还想作弊？呵呵！")
            }
        } else {
            if (ccb_lc_doubt > 0) {
                ccb_lc_doubt = 0
            }
        }
    }
}
function show_s6() {
    screen1.style.display = "none"
    screen6.style.display = 'block'
}
function close_s6() {
    screen1.style.display = "block"
    screen6.style.display = 'none'
}
function handlefile(file,target) {
    if (!file) {
        return
    } else if (file.type.indexOf('image')!=0) {
        document.getElementById("ccb_s6_title_txt1").innerText = "铸币吧！你选择的是图片吗？"
        return
    }
    const file_url = window.URL.createObjectURL(file)
    if (target == "s4_im") {
        document.getElementById("screen4_img_pre").src = document.getElementById("screen4_img").src = file_url
    } else {
        document.getElementById("screen4_wow_pre").src = document.getElementById("screen4_wow").src = file_url
    }
}
document.getElementById("s4_im_upl").addEventListener('change',function(e){
    handlefile(e.target.files[0],"s4_im")
})
document.getElementById("s4_wo_upl").addEventListener('change',function(e){
    handlefile(e.target.files[0],"s4_wo")
})
function toggle_bgm() {
    const c = document.getElementById("bt_icon")
    const b = document.getElementById("bgm")
    if (!bgm_on) {
        bgm_on = 1
        c.src = "assets/png/speaker.png"
        b.play()
    } else {
        bgm_on = 0
        c.src = "assets/png/speakerm.png"
        b.pause()
        b.currentTime = 0
    }
}
window.addEventListener("keydown",(e)=>{
    let ct2 = document.getElementById("cnp2_txt")
    if (!cb_allow) {
        return
    }
    if (e.key == "c" && !cb_key_state) {
        cb_key_state = 1
        ccb_click()
        ct2.style.display = "none"
    } else if (e.key == "b" && cb_key_state) {
        cb_key_state = 0
        ccb_click()
        ct2.style.display = "none"
    } else {
        ct2.style.display = ""
    }
})
console.log(`${app_name} version ${app_ver}. Last updated ${app_date}.`)