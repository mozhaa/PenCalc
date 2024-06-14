class CreateUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :users do |t|
      t.string :username
      t.integer :role
      t.string :password_hash
      t.string :password_salt
      t.datetime :registration_date

      t.timestamps
    end
  end
end
