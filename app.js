import { Game } from './game.js';
import { Displayer } from './displayer.js';
import { getMaterial } from './material.js';

/**
 * 控制遊戲畫面
 */
class App {
  /**
   * 初始化App
   */
  constructor() {
    this.displayer = new Displayer(document.getElementById('render'));
    this.brickCount = 4;
    this.materialName = 'octangle-full';
    this.game = null;
    this.volume = 1;
    this.bgm = null; // TODO
    this.displayer.scene.background = new THREE.CubeTextureLoader().load(getMaterial('bg-sky').fileNames.map(n => `img/${n}`))
  }

  // Home page

  /**
   * 清除畫面
   */
  clearPage() {
    var myNode = document.getElementById("game");
    while (myNode.firstChild) {
      myNode.removeChild(myNode.firstChild);
    }
  }

  /**
   * 前往遊戲首頁
   */
  gotoHome() {
    this.clearPage();
    this.displayer.display(Displayer.BACKGROUND)
    var home_div = document.createElement("div");
    var icon_div = document.createElement("div");
    var start_btn = document.createElement("button");
    var setting_btn = document.createElement("button");
    var achievement_btn = document.createElement("button");

    start_btn.onclick = () => { this.start(); };
    setting_btn.onclick = () => { this.gotoSetting(); };
    achievement_btn.onclick = () => { this.gotoAchievement(); };

    home_div.id = "home";
    icon_div.id = "icon-area";
    start_btn.id = "start";
    setting_btn.id = "gotoSetting";
    achievement_btn.id = "gotoAchievement";
    achievement_btn.style = "display: none"; // Temporary

    start_btn.innerText = "開始";
    setting_btn.innerText = "設定";
    achievement_btn.innerText = "成就";

    home_div.appendChild(icon_div);
    home_div.appendChild(start_btn);
    home_div.appendChild(setting_btn);
    home_div.appendChild(achievement_btn);

    document.getElementById("game").appendChild(home_div);
  }

  /**
   * 開始遊戲
   */
  start() {
    this.clearPage();
    this.game = new Game(this)
    this.displayer.display(Displayer.GAMMING)
    var play_div = document.createElement("div");
    var pause_btn = document.createElement("button");
    var submit_btn = document.createElement("button");
    // var canvas_div = document.createElement("div");
    var timemoveblock_div = document.createElement("div");
    var time_div = document.createElement("div");
    var move_div = document.createElement("div");
    var pauseBackgroundPage_div = document.createElement("div");
    var pausePage_div = document.createElement("div");
    var continue_btn = document.createElement("button");
    var restart_btn = document.createElement("button");
    var exit_btn = document.createElement("button");
    var volumeSetting_div = document.createElement("div");
    var volume_icon = document.createElement("div");
    var volume_ipt = document.createElement("input");
    var output_div = document.createElement("div");

    pause_btn.onclick = () => { this.pause(); };
    submit_btn.onclick = () => { this.submit(); };
    continue_btn.onclick = () => { this.continue(); };
    restart_btn.onclick = () => { this.restart(); };
    exit_btn.onclick = () => { this.exit(); };
    volume_ipt.oninput = () => {
      this.setVolume(volume_ipt.value);
    };

    play_div.id = "play";
    pause_btn.id = "pause";
    submit_btn.id = "submit";
    // canvas_div.id = "canvas-area";
    timemoveblock_div.id = "timemoveblock";
    time_div.id = "time";
    move_div.id = "move";
    pauseBackgroundPage_div.id = "pauseBackgroundPage";
    pausePage_div.id = "pausePage";
    continue_btn.id = "continue";
    restart_btn.id = "restart";
    exit_btn.id = "exit";
    volumeSetting_div.id = "volumeSetting";
    volumeSetting_div.style = "display: none;"; // Temporary
    volume_icon.id = "volume_icon";
    volume_ipt.id = "volume";
    output_div.id = "output";

    submit_btn.innerText = "submit";
    time_div.innerText = "time:00.00";
    move_div.innerText = "move:0";
    continue_btn.innerText = "繼續遊戲";
    restart_btn.innerText = "重新遊戲";
    exit_btn.innerText = "結束遊戲";
    output_div.innerText = "75";

    volume_ipt.type = "range";
    volume_ipt.min = "0";
    volume_ipt.max = "100";
    volume_ipt.value = "75";

    play_div.appendChild(submit_btn);
    // play_div.appendChild(canvas_div);
    play_div.appendChild(timemoveblock_div);
    play_div.appendChild(pause_btn);
    timemoveblock_div.appendChild(time_div);
    timemoveblock_div.appendChild(move_div);
    pauseBackgroundPage_div.appendChild(pausePage_div);
    pausePage_div.appendChild(continue_btn);
    pausePage_div.appendChild(restart_btn);
    pausePage_div.appendChild(exit_btn);
    pausePage_div.appendChild(volumeSetting_div);
    volumeSetting_div.appendChild(volume_icon);
    volumeSetting_div.appendChild(volume_ipt);
    volumeSetting_div.appendChild(output_div);

    pauseBackgroundPage_div.style.display = "none";

    document.getElementById("game").appendChild(play_div);
    document.getElementById("game").appendChild(pauseBackgroundPage_div);

    this.timeInt = setInterval(() => {
      time_div.innerText = 'Time: ' + Math.floor(this.game.getTime());
    }, 100);

    let game_div = document.createElement('div');
    game_div.style = 'position: absolute; top: 5%; left: 10%; background: rgba(128, 128, 128, 0.5); display: none;';

    let brick_table = document.createElement('table');

    let createBrick = (brickId, face) => {
      let brick = document.createElement('div');
      brick.id = 'brick' + brickId + face;
      if (face == 'top' || face == 'bottom') {
        brick.className = 'facetop';
      } else {
        brick.className = 'faceside';
      }
      return brick;
    }

    for (let brickId = 0; brickId < this.brickCount; brickId++) {
      // top
      let tr_top = document.createElement('tr');
      let td_top = document.createElement('td');
      td_top.colSpan = 4;
      td_top.style = 'text-align: center;';
      td_top.appendChild(createBrick(brickId, 'top'));
      tr_top.appendChild(td_top);
      brick_table.appendChild(tr_top);
      // side
      let tr_side = document.createElement('tr');
      ['left', 'front', 'right', 'back'].forEach(face => {
        let td_side = document.createElement('td');
        td_side.appendChild(createBrick(brickId, face));
        tr_side.appendChild(td_side);
      });
      brick_table.appendChild(tr_side);
      // bottom
      let tr_bottom = document.createElement('tr');
      let td_bottom = document.createElement('td');
      td_bottom.colSpan = 4;
      td_bottom.style = 'text-align: center;';
      td_bottom.appendChild(createBrick(brickId, 'bottom'));
      tr_bottom.appendChild(td_bottom);
      brick_table.appendChild(tr_bottom);
    }

    game_div.appendChild(brick_table);

    this.draw = () => {
      for (let bid = 0; bid < this.brickCount; bid++) {
        ['front', 'back', 'left', 'right', 'top', 'bottom'].forEach(face => {
          const el = document.getElementById('brick' + bid + face);
          for (let bid2 = 1; bid2 <= this.brickCount; bid2++) {
            el.classList.remove('face' + bid2);
          }
          el.classList.add('face' + this.game.bricks[bid].facePattern[face]);
        });
      }
      move_div.innerText = 'Move: ' + this.game.getStepFormatted();
    }

    document.getElementById("game").appendChild(game_div);
    this.draw();
  }

  /**
   * 前往設定頁
   */
  gotoSetting() {
    this.clearPage();
    this.displayer.display(Displayer.SELECTING)
    var setting_div = document.createElement("div");
    var brickNumSetting_div = document.createElement("div");
    var brickStyleSetting_div = document.createElement("div");
    var brickNumTXT_div = document.createElement("div");
    var increaseBrickCount_div = document.createElement("button");
    var BrickCount_div = document.createElement("div");
    var decreaseBrickCount_div = document.createElement("button");
    var brickStyleTXT_div = document.createElement("div");
    var brickShow_div = document.createElement("div");
    var gohome_btn = document.createElement("button");

    increaseBrickCount_div.onclick = () => { this.increaseBrickCount(); };
    decreaseBrickCount_div.onclick = () => { this.decreaseBrickCount(); };
    gohome_btn.onclick = () => { this.gotoHome() };

    setting_div.id = "setting";
    brickNumSetting_div.id = "brickNumSetting";
    brickStyleSetting_div.id = "brickStyleSetting";
    brickStyleSetting_div.style = "display: none"; // Temporary
    brickNumTXT_div.id = "brickNumTXT";
    increaseBrickCount_div.id = "increaseBrickCount";
    BrickCount_div.id = "BrickCount";
    decreaseBrickCount_div.id = "decreaseBrickCount";
    brickStyleTXT_div.id = "brickStyleTXT";
    brickShow_div.id = "brickShow";
    gohome_btn.id = "gohome";

    brickNumTXT_div.innerText = "方塊數：";
    brickStyleTXT_div.innerText = "方塊樣式：";
    // increaseBrickCount_div.innerHTML = "+";
    // decreaseBrickCount_div.innerHTML = "-";
    BrickCount_div.innerText = this.brickCount.toString();

    brickNumSetting_div.appendChild(brickNumTXT_div);
    brickNumSetting_div.appendChild(decreaseBrickCount_div);
    brickNumSetting_div.appendChild(BrickCount_div);
    brickNumSetting_div.appendChild(increaseBrickCount_div);
    brickStyleSetting_div.appendChild(brickStyleTXT_div);
    brickStyleSetting_div.appendChild(brickShow_div);
    setting_div.appendChild(brickNumSetting_div);
    setting_div.appendChild(brickStyleSetting_div);

    document.getElementById("game").appendChild(gohome_btn);
    document.getElementById("game").appendChild(setting_div);
  }

  /**
   * 前往成就頁
   */
  gotoAchievement() {
    this.clearPage();
    var achievement_div = document.createElement("div");
    var normal_div = document.createElement("div");
    var special_div = document.createElement("div");
    var hide_div = document.createElement("div");
    var gohome_btn = document.createElement("button");

    gohome_btn.onclick = () => { this.gotoHome() };

    achievement_div.id = "achievement";
    normal_div.id = "normal-area";
    special_div.id = "special-area";
    hide_div.id = "hide-area";
    gohome_btn.id = "gohome";

    achievement_div.appendChild(normal_div);
    achievement_div.appendChild(special_div);
    achievement_div.appendChild(hide_div);

    document.getElementById("game").appendChild(gohome_btn);
    document.getElementById("game").appendChild(achievement_div);

    // TODO

    // Test Script
    var normal_unlocked_div = document.createElement("div");
    var normal_locked_div = document.createElement("div");
    var special_unlocked_div = document.createElement("div");
    var special_locked_div = document.createElement("div");
    var hide_unlocked_div = document.createElement("div");
    // var hide_locked_div = document.createElement("div");

    normal_unlocked_div.innerText = "一般成就 已解鎖";
    normal_locked_div.innerText = "一般成就 未解鎖";
    special_unlocked_div.innerText = "特殊成就 已解鎖";
    special_locked_div.innerText = "特殊成就 未解鎖";
    hide_unlocked_div.innerText = "隱藏成就 已解鎖";
    // hide_locked_div.innerText = "隱藏成就 未解鎖";

    normal_unlocked_div.classList.add("unlocked");
    normal_locked_div.classList.add("locked");
    special_unlocked_div.classList.add("unlocked");
    special_locked_div.classList.add("locked");
    hide_unlocked_div.classList.add("unlocked");
    // hide_locked_div.classList.add("locked");

    document.getElementById("normal-area").appendChild(normal_unlocked_div);
    document.getElementById("normal-area").appendChild(normal_locked_div);
    document.getElementById("special-area").appendChild(special_unlocked_div);
    document.getElementById("special-area").appendChild(special_locked_div);
    document.getElementById("hide-area").appendChild(hide_unlocked_div);
    // document.getElementById("hide-area").appendChild(hide_locked_div);
  }


  // Game page: playing

  /**
   * 暫停遊戲
   */
  pause() {
    this.game.pause();
    document.getElementById('pauseBackgroundPage').style.display = 'block';
  }

  /**
   * 檢查是否通關
   * @todo 應該要顯示結算畫面，尚未完成，暫時直接開始新遊戲
   */
  submit() {
    if (this.game.isResolve()) {
      clearInterval(this.timeInt);
      alert('Mission clear! Starting a new game.');
      this.start(); // Temporary
    } else {
      alert('Not yet');
    }
  }

  // Game page: pause

  /**
   * 繼續遊戲
   */
  continue() {
    this.game.start();
    document.getElementById('pauseBackgroundPage').style.display = 'none';
  }

  /**
   * 重新開始遊戲
   * @todo 應該為同一關卡重新開始，尚未完成
   */
  restart() {
    this.start();
  }

  /**
   * 結束遊戲
   */
  exit() {
    this.gotoHome();
  }

  /**
   * 設定音量
   * @param {number} value
   */
  setVolume(value) {
    document.getElementById("output").innerHTML = value;
  }


  // Setting page

  /**
   * 增加遊戲方塊數，上限為8個
   */
  increaseBrickCount() {
    if (this.brickCount >= 8) {
      alert('上限為8個方塊');
      return;
    }
    this.brickCount++;
    document.getElementById("BrickCount").innerText = this.brickCount.toString();
  }

  /**
   * 減少遊戲方塊數，下限為2個
   */
  decreaseBrickCount() {
    if (this.brickCount <= 2) {
      alert('下限為2個方塊');
      return;
    }
    this.brickCount--;
    document.getElementById("BrickCount").innerText = this.brickCount.toString();
  }

  /**
   * TODO
   * @param {number} textureId - TODO
   */
  setBrickTexture(textureId) {
    // TODO
  }


  // Achievement page

  /**
   * TODO
   * @param {number} achievementId - TODO
   */
  pickupGift(achievementId) {
    // TODO
  }
}

window.App = App;