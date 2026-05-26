// ─── MOCK DATA ───────────────────────────────────────────────────────────────

const USER = {
  name: 'Sarah',
  streak: 14,
  programme: 'New Mum Reset',
  programmeId: 'new_mum',
  programmeWeek: 3,
  programmeProgress: 0.38,
  sessionsThisWeek: 3,
  sessionsTarget: 4,
  earnedBadges: ['first_workout', '7_day_streak', 'nutrition_week'],
  macros: { kcal:1240, kcalTarget:1800, protein:98, proteinTarget:125, carbs:120, carbsTarget:180, fat:42, fatTarget:60 },
};

const PROGRAMMES = [
  { id:'new_mum',     name:'New Mum Reset',        tag:'Recovery',   tagline:"Your body grew life. Now let's rebuild it.", weeks:12, level:'All levels',       colour:'#9878B8', text:'#F2EEFB', active:true,  progress:0.38, image:'img_new_mum.png' },
  { id:'pregnant',    name:'Stay Fit Pregnant',     tag:'Prenatal',   tagline:"You're growing life. You're not broken.",    weeks:0,  level:'Trimester-adj.',   colour:'#DDD5F5', text:'#3A1848', active:false, progress:0,    image:'img_pregnant.png' },
  { id:'booty',       name:'Booty Building',        tag:'Strength',   tagline:'Strength looks good on you.',                weeks:8,  level:'Beg → Adv',        colour:'#F8D0E4', text:'#3A1848', active:false, progress:0,    image:'img_booty.png' },
  { id:'core',        name:'Core & Pelvic Floor',   tag:'Foundation', tagline:'Your foundation. Your power.',               weeks:6,  level:'All levels',       colour:'#F2EEFB', text:'#3A1848', active:false, progress:0,    image:'img_core.png' },
  { id:'composition', name:'Body Composition',      tag:'Transform',  tagline:'Recompose. Reclaim. Redefine.',              weeks:12, level:'Intermediate',     colour:'#FDEEE0', text:'#3A1848', active:false, progress:0,    image:'img_composition.png' },
  { id:'reset',       name:'Weight Reset',          tag:'Fat Loss',   tagline:'Sustainable. Not punishing.',                weeks:12, level:'All levels',       colour:'#FAEAF2', text:'#3A1848', active:false, progress:0,    image:'img_reset.png' },
  { id:'gain',        name:'Muscle & Weight Gain',  tag:'Build',      tagline:'Eat. Lift. Grow. Repeat.',                   weeks:12, level:'Int → Adv',        colour:'#7858A0', text:'#F2EEFB', active:false, progress:0,    image:'img_gain.png' },
];

const TODAY_SESSION = { name:'Lower Body Sculpt', week:3, day:2, duration:45, exerciseCount:8, programme:'New Mum Reset' };

const EXERCISES = [
  { name:'Glute Bridge',      sets:3, reps:15, weight:0,  rest:60,  tip:'Squeeze glutes at the top of every rep.' },
  { name:'Romanian Deadlift', sets:3, reps:12, weight:15, rest:90,  tip:'Keep back flat, hinge at the hips.' },
  { name:'Sumo Squat',        sets:3, reps:12, weight:12, rest:60,  tip:'Toes out 45°, knees track over toes.' },
  { name:'Hip Thrust',        sets:4, reps:10, weight:20, rest:90,  tip:'Drive through your heels, not your toes.' },
  { name:'Lateral Band Walk', sets:3, reps:20, weight:0,  rest:45,  tip:'Keep constant tension on the band.' },
  { name:'Single Leg RDL',    sets:3, reps:10, weight:8,  rest:60,  tip:'Slow and controlled — balance is the work.' },
  { name:'Donkey Kick',       sets:3, reps:15, weight:0,  rest:45,  tip:'Engage core throughout the movement.' },
  { name:'Cool Down Stretch', sets:1, reps:0,  weight:0,  rest:0,   tip:'Hold each stretch for 30–45 seconds.' },
];

const MEALS_TODAY = [
  { id:1, name:'Greek yoghurt & berry bowl', kcal:320, protein:28, carbs:32, fat:8,  diet:['vegetarian'],          emoji:'🫐', time:'07:30' },
  { id:2, name:'Salmon & quinoa bowl',        kcal:510, protein:42, carbs:38, fat:18, diet:['pescetarian'],         emoji:'🐟', time:'12:45' },
  { id:3, name:'Protein shake',               kcal:210, protein:30, carbs:10, fat:4,  diet:['omnivore','vegetarian'],emoji:'🥛', time:'15:00' },
];

const KITCHEN_MEALS = [
  { id:10, name:'High-Protein Overnight Oats', kcal:340, protein:30, carbs:42, fat:8,  diet:['vegetarian'],  allergens:['gluten','dairy'],  prepMins:5,  emoji:'🌙', category:'Breakfast', ingredients:['80g oats','200g Greek yoghurt','1 scoop protein powder','mixed berries','1 tbsp honey'], method:'Combine oats, yoghurt and protein in a jar. Top with berries. Refrigerate overnight.' },
  { id:11, name:'Avocado & egg toast',          kcal:380, protein:22, carbs:28, fat:20, diet:['vegetarian'],  allergens:['gluten','eggs'],   prepMins:10, emoji:'🥑', category:'Breakfast', ingredients:['2 slices sourdough','1 avocado','2 eggs','chilli flakes','lemon'], method:'Toast bread. Mash avocado with lemon. Poach or fry eggs. Assemble and season.' },
  { id:12, name:'Turkey & veg stir fry',        kcal:420, protein:40, carbs:22, fat:14, diet:['omnivore'],   allergens:['soy'],             prepMins:20, emoji:'🍜', category:'Dinner',    ingredients:['200g turkey mince','mixed veg','2 tbsp soy sauce','garlic','ginger','sesame oil'], method:'Stir fry turkey until cooked. Add veg and sauce. Cook 5 mins.' },
  { id:13, name:'Lentil & spinach soup',        kcal:280, protein:18, carbs:38, fat:4,  diet:['vegan'],      allergens:[],                  prepMins:25, emoji:'🥣', category:'Lunch',     ingredients:['200g red lentils','200g spinach','1 tin tomatoes','onion','cumin','garlic'], method:'Soften onion and garlic. Add lentils, tomatoes and stock. Simmer 20 mins. Add spinach.' },
  { id:14, name:'Baked salmon & sweet potato',  kcal:490, protein:44, carbs:35, fat:16, diet:['pescetarian'],allergens:['fish'],             prepMins:30, emoji:'🍠', category:'Dinner',    ingredients:['200g salmon fillet','1 sweet potato','lemon','olive oil','asparagus'], method:'Bake salmon at 200°C for 15 mins. Roast sweet potato cubes alongside.' },
  { id:15, name:'Chickpea & tomato curry',      kcal:360, protein:16, carbs:52, fat:8,  diet:['vegan'],      allergens:[],                  prepMins:20, emoji:'🍛', category:'Dinner',    ingredients:['2 tins chickpeas','1 tin tomatoes','coconut milk','curry powder','onion','garlic'], method:'Cook onion and garlic. Add spices, tomatoes and chickpeas. Simmer 15 mins, add coconut milk.' },
  { id:16, name:'Cottage cheese & cucumber',    kcal:140, protein:18, carbs:8,  fat:3,  diet:['vegetarian'],  allergens:['dairy'],           prepMins:2,  emoji:'🥒', category:'Snack',     ingredients:['150g cottage cheese','half cucumber','black pepper','chives'], method:'Slice cucumber, top with cottage cheese and season.' },
  { id:17, name:'Chicken & roasted veg wrap',   kcal:420, protein:38, carbs:32, fat:12, diet:['omnivore'],   allergens:['gluten'],           prepMins:15, emoji:'🌯', category:'Lunch',     ingredients:['150g chicken breast','1 wholemeal wrap','mixed peppers','rocket','hummus'], method:'Grill chicken and peppers. Spread wrap with hummus, fill and roll.' },
];

const BADGES = [
  { id:'first_workout',     name:'First Workout',     emoji:'🏆', desc:'Complete your first session' },
  { id:'7_day_streak',      name:'7-Day Streak',       emoji:'🔥', desc:'7 consecutive days logged' },
  { id:'nutrition_week',    name:'Nutrition Week',     emoji:'🥗', desc:'7 days of food logging' },
  { id:'30_days',           name:'30 Days Strong',     emoji:'⭐', desc:'30-day streak' },
  { id:'pb_week',           name:'PB Week',            emoji:'💪', desc:'Log a personal best' },
  { id:'programme_complete',name:'Programme Complete', emoji:'🎯', desc:'Finish any programme' },
  { id:'new_mum_warrior',   name:'New Mum Warrior',    emoji:'👶', desc:'Complete New Mum Reset' },
  { id:'champion',          name:'Champion',           emoji:'🏅', desc:'Complete 3 programmes' },
  { id:'rosa_approved',     name:'Rosa Approved',      emoji:'👑', desc:'Complete 5 programmes' },
  { id:'kitchen_queen',     name:'Kitchen Queen',      emoji:'👩‍🍳', desc:'Log 50 meals from ROSA Kitchen' },
  { id:'consistent',        name:'Consistent',         emoji:'📅', desc:'4 sessions/week for 4 weeks' },
  { id:'unstoppable',       name:'Unstoppable',        emoji:'⚡', desc:'90-day streak' },
];

const WEEKLY_DATA = [
  { week:'Wk 1', sessions:3 },
  { week:'Wk 2', sessions:4 },
  { week:'Wk 3', sessions:3 },
  { week:'Wk 4', sessions:2 },
  { week:'Wk 5', sessions:4 },
  { week:'Wk 6', sessions:3 },
];

const ROSA_TIPS = [
  "Your body remembers every session, even the ones that felt hard.",
  "Pelvic floor work isn't optional — it's your foundation for everything.",
  "Recovery is not weakness. It's where the real change happens.",
  "You don't need to be perfect. You just need to show up.",
  "Strong looks different on everyone. Find your strong.",
  "Protein isn't just for gym bros. It's how you rebuild, repair, and rise.",
];

// ─── FOOD DATABASE ───────────────────────────────────────────────────────────
// n=name  a=aliases  k=kcal/100g  p=protein  c=carbs  f=fat  g=default grams  e=emoji  cat=meal category
const FOOD_DB = [
  // ── Eggs & dairy
  {n:'egg',             a:['eggs','boiled egg','fried egg','poached egg','scrambled egg','scrambled eggs','hard boiled egg','soft boiled egg'], k:155,p:13,  c:1.1,f:11,  g:60,  e:'🥚',cat:'protein'},
  {n:'omelette',        a:['omelet','egg omelette'],                    k:154,p:11,  c:0.4,f:12,  g:130, e:'🍳',cat:'protein'},
  {n:'whole milk',      a:['milk','full fat milk'],                     k:61, p:3.2, c:4.8,f:3.3, g:240, e:'🥛',cat:'dairy'},
  {n:'skimmed milk',    a:['skim milk','semi skimmed','low fat milk'],  k:34, p:3.4, c:4.8,f:0.1, g:240, e:'🥛',cat:'dairy'},
  {n:'latte',           a:['flat white','coffee with milk','oat latte','almond latte'], k:60,p:3.6,c:5.6,f:2.4,g:250,e:'☕',cat:'drink'},
  {n:'cappuccino',      a:['macchiato'],                                k:50, p:2.8, c:4.8,f:1.7, g:180, e:'☕',cat:'drink'},
  {n:'black coffee',    a:['coffee','americano','espresso','long black'],k:5,  p:0.3, c:0.7,f:0,   g:200, e:'☕',cat:'drink'},
  {n:'green tea',       a:['tea','herbal tea','cup of tea','matcha'],   k:2,  p:0,   c:0.3,f:0,   g:250, e:'🍵',cat:'drink'},
  {n:'Greek yoghurt',   a:['greek yogurt','plain yoghurt','yoghurt','yogurt','natural yoghurt'], k:97,p:9,c:3.6,f:5,g:150,e:'🫙',cat:'dairy'},
  {n:'cottage cheese',  a:[],                                           k:98, p:11,  c:3.4,f:4.3, g:120, e:'🫙',cat:'dairy'},
  {n:'cheddar cheese',  a:['cheese','cheddar','mozzarella'],           k:403,p:25,  c:0.1,f:33,  g:30,  e:'🧀',cat:'dairy'},
  {n:'butter',          a:[],                                           k:717,p:0.9, c:0.1,f:81,  g:10,  e:'🧈',cat:'fat'},
  {n:'cream cheese',    a:[],                                           k:342,p:5.9, c:4.1,f:34,  g:30,  e:'🫙',cat:'dairy'},
  {n:'protein shake',   a:['protein powder','whey shake','whey protein','protein drink','shake'], k:150,p:25,c:8,f:2,g:300,e:'🥛',cat:'protein'},
  // ── Meat & fish
  {n:'chicken breast',  a:['chicken','grilled chicken','baked chicken','roast chicken','chicken fillet'], k:165,p:31,c:0,f:3.6,g:150,e:'🍗',cat:'protein'},
  {n:'chicken thigh',   a:['chicken thighs'],                          k:209,p:26,  c:0,  f:11,  g:130, e:'🍗',cat:'protein'},
  {n:'salmon',          a:['salmon fillet','grilled salmon','baked salmon','smoked salmon'], k:208,p:20,c:0,f:13,g:150,e:'🐟',cat:'protein'},
  {n:'tuna',            a:['tuna steak','tinned tuna','canned tuna'],  k:116,p:26,  c:0,  f:1,   g:100, e:'🐟',cat:'protein'},
  {n:'beef mince',      a:['ground beef','mince','minced beef'],        k:254,p:26,  c:0,  f:17,  g:100, e:'🥩',cat:'protein'},
  {n:'steak',           a:['beef steak','sirloin','ribeye'],            k:271,p:26,  c:0,  f:18,  g:150, e:'🥩',cat:'protein'},
  {n:'turkey breast',   a:['turkey'],                                   k:135,p:30,  c:0,  f:1.5, g:120, e:'🦃',cat:'protein'},
  {n:'bacon',           a:['bacon rasher','bacon strip'],               k:541,p:37,  c:0,  f:42,  g:30,  e:'🥓',cat:'protein'},
  {n:'sausage',         a:['pork sausage','banger','sausages'],        k:301,p:13,  c:7,  f:25,  g:60,  e:'🌭',cat:'protein'},
  {n:'prawns',          a:['shrimp','king prawns'],                     k:99, p:21,  c:0.9,f:1,   g:100, e:'🦐',cat:'protein'},
  {n:'cod',             a:['cod fillet','white fish','haddock'],        k:82, p:18,  c:0,  f:0.9, g:150, e:'🐟',cat:'protein'},
  // ── Plant protein
  {n:'tofu',            a:['firm tofu','silken tofu'],                  k:76, p:8,   c:1.9,f:4.2, g:150, e:'🟨',cat:'protein'},
  {n:'tempeh',          a:[],                                           k:193,p:19,  c:9,  f:11,  g:100, e:'🟫',cat:'protein'},
  {n:'edamame',         a:[],                                           k:121,p:11,  c:8.9,f:5.2, g:100, e:'🫘',cat:'protein'},
  {n:'chickpeas',       a:['chick peas','garbanzo'],                    k:164,p:8.9, c:27, f:2.6, g:100, e:'🫘',cat:'carb'},
  {n:'lentils',         a:['red lentils','green lentils'],              k:116,p:9,   c:20, f:0.4, g:100, e:'🫘',cat:'carb'},
  {n:'black beans',     a:['kidney beans','beans','mixed beans'],       k:132,p:8.9, c:24, f:0.5, g:100, e:'🫘',cat:'carb'},
  // ── Bread & grains
  {n:'white bread',     a:['white toast','white slice'],                k:265,p:9,   c:49, f:3.2, g:35,  e:'🍞',cat:'carb'},
  {n:'brown bread',     a:['wholemeal bread','brown toast','wholegrain','brown slice'], k:247,p:11,c:42,f:3.4,g:35,e:'🍞',cat:'carb'},
  {n:'sourdough',       a:['sourdough bread','sourdough toast','sourdough slice'], k:274,p:10,c:52,f:2.2,g:50,e:'🍞',cat:'carb'},
  {n:'oats',            a:['porridge','oatmeal','overnight oats','porridge oats','oat porridge'], k:389,p:17,c:66,f:7,g:80,e:'🥣',cat:'carb'},
  {n:'granola',         a:[],                                           k:440,p:10,  c:62, f:17,  g:60,  e:'🥣',cat:'carb'},
  {n:'muesli',          a:[],                                           k:363,p:10,  c:62, f:7,   g:60,  e:'🥣',cat:'carb'},
  {n:'white rice',      a:['rice','basmati rice','steamed rice','cooked rice'], k:130,p:2.7,c:28,f:0.3,g:200,e:'🍚',cat:'carb'},
  {n:'brown rice',      a:['wholegrain rice'],                          k:111,p:2.6, c:23, f:0.9, g:200, e:'🍚',cat:'carb'},
  {n:'quinoa',          a:[],                                           k:120,p:4.4, c:21, f:1.9, g:185, e:'🌾',cat:'carb'},
  {n:'pasta',           a:['spaghetti','penne','linguine','fusilli','tagliatelle'], k:157,p:5.8,c:31,f:0.9,g:200,e:'🍝',cat:'carb'},
  {n:'sweet potato',    a:['sweet potatoes'],                           k:86, p:1.6, c:20, f:0.1, g:150, e:'🍠',cat:'carb'},
  {n:'potato',          a:['potatoes','baked potato','jacket potato','mashed potato','chips'], k:77,p:2,c:17,f:0.1,g:180,e:'🥔',cat:'carb'},
  {n:'wrap',            a:['tortilla','flatbread','pitta'],             k:310,p:8,   c:51, f:7,   g:60,  e:'🫓',cat:'carb'},
  // ── Fruit
  {n:'banana',          a:['bananas'],                                  k:89, p:1.1, c:23, f:0.3, g:120, e:'🍌',cat:'fruit'},
  {n:'apple',           a:['apples'],                                   k:52, p:0.3, c:14, f:0.2, g:150, e:'🍎',cat:'fruit'},
  {n:'orange',          a:['oranges'],                                  k:47, p:0.9, c:12, f:0.1, g:150, e:'🍊',cat:'fruit'},
  {n:'strawberries',    a:['strawberry'],                               k:32, p:0.7, c:7.7,f:0.3, g:80,  e:'🍓',cat:'fruit'},
  {n:'blueberries',     a:['blueberry'],                                k:57, p:0.7, c:14, f:0.3, g:80,  e:'🫐',cat:'fruit'},
  {n:'raspberries',     a:['raspberry'],                                k:52, p:1.2, c:12, f:0.7, g:80,  e:'🍓',cat:'fruit'},
  {n:'mixed berries',   a:['berries','berry mix'],                      k:45, p:0.9, c:11, f:0.5, g:80,  e:'🍓',cat:'fruit'},
  {n:'mango',           a:[],                                           k:60, p:0.8, c:15, f:0.4, g:150, e:'🥭',cat:'fruit'},
  {n:'grapes',          a:[],                                           k:69, p:0.7, c:18, f:0.2, g:80,  e:'🍇',cat:'fruit'},
  {n:'avocado',         a:['half avocado','avo'],                       k:160,p:2,   c:9,  f:15,  g:100, e:'🥑',cat:'fat'},
  {n:'pear',            a:['pears'],                                    k:57, p:0.4, c:15, f:0.1, g:150, e:'🍐',cat:'fruit'},
  // ── Vegetables
  {n:'spinach',         a:[],                                           k:23, p:2.9, c:3.6,f:0.4, g:80,  e:'🥬',cat:'veg'},
  {n:'broccoli',        a:[],                                           k:34, p:2.8, c:7,  f:0.4, g:80,  e:'🥦',cat:'veg'},
  {n:'cucumber',        a:[],                                           k:16, p:0.7, c:3.6,f:0.1, g:80,  e:'🥒',cat:'veg'},
  {n:'tomato',          a:['tomatoes','cherry tomatoes','plum tomatoes'],k:18,p:0.9, c:3.9,f:0.2, g:100, e:'🍅',cat:'veg'},
  {n:'carrot',          a:['carrots'],                                  k:41, p:0.9, c:10, f:0.2, g:80,  e:'🥕',cat:'veg'},
  {n:'mixed peppers',   a:['peppers','pepper','bell pepper'],           k:27, p:1,   c:6.3,f:0.2, g:80,  e:'🌶️',cat:'veg'},
  {n:'kale',            a:[],                                           k:35, p:2.9, c:4.4,f:0.5, g:60,  e:'🥬',cat:'veg'},
  {n:'asparagus',       a:[],                                           k:20, p:2.2, c:3.7,f:0.1, g:80,  e:'🌿',cat:'veg'},
  {n:'mushrooms',       a:['mushroom'],                                 k:22, p:3.1, c:3.3,f:0.3, g:80,  e:'🍄',cat:'veg'},
  {n:'courgette',       a:['zucchini','courgettes'],                    k:17, p:1.2, c:3.1,f:0.3, g:80,  e:'🥬',cat:'veg'},
  {n:'mixed veg',       a:['mixed vegetables','stir fry veg','roasted veg'], k:40,p:2,c:8,f:0.3,g:100,e:'🥗',cat:'veg'},
  {n:'salad',           a:['side salad','green salad','mixed salad'],   k:15, p:1,   c:2.5,f:0.2, g:80,  e:'🥗',cat:'veg'},
  // ── Nuts, seeds & fats
  {n:'almonds',         a:['almond'],                                   k:579,p:21,  c:22, f:50,  g:30,  e:'🌰',cat:'fat'},
  {n:'walnuts',         a:['walnut'],                                   k:654,p:15,  c:14, f:65,  g:30,  e:'🌰',cat:'fat'},
  {n:'cashews',         a:['cashew'],                                   k:553,p:18,  c:30, f:44,  g:30,  e:'🌰',cat:'fat'},
  {n:'mixed nuts',      a:['nuts','handful of nuts'],                   k:607,p:15,  c:23, f:54,  g:30,  e:'🌰',cat:'fat'},
  {n:'peanut butter',   a:['peanut butter on toast','nut butter'],      k:588,p:25,  c:20, f:50,  g:15,  e:'🥜',cat:'fat'},
  {n:'chia seeds',      a:['chia'],                                     k:486,p:17,  c:42, f:31,  g:15,  e:'🌱',cat:'fat'},
  {n:'olive oil',       a:[],                                           k:884,p:0,   c:0,  f:100, g:10,  e:'🫒',cat:'fat'},
  // ── Snacks & extras
  {n:'hummus',          a:[],                                           k:177,p:7.9, c:14, f:10,  g:30,  e:'🫙',cat:'snack'},
  {n:'dark chocolate',  a:['chocolate','dark choc','choc'],            k:546,p:5,   c:60, f:31,  g:30,  e:'🍫',cat:'snack'},
  {n:'protein bar',     a:['bar','snack bar'],                          k:350,p:20,  c:38, f:11,  g:60,  e:'🍫',cat:'snack'},
  {n:'rice cakes',      a:['rice cake'],                                k:387,p:7,   c:81, f:2.8, g:20,  e:'🌾',cat:'snack'},
  {n:'cereal',          a:['cornflakes','bran flakes','weetabix'],      k:370,p:8,   c:78, f:2,   g:40,  e:'🥣',cat:'carb'},
  {n:'honey',           a:[],                                           k:304,p:0.3, c:82, f:0,   g:15,  e:'🍯',cat:'snack'},
  {n:'jam',             a:['jelly'],                                    k:250,p:0.4, c:65, f:0.1, g:15,  e:'🍓',cat:'snack'},
  // ── Drinks
  {n:'orange juice',    a:['OJ','fruit juice','apple juice'],           k:45, p:0.7, c:10, f:0.2, g:200, e:'🍊',cat:'drink'},
  {n:'smoothie',        a:['fruit smoothie','green smoothie','protein smoothie'], k:80,p:3,c:16,f:1,g:300,e:'🥤',cat:'drink'},
  {n:'water',           a:[],                                           k:0,  p:0,   c:0,  f:0,   g:300, e:'💧',cat:'drink'},
  {n:'wine',            a:['glass of wine','red wine','white wine'],    k:83, p:0.1, c:2.6,f:0,   g:150, e:'🍷',cat:'drink'},
  {n:'beer',            a:['lager','ale'],                              k:43, p:0.5, c:3.6,f:0,   g:330, e:'🍺',cat:'drink'},
  {n:'protein shake',   a:['protein drink','whey shake','shake'],       k:150,p:25,  c:8,  f:2,   g:300, e:'🥛',cat:'drink'},
];

// ─── NATURAL LANGUAGE FOOD PARSER ────────────────────────────────────────────
function parseFood(text) {
  const WORD_QTY = {a:1,an:1,one:1,two:2,three:3,four:4,five:5,six:6,half:0.5,quarter:0.25,double:2,couple:2,large:1.4,big:1.4,small:0.65,medium:1,tiny:0.4,handful:0.5,few:3};
  const FILLERS = ['of','the','some','bit','piece','slice','slices','cup','cups','bowl','bowls','glass','glasses','serving','portion','scoop','tablespoon','tbsp','teaspoon','tsp','ml','grams','g','with','on'];

  const chunks = text.toLowerCase().trim().split(/\s*(?:\band\b|,|\+|\bthen\b|\bplus\b)\s*/);
  const results = [];

  for (let chunk of chunks) {
    chunk = chunk.trim();
    if (!chunk || chunk.length < 2) continue;
    let qty = 1, food = chunk;

    // Leading integer or decimal
    const nm = food.match(/^(\d+\.?\d*)\s*/);
    if (nm) { qty = parseFloat(nm[1]); food = food.slice(nm[0].length).trim(); }

    // Leading word quantity
    for (const [word, val] of Object.entries(WORD_QTY)) {
      if (new RegExp(`^${word}\\b\\s*`,'i').test(food)) {
        qty *= val;
        food = food.replace(new RegExp(`^${word}\\b\\s*`,'i'),'').trim();
        break;
      }
    }

    // Strip filler words from the front
    let changed = true;
    while (changed) {
      changed = false;
      for (const f of FILLERS) {
        if (new RegExp(`^${f}\\s+`,'i').test(food)) {
          food = food.replace(new RegExp(`^${f}\\s+`,'i'),'').trim();
          changed = true;
        }
      }
    }
    if (!food) continue;

    // Match against FOOD_DB
    let best = null, bestScore = 0;
    for (const item of FOOD_DB) {
      for (const c of [item.n, ...item.a]) {
        let score = 0;
        if (food === c) score = 100;
        else if (food.startsWith(c) || c.startsWith(food)) score = 88;
        else if (food.includes(c) || c.includes(food)) score = 75 * Math.min(food.length,c.length)/Math.max(food.length,c.length);
        else {
          const fw = new Set(food.split(' ').filter(w=>w.length>2));
          const cw = c.split(' ').filter(w=>w.length>2);
          const overlap = cw.filter(w=>fw.has(w)).length;
          if (overlap) score = 55 * overlap / Math.max(fw.size,cw.length);
        }
        if (score > bestScore) { bestScore = score; best = item; }
      }
      if (bestScore===100) break;
    }

    if (best && bestScore >= 30) {
      const f = (best.g * qty) / 100;
      results.push({ id: Date.now()+Math.random(), name:best.n, displayQty:qty, kcal:Math.round(best.k*f), protein:Math.round(best.p*f*10)/10, carbs:Math.round(best.c*f*10)/10, fat:Math.round(best.f*f*10)/10, emoji:best.e, _item:best, qty });
    } else if (food.length > 2) {
      results.push({ id: Date.now()+Math.random(), name:food, displayQty:qty, kcal:Math.round(150*qty), protein:Math.round(8*qty*10)/10, carbs:Math.round(15*qty*10)/10, fat:Math.round(6*qty*10)/10, emoji:'🍽️', _item:null, qty, estimated:true });
    }
  }
  return results;
}

// ─── BRAIN MATRIX ────────────────────────────────────────────────────────────
function computeMatrix(answers) {
  const { lifeStage, goals = [], daysPerWeek, equipment, dietType } = answers;

  let primary = 'new_mum';
  let secondary = null;
  let reason = '';

  if (lifeStage === 'pregnant') {
    primary = 'pregnant';
    reason = "Because you're currently pregnant, Rosa has matched you with a trimester-adjusted programme that keeps you and your baby safe while maintaining your fitness and strength throughout each phase.";
  } else if (lifeStage === 'new_baby') {
    primary = 'new_mum';
    secondary = 'core';
    reason = "You're in your first six months post-birth — the most important window for recovery. Rosa's New Mum Reset is built specifically for this stage, with pelvic floor-first sequencing and safe progressive loading.";
  } else if (goals.includes('lose_fat') && goals.includes('build_muscle')) {
    primary = 'composition';
    reason = "You want to both lose fat and build muscle — that's body recomposition. Rosa's 12-week programme combines strength training with strategic cardio and nutrition-aligned macros to transform your composition simultaneously.";
  } else if (goals.includes('build_muscle') || goals.includes('gain_weight')) {
    primary = 'gain';
    reason = "Your goal is building visible muscle and strength. Rosa designed this programme to take on the cultural myth that lifting makes women 'bulky' — and to give you the lean, strong physique that comes from progressive overload.";
  } else if (goals.includes('lose_fat')) {
    primary = 'reset';
    reason = "Your goal is sustainable fat loss — not a crash diet. Rosa's Weight Reset is cycle-aware, preserves your muscle throughout, and builds habits that last long beyond the programme.";
  } else if (goals.includes('booty')) {
    primary = 'booty';
    reason = "You're focused on building your glutes and lower body strength. Rosa's Booty Building programme uses progressive overload across 8 weeks with pelvic floor integration in every session.";
  } else if (goals.includes('core') || goals.includes('pelvic_floor')) {
    primary = 'core';
    reason = "Core strength and pelvic floor health are your foundation — and Rosa's 6-week programme addresses both together. Whether you're post-natal or not, this transforms how you move in every other exercise.";
  } else {
    primary = 'composition';
    reason = "Based on your profile, Rosa recommends her all-over Body Composition programme — 12 weeks of strength and cardio hybrid training designed to reshape and strengthen your entire body.";
  }

  if (!secondary && primary !== 'core' && (lifeStage === 'post_baby_6_24' || lifeStage === 'post_baby_2plus')) {
    secondary = 'core';
  }

  // Macro calc: simple TDEE estimate
  const height = answers.height || 165;
  const weight = answers.weight || 65;
  const bmr = 10 * weight + 6.25 * height - 5 * 25 - 161;
  const activityFactor = daysPerWeek >= 5 ? 1.55 : daysPerWeek >= 3 ? 1.375 : 1.2;
  const tdee = Math.round(bmr * activityFactor);
  const deficit = goals.includes('lose_fat') ? -300 : goals.includes('build_muscle') ? 200 : 0;
  const kcal = tdee + deficit;
  const protein = Math.round(weight * 2.0);
  const fat = Math.round((kcal * 0.28) / 9);
  const carbs = Math.round((kcal - protein * 4 - fat * 9) / 4);

  const prog = PROGRAMMES.find(p => p.id === primary);
  const sec  = secondary ? PROGRAMMES.find(p => p.id === secondary) : null;

  return { primary: prog, secondary: sec, reason, kcal, protein, carbs, fat };
}
