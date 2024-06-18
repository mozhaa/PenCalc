class CreateUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :users do |t|
      t.string :username, null: false
      t.string :password_digest
      t.integer :role

      t.timestamps
    end

    add_index :users, :username, unique: true
  end
end
