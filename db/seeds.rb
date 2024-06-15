# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# User.destroy_all
# Mod.destroy_all
# Session.destroy_all

# User.create!(
#   username: "Anonymous",
#   role: 0,
#   password_hash: "123",
#   password_salt: "123",
#   registration_date: 1.days.ago
# )

# User.create!(
#   username: "mozhayka",
#   role: 2,
#   password_hash: "123",
#   password_salt: "123",
#   registration_date: 1.days.ago
# )

# Mod.create!(
#   name: "Ajisai SC",
#   json_path: "",
#   verified: true,
#   author_id: 1
# )