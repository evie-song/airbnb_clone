import consumer from "channels/consumer"

$(document).ready(function(){
  // if ($("#chatroom-messages")[0] == undefined) {return}

  // const chatroomId = $("#chatroom-messages").data('chatroom_id')
  // consumer.subscriptions.create({ channel: "ChatroomsChannel", id: chatroomId}, {
  //   connected() {
  //     console.log("Connected to the channel:", this);
  //   },
  //   disconnected() {
  //     console.log("Disconnected");
  //   },
  //   received(data) {
  //     const userId = data.user_id
  //     const messageContent = data.content 
  //     const messageTime = new Date(data.created_at) 

  //     const newMessageCard = $(".example-message-card[data-user_id='" + userId +"']").clone()
  //     newMessageCard.removeClass('example-message-card')
  //     newMessageCard.addClass('message-card')
  //     newMessageCard.insertBefore($('.example-message-card')[0])
  //     newMessageCard.find('.message-created-time').text(messageTime)
  //     newMessageCard.find('.message-content').text(messageContent)
  //     console.log(messageTime)
  //     console.log("Received some data:", data);
  //   }
     
  // });  
  if ($(".chatroom-card")[0] == undefined) {return}

  const $chatrooms = $('.chatroom-card')

  $chatrooms.each(function(){
    let $chatroomEle = $(this)
    let $chatroomId = $chatroomEle.data('id')
    consumer.subscriptions.create({ channel: "ChatroomsChannel", id: $chatroomId}, {
      connected() {
        console.log("Connected to the channel for chatroom id:", $chatroomId, this);
      },
      disconnected() {
        console.log("Disconnected");
      },
      received(data) {

        const chatroomId = data.chatroom_id 
        const $chatroomCard = $(".chatroom-card[data-id='" + chatroomId + "']")
        if ($chatroomCard.hasClass('selected')) {
          const userId = data.user_id
          const messageContent = data.content 
          const messageTime = data.created_at 
    
          const newMessageCard = $(".example-message-card[data-user_id='" + userId +"']").clone()
          newMessageCard.removeClass('example-message-card')
          newMessageCard.addClass('message-card')
          newMessageCard.insertBefore($('.example-message-card')[0])
          newMessageCard.find('.message-created-time').text(messageTime)
          newMessageCard.find('.message-content').text(messageContent)
          console.log("Received some data:", data);

          // scroll to the last message
          const $messageContainer = $('.message-wrapper').find('.message-content')
          $('.message-wrapper').find('.message-container').scrollTop($messageContainer.height())
        } else {
          $chatroomCard.addClass('new-message')
        }
      }
  })

  
     
  });  
})
