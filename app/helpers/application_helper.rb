module ApplicationHelper

  def include_action_js
    script = "#{params[:controller]}/#{params[:action]}"
    script_path = "#{Rails.root}/app/assets/javascripts/#{script}.js"

    if File.exists?(script_path) || File.exists?("#{script_path}.coffee")
      javascript_include_tag script
    end
  end

end
