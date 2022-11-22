import consumer from "channels/consumer"

$(document).ready(function(){
  if ($("#chatroom-messages")[0] == undefined) {return}

  const chatroomId = $("#chatroom-messages").data('chatroom_id')
  consumer.subscriptions.create({ channel: "ChatroomsChannel", id: chatroomId}, {
    connected() {
      console.log("Connected to the channel:", this);
    },
    disconnected() {
      console.log("Disconnected");
    },
    received(data) {
      console.log("Received some data:", data);
    }
     
  });  
})
