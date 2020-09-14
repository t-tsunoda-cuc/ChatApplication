/* eslint-disable */

// グローバル変数
let beforeDay
const loginUser = sessionStorage.getItem('loginUser')

// クライアントからサーバーへの接続要求
const socket = io.connect()

// 読み込み時の処理
window.onload = function() {
  getData('http://chatapp-env.eba-gk36pmgm.ap-northeast-1.elasticbeanstalk.com/api/chatMessages',)
    .then(data => {
      for(let i=0; i<data.length; i++){
        const time = new Date(data[i].message_time)
        if(data[i].user === null){
          const userNull = '不明'
          const defaltIcon = 'https://cdn.aprico-media.com/production/imgs/images/000/008/511/original.jpg?1505866639'
          commentAdd(data[i].message_text,userNull,defaltIcon,time,data[i]._id)
        }else{
          commentAdd(data[i].message_text, data[i].user.user_name, data[i].user.user_icon,time,data[i]._id)
        }
      }
    })
  
  getData('http://chatapp-env.eba-gk36pmgm.ap-northeast-1.elasticbeanstalk.com/api/users',)
    .then(data => {
      for(let i=0; i<data.length; i++){
        displayUserList(data[i].user_name,data[i].user_icon,data[i].user_isTeacher,data[i]._id)
        // ログインユーザー情報
        if(loginUser === data[i]._id){
          document.getElementById('login_user').innerHTML = data[i].user_name
          document.getElementById('login_icon').src = data[i].user_icon
        }
      }
    }) 
}

// 接続時の処理
socket.on('connect', () => {
  console.log('connect')
})

// Sendボタンを押した処理
const send = document.getElementById('send')
send.addEventListener('click',() => {
  sendMessage()
  scrollBottom()
})

// Enterキーで送信処理
document.body.addEventListener('keydown', event => {
  if(event.key === 'Enter' && event.ctrlKey){
    sendMessage()
  }
})

// メッセージ拡散時の処理
socket.on('spread message',chatId => {
  getData(`http://chatapp-env.eba-gk36pmgm.ap-northeast-1.elasticbeanstalk.com/api/chatMessages/${chatId}`,).then(data => {
    const createTime = new Date(data.message_time)
    commentAdd(data.message_text, data.user.user_name, data.user.user_icon, createTime, data._id)
  })
})
// メッセージ削除拡散時の処理
socket.on('delete chat',chatId => {
  const selectChat = document.getElementById(chatId)
  if(selectChat=== null){
    location.reload()
  }
  deleteData(`http://chatapp-env.eba-gk36pmgm.ap-northeast-1.elasticbeanstalk.com/api/chatMessages/${chatId}`,)
    .then(() => {
      selectChat.remove()
    })
})

// 新規ユーザー受信時
socket.on('new user',_id => {
  console.log(`${_id}`)
  getData(`http://chatapp-env.eba-gk36pmgm.ap-northeast-1.elasticbeanstalk.com/api/users/${_id}`,).then(data => {
    displayUserList(data.user_name,data.user_icon,data.user_isTeacher,data._id)
  })
})
// ユーザー削除拡散時の処理
socket.on('delete user',_id => {
  const selectUser = document.getElementById(_id)
  deleteData(`http://chatapp-env.eba-gk36pmgm.ap-northeast-1.elasticbeanstalk.com/api/users/${_id}`,)
    .then(() => {
      selectUser.remove()
    })
})

// チャット送信関数(post処理込み)
async function sendMessage(){
  const input_text = document.getElementById('input-message')
  const msg = input_text.value

  if(msg.length !== 0){
    getData('http://chatapp-env.eba-gk36pmgm.ap-northeast-1.elasticbeanstalk.com/api/users',).then(data => {
      for(let i = 0; i < data.length; i++) {
        if(loginUser === data[i]._id){
          postData('http://chatapp-env.eba-gk36pmgm.ap-northeast-1.elasticbeanstalk.com/api/chatMessages', {
            user: data[i]._id,
            message_text: msg
          }).then(data => {
            socket.emit('new message',data._id)
            input_text.value = ''
            textAreaHeightSet()
          })
        }
      }
    })
  }
}

// チャット追加関数
async function commentAdd(Msg,userName,userIcon,time,id){
  // 送信日時の取得
  const strday = DateFormat(new Date(time),'YYYY年MM月DD日')
  const strtime = DateFormat(new Date(time),'HH:mm')
  const stryoubi = new Date(time).getDay()
  const youbi = [ '日', '月', '火', '水', '木', '金', '土' ][stryoubi]

  // コメント作成
  if(strday !== beforeDay){
    const createDay = '<div class="date-container">'
            + '<hr class="date-line"></hr>'
            + '<div class="date-box">'
            + '<div class="date">' + strday + '(' + youbi + ')</div>'
            + '</div>'
            + '</div>'
    document.getElementById('comment-main').insertAdjacentHTML('beforeend',createDay)
    beforeDay = strday
  }
  const createComment = '<div id="' + id + '" class="comment-block">'
          + '<div class="comment-user">'
          + '<img class="user-icon" src=' + userIcon + ' alt="写真 ">'
          + '<div class="user-name">' + userName + '</div>'
          + '<div class="comment-time">  ' + strtime + '</div>'
          + '<button onclick="DeleteConfirmeChat(event)" class="chatDelete" id="chatDelete" value=' + id + '>×</button>'
          + '</div>'
          + '<div class="comment-box">'
          + '<div class="comment">' + Msg + '</div>'
          + '</div>'
          + '</div>'
  document.getElementById('comment-main').insertAdjacentHTML('beforeend',createComment)
  scrollBottom()
}

// チャット削除機能
function chatDelete(e){
  // const chatHtmlId = e.target.value
  // const deleteChatElement = document.getElementById(chatHtmlId)
  // console.log(deleteChatElement)
  // socket.emit('delete chat', deleteChatElement)
  const chatHtmlId = e.target.value
  socket.emit('delete chat', chatHtmlId)
  document.getElementById('chat_delete_screen').classList.toggle('openDeleteChat')
}
// ユーザー削除機能
function userDelete(){
  const _id = document.getElementById('delete_user').value
  socket.emit('delete user',_id)
  document.getElementById('user_delete_screen').classList.toggle('openDeleteUser')
}

// Date format関数
function DateFormat(date, format) {
  format = format.replace(/YYYY/, date.getFullYear())
  format = format.replace(/MM/, ('0' + (date.getMonth() + 1)).slice(-2))
  format = format.replace(/DD/, ('0' + date.getDate()).slice(-2))
  format = format.replace(/HH/,date.getHours())
  format = format.replace(/mm/,('0' + date.getMinutes()).slice(-2))
  return format
}
// テキストエリア行調整
function textAreaHeightSet(){
  const input_text = document.getElementById('input-message')
  // 一旦テキストエリアを小さくしてスクロールバー（縦の長さを取得）
  input_text.style.height = '1px'
  var wSclollHeight = parseInt(input_text.scrollHeight)

  // テキストエリアの高さを設定する
  input_text.style.height = wSclollHeight + 'px'
}

// ユーザー追加関数
function userAdd() {
  const input_user = document.getElementById('input_user')
  const newUser = input_user.value
  const input_category = document.getElementById('user_category').value
  let isTeacher
  if(input_category === 'teacher'){
    isTeacher = true
  }else{
    isTeacher = false
  }
  if(newUser.length !== 0){
    postData('http://chatapp-env.eba-gk36pmgm.ap-northeast-1.elasticbeanstalk.com/api/users', {
      user_name: newUser ,
      user_icon: 'https://cdn.aprico-media.com/production/imgs/images/000/008/511/original.jpg?1505866639',
      user_isTeacher: isTeacher
    }).then(data => {
      socket.emit('new user',data._id)
      input_user.value = ''
      document.getElementById('user_add_screen').classList.toggle('open')
    })
    
  }
}
// ユーザー表示関数
async function displayUserList(userName,userIcon,isTeacher,id){
  if(isTeacher === true){
    const createTeacher = '<div id="' + id + '" class="user">'
            + '<img class="user-icon" src=' + userIcon +' alt="写真">'
            + '<div id="user_name" class="user-name">' + userName + '</div>'
            + '<button onclick="DeleteConfirmeUser(event)" class="userDelete" id="userDelete" value=' + id + '>×</button>'
            + '</div>'
    document.getElementById('teacher_container').insertAdjacentHTML('beforeend',createTeacher)
  }else{
    const createStudent = '<div id="' + id + '" class="user">'
            + '<img class="user-icon" src=' + userIcon +' alt="写真">'
            + '<div id="user_name" class="user-name">' + userName + '</div>'
            + '<button onclick="DeleteConfirmeUser(event)" class="userDelete" id="userDelete" value=' + id + '>×</button>'
            + '</div>'
    document.getElementById('user_add').insertAdjacentHTML('beforebegin',createStudent)
  }

}

//チャット自動スクロール ※commentAdd内で使用
function scrollBottom(){
  const element = document.getElementById('comment-main')
  const scrollHeight = element.scrollHeight
  const y = element.scrollHeight - element.clientHeight
  element.scroll(0,y)

  // なぜ使えないか不明
  // element.scrollIntoView(false);
}

// ドロップダウンメニュー開閉
function myFunction() {
  document.getElementById('myDropdown').classList.toggle('show')
}
// ドロップダウンメニュー画面外処理
window.onclick = function(event) {
  if (!event.target.matches('.dropdown-icon')) {
    var dropdowns = document.getElementsByClassName('dropdown-container')
    var i
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i]
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show')
      }
    }
  }
}

// Menu開閉処理
function MenuSwitch() {
  const input_user = document.getElementById('input_user')
  input_user.value = ''
  document.getElementById('user_add_screen').classList.toggle('open')
}
//Menu外選択時処理
window.onclick = function(event) {
  if (event.target.matches('.user_add_screen')) {
    var addscreen = document.getElementsByClassName('user_add_screen')
    var i
    for (i = 0; i < addscreen.length; i++) {
      var open = addscreen[i]
      if (open.classList.contains('open')) {
        const input_user = document.getElementById('input_user')
        input_user.value = ''
        open.classList.remove('open')
      }
    }
  }
}

// ユーザー削除確認画面開閉処理
function DeleteConfirmeUser(e) {
  if(e){
    console.log(e.target.value)
    getData(`http://chatapp-env.eba-gk36pmgm.ap-northeast-1.elasticbeanstalk.com/api/users/${e.target.value}`,).then(data => {
      document.getElementById('user_delete_screen').classList.toggle('openDeleteUser')
      document.getElementById('delete_user').value = data._id
      document.getElementById('delete_user').innerHTML = data.user_name
      document.getElementById('delete_user_icon').src = data.user_icon
      
    })
  }else{
    document.getElementById('delete_user').innerHTML = ""
    document.getElementById('delete_user_icon').src = ""
    document.getElementById('user_delete_screen').classList.toggle('openDeleteUser')
  }
}
//削除確認画面外選択時処理
window.onclick = function(event) {
  if (event.target.matches('.user_delete_screen')) {
    var deletescreen = document.getElementsByClassName('user_delete_screen')
    var i
    for (i = 0; i < deletescreen.length; i++) {
      var open = deletescreen[i]
      if (open.classList.contains('openDeleteUser')) {
        open.classList.remove('openDeleteUser')
      }
    }
  }
}

// チャット削除確認画面開閉処理
function DeleteConfirmeChat(e) {
  if(e){
    getData(`http://chatapp-env.eba-gk36pmgm.ap-northeast-1.elasticbeanstalk.com/api/chatMessages/${e.target.value}`,).then(data => {
      document.getElementById('chat_delete_screen').classList.toggle('openDeleteChat')
      document.getElementById('deleteChat').value = data._id
    })
  }else{
    document.getElementById('chat_delete_screen').classList.toggle('openDeleteChat')
  }
}
//削除確認画面外選択時処理
window.onclick = function(event) {
  if (event.target.matches('.chat_delete_screen')) {
    let deletescreen = document.getElementsByClassName('chat_delete_screen')
    let i
    for (i = 0; i < deletescreen.length; i++) {
      const open = deletescreen[i]
      if (open.classList.contains('openDeleteChat')) {
        open.classList.remove('openDeleteChat')
      }
    }
  }
}


