# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20151104092612) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "characters", force: :cascade do |t|
    t.string   "character_name"
    t.string   "character_image"
    t.integer  "health"
    t.integer  "life"
    t.boolean  "is_powerup"
    t.integer  "max_allowed"
    t.boolean  "is_enemy"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
  end

  create_table "gamestates", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "users_id"
    t.integer  "score_last"
    t.integer  "score_high"
    t.integer  "number_kills"
    t.boolean  "is_playing"
    t.boolean  "is_loggedin"
    t.integer  "character_id"
    t.integer  "characters_id"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
  end

  add_index "gamestates", ["characters_id"], name: "index_gamestates_on_characters_id", using: :btree
  add_index "gamestates", ["users_id"], name: "index_gamestates_on_users_id", using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "name"
    t.string   "email"
    t.datetime "created_at",                        null: false
    t.datetime "updated_at",                        null: false
    t.string   "password_digest"
    t.string   "remember_digest"
    t.boolean  "admin",             default: false
    t.string   "activation_digest"
    t.boolean  "activated",         default: false
    t.datetime "activated_at"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree

  add_foreign_key "gamestates", "characters"
  add_foreign_key "gamestates", "users"
end
