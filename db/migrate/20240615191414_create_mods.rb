class CreateMods < ActiveRecord::Migration[7.1]
  def change
    create_table :mods do |t|
      t.string :name, null: false
      t.references :author_user, null: false, foreign_key: { to_table: :users }

      t.timestamps
    end
  end
end
