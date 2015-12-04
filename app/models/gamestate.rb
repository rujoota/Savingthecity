class Gamestate < ActiveRecord::Base
  belongs_to :user
  belongs_to :character
end
