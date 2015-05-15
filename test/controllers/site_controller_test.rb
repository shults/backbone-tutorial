require 'test_helper'

class SiteControllerTest < ActionController::TestCase
  test "should get dupa" do
    get :dupa
    assert_response :success
  end

end
