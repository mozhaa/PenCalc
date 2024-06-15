class Mod < ApplicationRecord
  belongs_to :author_user, class_name: "User"
end
