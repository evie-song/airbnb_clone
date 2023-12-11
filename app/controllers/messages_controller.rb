class MessagesController < ApplicationController
  before_action :set_message, only: %i[show edit update destroy]

  # GET /messages or /messages.json
  def index
    respond_to do |format|
      format.html do
        @messages = Message.all
        @user = current_user
        @new_maessage = Message.new
      end

      format.json do
        chatroom_id = params[:chatroom_id]
        chatroom = Chatroom.find(chatroom_id)
        rendered_string =
          render_to_string(
            template: "messages/index",
            formats: [:html],
            layout: false,
            locals: {
              chatroom: chatroom
            }
          )
        return render json: { partial: rendered_string }
      end
    end
  end

  # GET /messages/1 or /messages/1.json
  def show
  end

  # GET /messages/new
  def new
    @message = Message.new
  end

  # GET /messages/1/edit
  def edit
  end

  # POST /messages or /messages.json
  def create
    @message = Message.new(message_params)
    if @message.save
      @chatroom = @message.chatroom
      ChatroomsChannel.broadcast_to(@chatroom, @message.message_data)

      render json: { success: true, message_id: @message.id }
    else
      render json: @message.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /messages/1 or /messages/1.json
  def update
    respond_to do |format|
      if @message.update(message_params)
        format.html do
          redirect_to message_url(@message),
                      notice: "Message was successfully updated."
        end
        format.json { render :show, status: :ok, location: @message }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json do
          render json: @message.errors, status: :unprocessable_entity
        end
      end
    end
  end

  # DELETE /messages/1 or /messages/1.json
  def destroy
    @message.destroy

    respond_to do |format|
      format.html do
        redirect_to messages_url, notice: "Message was successfully destroyed."
      end
      format.json { head :no_content }
    end
  end

  def messages_as_host
    respond_to do |format|
      format.json do
        chatroom_id = params[:chatroom_id]
        chatroom = Chatroom.find(id = chatroom_id)
        rendered_string =
          render_to_string(
            partial: "messages/messages_as_host_partial",
            format: [:html],
            layout: false,
            locals: {
              chatroom: chatroom
            }
          )
        return render json: { partial: rendered_string }
      end
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_message
    @message = Message.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def message_params
    # params.fetch(:message, {})
    params.require(:message).permit(:chatroom_id, :content, :user_id)
  end
end
