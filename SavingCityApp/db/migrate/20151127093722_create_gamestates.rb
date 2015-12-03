class CreateGamestates < ActiveRecord::Migration
  def change
    create_table :gamestates do |t|
      #t.references :users, index: true, foreign_key: true
      t.integer :score_last
      t.integer :score_high
      t.integer :number_kills
      t.boolean :is_playing
      t.boolean :is_loggedin
      #t.references :characters, index: true, foreign_key: true
      t.timestamps null: false
    end
  end
end
