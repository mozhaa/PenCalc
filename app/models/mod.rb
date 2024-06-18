class Mod < ApplicationRecord
  validates :name, presence: true

  belongs_to :author_user, class_name: "User", optional: true
end
