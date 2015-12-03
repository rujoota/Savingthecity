class CreateCharacters < ActiveRecord::Migration
  def change
    create_table :characters do |t|
      t.string :character_name
      t.string :character_image
      t.integer :health
      t.integer :life
      t.boolean :is_powerup
      t.integer :max_allowed
      t.boolean :is_enemy
      t.timestamps null: false
    end
  end
end
