class CreateSessions < ActiveRecord::Migration[7.1]
  def change
    create_table :sessions do |t|
      t.string :token
      t.references :user, null: false, index: true, foreign_key: {to_table: :users}

      t.timestamps
    end
  end
end
