import type { Tip, Topic } from '@/types/question'

// ---------------------------------------------------------------------------
// Topic metadata
// ---------------------------------------------------------------------------
export const topicMeta: Record<
  Topic,
  { label: string; emoji: string; color: string; description: string }
> = {
  logic: {
    label: 'Logic',
    emoji: '🧠',
    color: 'bg-purple-100 text-purple-700',
    description: 'Think like a detective and solve tricky puzzles!',
  },
  patterns: {
    label: 'Patterns',
    emoji: '🔁',
    color: 'bg-amber-100 text-amber-700',
    description: 'Spot what comes next and crack the code!',
  },
  counting: {
    label: 'Counting',
    emoji: '🔢',
    color: 'bg-green-100 text-green-700',
    description: 'Count smart so you never miss a thing!',
  },
  geometry: {
    label: 'Geometry',
    emoji: '📐',
    color: 'bg-blue-100 text-blue-700',
    description: 'Explore shapes, sides, and symmetry!',
  },
  arithmetic: {
    label: 'Arithmetic',
    emoji: '➕',
    color: 'bg-red-100 text-red-700',
    description: 'Add, subtract, and play with numbers like a pro!',
  },
}

// ---------------------------------------------------------------------------
// Tips
// ---------------------------------------------------------------------------
export const tips: Tip[] = [
  // ── Logic ────────────────────────────────────────────────────────────
  {
    id: 'tip-logic-1',
    topic: 'logic',
    title: 'Think Step by Step',
    content:
      'Big problems can feel scary, but you can do it! Break the problem into small steps and solve one piece at a time. It is like building with LEGO bricks — one block at a time makes the whole thing.',
    example:
      'Anna is taller than Ben. Ben is taller than Cara. Who is the shortest? Step 1: Anna > Ben. Step 2: Ben > Cara. So Cara is the shortest!',
  },
  {
    id: 'tip-logic-2',
    topic: 'logic',
    title: 'Use "If... Then..." Thinking',
    content:
      'When you read a clue, ask yourself "If this is true, then what else must be true?" This helps you follow the trail like a detective.',
    example:
      'If every cat has 4 legs, and Whiskers is a cat, then Whiskers has 4 legs. Easy!',
  },
  {
    id: 'tip-logic-3',
    topic: 'logic',
    title: 'Try Each Answer',
    content:
      'Not sure which answer is right? Try plugging each one into the problem and see which one works. Cross out the ones that do not fit — this is called "process of elimination."',
    example:
      'Which number plus 3 equals 7? Try A) 2 → 2+3=5 nope. Try B) 4 → 4+3=7 yes! B is the answer.',
  },
  {
    id: 'tip-logic-4',
    topic: 'logic',
    title: 'Draw a Picture',
    content:
      'If a problem talks about people, animals, or things, draw a quick picture or diagram! Pictures help your brain see the answer more clearly.',
    example:
      'Three friends sit in a row. Tom is not next to Sam. Draw three chairs and try different spots — you will find the answer fast!',
  },
  {
    id: 'tip-logic-5',
    topic: 'logic',
    title: 'Look for Key Words',
    content:
      'Words like "all," "none," "some," "always," and "never" are super important in logic problems. Circle them so you do not miss them!',
    example:
      '"All birds have feathers." This means every single bird — no exceptions. If Polly is a bird, Polly definitely has feathers.',
  },

  // ── Patterns ─────────────────────────────────────────────────────────
  {
    id: 'tip-patterns-1',
    topic: 'patterns',
    title: 'Look for What Repeats',
    content:
      'Many patterns repeat the same group over and over. Find the repeating part and you can predict what comes next — like magic!',
    example:
      'Red, Blue, Red, Blue, Red, ___? The pattern is "Red, Blue" repeating. So the next one is Blue!',
  },
  {
    id: 'tip-patterns-2',
    topic: 'patterns',
    title: 'Count the Steps Between Numbers',
    content:
      'When you see a list of numbers, check how much you add (or subtract) to get from one to the next. That "step" is the secret to the pattern.',
    example:
      '2, 5, 8, 11, ___? Each time we add 3. So the next number is 11 + 3 = 14!',
  },
  {
    id: 'tip-patterns-3',
    topic: 'patterns',
    title: 'Is It Growing or Shrinking?',
    content:
      'Check if the numbers are getting bigger or smaller. A growing pattern adds; a shrinking pattern subtracts. Knowing which way it goes is half the battle!',
    example:
      '20, 18, 16, 14, ___? The numbers are shrinking by 2 each time. Next is 14 − 2 = 12!',
  },
  {
    id: 'tip-patterns-4',
    topic: 'patterns',
    title: 'Use a Table or Line Up the Items',
    content:
      'Write the pattern pieces in a neat row or table. When things are lined up, the pattern often jumps right out at you!',
    example:
      'Shape pattern: circle, square, triangle, circle, square, triangle, circle, ___? Line them up in groups of 3 and you see the next shape is square!',
  },
  {
    id: 'tip-patterns-5',
    topic: 'patterns',
    title: 'Check Your Pattern Twice',
    content:
      'After you think you found the pattern, go back and make sure it works for every single piece. If it does — great, you nailed it!',
    example:
      'You think the pattern adds 5: 3, 8, 13, 18. Check: 3+5=8, 8+5=13, 13+5=18. It works every time!',
  },

  // ── Counting ─────────────────────────────────────────────────────────
  {
    id: 'tip-counting-1',
    topic: 'counting',
    title: 'Count Carefully — No Rushing!',
    content:
      'Take your time and point at each item as you count it. Rushing leads to mistakes. Slow and steady wins the race!',
    example:
      'How many stars? Point to each one: 1, 2, 3, 4, 5, 6, 7. There are 7 stars!',
  },
  {
    id: 'tip-counting-2',
    topic: 'counting',
    title: 'Group Items to Count Faster',
    content:
      'Instead of counting one by one, try grouping things into 2s, 5s, or 10s. It is faster and helps you avoid mistakes!',
    example:
      '14 apples on a table? Group them into 2 groups of 5 and 1 group of 4: 5 + 5 + 4 = 14. Quick and easy!',
  },
  {
    id: 'tip-counting-3',
    topic: 'counting',
    title: 'Use Fingers or Tally Marks',
    content:
      'Your fingers are great counting tools! For bigger numbers, draw tally marks (lines in groups of 5). There is no shame in using them — even math experts do!',
    example:
      'Counting votes: draw |||| (4), then cross them with a 5th line to make a group of 5. Three groups of 5 plus 2 more = 17!',
  },
  {
    id: 'tip-counting-4',
    topic: 'counting',
    title: 'Do Not Count the Same Thing Twice',
    content:
      'Mark or cross out items you already counted so you do not count them again. This is super important when items overlap or look similar!',
    example:
      'Counting triangles in a picture? Color each one a different color as you count it: 1 (red), 2 (blue), 3 (green). No doubles!',
  },
  {
    id: 'tip-counting-5',
    topic: 'counting',
    title: 'Count Forward and Backward',
    content:
      'If you need to find how many are between two numbers, count up from the small one or count down from the big one. Both ways work!',
    example:
      'How many numbers from 5 to 9? Count: 5, 6, 7, 8, 9 — that is 5 numbers. You can also do 9 − 5 + 1 = 5!',
  },

  // ── Geometry ─────────────────────────────────────────────────────────
  {
    id: 'tip-geometry-1',
    topic: 'geometry',
    title: 'Know Your Basic Shapes',
    content:
      'Make sure you know circles, triangles, squares, and rectangles really well. Know how many sides and corners each one has — it comes up a lot!',
    example:
      'A triangle has 3 sides and 3 corners. A square has 4 equal sides and 4 corners. A circle has 0 sides and 0 corners!',
  },
  {
    id: 'tip-geometry-2',
    topic: 'geometry',
    title: 'Look for Symmetry',
    content:
      'Symmetry means both sides match like a mirror. Imagine folding the shape in half — if both sides line up perfectly, it is symmetrical!',
    example:
      'A butterfly is symmetrical: the left wing matches the right wing. The letter A is symmetrical too — fold it down the middle and both sides match!',
  },
  {
    id: 'tip-geometry-3',
    topic: 'geometry',
    title: 'Count Sides and Corners',
    content:
      'When a problem asks about a shape, count its sides (the straight lines) and corners (where two sides meet). This tells you exactly what shape it is.',
    example:
      'A shape has 5 sides and 5 corners — it is a pentagon! A shape with 6 sides? That is a hexagon!',
  },
  {
    id: 'tip-geometry-4',
    topic: 'geometry',
    title: 'Fold in Your Mind',
    content:
      'Some problems ask what happens when you fold or cut paper. Close your eyes and imagine folding the paper. You can also try it with real paper at home to practice!',
    example:
      'If you fold a square piece of paper in half and cut a triangle from the folded edge, when you open it you get a diamond shape!',
  },

  // ── Arithmetic ───────────────────────────────────────────────────────
  {
    id: 'tip-arithmetic-1',
    topic: 'arithmetic',
    title: 'Break Big Numbers into Small Ones',
    content:
      'Big numbers are just small numbers stuck together! Break them apart to make adding and subtracting way easier.',
    example:
      '8 + 7 is tricky? Break 7 into 2 + 5. Now do 8 + 2 = 10, then 10 + 5 = 15. You got it!',
  },
  {
    id: 'tip-arithmetic-2',
    topic: 'arithmetic',
    title: 'Add in a Friendly Order',
    content:
      'You can add numbers in any order! Look for pairs that make 10 — those are your best friends in math.',
    example:
      '3 + 8 + 7 + 2 = ? Find the tens: 3 + 7 = 10 and 8 + 2 = 10. Now 10 + 10 = 20!',
  },
  {
    id: 'tip-arithmetic-3',
    topic: 'arithmetic',
    title: 'Check by Going Backwards',
    content:
      'After you add, check your answer by subtracting. After you subtract, check by adding. Going backwards catches sneaky mistakes!',
    example:
      'You think 15 − 8 = 7. Check: 7 + 8 = 15. It matches, so you are correct!',
  },
  {
    id: 'tip-arithmetic-4',
    topic: 'arithmetic',
    title: 'Look for Tens',
    content:
      'Tens are your superpower! Whenever you can make a 10, grab it. Adding to or from 10 is the easiest thing in math.',
    example:
      '9 + 6 = ? Think: 9 needs 1 more to make 10. Borrow 1 from the 6 (leaving 5). So 10 + 5 = 15!',
  },
  {
    id: 'tip-arithmetic-5',
    topic: 'arithmetic',
    title: 'Use Doubles You Already Know',
    content:
      'You probably know doubles like 5+5=10 and 6+6=12 by heart. Use them! If a problem is close to a double, adjust from there.',
    example:
      '6 + 7 = ? You know 6 + 6 = 12. Since 7 is one more than 6, the answer is 12 + 1 = 13!',
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Returns all tips for a given topic.
 */
export function getTipsByTopic(topic: Topic): Tip[] {
  return tips.filter((tip) => tip.topic === topic)
}
