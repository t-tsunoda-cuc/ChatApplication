/* eslint-disable */

// 読み込み時の処理
window.onload = function() {
  getData(`http://chatapp-env.eba-gk36pmgm.ap-northeast-1.elasticbeanstalk.com/api/users`,)
      .then(data => {
        for(let i=0; i<data.length; i++){
          setUser(data[i]._id,data[i].user_name)
        }
      })
  }

// ログインボタン押下時
const login = document.getElementById('login')
login.addEventListener('click',() => {
    const selectedUser = document.getElementById('select_user').value
    getData(`http://chatapp-env.eba-gk36pmgm.ap-northeast-1.elasticbeanstalk.com/api/users`,)
      .then(data => {
        for(let i=0; i<data.length; i++){
          if(data[i]._id === selectedUser){

            sessionStorage.setItem('loginUser',selectedUser)
            document.location.href = "chat.html"
          }
        }
    })
})


// ユーザーリスト追加
async function setUser(userId,userName){
    const selectuser = '<option value="' + userId + '">' + userName + '</option>'
    document.getElementById('select_user').insertAdjacentHTML('beforeend',selectuser)
}