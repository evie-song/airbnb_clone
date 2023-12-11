class ChatroomsController < ApplicationController
  before_action :set_chatroom, only: %i[show edit update destroy]

  # GET /chatrooms or /chatrooms.json
  def index
    @user = current_user
    @new_maessage = Message.new
  end

  # GET /chatrooms/1 or /chatrooms/1.json
  def show
    chatroom_id = params[:id]
    @selected_chatroom = Chatroom.find(id = chatroom_id)

    render "chatrooms/index"
    # redirect_to "/chatrooms"
  end

  # GET /chatrooms/new
  def new
    @chatroom = Chatroom.new
  end

  # GET /chatrooms/1/edit
  def edit
  end

  def create_new_chatroom
    test = 1
    byebug
  end

  # POST /chatrooms or /chatrooms.json
  def create
    listing_id = params["listing_id"].to_i
    user_id = params["user_id"].to_i
    listing = Listing.find(id = listing_id)
    user = User.find(id = user_id)

    # check if a chatroom already exists.
    existing_registration =
      ChatroomRegistration.joins(:chatroom).where(
        chatrooms: {
          listing_id: listing_id
        },
        user_id: user_id
      )
    # if a chatroom already exist, redirect to the chatroom.
    if existing_registration.any?
      existing_chatroom = existing_registration.first.chatroom
      redirect_to chatroom_url(existing_chatroom)
    else
      # if a chatroxom doesn't exist, create new chatroom record and then redirect to the chatroom.
      @chatroom = Chatroom.new(listing: listing)
      if @chatroom.save
        @chatroom_registration =
          ChatroomRegistration.new(chatroom: @chatroom, user: user)
        if @chatroom_registration.save
          redirect_to chatroom_url(@chatroom),
                      notice: "Chatroom was successfully created."
        end
      else
        render :new, status: :unprocessable_entity
      end
    end

    # byebug
    # @chatroom = Chatroom.new(chatroom_params)

    # respond_to do |format|
    #   if @chatroom.save
    #     format.html do
    #       redirect_to chatroom_url(@chatroom),
    #                   notice: "Chatroom was successfully created."
    #     end
    #     format.json { render :show, status: :created, location: @chatroom }
    #   else
    #     format.html { render :new, status: :unprocessable_entity }
    #     format.json do
    #       render json: @chatroom.errors, status: :unprocessable_entity
    #     end
    #   end
    # end
  end

  def get_details
    respond_to do |format|
      format.json do
        chatroom_id = params[:chatroom_id]
        chatroom = Chatroom.find(id = chatroom_id)
        rendered_string =
          render_to_string(
            partial: "chatrooms/chatroom_details_partial",
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

  def chatrooms_as_host
    @user = current_user
    # @chatrooms = Chatroom.joins(listing: :user).where(users: { id: user_id })

    render "chatrooms/chatrooms_as_host"
  end

  # PATCH/PUT /chatrooms/1 or /chatrooms/1.json
  def update
    respond_to do |format|
      if @chatroom.update(chatroom_params)
        format.html do
          redirect_to chatroom_url(@chatroom),
                      notice: "Chatroom was successfully updated."
        end
        format.json { render :show, status: :ok, location: @chatroom }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json do
          render json: @chatroom.errors, status: :unprocessable_entity
        end
      end
    end
  end

  # DELETE /chatrooms/1 or /chatrooms/1.json
  def destroy
    @chatroom.destroy

    respond_to do |format|
      format.html do
        redirect_to chatrooms_url,
                    notice: "Chatroom was successfully destroyed."
      end
      format.json { head :no_content }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_chatroom
    @chatroom = Chatroom.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def chatroom_params
    params.fetch(:chatroom, {})
  end
end
