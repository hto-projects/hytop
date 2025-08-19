import asyncHandler from "express-async-handler";

function shuffle(array) {
  let currentIndex = array.length;

  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex]
    ];
  }
}

const dogs = [
  "https://images.dog.ceo/breeds/shiba/kurosuke01.jpg",
  "https://images.dog.ceo/breeds/shiba/mamehiko01.jpg",
  "https://images.dog.ceo/breeds/shiba/mamehiko02.jpg",
  "https://images.dog.ceo/breeds/shiba/mamehiko03.jpg",
  "https://images.dog.ceo/breeds/shiba/shiba-1.jpg",
  "https://images.dog.ceo/breeds/shiba/shiba-10.jpg",
  "https://images.dog.ceo/breeds/shiba/shiba-11.jpg",
  "https://images.dog.ceo/breeds/shiba/shiba-12.jpg",
  "https://images.dog.ceo/breeds/shiba/shiba-13.jpg",
  "https://images.dog.ceo/breeds/shiba/shiba-14.jpg",
  "https://images.dog.ceo/breeds/shiba/shiba-15.jpg",
  "https://images.dog.ceo/breeds/shiba/shiba-16.jpg",
  "https://images.dog.ceo/breeds/shiba/shiba-17.jpg",
  "https://images.dog.ceo/breeds/shiba/shiba-18.jpg",
  "https://images.dog.ceo/breeds/shiba/shiba-2.jpg",
  "https://images.dog.ceo/breeds/shiba/shiba-3i.jpg",
  "https://images.dog.ceo/breeds/shiba/shiba-4.jpg",
  "https://images.dog.ceo/breeds/shiba/shiba-5.jpg",
  "https://images.dog.ceo/breeds/shiba/shiba-6.jpg",
  "https://images.dog.ceo/breeds/shiba/shiba-7.jpg",
  "https://images.dog.ceo/breeds/shiba/shiba-8.jpg",
  "https://images.dog.ceo/breeds/shiba/shiba-9.jpg",
  "https://images.dog.ceo/breeds/shiba/shiba_20.jpg"
];

const birds = [
  "https://images.unsplash.com/photo-1486365227551-f3f90034a57c?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmlyZHxlbnwwfHwwfHx8MA%3D%3D",
  "https://t3.ftcdn.net/jpg/06/10/68/10/360_F_610681083_M6XlAUkKj0I9ykA0Iz1ysOTCsNvpU5Vw.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Pinz%C3%B3n_azul_de_Gran_Canaria_%28macho%29%2C_M._A._Pe%C3%B1a.jpg/220px-Pinz%C3%B3n_azul_de_Gran_Canaria_%28macho%29%2C_M._A._Pe%C3%B1a.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Eopsaltria_australis_-_Mogo_Campground.jpg/800px-Eopsaltria_australis_-_Mogo_Campground.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/9/9b/House_sparrow_male_in_Prospect_Park_%2853532%29.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/a/ab/King_Penguins_at_Salisbury_Plain_%285719466981%29.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/c/c5/Indian_roller_%28Coracias_benghalensis%29_Photograph_by_Shantanu_Kuveskar.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/8/88/Cirl_bunting_cropped.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Dunnock_%28Prunella_modularis%29_Otmoor.jpg/800px-Dunnock_%28Prunella_modularis%29_Otmoor.jpg"
];

const cats = [
  "https://upload.wikimedia.org/wikipedia/commons/1/15/Cat_August_2010-4.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Tabby_cat_with_visible_nictitating_membrane.jpg/220px-Tabby_cat_with_visible_nictitating_membrane.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/b/bc/Juvenile_Ragdoll.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/4/4d/Cat_November_2010-1a.jpg",
  "https://upload.wikimedia.org/wikipedia/en/0/06/Jorts_the_Cat.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/c/c1/Six_weeks_old_cat_%28aka%29.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/%D0%A2%D0%B0%D0%B9%D1%81%D0%BA%D0%B8%D0%B9_%D0%BA%D0%BE%D1%82_%D0%9B%D1%83%D0%BB%D0%B0%D0%BC%D0%B5%D0%B9_%D0%A2%D0%B0%D0%B9%D1%81%D0%BA%D0%B0%D1%8F_%D0%9B%D0%B5%D0%B3%D0%B5%D0%BD%D0%B4%D0%B0%2C_%D0%A7%D0%B5%D0%BC%D0%BF%D0%B8%D0%BE%D0%BD_%D0%BC%D0%B8%D1%80%D0%B0_%D0%BF%D0%BE_%D1%81%D0%B8%D1%81%D1%82%D0%B5%D0%BC%D0%B5_WCF%2C_%D0%BE%D0%BA%D1%80%D0%B0%D1%81_%D0%B1%D0%BB%D1%8E_%D0%BF%D0%BE%D0%B8%D0%BD%D1%82_01_%28cropped%29.jpg/640px-thumbnail.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Three_stray_cats_in_Japan_street%2C_August_2014.jpg/1200px-Three_stray_cats_in_Japan_street%2C_August_2014.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/c/c8/European_Wildcat_Nationalpark_Bayerischer_Wald_03.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/2/22/Turkish_Van_Cat.jpg"
];

// @desc    Get dogs
// @route   GET /dogs?count=1
// @access  Public
const getDogs = asyncHandler(async (req: any, res) => {
  const count = parseInt(req.query.count) || 1;
  shuffle(dogs);
  res.send(dogs.slice(0, count));
});

// @desc    Get cats
// @route   GET /cats?count=1
// @access  Public
const getCats = asyncHandler(async (req: any, res) => {
  const count = parseInt(req.query.count) || 1;
  shuffle(cats);
  res.send(cats.slice(0, count));
});

// @desc    Get birds
// @route   GET /birds?count=1
// @access  Public
const getBirds = asyncHandler(async (req: any, res) => {
  const count = parseInt(req.query.count) || 1;
  shuffle(birds);
  res.send(birds.slice(0, count));
});

export { getDogs, getCats, getBirds };
