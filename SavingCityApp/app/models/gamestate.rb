class Gamestate < ActiveRecord::Base
  belongs_to :users
  belongs_to :character
end
