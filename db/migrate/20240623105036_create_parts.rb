class CreateParts < ActiveRecord::Migration[7.1]
  def change
    create_table :parts do |t|
      t.string :name, null: false
      t.float :mass, null: false
      t.float :width, null: false
      t.string :color, null: false
      t.boolean :verified, null: false

      t.timestamps
    end
  end
end
