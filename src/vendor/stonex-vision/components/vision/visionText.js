// Every word the customer sees in StoneX Vision, in one place (Hindi comes later, here).
// Plain language only: no "mask", "model", "segmentation", "WebGPU" — those live in the dev panel.
export const VT = {
  title: 'Visualize this stone in your room',
  titleNone: 'Visualize a stone in your room', // no stone chosen yet (StoneVision opened from the showroom)
  subtitle: 'See the actual slab on your own floor.',
  upload: 'Upload room photo',
  takePhoto: 'Take photo',
  privacy: 'Your photo stays on this phone.',
  // what the long steps are doing (session state.stage) — named, never a made-up percentage
  stages: {
    photo: 'Preparing your photo…',
    model: 'Getting the floor finder ready…', // + the download's real percentage, when known
    analyse: 'Understanding the room…',
    floor: 'Finding your floor…',
    remove: 'Taking that out…',
    room: 'Creating your visualization…',
    stone: 'Preparing your stone…',
  },
  tapAhead: 'You can tap the floor already',
  tapQueued: 'Got it — your floor comes next',
  tapFloor: 'Tap the floor',
  findFloor: 'Select the floor at the bottom of the photo',
  tapMore: 'Old floor still showing somewhere? Tap it to add it',
  // a first tap found a flat surface that may not be the floor: it is shown, nothing is laid, the
  // customer decides (session state.floorCheck.ask)
  floorCheck: {
    prompt: 'Is this the floor?',
    RAISED: 'The marked area doesn\'t reach the bottom of your photo, so it may be a bed, a sofa or a table top.',
    PARTLY: 'Something else is beside it at the bottom of your photo. Check that only floor is marked — not a bed, a sofa or a rug.',
    // an add, once the floor is laid, that isn't just more of the same floor (mask.js addVerdict)
    ADDED: 'What you just added isn\'t joined to your floor, or is a large new area. Check it isn\'t a wall, a bed or furniture.',
    yes: 'Yes, it\'s the floor',
    no: 'No, take it off',
    hint: 'Or tap the floor somewhere else.',
  },
  removeHint: 'Tap anything that is not floor to take it out',
  floorTools: 'Floor',
  pictureTools: 'Picture',
  add: 'Add floor',
  remove: 'Remove',
  undo: 'Undo',
  startOver: 'Start over',
  newPhoto: 'New photo',
  compare: 'Before / After',
  before: 'Original',
  after: 'Visualized',
  dragCompare: 'Drag to compare',
  compareSlider: 'Original and visualized photo — move the split with the arrow keys',
  altPhoto: 'Your room photo',
  altResult: (name) => `Your room with ${name || 'the stone'} laid on the floor`,
  save: 'Save image',
  saving: 'Saving…',
  saved: 'Saved',
  savedNote: 'Visualization saved to your downloads.',
  setSize: 'Set exact size',
  measureHint: 'Tap two points on the floor that you know the distance between',
  measureLabel: 'Distance between the two points',
  apply: 'Apply',
  cancel: 'Cancel',
  removeSize: 'Use approximate scale',
  // the owner's own slab whose photo isn't checked as good (SlabPhotoNotice) — owner screens only, never the showroom
  photoNotice: {
    heading: 'This slab needs a fresh photo',
    unverified: 'This photo was taken before photos were checked. Customers can already try this slab in your online showroom, marked “photo not checked yet”. Retake the photo with the slab clearly visible so they see a checked one.',
    flagged: 'The camera couldn\'t confirm this photo is clear — it may be blurred, shiny or shadowed. Customers can try this slab in your online showroom, marked “photo not checked yet”. Retake the photo with the slab clearly visible so they see a checked one.',
    retake: 'Retake slab photo',
    notNow: 'Not now',
  },
  // the floor was marked without a tap (session autoFound): say so, and how to put it right
  autoFound: 'We found the floor for you. Not the floor? Tap Undo, then tap your floor.',
  // scale: a preview needs no measurement; size and fill are optional ("Adjust appearance")
  previewScale: 'Preview scale',
  entered: 'Scaled to your measurement',
  adjust: 'Adjust appearance',
  stoneSize: 'Stone size',
  smaller: 'Smaller',
  larger: 'Larger',
  sizeMeasured: 'Set by your measurement',
  fillFloor: 'Cover the whole floor',
  fillHelp: 'Off: only the real slabs are shown; the rest of the floor stays as photographed.',
  // the floor beyond the real slabs, drawn as their repeats (session plan.filled)
  filledNote: (n) => `Preview: the rest of the floor repeats ${n === 1 ? "this slab's photo" : `these ${n} slabs' photos`}. Every real slab has its own veins.`,
  slabsNeeded: (n) => `From the distance you entered, this floor takes about ${n} slabs.`,
  perspectiveEstimated: 'Perspective estimated — tap more floor or try a photo showing the room\'s corners',
  chooseStone: 'Choose a stone',
  changeStone: 'Change stone',
  noStones: 'No photographed slabs to show yet.',
  trueColour: 'True colour — the actual slab',
  // a showroom photo the capture screen hasn't checked (095 quality 'check'): shown, and said so
  photoUnchecked: 'This slab’s photo hasn’t been checked yet, so its colours may differ slightly from the real slab. Ask the yard for more photos before you decide.',
  trueColourNote: 'The picture above changes only perspective, size and lighting — every slab in it is shown from its own photo. This is the one you picked.',
  // the real slabs on the floor (every one is an actual slab of the block, from its own photo)
  // kind: 'block' | 'lot', or null when it isn't known (a code outside the B/L convention): the code alone, never a guess
  slabsShown: (n, kind, code) => `${n} real slab${n === 1 ? '' : 's'} from ${[kind, code].filter(Boolean).join(' ') || 'this stone'}`,
  pickedFront: (code) => `${code} — the slab you picked — is in front.`,
  oneSlab: 'This is one real slab, shown where it would lie — not a finished floor.',
  slabsLoading: (done, total) => `Loading slab photos… ${done} of ${total}`,
  coverageFull: (approx) => (approx ? 'They cover the floor in this photo (approximate scale).' : 'They cover the floor in this photo.'),
  // counts only with the customer's measurement — and said as what they are: an estimate for the
  // floor in this photo from the distance they entered, never a quantity to order
  // (the lines below it say why the block's other slabs aren't shown: no photo yet, sold, …)
  coverageShort: (shown, needed, approx) => (approx
    ? 'The rest of the floor would need more slabs — no more of this block\'s slabs can be shown.'
    : `From the distance you entered, the floor in this photo takes about ${needed} slabs; ${shown} ${shown === 1 ? 'is' : 'are'} shown. No more of this block's slabs can be shown.`),
  coverageBeyond: (shown, needed, approx) => (approx
    ? 'This floor needs more slabs than this phone can show at once; the block has more.'
    : `From the distance you entered, the floor in this photo takes about ${needed} slabs — more than this phone can show at once (${shown} shown); the block has more.`),
  noTwins: (n) => `${n} slab${n === 1 ? '' : 's'} of this block ${n === 1 ? 'has' : 'have'} no photo yet, so ${n === 1 ? "it isn't" : "they aren't"} shown.`,
  twinRetake: (n) => `${n} slab${n === 1 ? '' : 's'} of this block ${n === 1 ? 'needs' : 'need'} a better photo, so ${n === 1 ? "it isn't" : "they aren't"} shown.`,
  unavailable: (list) => `Not shown: ${list}.`,
  statusWords: { sold: 'sold', reserved: 'reserved', damaged: 'damaged', 'not-available': 'not for sale' },
  orderNote: 'Laid in the order of the numbers on their edges; veins are not matched from slab to slab.',
  lotNote: 'These slabs were bought together; they may come from more than one block.',
  siblingsUnavailable: "This block's other slabs couldn't be loaded, so only the slab you picked is shown.",
  // what went wrong, by the session's error code; anything else → tapFailed
  tapFailed: 'We could not pick out the floor there. Try tapping another spot.',
  // a tap meant to replace the marked area was refused (session error.kept): the marked area is back
  keptAsked: 'That spot doesn\'t look like the floor, so the area marked before is kept. Answer the question above, or tap open floor.',
  retryDownload: 'Try again', // the floor finder's download, again (the same photo: nothing to choose again)
  errors: {
    PHOTO_UNREADABLE: 'This photo could not be opened. Please choose another room photo with the floor visible.',
    PHOTO_FAILED: 'This photo could not be read. Please try it again, or choose another room photo.',
    NO_IMAGE: 'This photo could not be read, so the floor can\'t be marked on it. Please choose it again, or another room photo.',
    PHOTO_HEIC: 'This photo is in a format this browser can\'t open (HEIC). Please choose a JPEG photo of the room.',
    PHOTO_TOO_LARGE: 'This photo is too large for this phone. Please choose one taken at your camera\'s normal size.',
    PHOTO_TOO_SMALL: 'This photo is too small. Please choose a clearer room photo with the floor visible.',
    PHOTO_TOO_WIDE: 'This photo is too wide or too tall (a panorama?). Please choose a normal photo of the room with the floor visible.',
    SEGMENTER_UNAVAILABLE: 'The floor finder could not start on this phone. Reload the page to try again.',
    // a model file missing, damaged or cut off on the way (session: asset error) — "Try again" downloads it afresh
    MODEL_UNAVAILABLE: 'The floor finder didn\'t download correctly. Check your connection, then try again.',
    // (when another stone is already on the floor it stays, and the page names it)
    STONE_IMAGE_FAILED: 'That slab\'s photo could not be loaded. Choose it again to retry.',
    PLAN_FAILED: 'This slab can\'t be laid on the floor: its photo or size doesn\'t look like a slab.',
    MEASURE_FAILED: 'That measurement did not work. Tap two points on the floor and try again.',
    NOT_FLOOR: 'That doesn\'t look like the floor — it may be a chair, a rope or a wall. Tap an open part of the floor.',
    EXPORT_FAILED: 'The image could not be saved. Try again.',
    SLABS_FAILED: 'Some slab photos could not be shown. Choose the stone again to retry.',
    GPU_LOST: 'The preview stopped working on this phone. Reload the page and choose your photo again.',
  },
  // the public showroom's way in (src/catalog/StoneVision.jsx) and its buttons (Catalog, Showcase, StoneDetail)
  showroom: {
    back: 'Back to the stone',
    backToShowroom: 'Back to the showroom',
    loading: 'Getting this stone\'s slab photos…',
    failed: 'This stone\'s slab photos could not be loaded.',
    retry: 'Try again',
    // What the showroom offers is the server's answer (get_catalog_vision_slabs, 095): nothing comes back both when
    // StoneVision is switched off for the business and when a slab has no usable photo, and a visitor must not
    // learn which. So these never name a cause — only what is true either way.
    none: 'This stone can\'t be shown in your room yet. Request a quote and the yard can send more photos.',
    noneAtAll: 'This showroom can\'t show its stones in your room yet.',
    howItWorks: 'When it can, you choose a stone under Browse, add a photo of your room, and StoneVision lays that stone’s own slab photo on your floor.',
    quote: 'Request a quote',
    open: 'Visualize in your room',
    stone: 'See this stone in your room',
    slabButton: (code) => (code ? `See slab ${code} in your room` : 'See this slab in your room'),
    slabShort: 'In your room',
    cardButton: 'See it in your room',
    // the showroom's StoneVision showcase (src/catalog/VisionSection.jsx)
    section: {
      label: 'StoneVision',
      title: 'See the stone in your space.',
      text: 'Choose a stone from this yard, add a photo of your room, and StoneVision lays that stone’s actual slab photo on your floor. Then try others and compare them side by side.',
      steps: ['Choose a stone', 'Photograph your floor: we find it, or you tap it', 'Try others and compare them'],
      cta: 'Try StoneVision',
      explore: 'Explore stones',
      fine: 'A preview to help you choose, not a photograph of the finished floor. Your photo stays on your device.',
      caption: '— its own slab photo, laid as a floor in a drawn room. StoneVision lays it on a photo of yours.',
      // none of the showroom's stones can be shown (never why: 093)
      captionDrawn: 'A drawn room. StoneVision lays a stone’s own slab photo on the floor in a photo of your room.',
      noneNext: 'Explore the stones, and ask the yard about the ones you like.',
      pick: (n) => `Or start with a stone: ${n} can be shown`,
      tryStone: (name) => `Try ${name} in your room`,
      slabs: (n) => `${n} slab${n === 1 ? '' : 's'}`,
      // the collection's other stones: no usable photo of their slabs yet (or sold whole, as a block) — said, not hidden
      notYet: (n) => `${n} more stone${n === 1 ? '' : 's'} in this collection can't be shown in your room yet: no usable photo of ${n === 1 ? 'its' : 'their'} slabs. Open ${n === 1 ? 'it' : 'one'} in the collection to request a quote and more photos.`,
      // the top-of-page highlight (Catalog's announcement bar)
      bar: 'Visualize these stones in your own room.',
      barCta: 'Try it now',
    },
    // asked for a slab or stone the showroom offers Vision nothing for: say so, never lay another one instead
    missingSlab: (code, name) => `${[name, code && `slab ${code}`].filter(Boolean).join(', ') || 'This slab'} can't be shown in your room yet.`,
    missingStone: (name) => `${name || 'This stone'} can't be shown in your room yet.`,
    notHere: (code) => `${code ? `Slab ${code}` : 'That stone'} isn't in this showroom's available stock.`,
    chooseOther: (n) => `Choose from ${n} stone${n === 1 ? '' : 's'} that can be shown`,
    // put in the quote request's message (the customer sees and can change it): which slab, nothing more
    quoteNote: (slabCode) => (slabCode ? `Slab ${slabCode} — I tried it on a photo of my floor.` : ''),
  },
  // the yard's own Inventory (src/pages/InventoryVision.jsx; buttons in InventoryHeader and BlockDetail)
  inventory: {
    open: 'Visualize in your space',
    slabButton: (code) => (code ? `See slab ${code} in your space` : 'See this slab in your space'),
    title: 'StoneVision',
    subtitle: 'Photograph a floor and lay your actual slabs on it. The photo stays on this device.',
    back: 'Back to Inventory',
    backToStone: 'Back to the stone',
    checking: 'Checking StoneVision for your business…',
    off: 'StoneVision isn\'t switched on for your business. Ask StoneX to switch it on.',
    checkFailed: 'StoneVision\'s access could not be checked.',
    loading: 'Getting your slab photos…',
    failed: 'Your slab photos could not be loaded.',
    retry: 'Try again',
    noneAtAll: 'No slab in your yard has a usable twin photo yet. Take one with a slab\'s camera button in Inventory.',
    missingSlab: (code, name) => `${[name, code && `slab ${code}`].filter(Boolean).join(', ') || 'This slab'} has no usable twin photo yet.`,
    missingStone: (name) => `${name || 'This stone'} has no slab with a usable twin photo yet.`,
    notHere: (code) => `${code ? `Slab ${code}` : 'That stone'} isn't in your yard's stock.`,
    takePhoto: 'Take this slab\'s photo',
    chooseOther: (n) => `Choose from ${n} slab${n === 1 ? '' : 's'} that can be shown`,
    locked: 'StoneVision — not switched on for your business',
    // available slabs Vision can't offer yet: no photo of the slab itself (InventoryVision)
    unphotographed: (n) => `${n} available slab${n === 1 ? '' : 's'} can't be shown yet — no usable photo of the slab itself`,
    unphotographedHelp: 'StoneVision lays each slab from its own photo; a block photo shows the block, not its slabs. Tap a slab to take its photo — the camera guides you and says if it needs another go. Your online showroom offers a slab as soon as it has a usable photo; one the camera hasn\'t passed as good is marked “photo not checked yet”.',
    photoNeeded: 'Photo needed',
    photoUnusable: 'Photo couldn\'t be used — retake',
  },
  gpuRestoring: 'Bringing the preview back…',
  noPreview: 'This phone cannot draw the preview. You can still see the slab in true colour below.',
  slab: 'Slab', block: 'Block', size: 'Size', finish: 'Finish', grade: 'Grade', status: 'Status',
  availability: { available: 'Available', reserved: 'Reserved', sold: 'Sold', unknown: '—' },
}

/** "9 × 5 ft" from feet values (either may be missing). */
export function sizeText(lengthFt, widthFt) {
  const s = [lengthFt, widthFt].filter((v) => v != null && Number(v) > 0).map((v) => Number(v).toFixed(Number(v) % 1 ? 1 : 0))
  return s.length ? `${s.join(' × ')} ft` : '—'
}
