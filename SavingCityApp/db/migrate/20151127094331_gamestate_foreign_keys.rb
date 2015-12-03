class GamestateForeignKeys < ActiveRecord::Migration
  def change
    add_column :gamestates, :user_id, :integer
    add_column :gamestates, :character_id, :integer
    add_foreign_key :gamestates, :users, column: :user_id
    add_foreign_key :gamestates, :characters, column: :character_id
  end
end
