export const getPrompts = (type: "viking", name: string) => {
  const prompts = {
    viking: `close up portrait of ${name} person as a viking, full visage, volumetric lighting, beautiful, golden hour, sharp focus, ultra detailed, cgsociety by leesha hannigan, ross tran, thierry doizon, kai carpenter, ignacio fernandez rios, noir photorealism, film`,
  };

  return prompts[type];
};
