class CharacterController < ApplicationController
	#helper_method :select_my_char
	def index
		@chars=Character.all
	end

	def create_new_characters
		@newchar=Character.new
		@newchar.character_name="superman"
		@newchar.character_image=image_path("superman.jpg")
		@newchar.health=10
		@newchar.life=3
		@newchar.is_powerup=false
		@newchar.is_enemy=false		
		@newchar.save

		newchar=Character.create(character_name:"spiderman",character_image:"spiderman.jpg",health: 10,life: 3,is_powerup: false, is_enemy: false)
		
	end

	def game
		
	end

	def edit
	end

	def update

	end

	def destroy
	end


end
