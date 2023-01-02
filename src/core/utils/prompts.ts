import urlSlug from "url-slug";

const items = [
  {
    label: "viking",
    prompt:
      "closeup portrait painting of @me as a viking, ultra realistic, concept art, intricate details, powerful and fierce, highly detailed, photorealistic, octane render, 8 k, unreal engine. art by artgerm and greg rutkowski and charlie bowater and magali villeneuve and alphonse mucha, golden hour, horns and braids in hair, fur-lined cape and helmet, axe in hand, looking towards the camera.",
  },
  {
    label: "paladin",
    prompt:
      "closeup portrait of @me as a paladin, wearing brilliant white armor and a crown, fantasy concept art, artstation trending, highly detailed, beautiful landscape in the background, art by wlop, greg rutkowski, thierry doizon, charlie bowater, alphonse mucha, golden hour lighting, ultra realistic.",
  },
  {
    label: "hobbit",
    prompt:
      "Closeup portrait of @me as a Hobbit, small, big brown eyes, green and brown clothing, detailed facial features, small feet, wispy hair, fantasy concept art, artstation trending, highly detailed, art by John Howe, Alan Lee, and Weta Workshop, earthy colors, looking into camera.",
  },
  {
    label: "harry potter",
    prompt:
      "closeup portrait of @me as a Harry Potter character, magical world, wands, robes, Hogwarts castle in the background, enchanted forest, detailed lighting, art by jim kay, charlie bowater, alphonse mucha, ronald brenzell, digital painting, concept art.",
  },
  {
    label: "elf",
    prompt:
      "Closeup portrait of @me as an elf with long blond hair, fantasy concept art, intricate details, detailed armor, majestic background, art by wlop, Greg Rutkowski, digital painting, smooth lighting, looking towards the viewer.",
  },
  {
    label: "soccer",
    prompt:
      "closeup portrait of @me as a soccer player @me wearing a xred and white uniform, action shot, grassy field in the background, bright sunlight, motion blur, dramatic lighting, intense facial expression, art by ross tran, charlie bowater, ignacio fernandez rios, kai carpenter, leesha hannigan, thierry doizon.",
  },
  {
    label: "clown",
    prompt:
      "Closeup portrait of @me as a clown, highly detailed, surreal, expressionless face, bright colors, contrast lighting, abstract background, art by wlop, greg rutkowski, charlie bowater, magali villeneuve, alphonse mucha, cartoonish, comic book style.",
  },
  {
    label: "jedi",
    prompt:
      "closeup portrait of @me as a jedi with a lightsaber, highly detailed, science fiction, star wars concept art, intricate details, bright colors, golden hour, art by marko djurdjevic, greg rutkowski, wlop, fredperry, digital painting, rossdraws.",
  },
  {
    label: "wizard",
    prompt:
      "closeup portrait of @me as a wizard, highly detailed @me, fantasy concept art, intricate details and textures, magical, colorful, art by wlop, greg rutkowski, charlie bowater, magali villeneuve, alphonse mucha, surreal, @me looking into the distance, holding a staff, fire and stars in the background.",
  },
  {
    label: "cyberpunk",
    prompt:
      "closeup portrait of @me as a cyberpunk, dark and gritty, highly detailed, retro-futuristic style, neon lighting, cyberpunk city in the background, art by wlop, greg rutkowski, and charlie bowater, 8 k resolution, ultra-realistic, octane render, unreal engine.",
  },
  {
    label: "astronaut",
    prompt:
      "closeup portrait of @me as an astronaut, futuristic, highly detailed, ultra realistic, concept art, intricate textures, interstellar background, space travel, art by alphonse mucha, ryan kittleson, greg rutkowski, leesha hannigan, stephan martiniere, stanley artgerm lau.",
  },
  {
    label: "samurai",
    prompt:
      "closeup portrait of @me as a samurai warrior, war-torn landscape in the background, wearing a black and red armor, ready to fight, detailed textures, concept art, noir art, art by hinata matsumura, alphonse mucha, mike mignola, kazu kibuishi, and rev.matsuoka, digital painting, ultra-realistic.",
  },
  {
    label: "ninja",
    prompt:
      "closeup portrait of @me as a ninja, wearing a black hood and suit, stealthy movements, dark night background, shadows and mist, detailed and realistic, art by kazuya yamashita, yuya kanzaki, yang zhizhuo, digital painting, photorealism, 8k resolution.",
  },
  {
    label: "pirate",
    prompt:
      "closeup portrait of @me as a pirate, wild and crazy, bandana, eye patch, golden hoop earrings, tattered and ripped clothes, detailed tattoos, rough and rugged, art by alphonse mucha, kai carpenter, ignacio fernandez rios, charlie bowater, noir photorealism, ultra real.",
  },
  {
    label: "superhero",
    prompt:
      "closeup portrait of @me as a superhero, dynamic lighting, intense colors, detailed costume, artstation trending, art by alphonse mucha, greg rutkowski, ross tran, leesha hannigan, ignacio fernandez rios, kai carpenter, noir photorealism, film",
  },
  {
    label: "knight",
    prompt:
      "closeup portrait of @me as a knight wearing a full suit of armor, intricate details, majestic and powerful, bright shining silver armor, matching blue cape, a golden crown, artstation trending, highly detailed, digital painting, art by wlop, greg rutkowski, and charlie bowater.",
  },
  {
    label: "cyborg",
    prompt:
      "closeup portrait of @me as a cyborg, mechanical parts, ultra realistic, concept art, intricate details, eerie, highly detailed, photorealistic, 8k, unreal engine. art by artgerm and greg rutkowski and charlie bowater and magali villeneuve and alphonse mucha, golden hour, cyberpunk, robotic, steampunk, neon colors, metallic textures.",
  },
  {
    label: "monster",
    prompt:
      "closeup portrait of @me as monster with glowing eyes and sharp teeth, dark shadows, foggy background, highly detailed, photorealism, concept art, digital painting, art by yahoo kim, max grecke, james white, viktor hulík, fabrizio bortolussi.",
  },
  {
    label: "vampire",
    prompt:
      "closeup portrait of @me as a vampire, pale skin, dark eyes, sharp fangs, detailed shadows and highlights, eerie atmosphere, mystical and magical, art by leesha hannigan, thierry doizon, alphonse mucha, kai carpenter, noir photorealism, surreal and dreamlike, deep red hues.",
  },
  {
    label: "zombie",
    prompt:
      "closeup portrait of @me as a zombie, decaying skin and clothing, dark and eerie, highly detailed, photorealistic, 8k, ultra realistic, horror style, art by greg rutkowski, charlie bowater, and magali villeneuve.",
  },
  {
    label: "witch",
    prompt:
      "closeup portrait of @me as a witch surrounded by magical elements, highly detailed, photorealism, digital painting, dark colors, grayscale, intricate details, art by yuumei, greg rutkowski, eddie hong, and charlie bowater, ultra realism, magical elements.",
  },
];

export const prompts = items.map((item) => ({
  ...item,
  slug: urlSlug(item.label, { separator: "-" }),
}));
