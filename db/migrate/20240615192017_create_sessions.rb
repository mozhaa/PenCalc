class CreateSessions < ActiveRecord::Migration[7.1]
  def change
    create_table :sessions do |t|
      t.string :token, null: false
      t.references :user, null: false, foreign_key: { to_table: :users }

      t.timestamps
    end

    add_index :sessions, :token, unique: true
  end
end
