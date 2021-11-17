//"http://localhost:4000",{}
const socket = io()
const clientsTotal = document.getElementById('clients-total')

const messageContainer = document.getElementById('message-conatiner')
const nameInput = document.getElementById('name-input')
const messageForm = document.getElementById('message-form')
const messageInput = document.getElementById('message-input')

const messageTone=new Audio('/pikachu-cute-voice-message.mp3')

messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    sendMessage();
})
socket.on('clients-total', (data) => {
    clientsTotal.innerText = `Total Clients: ${data}`
})
function sendMessage() {
    if(messageInput==='') return
    const data = {
        name: nameInput.value,
        mesaage: messageInput.value,
        dateTime: new Date()
    }
    socket.emit('message', data)
    addMessageToUI(true,data)
    messageInput.value=''

}

socket.on('chat-message', (data) => {
    messageTone.play()
    addMessageToUI(false,data)
})

function addMessageToUI(isOwnMessage, data) {
    clearFeedBack()
    const element = ` <li class="${isOwnMessage?"message-right":"message-left"}">
                        <p class="message">
                          ${data.mesaage}<span>${data.name} * ${moment(data.dateTime).fromNow()}</span>
                        </p>
                    </li>`
    messageContainer.innerHTML+=element;
    scrollToBottom();

}
function scrollToBottom(){
    messageContainer.scrollTo(0,messageContainer.scrollHeight)
}
messageInput,addEventListener('focus',(e)=>{
    socket.emit('feedback',{
        feedback:`${nameInput.value} is typing Message`
    })

})
messageInput,addEventListener('keypress',(e)=>{
    socket.emit('feedback',{
        feedback:`${nameInput.value} is typing`
    })
})
messageInput,addEventListener('blur',(e)=>{
    socket.emit('feedback',{
        feedback:''
    })
})
socket.on('feedback',(data)=>{
    clearFeedBack();
    const element=` <li class="message-feedback">
    <p class="feedback" id="feedback">
       ${data.feedback}
    </p>
</li>`
messageContainer.innerHTML+=element
})

function clearFeedBack(){
    document.querySelectorAll('li.message-feedback').forEach(element=>{
        element.parentNode.removeChild(element)
    })
}