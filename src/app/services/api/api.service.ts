import { Injectable } from '@angular/core';
import { Banner } from 'src/app/interfaces/banner.interface';
import { Category } from 'src/app/interfaces/category.interface';
import { Chat } from 'src/app/interfaces/chat.interface';
import { Coupon } from 'src/app/interfaces/coupon.interface';
import { Item } from 'src/app/interfaces/item.interface';
import { Chef } from 'src/app/interfaces/chef.interface';
import { Address } from 'src/app/models/address.model';
import { Order } from 'src/app/models/order.model';
import { User } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  radius = 20;// in km
  deliveryCharge = 20; 
  
  // Function that returns a Promise with a delayed response
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Function using async/await to delay the response
  async delayedResponse(delayTime) {
    await this.delay(delayTime);
    return 'Response after ' + delayTime + ' milliseconds';
  }

  getRadius() {
    return this.radius;
  }

  getDeliveryCharge() {
    // calculate using your certain parameters
    return this.deliveryCharge;
  }

  users: User[] = [
    new User('nykz786@gmail.com', '9101000000', 'Nikhil Agarwal', '1', 'user', 'active'),
    new User('technyks@gmail.com', '9101000001', 'Technyks', '2', 'user', 'active'),
    new User('codingtechnyks@gmail.com', '9101000002', 'Coding Technyks', '3', 'user', 'active'),
    new User('abc@gmail.com', '9101000003', 'Ravi S', '4', 'rider', 'active', null, 'DL05DL4321', 28.633255, 77.219487, 'active'),
    new User('xyz@gmail.com', '9101000004', 'Xavier', '5', 'rider', 'active', null, 'DL05DL3322', 28.633255, 77.219487, 'active'),
  ];

  banners: Banner[] = [
    { id: '1', banner: 'assets/banners/1.jpg', active: true, chef_id: '1' },
    { id: '2', banner: 'assets/banners/2.jpg', active: true },
    { id: '3', banner: 'assets/banners/3.jpg', active: true },
  ];

  allChefs: Chef[] = [
    {
      id: '1',
      cover: 'assets/chefs/1.jpg',
      name: 'Stayfit Kitchen',
      cuisines: ['Indian', 'Italian', 'Mexican'],
      rating: 5,
      delivery_time: 25,
      distance: 2.5,
      price: 100,
      latitude: 28.633255,
      longitude: 77.219487,
      address: 'M-Block, Connaught Place, New Delhi, India',
    },
    {
      id: '2',
      cover: 'assets/chefs/2.jpg',
      name: 'Healthy Bites',
      cuisines: ['Italian', 'Mexican', 'Chinese'],
      rating: 5,
      delivery_time: 25,
      distance: 2.5,
      price: 100,
      latitude: 12.975032,
      longitude: 77.601442,
      address: 'MG Road, Bangalore, India',
    },
    {
      id: '3',
      cover: 'assets/chefs/3.jpg',
      name: 'Kolkata Roll Corner',
      cuisines: ['Bengali', 'Continental'],
      rating: 5,
      delivery_time: 25,
      distance: 2.5,
      price: 100,
      latitude: 22.556437,
      longitude: 88.353179,
      address: 'Elliot Road, Kolkata, India'
    },
    {
      id: '6',
      cover: 'assets/chefs/3.jpg',
      name: 'Kolkata Roll',
      cuisines: ['Bengali', 'Continental'],
      rating: 5,
      delivery_time: 25,
      distance: 2.5,
      price: 100,
      latitude: 28.6541846,
      longitude: 77.2222642,
      address: 'Kashmiri Gate, Near, Lothian Rd, Inter State Bus Terminal, Mori Gate, New Delhi, Delhi, 110006, India'
    },
    {
      id: '4',
      cover: 'assets/chefs/spiceofindia.png',
      name: 'Spice of India',
      cuisines: ['Indian', 'Chinese'],
      rating: 4.8,
      delivery_time: 30,
      distance: 3.2,
      price: 120,
      latitude: 28.652982,
      longitude: 77.193031,
      address: 'Pusa Road, New Delhi, India',
    },
    {
      id: '5',
      cover: 'assets/chefs/pizza.jpg',
      name: 'Pizza Hub',
      cuisines: ['Italian', 'Indian', 'Spanish'],
      rating: 4.6,
      delivery_time: 20,
      distance: 1.8,
      price: 150,
      latitude: 28.653237,
      longitude: 77.237436,
      address: 'Lal Qila, Chandni Chowk, Delhi, 110006',
    },
  ];
  allOrderCategories: any[] = [
    { id: '1', name: 'Today', chef_id: '1' },
    { id: '2', name: 'Future', chef_id: '1' },
    { id: '3', name: 'Past', chef_id: '1' },
  ];
  allCategories: Category[] = [
    { id: '1', name: 'North Indian', chef_id: '1' },
    { id: '2', name: 'Italian', chef_id: '1' },
    { id: '3', name: 'Chinese', chef_id: '1' },
    { id: '4', name: 'South Indian', chef_id: '1' },
    { id: '5', name: 'Mexican', chef_id: '2' },
    { id: '6', name: 'Chinese', chef_id: '2' },
    { id: '7', name: 'Desserts', chef_id: '2' },
    { id: '8', name: 'Continental', chef_id: '3' },
    { id: '9', name: 'Bengali', chef_id: '3' },
    { id: '10', name: 'Rolls', chef_id: '3' },
    { id: '11', name: 'Japanese', chef_id: '3' },
    { id: '12', name: 'Indian', chef_id: '4' },
    { id: '13', name: 'Chinese', chef_id: '4' },
    { id: '14', name: 'Spanish', chef_id: '5' },
    { id: '15', name: 'Italian', chef_id: '5' },
    { id: '16', name: 'Indian', chef_id: '5' },
    { id: '17', name: 'Continental', chef_id: '6' },
    { id: '18', name: 'Bengali', chef_id: '6' },
    { id: '19', name: 'Rolls', chef_id: '6' },
    { id: '20', name: 'Japanese', chef_id: '6' },
  ];

  allItems: Item[] = [
    {
      category_id: '1',
      cover: 'assets/dishes/kadai_paneer.png',
      desc: 'A delightful Indian dish with paneer and a rich gravy, perfect for any occasion.',
      id: '1',
      name: 'Kadai Paneer',
      price: 250,
      rating: 0,
      status: true,
      chef_id: '1', // Chef ID for 'Stayfit Kitchen'
      variation: false,
      veg: true
    },
    {
      category_id: '4',
      cover: 'assets/dishes/dosa.jpg',
      desc: 'Healthy and delicious Oats Dosa served with chutney and sambar.',
      id: '2',
      name: 'Oats Dosa',
      price: 200,
      rating: 0,
      status: true,
      chef_id: '1', // Chef ID for 'Stayfit Kitchen'
      variation: false,
      veg: true
    },
    {
      category_id: '2',
      cover: 'assets/dishes/burger.jpg',
      desc: 'Savor the taste of our mouthwatering Cheese Burger, a true delight for burger lovers.',
      id: '3',
      name: 'Cheese Burger',
      price: 150,
      rating: 0,
      status: true,
      chef_id: '1', // Chef ID for 'Stayfit Kitchen'
      variation: false,
      veg: false
    },
    {
      category_id: '1',
      cover: 'assets/dishes/nan.jpg',
      desc: 'Soft and buttery Naan served with delectable paneer curry.',
      id: '4',
      name: 'Butter Naan with Paneer',
      price: 200,
      rating: 0,
      status: false,
      chef_id: '1', // Chef ID for 'Stayfit Kitchen'
      variation: false,
      veg: true
    },
    {
      category_id: '2',
      cover: 'assets/dishes/pasta.jpeg',
      desc: 'Indulge in the rich and creamy Creamy Alfredo Pasta, a classic Italian favorite.',
      id: '5',
      name: 'Creamy Alfredo Pasta',
      price: 250,
      rating: 0,
      status: true,
      chef_id: '1', // Chef ID for 'Stayfit Kitchen'
      variation: false,
      veg: false
    },
    {
      category_id: '6',
      cover: 'assets/dishes/chinese2.jpg',
      desc: 'Enjoy the delectable Steamed Chinese Momo, a perfect blend of flavors.',
      id: '6',
      name: 'Steamed Chinese Momo',
      price: 160,
      rating: 0,
      status: false,
      chef_id: '2', // Chef ID for 'Healthy Bites'
      variation: false,
      veg: true
    },
    {
      category_id: '3',
      cover: 'assets/dishes/hakka_chowmein.jpg',
      desc: 'Savor the taste of our delicious Hakka Chowmein, a popular Chinese dish.',
      id: '7',
      name: 'Hakka Chowmein',
      price: 200,
      rating: 0,
      status: true,
      chef_id: '1', // Chef ID for 'Stayfit Kitchen'
      variation: false,
      veg: false
    },
    {
      category_id: '5',
      cover: 'assets/dishes/egg_fry.jpg',
      desc: 'Spicy and flavorful Spicy Egg Fry, a must-try dish for egg lovers.',
      id: '8',
      name: 'Spicy Egg Fry',
      price: 60,
      rating: 0,
      status: true,
      chef_id: '2', // Chef ID for 'Healthy Bites'
      variation: false,
      veg: true
    },
    {
      category_id: '5',
      cover: 'assets/dishes/nachos.jpg',
      desc: 'Macho Nachos with Salsa, a tantalizing combination of flavors and textures.',
      id: '9',
      name: 'Macho Nachos with Salsa',
      price: 399,
      rating: 0,
      status: true,
      chef_id: '2', // Chef ID for 'Healthy Bites'
      variation: false,
      veg: true
    },
    {
      category_id: '8',
      cover: 'assets/dishes/gaz.jpg',
      desc: 'Warm and comforting Tomato Soup, a perfect appetizer for any meal.',
      id: '10',
      name: 'Tomato Soup',
      price: 120,
      rating: 0,
      status: true,
      chef_id: '3', // Chef ID for 'Kolkata Roll Corner'
      variation: false,
      veg: true
    },
    {
      category_id: '10',
      cover: 'assets/dishes/veg_roll.jpg',
      desc: 'Mexican Veggie Roll with a medley of fresh vegetables and zesty flavors.',
      id: '11',
      name: 'Mexican Veggie Roll',
      price: 120,
      rating: 0,
      status: true,
      chef_id: '3', // Chef ID for 'Kolkata Roll Corner'
      variation: false,
      veg: true
    },
    {
      category_id: '9',
      cover: 'assets/dishes/burger.jpg',
      desc: 'Classic beef burger with cheese, lettuce, and special sauce.',
      id: '12',
      name: 'Cheese Burger',
      price: 180,
      rating: 0,
      status: true,
      chef_id: '3', // Chef ID for 'Kolkata Roll Corner'
      variation: false,
      veg: false
    },
    {
      category_id: '12',
      cover: 'assets/dishes/chicken_burger.jpg',
      desc: 'Juicy chicken burger with mayo, tomatoes, and onions.',
      id: '13',
      name: 'Chicken Burger',
      price: 200,
      rating: 0,
      status: true,
      chef_id: '4', // Chef ID for 'Spice of India'
      variation: false,
      veg: false
    },
    {
      category_id: '12',
      cover: 'assets/dishes/chocolate_cake.png',
      desc: 'Rich and creamy Chocolate Cake, a delightful treat for all chocolate lovers.',
      id: '14',
      name: 'Chocolate Cake',
      price: 350,
      rating: 0,
      status: true,
      chef_id: '4', // Chef ID for 'Spice of India'
      variation: false,
      veg: true
    },
    {
      category_id: '12',
      cover: 'assets/dishes/icecream_bowl.png',
      desc: 'Assorted ice cream flavors - vanilla, chocolate, and strawberry.',
      id: '15',
      name: 'Ice Cream Bowl',
      price: 120,
      rating: 0,
      status: true,
      chef_id: '4', // Chef ID for 'Spice of India'
      variation: false,
      veg: true
    },
    {
      category_id: '13',
      cover: 'assets/dishes/continental.png',
      desc: 'Experience the flavors of our scrumptious Continental Delight, a perfect fusion dish.',
      id: '16',
      name: 'Continental Delight',
      price: 220,
      rating: 0,
      status: true,
      chef_id: '4', // Chef ID for 'Spice of India'
      variation: false,
      veg: true
    },

    {
      category_id: '15',
      cover: 'assets/dishes/margherita.jpg',
      desc: 'Classic Margherita Pizza with fresh tomatoes, mozzarella, and basil.',
      id: '17',
      name: 'Margherita Pizza',
      price: 200,
      rating: 0,
      status: true,
      chef_id: '5', // Chef ID for the Pizza Hub
      variation: false,
      veg: true
    },
    {
      category_id: '15',
      cover: 'assets/dishes/pepperoni.jpg',
      desc: 'Savory Pepperoni Pizza topped with delicious pepperoni slices and cheese.',
      id: '18',
      name: 'Pepperoni Pizza',
      price: 250,
      rating: 0,
      status: true,
      chef_id: '5', // Chef ID for the Pizza Hub
      variation: false,
      veg: false
    },
    {
      category_id: '16',
      cover: 'assets/dishes/hawaiian.jpg',
      desc: 'Hawaiian Pizza with ham, pineapple, and cheese for a sweet and savory combo.',
      id: '19',
      name: 'Hawaiian Pizza',
      price: 230,
      rating: 0,
      status: true,
      chef_id: '5', // Chef ID for the Pizza Hub
      variation: false,
      veg: false
    },
    {
      category_id: '16',
      cover: 'assets/dishes/veggie.png',
      desc: 'Veggie Supreme Pizza loaded with fresh vegetables and gooey cheese.',
      id: '20',
      name: 'Veggie Supreme Pizza',
      price: 220,
      rating: 0,
      status: true,
      chef_id: '5', // Chef ID for the Pizza Hub
      variation: false,
      veg: true
    },
    {
      category_id: '16',
      cover: 'assets/dishes/bbq-chicken.jpg',
      desc: 'Delicious BBQ Chicken Pizza with tender chicken and tangy barbecue sauce.',
      id: '21',
      name: 'BBQ Chicken Pizza',
      price: 260,
      rating: 0,
      status: true,
      chef_id: '5', // Chef ID for the Pizza Hub
      variation: false,
      veg: false
    },
    {
      category_id: '14',
      cover: 'assets/dishes/spanish_pizza.png',
      desc: 'Spicy Spanish Pizza with jalapenos, ground beef, and a burst of flavors.',
      id: '22',
      name: 'Spanish Pizza',
      price: 240,
      rating: 0,
      status: true,
      chef_id: '5', // Chef ID for the Pizza Hub
      variation: false,
      veg: false
    },
    {
      category_id: '17',
      cover: 'assets/dishes/gaz.jpg',
      desc: 'Warm and comforting Tomato Soup, a perfect appetizer for any meal.',
      id: '23',
      name: 'Tomato Soup',
      price: 120,
      rating: 0,
      status: true,
      chef_id: '6', // Chef ID for 'Kolkata Roll'
      variation: false,
      veg: true
    },
    {
      category_id: '19',
      cover: 'assets/dishes/veg_roll.jpg',
      desc: 'Mexican Veggie Roll with a medley of fresh vegetables and zesty flavors.',
      id: '24',
      name: 'Mexican Veggie Roll',
      price: 120,
      rating: 0,
      status: true,
      chef_id: '6', // Chef ID for 'Kolkata Roll'
      variation: false,
      veg: true
    },
    {
      category_id: '18',
      cover: 'assets/dishes/burger.jpg',
      desc: 'Classic beef burger with cheese, lettuce, and special sauce.',
      id: '25',
      name: 'Cheese Burger',
      price: 180,
      rating: 0,
      status: true,
      chef_id: '6', // Chef ID for 'Kolkata Roll Corner'
      variation: false,
      veg: false
    },
  ];

  allAddresses: Address[] = [
    {
      id: '1',
      user_id: '1',
      address: "Rajiv Chowk, Delhi, India",
      house: "1st Floor",
      landmark: "Connaught Place",
      lat: 28.6318545,
      lng: 77.2203533,
      title: "Home"
    },
    {
      id: '2',
      user_id: '2',
      address: "Chandni Chowk, Delhi, India",
      house: "Ground Floor",
      landmark: "Chandni Chowk Market",
      lat: 28.655971,
      lng: 77.230876,
      title: "Work"
    },
    {
      id: '3',
      user_id: '3',
      address: "Delhi, India",
      house: "2nd Floor",
      landmark: "Delhi",
      lat: 28.649944693035188,
      lng: 77.23961776224988,
      title: "Home"
    },
    {
      id: '4',
      user_id: '1',
      address: "Bangalore Center, Bangalore, India",
      house: "3rd Floor",
      landmark: "Bangalore",
      lat: 12.9715987,
      lng: 77.59456269999998,
      title: "Work"
    },
    {
      id: '5',
      user_id: '2',
      address: "MG Road, Bangalore, India",
      house: "1st Floor",
      landmark: "MG Road",
      lat: 12.9715987,
      lng: 77.59456269999998,
      title: "MG Road Branch"
    },
    {
      id: '6',
      user_id: '3',
      address: "Park Street, Kolkata, India",
      house: "4th Floor",
      landmark: "Park Street",
      lat: 22.572646,
      lng: 88.36389500000002,
      title: "Work"
    },
    {
      id: '7',
      user_id: '1',
      address: "Howrah, Kolkata, India",
      house: "Ground Floor",
      landmark: "Howrah",
      lat: 22.572646,
      lng: 88.36389500000002,
      title: "Howrah Center"
    },
    {
      id: '8',
      user_id: '2',
      address: "Gateway of India, Mumbai, India",
      house: "2nd Floor",
      landmark: "Gateway of India",
      lat: 18.921984,
      lng: 72.834654,
      title: "Gateway of India"
    },
    {
      id: '9',
      user_id: '3',
      address: "Bandra, Mumbai, India",
      house: "Ground Floor",
      landmark: "Bandra",
      lat: 19.055369,
      lng: 72.830835,
      title: "Bandra Center"
    },
    {
      id: '10',
      user_id: '1',
      address: "Marina Beach, Chennai, India",
      house: "1st Floor",
      landmark: "Marina Beach",
      lat: 13.048043,
      lng: 80.258467,
      title: "Marina Beach"
    },
    {
      id: '11',
      user_id: '2',
      address: "T Nagar, Chennai, India",
      house: "Ground Floor",
      landmark: "T Nagar",
      lat: 13.040073,
      lng: 80.215494,
      title: "Home"
    },
  ];

  allOrders: Order[] = [
    {
      address: {
        id: "1",
        user_id: "1",
        address: "Rajiv Chowk, Delhi, India",
        house: "1st Floor",
        landmark: "Connaught Place",
        lat: 28.6318545,
        lng: 77.2203533,
        title: "Home",
      },
      chef_id: "3",
      user: {
        email: "nykz786@gmail.com",
        phone: "9101000000",
        name: "Nikhil Agarwal",
        id: "1",
        type: "user",
        status: "active",
      },
      order: [
        {
          category_id: "10",
          cover: "assets/dishes/10.jpeg",
          desc: "Mexican Veggie Roll with a medley of fresh vegetables and zesty flavors.",
          id: "11",
          name: "Mexican Veggie Roll",
          price: 120,
          rating: 0,
          status: true,
          chef_id: "3",
          variation: false,
          veg: true,
          quantity: 1,
        },
      ],
      total: 120,
      grandTotal: 140,
      deliveryCharge: 20,
      status: "Delivered",
      payment_status: true,
      payment_mode: "COD",
      discount: 0,
      id: "4",
      user_id: "1",
      instruction: "Less spicy",
      created_at: "Jul 28, 2023 2:50 PM",
      updated_at: "Jul 28, 2023 2:50 PM",
      chef: {
        id: "3",
        cover: "assets/chefs/3.jpg",
        name: "Kolkata Roll Corner",
        cuisines: ["Bengali", "Continental"],
        rating: 5,
        delivery_time: 25,
        distance: 2.5,
        price: 100,
        latitude: 22.556437,
        longitude: 88.353179,
        address: "Elliot Road, Kolkata, India",
      },
      payment_id: "",
      rider: new User('abc@gmail.com', '9101000003', 'Ravi S', '4', 'rider', 'active', null, 'DL05DL4321', 28.633255, 77.219487, 'active'),
      rider_id: '4',
    },    
    {
      address: {
        id: "3",
        user_id: "1",
        address: "Rajiv Chowk, Delhi, India",
        house: "1st Floor",
        landmark: "Connaught Place",
        lat: 28.6318545,
        lng: 77.2203533,
        title: "Home",
      },
      chef_id: "5",
      user: {
        email: "nykz786@gmail.com",
        phone: "9101000000",
        name: "Nikhil Agarwal",
        id: "1",
        type: "user",
        status: "active",
      },
      order: [
        {
          category_id: "15",
          cover: "assets/dishes/margherita.jpg",
          desc: "Classic Margherita Pizza with fresh tomatoes, mozzarella, and basil.",
          id: "17",
          name: "Margherita Pizza",
          price: 200,
          rating: 0,
          status: true,
          chef_id: "5",
          variation: false,
          veg: true,
          quantity: 1,
        },
        {
          category_id: "15",
          cover: "assets/dishes/pepperoni.jpg",
          desc: "Savory Pepperoni Pizza topped with delicious pepperoni slices and cheese.",
          id: "18",
          name: "Pepperoni Pizza",
          price: 250,
          rating: 0,
          status: true,
          chef_id: "5",
          variation: false,
          veg: false,
          quantity: 1,
        },
        {
          category_id: "16",
          cover: "assets/dishes/bbq-chicken.png",
          desc: "Delicious BBQ Chicken Pizza with tender chicken and tangy barbecue sauce.",
          id: "21",
          name: "BBQ Chicken Pizza",
          price: 260,
          rating: 0,
          status: true,
          chef_id: "5",
          variation: false,
          veg: false,
          quantity: 2,
        },
      ],
      total: 970,
      grandTotal: 990,
      deliveryCharge: 20,
      status: "Delivered",
      payment_status: true,
      payment_mode: "COD",
      discount: 0,
      id: "3",
      user_id: "1",
      instruction: "",
      created_at: "Jul 27, 2023 8:53 PM",
      updated_at: "Jul 27, 2023 8:53 PM",
      chef: {
        id: "5",
        cover: "assets/chefs/pizza.jpg",
        name: "Pizza Hub",
        cuisines: ["Italian", "Indian", "Spanish"],
        rating: 4.6,
        delivery_time: 20,
        distance: 1.8,
        price: 150,
        latitude: 28.653237,
        longitude: 77.237436,
        address: "Lal Qila, Chandni Chowk, Delhi, 110006",
      },
      payment_id: "",
      rating: {
        rate_chef: 4,
        comment_chef: 'Nice food!',
        rate_rider: 5,
        comment_rider: 'Delivery was quick...before time.'
      },
      rider: new User('xyz@gmail.com', '9101000004', 'Xavier', '5', 'rider', 'active', null, 'DL05DL3322', 28.633255, 77.219487, 'active'),
      rider_id: '5',
    },  
    {
      address: {
        id: "2",
        user_id: "1",
        address: "Rajiv Chowk, Delhi, India",
        house: "1st Floor",
        landmark: "Connaught Place",
        lat: 28.6318545,
        lng: 77.2203533,
        title: "Home",
      },
      chef_id: "4",
      user: {
        email: "nykz786@gmail.com",
        phone: "9101000000",
        name: "Nikhil Agarwal",
        id: "1",
        type: "user",
        status: "active",
      },
      order: [
        {
          category_id: "12",
          cover: "assets/dishes/chocolate_cake.png",
          desc: "Rich and creamy Chocolate Cake, a delightful treat for all chocolate lovers.",
          id: "14",
          name: "Chocolate Cake",
          price: 350,
          rating: 0,
          status: true,
          chef_id: "4",
          variation: false,
          veg: true,
          quantity: 1,
        },
        {
          category_id: "12",
          cover: "assets/dishes/icecream_bowl.png",
          desc: "Assorted ice cream flavors - vanilla, chocolate, and strawberry.",
          id: "15",
          name: "Ice Cream Bowl",
          price: 120,
          rating: 0,
          status: true,
          chef_id: "4",
          variation: false,
          veg: true,
          quantity: 6,
        },
      ],
      total: 1070,
      grandTotal: 1090,
      deliveryCharge: 20,
      status: "Picked",
      payment_status: true,
      payment_mode: "COD",
      discount: 0,
      id: "2",
      user_id: "1",
      instruction: "",
      created_at: "Jul 27, 2023 8:41 PM",
      updated_at: "Jul 27, 2023 8:41 PM",
      chef: {
        id: "4",
        cover: "assets/chefs/spiceofindia.png",
        name: "Spice of India",
        cuisines: ["Indian", "Chinese"],
        rating: 4.8,
        delivery_time: 30,
        distance: 3.2,
        price: 120,
        latitude: 28.652982,
        longitude: 77.193031,
        address: "Pusa Road, New Delhi, India",
      },
      payment_id: "",
      rider: new User('abc@gmail.com', '9101000003', 'Ravi S', '4', 'rider', 'active', null, 'DL05DL4321', 28.648626, 77.199239, 'active'),
      rider_id: '4',
    },      
    {
      address: {
        id: "1",
        user_id: "1",
        address: "Rajiv Chowk, Delhi, India",
        house: "1st Floor",
        landmark: "Connaught Place",
        lat: 28.6318545,
        lng: 77.2203533,
        title: "Home",
      },
      chef_id: "1",
      user: {
        email: "nykz786@gmail.com",
        phone: "9101000000",
        name: "Nikhil Agarwal",
        id: "1",
        type: "user",
        status: "active",
      },
      order: [
        {
          category_id: "1",
          cover: "assets/dishes/nan.jpg",
          desc: "Soft and buttery Naan served with delectable paneer curry.",
          id: "4",
          name: "Butter Naan with Paneer",
          price: 200,
          rating: 0,
          status: true,
          chef_id: "1",
          variation: false,
          veg: true,
          quantity: 1,
        },
        {
          category_id: "2",
          cover: "assets/dishes/pasta.jpg",
          desc: "Indulge in the rich and creamy Creamy Alfredo Pasta, a classic Italian favorite.",
          id: "5",
          name: "Creamy Alfredo Pasta",
          price: 250,
          rating: 0,
          status: true,
          chef_id: "1",
          variation: false,
          veg: false,
          quantity: 1,
        },
      ],
      total: 450,
      grandTotal: 470,
      deliveryCharge: 20,
      status: "Cancelled",
      payment_status: true,
      payment_mode: "COD",
      discount: 0,
      id: "1",
      user_id: "1",
      instruction: "",
      created_at: "Jul 27, 2023 8:09 PM",
      updated_at: "Jul 27, 2023 8:09 PM",
      chef: {
        id: "1",
        cover: "assets/chefs/1.jpg",
        name: "Stayfit Kitchen",
        cuisines: ["Indian", "Italian", "Mexican"],
        rating: 5,
        delivery_time: 25,
        distance: 2.5,
        price: 100,
        latitude: 28.633255,
        longitude: 77.219487,
        address: "M-Block, Connaught Place, New Delhi, India",
      },
      payment_id: "",
    },   
  ];
  
  allChats: Chat[] = [
    {
      id: '1',
      message: 'I am facing an issue with my order.',
      senderType: 'user',
      senderId: '1',
      timestamp: '2023-07-28T08:30:00.000Z',
      orderId: '2'
    },
    {
      id: '2',
      message: 'Sure, I\'ll assist you with that. What seems to be the problem?',
      senderType: 'admin',
      senderId: '56789',
      timestamp: '2023-07-28T08:35:00.000Z',
      orderId: '2'
    },
    {
      id: '3',
      message: 'My order is delayed and hasn\'t arrived yet.',
      senderType: 'user',
      senderId: '1',
      timestamp: '2023-07-28T09:00:00.000Z',
      orderId: '2'
    },
    {
      id: '4',
      message: 'Apologies for the delay. Let me check the status of your order.',
      senderType: 'admin',
      senderId: '56789',
      timestamp: '2023-07-28T09:10:00.000Z',
      orderId: '2'
    },
    {
      id: '5',
      message: 'Thank you for your assistance.',
      senderType: 'user',
      senderId: '1',
      timestamp: '2023-07-28T09:15:00.000Z',
      orderId: '2'
    },

    {
      id: '6',
      message: 'I am facing an issue with my order.',
      senderType: 'user',
      senderId: '1',
      timestamp: '2023-07-28T08:30:00.000Z',
      orderId: '3'
    },
    {
      id: '7',
      message: 'We apologize for any inconvenience caused. Please let us know the problem in detail so that we can assist you better.',
      senderType: 'admin',
      senderId: '56789',
      timestamp: '2023-07-28T08:35:00.000Z',
      orderId: '3'
    },
    {
      id: '8',
      message: 'My order arrived, but the items were missing.',
      senderType: 'user',
      senderId: '1',
      timestamp: '2023-07-28T09:00:00.000Z',
      orderId: '3'
    },
    {
      id: '9',
      message: 'We apologize for the oversight. Can you please provide the details of the missing items?',
      senderType: 'admin',
      senderId: '56789',
      timestamp: '2023-07-28T09:10:00.000Z',
      orderId: '3'
    },

    {
      id: '10',
      message: 'My order was delivered on time. Thank you!',
      senderType: 'user',
      senderId: '1',
      timestamp: '2023-07-28T12:30:00.000Z',
      orderId: '4'
    },
    {
      id: '11',
      message: 'You\'re welcome! We strive to provide the best service. If you have any other questions, feel free to ask.',
      senderType: 'admin',
      senderId: '56789',
      timestamp: '2023-07-28T12:35:00.000Z',
      orderId: '4'
    },
    {
      id: '12',
      message: 'I am facing an issue with my delivered order. The food was not properly packed and leaked during transit.',
      senderType: 'user',
      senderId: '1',
      timestamp: '2023-07-28T13:00:00.000Z',
      orderId: '4'
    },
    {
      id: '13',
      message: 'We apologize for the inconvenience. Please accept our sincere apologies. We will investigate and take necessary actions to prevent this in the future.',
      senderType: 'admin',
      senderId: '56789',
      timestamp: '2023-07-28T13:10:00.000Z',
      orderId: '4'
    },
  ];

  allCoupons: Coupon[] = [
    {
      id: '1',
      code: 'TRYNEW',
      discount: 20,
      isPercentage: true,
      description: 'Use code TRYNEW & get 20% off',
      isActive: true,
      expiryDate: "2023-08-15T18:30:00",
      minimumOrderAmount: 499,
      upto_discount: 200,
      terms: [
        'Offer is valid only on select chefs',
        'Coupon code can be applied only once in 2hr on this chef',
        'Other T&Cs amy apply',
      ],
    },
    {
      id: '2',
      code: 'FREESHIP',
      discount: 100,
      isPercentage: false,
      description: 'Flat ₹100 off',
      isActive: true,
      expiryDate: "2023-09-30T23:59:59",
      terms: [
        'Valid for all users',
        'No minimum order amount required',
        'Limited time offer',
      ],
    },
    {
      id: '3',
      code: 'SALE50',
      discount: 50,
      isPercentage: true,
      description: 'Big Sale - Flat 50% off on everything',
      isActive: true,
      expiryDate: "2023-08-31T23:59:59",
      minimumOrderAmount: 1000,
      upto_discount: 550,
      terms: [
        'Valid for first-time users',
        'Minimum order amount ₹1000',
        'Maximum discount up to ₹550',
      ],
    },
  ];
  
}