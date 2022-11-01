# frozen_string_literal: true

class Users::SessionsController < Devise::SessionsController
  before_action :configure_sign_in_params, only: [:create]

  # GET /resource/sign_in
  def new
    partial =
      render_to_string(
        template: "users/sessions/new",
        formats: [:html],
        layout: false,
        locals: {
          resource: User.new
        }
      )
    return render json: { partial: partial }

    # respond_to do |format|
    #   format.html { return render "users/sessions/new", layout: false }

    #   format.json do
    #     partial =
    #       render_to_string(
    #         template: "users/sessions/new",
    #         formats: [:html],
    #         layout: false,
    #         locals: {
    #           resource: User.new
    #         }
    #       )
    #     return render json: { partial: partial }
    #   end
    # end
  end

  # POST /resource/sign_in
  def create
    # check if user exists with email
    # check if password matches
    # if it does, set success flash, sign in the user and redirect
    # if it doesn't, set the failure flash and redirect to the new route

    # byebug
    self.resource = warden.authenticate!(auth_options)
    set_flash_message!(:notice, :signed_in)
    sign_in(resource_name, resource)
    yield resource if block_given?
    respond_with resource, location: after_sign_in_path_for(resource)
  end

  # DELETE /resource/sign_out
  def destroy
    super
  end

  def trips
    @user = current_user
    render template: "users/sessions/trips"
  end

  def hosting_page
    @user = current_user
    render template: "users/sessions/hosting_page"
  end

  protected

  # If you have extra params to permit, append them to the sanitizer.
  def configure_sign_in_params
    devise_parameter_sanitizer.permit(:sign_in, keys: [:attribute])
  end
end
