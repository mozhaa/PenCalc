class CreateMods < ActiveRecord::Migration[7.1]
  def change
    create_table :mods do |t|
      t.string :name
      t.string :json_path
      t.boolean :verified
      t.references :author, null: false, index: true, foreign_key: {to_table: :users}

      t.timestamps
    end
  end
end
