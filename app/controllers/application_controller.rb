class ApplicationController < ActionController::Base
	def javascript_exists?
	  script = "#{Rails.root}/app/assets/javascripts/#{params[:controller]}/#{params[:action]}}.js"
	  File.exists?(script) || File.exists?("#{script}.coffee") 
	end

  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  def include_action_javascript 
  	script = "#{params[:controller]}/#{params[:action]}"
  	script_path = "#{Rails.root}/app/assets/javascripts/#{script}.js"

  	if File.exists?(script_path) || File.exists?("#{script_path}.coffee")
  		javascript_include_tag script
  	end
  end

 #  def javascript_exists?(script)
	#   script = "#{Rails.root}/app/assets/javascripts/#{params[:controller]}/#{params[:action]}}.js"
	#   File.exists?(script) || File.exists?("#{script}.coffee") 
	# end

end