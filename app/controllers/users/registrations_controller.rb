# frozen_string_literal: true

class Users::RegistrationsController < Devise::RegistrationsController
  before_action :configure_sign_up_params, only: [:create]
  before_action :configure_account_update_params, only: [:update]

  # GET /resource/sign_up
  def new
    # partial =
    #   render_to_string(
    #     template: "users/registrations/new",
    #     formats: [:html],
    #     layout: false,
    #     locals: {
    #       resource: User.new
    #     }
    #   )
    # return render json: { partial: partial }
    respond_to do |format|
      format.html { super }

      format.json do
        partial =
          render_to_string(
            template: "users/registrations/new",
            formats: [:html],
            layout: false,
            locals: {
              resource: User.new
            }
          )
        return render json: { partial: partial }
      end
    end
  end

  # POST /resource
  def create
    new_user = User.new(params[:user].permit!.to_h)
    # byebug

    if new_user.save
      sign_in(new_user)
      return render json: { redirect_url: edit_user_registration_url }
      # redirect_to root_path
    else
      partial =
        render_to_string(
          template: "users/registrations/new",
          formats: [:html],
          layout: false,
          locals: {
            resource: new_user
          }
        )
      return render json: { partial: partial }, status: 400
    end
    # super
  end

  # GET /resource/edit
  def edit
    super
  end

  # PUT /resource
  def update
    # byebug
    super
  end

  # DELETE /resource
  def destroy
    super
  end

  # GET /resource/cancel
  # Forces the session data which is usually expired after sign
  # in to be expired now. This is useful if the user wants to
  # cancel oauth signing in/up in the middle of the process,
  # removing all OAuth session data.
  def cancel
    super
  end

  def change_password
    @user = current_user
    render template: "users/registrations/change_password"
  end

  # protected

  # If you have extra params to permit, append them to the sanitizer.
  def configure_sign_up_params
    devise_parameter_sanitizer.permit(:sign_up, keys: [:attribute])
  end

  # If you have extra params to permit, append them to the sanitizer.
  def configure_account_update_params
    devise_parameter_sanitizer.permit(
      :account_update,
      keys: %i[
        attribute
        first_name
        last_name
        display_name
        email
        phone_number
        about
        avatar
      ]
    )
  end

  # The path used after sign up.
  def after_sign_up_path_for(resource)
    super(resource)
  end

  # The path used after sign up for inactive accounts.
  def after_inactive_sign_up_path_for(resource)
    super(resource)
  end
end
