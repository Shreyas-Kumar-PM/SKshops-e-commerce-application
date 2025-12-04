# backend/db/seeds.rb

puts "Clearing old data..."

# Delete in dependency order to avoid foreign key errors
OrderItem.destroy_all if defined?(OrderItem)
Order.destroy_all     if defined?(Order)
CartItem.destroy_all  if defined?(CartItem)

Product.destroy_all

puts "Seeding products..."

products = [
  # ---------- Jerseys ----------
  {
    name: "Home Jersey 2024",
    brand: "Nike",
    category: "jerseys",
    price: 3499,
    image_url: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTOkIxKlWRTsybA1jKbhtzjv7FGZSu42u0VxaWEWOgbkgPNUvevG_bZvAox0FOfEuxfS6UqZJN4V0aHOxjeK_MLm6CJr1wqcaNtig0mq6x5",
    description: "Lightweight match jersey with breathable fabric and modern fit."
  },
  {
    name: "Away Jersey 2024",
    brand: "Adidas",
    category: "jerseys",
    price: 3299,
    image_url: "https://assets.adidas.com/images/w_600,f_auto,q_auto/588311e46186457b81db1df5428c285e_faec/Arsenal_24-25_Away_Jersey_Black_IT6148_dbHM1.tiff.jpg",
    description: "Moisture-wicking away jersey designed for comfort in all conditions."
  },
  {
    name: "Retro Classic Jersey",
    brand: "Puma",
    category: "jerseys",
    price: 2899,
    image_url: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/782753/02/mod01/fnd/IND/fmt/png/PUMA-x-KIDSUPER-BVB-Men's-Long-Sleeve-Retro-Football-Jersey",
    description: "Vintage-style jersey inspired by classic club kits from the 90s."
  },
  {
    name: "Training Jersey Pro",
    brand: "Nike",
    category: "jerseys",
    price: 2599,
    image_url: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTgYrdszaK-41jBhc5t_fC9GlPGpgNAyH8u9TKLCtr1VCzxVejQW5vJm8ehY5_3EMCTB9OC0c6sKwydx3OTP1iKW4MOWK6AfmQpzS2kj1nMKFbl_icUB3mC",
    description: "Slim-fit training top with mesh panels for extra ventilation."
  },

  # ---------- Shoes ----------
  {
    name: "Speed Runner",
    brand: "Adidas",
    category: "shoes",
    price: 5999,
    image_url: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQSLl139rFVBWjJYQUodnnzzjfskygFLQS95jIcZgkKIapWnUe0UjHD0aXr7Rhg4-r24Iu0sXuG7Lk6GijzW1w0ns-UIJNNystR5HQC417AA5Spb4L46yolWw",
    description: "High-performance running shoes with cushioned sole and heel support."
  },
  {
    name: "Court Master",
    brand: "Nike",
    category: "shoes",
    price: 5499,
    image_url: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRjEBlPPh4WizQrHINURQTj9N1h24yFWGm-R6RnE7Cb5ROiu1AqrtlRhpUTbllXd_6ssgoAVtarbA6d4z1_Dxt60_RwUsLo0Sq7TZi4zbjIz-RZJUg8g9gaQg",
    description: "Versatile court shoes with grippy outsole for indoor and outdoor use."
  },
  {
    name: "Street Glide",
    brand: "Puma",
    category: "shoes",
    price: 4799,
    image_url: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTfArTRZDmKA2pvtkHb2_gr-Qn_fsh5ik0brsUdtCwqEUk0d2rGW-tCDWjJ144GLGd0kZ-_Z4uj4bNrX4d-aQUJRs9fZ__3wrC6dCvge02CoY5v49EOQnISxg",
    description: "Everyday sneakers with minimalist design and soft foam insole."
  },
  {
    name: "Trail Pro X",
    brand: "Adidas",
    category: "shoes",
    price: 6399,
    image_url: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQvUTj88jcqwoDbNdxB253cb-H1o1d_2xt9_oXmGCbVnUX1pxHw_pmP7QfhbfgnL-V0Vh9T6ZvI_FzaCexTlovmNYcbL5I6q1ht5C9SwOMUq2BglhbnVcdH",
    description: "Durable trail-running shoes with aggressive lugs for off-road grip."
  },

  # ---------- Watches ----------
  {
    name: "Classic Steel Watch",
    brand: "Casio",
    category: "watches",
    price: 4299,
    image_url: "https://www.casio.com/content/dam/casio/product-info/locales/in/en/timepiece/product/watch/A/AQ/AQ2/aq-240e-7a/assets/AQ-240E-7A.png.transform/product-panel/image.png",
    description: "Stainless-steel analog watch with water resistance and date display."
  },
  {
    name: "Sport Chrono",
    brand: "Casio",
    category: "watches",
    price: 3899,
    image_url: "https://www.casio.com/content/dam/casio/product-info/locales/in/en/timepiece/product/watch/A/AE/AE1/ae-1200whl-5av/assets/AE-1200WHL-5AV.png.transform/main-visual-sp/image.png",
    description: "Sporty chronograph watch with stopwatch and backlit display."
  },
  {
    name: "Urban Minimal",
    brand: "Fossil",
    category: "watches",
    price: 5199,
    image_url: "https://www.fossil.com/on/demandware.static/-/Library-Sites-FossilSharedLibrary/default/dw294e3664/2025/HO25/set_10272025_global_holiday_lp/watches/Watches_LP_carousel_Style_Mens_classic.jpg",
    description: "Clean, modern watch with leather strap and slim stainless case."
  },
  {
    name: "SmartFit Band",
    brand: "Apple",
    category: "watches",
    price: 7999,
    image_url: "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/watch-compare-s11-202509_FMT_WHH?wid=296&hei=296&fmt=jpeg&qlt=90&.v=dWNxM2FBcWh6K3lqd1ZDZ0J0SmQzLzRxZ3huVnJIT2RsYmVuZmY3VmJyWVVRZEpaT1dTYTRVRGJYVlZ5a1RjamJGcXNRQnFCV0w3WVRjTExvdm1ic2Zod2h2SXJqUWFnZjgyKzVoUEVRcndXZEdHNUFPR0hYUU12cjI0VlFzM1A",
    description: "Fitness-focused smart band with heart-rate tracking and notifications."
  }
]

products.each do |attrs|
  Product.create!(attrs)
end

puts "Seeded #{Product.count} products."
