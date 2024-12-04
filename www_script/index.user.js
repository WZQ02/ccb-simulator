// ==UserScript==
// @name         篡改猴笑传之踩踩背
// @license      CC0-1.0 Universal
// @version      2024-12-03
// @description  perform caocaobi on every website!
// @author       wzq2002
// @match        http://*/*
// @match        https://*/*
// @icon         https://ccbsimulator.wzq02.top/favicon.ico
// @grant        none
// ==/UserScript==

// 安装此脚本后，即可在任何网站踩踩背
// 键盘快捷键：C+B 召唤或隐藏大象，C+N 更改踩背时是否触发点击操作，C+加号键放大大象，C+减号键缩小大象

(function() {
    'use strict';
    const img_src_url = "https://ccbsimulator.wzq02.top/assets/webp/"
    const snd_src_url = "https://ccbsimulator.wzq02.top/assets/mp3/"
    let elep_size = 64
    let elep_invl,einv_avail,c_kd,sw_s,c_clk_s
    function sho_elep() {
        sw_s = 1
        const a = document.createElement("div")
        a.style = "cursor:none;left:0px;top:0px;width:"+elep_size+"px;height:"+elep_size*1.3+"px;position:fixed;pointer-events:none;background-size:cover;z-index:1145"
        elep_invl = setInterval(()=>{
            if (einv_avail) {
                a.style.backgroundImage = "url("+img_src_url+"elep_1.webp)"
                setTimeout(()=>{
                    a.style.backgroundImage = "url("+img_src_url+"elep_2.webp)"
                },100)
            }
        },200)
        a.id = "ccb_elephant"
        document.body.appendChild(a)
        const b = document.createElement("div")
        const bse = "position:relative;left:"+-elep_size*1.5+"px;top:"+-elep_size*.5+"px;width:"+elep_size*4+"px;height:"+elep_size*3+"px;background-image:url("+img_src_url+"wow.webp);background-size:cover;z-index:1;transform:rotate(24deg)"
        b.style = bse+";opacity:0"
        a.appendChild(b)
        const c = document.createElement("audio")
        c.src = snd_src_url+"story_2.mp3"
        c.autoplay = 1
        a.appendChild(c)
        document.body.style.cursor = "none"
        window.addEventListener("mousemove",(e)=>{
            a.style.transform = "translate("+(e.clientX-elep_size*.5)+"px,"+(e.clientY-elep_size*1.2)+"px)"
            einv_avail = 1
        })
        window.addEventListener("mousedown",(e)=>{
            einv_avail = 0
            a.style.top = "8px"
        })
        window.addEventListener("mouseup",(e)=>{
            einv_avail = 1
            a.style.top = "0px"
            b.style = bse+" scale(.2);opacity:1;transition:none"
            setTimeout(()=>{b.style = bse+";opacity:0;transition:.2s"},3)
        })
    }
    window.addEventListener("mouseup",()=>{
        gen_wow()
    })
    function gen_wow() {
        if (!sw_s) {
            return
        }
        const a = document.createElement("audio")
        a.src = snd_src_url+"wow_1.mp3"
        a.autoplay = 1
        document.body.appendChild(a)
        setTimeout(()=>{a.remove()},1000)
    }
    function swit_so() {
        if (!sw_s) {
            sho_elep()
            return
        }
        document.body.removeChild(document.getElementById("ccb_elephant"))
        document.body.style.cursor = ""
        sw_s = 0
    }
    function elep_resz(z) {
        if (z) {
            elep_size = elep_size*1.25
        } else {
            elep_size = elep_size*.8
        }
        document.body.removeChild(document.getElementById("ccb_elephant"))
        sho_elep()
    }
    window.addEventListener("keydown",(e)=>{
        if (e.key == "c") {
            c_kd = 1
        }
        if (c_kd == 1) {
            if (e.key == "b") {
                swit_so()
            }
            if (e.key == "=") {
                elep_resz(1)
            }
            if (e.key == "-") {
                elep_resz()
            }
            if (e.key == "n") {
                if (c_clk_s) {
                    c_clk_s = 0
                    document.getElementById("ccb_elephant").style.pointerEvents = "none"
                } else {
                    c_clk_s = 1
                    document.getElementById("ccb_elephant").style.pointerEvents = "auto"
                }
            }
        }
    })
    window.addEventListener("keyup",(e)=>{
        if (e.key == "c") {
            c_kd = 0
        }
    })
    console.log("ccb-simulator-www-script 0.0.2. Last updated 2024/12/3")
})();