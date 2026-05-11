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
